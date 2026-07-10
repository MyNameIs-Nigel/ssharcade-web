"use client";

import { useEffect, useReducer, useSyncExternalStore } from "react";
import type { CSSProperties } from "react";
import { cropById, dailyFurrow } from "./crops";

/* ------------------------------------------------------------------ *
 * A faithful, NON-INTERACTIVE rendering of the real ssh-idlefarmer TUI.
 *
 * The game itself lives in the terminal — this is just a live "screen
 * recording" of it: a farm that grows, ripens, harvests and re-sows
 * itself on a sped-up clock so a visitor can watch the loop. Nothing
 * here is clickable; the only call to action is the ssh command.
 * Mirrors the actual UI: header, Daily Furrow / event line, the
 * 1 Farm / 2 Market / … nav, plot cards with ▰▱ progress bars, and the
 * keybinding footer.
 * ------------------------------------------------------------------ */

// Terminal palette, matching the in-game lipgloss theme (green on near-black).
const TERM = {
  bg: "#11140d",
  frame: "#3f9e4d",
  text: "#cfe6c2",
  dim: "#6f8a66",
  bright: "#8ef06a",
  tabBg: "#3fbf5f",
  tabText: "#0c160c",
} as const;

const MOON_PHASES = [
  "🌑 New Moon",
  "🌒 Waxing Crescent",
  "🌓 First Quarter",
  "🌔 Waxing Gibbous",
  "🌕 Full Moon",
  "🌖 Waning Gibbous",
  "🌗 Last Quarter",
  "🌘 Waning Crescent",
];

const EVENTS = [
  { label: "⚡ Bumper Demand", color: "#9b56c9" },
  { label: "🪙 Market Day", color: "#4a86d6" },
  { label: "☀ Warm Front", color: "#d68b3a" },
];

const NAV = [
  { key: "1", name: "Farm", active: true },
  { key: "2", name: "Market" },
  { key: "3", name: "Land" },
  { key: "4", name: "Rebirth" },
  { key: "5", name: "StarShop", locked: true },
  { key: "6", name: "Stats" },
  { key: "?", name: "Help" },
];

// Compressed grow durations (ms) for the demo reel — a gentle timelapse: slow
// enough to read each plot, quick enough that something is always ripening.
const DUR: Record<string, number> = {
  turnip: 9500,
  carrot: 12000,
  pumpkin: 15000,
  glimmercorn: 13000,
  starfruit: 18000,
  moonberry: 16000,
};

// The crops that cycle through the demo farm, in re-sow order.
const ROTATION = ["turnip", "carrot", "pumpkin", "glimmercorn", "starfruit", "moonberry"];

const READY_HOLD = 2000;
const CURSOR_MS = 2600;
const WELCOME_MS = 3600;

interface DemoPlot {
  cropId: string;
  startedAt: number;
  readyAt: number | null;
}

interface State {
  started: boolean;
  now: number;
  coins: number;
  coinKey: number;
  plots: DemoPlot[];
  cursor: number;
  lastCursorAt: number;
  status: { text: string; tone: "info" | "ready" | "good" };
}

type Action = { type: "start" } | { type: "tick"; now: number };

function durOf(cropId: string): number {
  return DUR[cropId] ?? 9000;
}

function init(seedNow: number): State {
  // Stagger the opening farm so plots ripen at different times.
  const layout: Array<{ cropId: string; grown: number }> = [
    { cropId: "starfruit", grown: 2600 },
    { cropId: "pumpkin", grown: 5200 },
    { cropId: "carrot", grown: 1200 },
    { cropId: "moonberry", grown: 6800 },
    { cropId: "glimmercorn", grown: 3400 },
    { cropId: "turnip", grown: 4200 },
  ];
  return {
    started: false,
    now: 0,
    coins: 1160,
    coinKey: 0,
    plots: layout.map((l) => ({ cropId: l.cropId, startedAt: seedNow - l.grown, readyAt: null })),
    cursor: 0,
    lastCursorAt: seedNow,
    status: { text: "Welcome back — your scarecrow kept watch.", tone: "info" },
  };
}

function reducer(state: State, action: Action): State {
  if (action.type === "start") return { ...state, started: true };

  const now = action.now;
  const plots = state.plots.slice();
  let { coins, coinKey, cursor, lastCursorAt, status } = state;

  for (let i = 0; i < plots.length; i++) {
    const p = plots[i];
    const crop = cropById(p.cropId);
    const dur = durOf(p.cropId);

    if (p.readyAt == null) {
      // Growing → just ripened?
      if (now - p.startedAt >= dur) {
        plots[i] = { ...p, readyAt: now };
        status = { text: `🌱 Your ${crop.name} is ready to harvest!`, tone: "ready" };
      }
    } else if (now - p.readyAt >= READY_HOLD) {
      // Auto-harvest + re-sow with the next crop in the rotation.
      coins += crop.sellValue;
      coinKey += 1;
      status = { text: `✓ Harvested ${crop.name}  ·  +${crop.sellValue.toLocaleString()} coins`, tone: "good" };
      const nextId = ROTATION[(ROTATION.indexOf(p.cropId) + 1 + i) % ROTATION.length];
      plots[i] = { cropId: nextId, startedAt: now, readyAt: null };
    }
  }

  // Drift the selection cursor so the terminal looks "operated".
  if (now - lastCursorAt >= CURSOR_MS) {
    cursor = (cursor + 1) % plots.length;
    lastCursorAt = now;
  }

  return { ...state, now, plots, coins, coinKey, cursor, lastCursorAt, status };
}

function fmtRemaining(seconds: number): string {
  const s = Math.max(0, Math.ceil(seconds));
  if (s >= 3600) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${h}h ${String(m).padStart(2, "0")}m`;
  }
  if (s >= 60) {
    const m = Math.floor(s / 60);
    return `${m}m ${String(s % 60).padStart(2, "0")}s`;
  }
  return `${s}s`;
}

function bar(progress: number): { filled: string; empty: string } {
  const SEG = 8;
  const f = Math.max(0, Math.min(SEG, Math.round(progress * SEG)));
  return { filled: "▰".repeat(f), empty: "▱".repeat(SEG - f) };
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCED_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

export default function TerminalDemo() {
  const reduced = usePrefersReducedMotion();
  const [state, dispatch] = useReducer(reducer, 0, () => init(typeof window === "undefined" ? 0 : Date.now()));

  useEffect(() => {
    if (reduced) {
      // Respect reduced motion: show a single static frame, no churn.
      dispatch({ type: "start" });
      dispatch({ type: "tick", now: Date.now() });
      return;
    }
    const welcome = window.setTimeout(() => dispatch({ type: "start" }), WELCOME_MS);
    const id = window.setInterval(() => dispatch({ type: "tick", now: Date.now() }), 200);
    return () => {
      window.clearTimeout(welcome);
      window.clearInterval(id);
    };
  }, [reduced]);

  // Derive the moon phase and the Daily Furrow / event line from the clock.
  const slot = Math.floor(state.now / 6200);
  const moon = MOON_PHASES[Math.floor(state.now / 9000) % MOON_PHASES.length];
  const showEvent = state.started && slot % 4 === 3;
  const event = EVENTS[Math.floor(slot / 4) % EVENTS.length];
  const eventLeft = 100 - ((state.now % 6200) / 6200) * 100;
  const headline = dailyFurrow[slot % dailyFurrow.length];

  return (
    <div
      role="img"
      aria-label="A live preview of the ssh-idlefarmer terminal game: a farm of crops growing and ripening, coins ticking up as they are harvested."
      className="flex min-h-[22rem] min-w-0 flex-col rounded-[0.6rem] border-2 p-2.5 font-mono text-[0.68rem] leading-relaxed sm:min-h-[27rem] sm:p-4 sm:text-sm"
      style={{ background: TERM.bg, borderColor: TERM.frame, color: TERM.text } as CSSProperties}
    >
      {/* Header */}
      <div className="flex min-w-0 items-center justify-between gap-2">
        <span className="min-w-0 truncate">
          <span aria-hidden="true">🌾 </span>
          <b style={{ color: TERM.bright }}>ssh-idlefarmer</b>
          <span style={{ color: TERM.dim }}> · user </span>
          <i className="hidden sm:inline" style={{ color: TERM.dim }}>
            {moon}
          </i>
        </span>
        <span className="shrink-0 whitespace-nowrap">
          <span aria-hidden="true">🪙 </span>
          <span key={state.coinKey} className="coin-bump font-bold tabular-nums">
            {state.coins.toLocaleString()}
          </span>{" "}
          coins
        </span>
      </div>

      {/* Daily Furrow / event line */}
      <div className="mt-1 h-5 truncate">
        {showEvent ? (
          <span
            className="rounded px-2 py-0.5 text-[0.68rem] font-bold sm:text-xs"
            style={{ background: event.color, color: "#f6ecff" }}
          >
            {event.label} ({fmtRemaining((eventLeft / 100) * 110)})
          </span>
        ) : (
          <span className="italic" style={{ color: TERM.dim }}>
            <span aria-hidden="true">📰 </span>
            <span style={{ color: TERM.text }}>The Daily Furrow:</span> {headline}
          </span>
        )}
      </div>

      {/* Nav */}
      <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 sm:gap-x-3">
        {NAV.map((tab) =>
          tab.active ? (
            <span key={tab.key} className="rounded px-1.5 font-bold" style={{ background: TERM.tabBg, color: TERM.tabText }}>
              {tab.key} {tab.name}
            </span>
          ) : (
            <span key={tab.key} style={{ color: tab.locked ? TERM.dim : TERM.text }}>
              <span style={{ color: TERM.dim }}>{tab.key}</span> {tab.name}
              {tab.locked ? " 🔒" : ""}
            </span>
          ),
        )}
      </div>

      {/* Farm grid */}
      <div className="relative mt-3 flex-1">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {state.plots.map((p, i) => {
            const crop = cropById(p.cropId);
            const dur = durOf(p.cropId);
            const progress = Math.max(0, Math.min(1, (state.now - p.startedAt) / dur));
            const ready = p.readyAt != null;
            const selected = state.started && state.cursor === i;
            const remaining = fmtRemaining((1 - progress) * crop.growSeconds);
            const b = bar(progress);
            return (
              <div
                key={i}
                className="min-w-0 rounded-[0.4rem] border px-2 py-1.5 sm:px-2.5 sm:py-1.5"
                style={{
                  borderColor: selected ? TERM.bright : ready ? TERM.frame : "#2e4a2c",
                  boxShadow: selected ? `0 0 0 1px ${TERM.bright}` : undefined,
                }}
              >
                <div className="font-bold" style={{ color: selected ? TERM.bright : TERM.text }}>
                  Plot {i + 1}
                </div>
                <div className="truncate" style={{ color: ready ? TERM.bright : TERM.text }}>
                  {crop.name}
                </div>
                <div className="mt-0.5 break-words text-[0.68rem] sm:whitespace-nowrap sm:text-xs">
                  {ready ? (
                    <span style={{ color: TERM.bright }}>✓ ready!</span>
                  ) : (
                    <>
                      <span style={{ color: TERM.bright }}>{b.filled}</span>
                      <span style={{ color: "#33502f" }}>{b.empty}</span>
                      <span style={{ color: TERM.dim }}> {remaining}</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Welcome-back card (opening scene) */}
        {!state.started && (
          <div className="term-welcome absolute inset-0 grid place-items-center" style={{ background: TERM.bg }}>
            <div className="w-full max-w-sm rounded-[0.5rem] border px-5 py-6 text-center" style={{ borderColor: TERM.frame }}>
              <p className="font-bold" style={{ color: TERM.bright }}>
                Welcome back! <span aria-hidden="true">🌾</span>
              </p>
              <p className="mt-3">You were away 1h 59m.</p>
              <p className="mt-1 italic" style={{ color: TERM.dim }}>
                Your scarecrow kept watch and gathered a few coins.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 border-t pt-2" style={{ borderColor: "#274226" }}>
        {state.started ? (
          <p
            className="h-5 truncate"
            style={{ color: state.status.tone === "good" ? TERM.bright : state.status.tone === "ready" ? TERM.bright : TERM.dim }}
          >
            {state.status.text}
          </p>
        ) : (
          <p className="h-5 italic" style={{ color: TERM.dim }}>
            press any key to continue
          </p>
        )}
        <p className="mt-0.5 text-[0.6rem] leading-snug break-words sm:truncate sm:text-xs" style={{ color: TERM.dim }}>
          ←↑↓→ · enter plant/harvest · a harvest all · r replant all · u upgrades · g gift · q leave
        </p>
      </div>
    </div>
  );
}
