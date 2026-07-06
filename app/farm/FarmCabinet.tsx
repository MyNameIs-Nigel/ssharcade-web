"use client";

import { useCallback, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { siteConfig } from "../site";
import { crops, dailyFurrow, growLabel, unlockLabel } from "./crops";
import TerminalDemo from "./TerminalDemo";

/**
 * Farm — the featured cabinet's detail page.
 *
 * It keeps the arcade hardware shell from the landing page (chunky chassis,
 * hard shadows, the amber accent) but the screen inside the cabinet shows the
 * *real* product: a faithful, self-playing rendering of the ssh-idlefarmer
 * terminal UI. The game lives in the terminal — the page just shows it off and
 * hands you the one command that runs it.
 */
export default function FarmCabinet() {
  const [copied, setCopied] = useState(false);

  const copyCommand = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.sshCommand);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked; the command is still visible to copy by hand.
    }
  }, []);

  const almanac = [...crops].sort((a, b) => a.growSeconds - b.growSeconds);

  return (
    <main
      className="theme-root min-h-screen overflow-hidden bg-[#d7d1c3] text-[#17150f]"
      // Farm's cabinet accent is leafy green (matches the cabinet on the arcade floor).
      style={{ "--accent": "#5fc868" } as CSSProperties}
    >
      <div aria-hidden="true" className="arcade-backdrop fixed inset-0 pointer-events-none" />
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none opacity-[0.34] mix-blend-multiply grain" />

      {/* ---- Status bar ---- */}
      <header className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 rounded-[1.5rem] border-4 border-[#17150f] bg-[#ede4ce] p-3 shadow-[4px_4px_0_#17150f] sm:shadow-[8px_8px_0_#17150f]">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full border-2 border-[#17150f] bg-[#17150f] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--accent)] shadow-[3px_3px_0_var(--accent)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-deep)]"
          >
            <span aria-hidden="true">←</span> Arcade floor
          </Link>
          <div className="flex items-center gap-2 font-mono text-[0.65rem] font-black uppercase tracking-[0.18em] text-[#5c523d] sm:text-xs">
            <span className="hidden rounded-full border-2 border-[#17150f] bg-[var(--accent)] px-3 py-1 text-[#17150f] sm:inline">F-01</span>
            <span className="hidden sm:inline">Now featuring</span>
            <span className="rounded-full bg-[#17150f] px-3 py-1 text-[var(--accent)]">Farm</span>
          </div>
        </div>
      </header>

      {/* ---- Hero ---- */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <p className="mb-4 inline-flex rounded-full border-2 border-[#17150f] bg-[#17150f] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[var(--accent)]">
          Cabinet F-01 / now playing
        </p>
        <h1 className="max-w-5xl text-balance font-display text-[clamp(2.75rem,9vw,7rem)] font-black uppercase leading-[0.82] tracking-[-0.07em]">
          Plant it. Walk away. Come home richer.
        </h1>
        <p className="mt-6 max-w-2xl text-lg font-bold leading-8 text-[#433c2d] sm:text-xl">
          A cozy idle farm that lives entirely in your terminal. Your SSH key is the whole account — no install, no
          password, no sign-up. Crops keep time while you are gone, and nothing ever punishes you for being away.
        </p>

        <div className="mt-8 flex max-w-2xl flex-col gap-4 sm:flex-row">
          <button
            type="button"
            onClick={copyCommand}
            className="group flex min-h-16 min-w-0 flex-1 items-center justify-between gap-4 rounded-[1.15rem] border-4 border-[#17150f] bg-[#17150f] px-5 py-4 font-mono text-sm font-bold text-[#f8f1dc] shadow-[4px_4px_0_var(--accent)] transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-deep)] sm:shadow-[7px_7px_0_var(--accent)]"
          >
            <span className="min-w-0 truncate">{siteConfig.sshCommand}</span>
            <span className="shrink-0 rounded-full bg-[var(--accent)] px-3 py-1 font-display text-xs uppercase tracking-[0.16em] text-[#17150f]">
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
          <a
            href="#screen"
            className="flex min-h-16 items-center justify-center rounded-[1.15rem] border-4 border-[#17150f] bg-[var(--accent-deep)] px-6 py-4 text-sm font-black uppercase tracking-[0.18em] shadow-[4px_4px_0_#17150f] transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] sm:shadow-[7px_7px_0_#17150f]"
          >
            Watch it run ↓
          </a>
        </div>
      </section>

      {/* ---- The cabinet: a live screen of the real terminal game ---- */}
      <section id="screen" className="relative z-10 mx-auto w-full max-w-5xl scroll-mt-6 px-4 pt-12 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="absolute -left-3 top-12 hidden h-28 w-7 rounded-l-2xl border-4 border-r-0 border-[#17150f] bg-[var(--accent-deep)] shadow-[5px_5px_0_#17150f] lg:block" />
          <div className="absolute -right-3 top-28 hidden h-36 w-7 rounded-r-2xl border-4 border-l-0 border-[#17150f] bg-[var(--accent)] shadow-[5px_5px_0_#17150f] lg:block" />

          <div className="rounded-[2.3rem] border-4 border-[#17150f] bg-[#4b4a42] p-3 shadow-[6px_6px_0_#17150f] sm:p-5 sm:shadow-[14px_14px_0_#17150f]">
            {/* Marquee */}
            <div className="mb-3 flex items-center justify-between gap-2 rounded-[1.2rem] border-4 border-[#17150f] bg-[#17150f] px-4 py-2 text-[var(--accent)]">
              <span className="font-display text-lg font-black uppercase tracking-[0.12em] sm:text-2xl">★ FARM ★</span>
              <span className="font-mono text-[0.6rem] font-black uppercase tracking-[0.2em] text-[#f8f1dc]/70 sm:text-xs">
                Live screen · the real terminal UI
              </span>
            </div>

            {/* CRT screen showing the actual TUI */}
            <div className="cabinet-stage rounded-[1.7rem] border-4 border-[#17150f] bg-[#f8f1dc] p-3 sm:p-4">
              <div className="crt-screen relative overflow-hidden rounded-[1.2rem] border-4 border-[#17150f] bg-[#11140d]">
                <div className="relative z-10">
                  <TerminalDemo />
                </div>
                <div aria-hidden="true" className="crt-overlay pointer-events-none absolute inset-0 z-20" />
              </div>
            </div>

            {/* Caption deck */}
            <div className="mt-4 grid gap-3 rounded-[1.4rem] border-4 border-[#17150f] bg-[#ede4ce] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <p className="font-mono text-[0.7rem] leading-5 text-[#5c523d] sm:text-xs">
                This isn&apos;t a web game — it&apos;s a recording of the real thing, running on a sped-up clock. Crops
                grow, ripen and re-sow themselves; coins tick up. To actually play, copy one command into any
                terminal — it opens the arcade menu, and Farm is one keypress away. That&apos;s the whole install.
              </p>
              <button
                type="button"
                onClick={copyCommand}
                className="group flex min-h-14 min-w-0 items-center justify-between gap-3 rounded-[1.1rem] border-4 border-[#17150f] bg-[#17150f] px-4 py-3 font-mono text-xs font-bold text-[#f8f1dc] shadow-[3px_3px_0_var(--accent)] transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-deep)] sm:text-sm sm:shadow-[5px_5px_0_var(--accent)]"
              >
                <span className="min-w-0 truncate">{siteConfig.sshCommand}</span>
                <span className="shrink-0 rounded-full bg-[var(--accent)] px-3 py-1 font-display text-[0.65rem] uppercase tracking-[0.16em] text-[#17150f]">
                  {copied ? "Copied" : "Copy"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---- The loop, in three beats ---- */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { n: "01", t: "Plant", d: "Drop a seed on any plot. Turnips in a minute, Voidlotus in twelve hours — patience pays, so the slow crops pay the most." },
            { n: "02", t: "Walk away", d: "Close the lid. The simulation is pure and deterministic, so it computes exactly what grew while you were gone — down to the second." },
            { n: "03", t: "Come home richer", d: "Reconnect to a quiet little world glad to see you: ripe fields, gift parcels at the gate, and a Welcome-Back tally." },
          ].map((beat) => (
            <div key={beat.n} className="rounded-[1.4rem] border-4 border-[#17150f] bg-[#ede4ce] p-5 shadow-[4px_4px_0_#17150f] sm:shadow-[6px_6px_0_#17150f]">
              <span className="font-mono text-xs font-black uppercase tracking-[0.24em] text-[var(--accent-deep)]">{beat.n}</span>
              <h3 className="mt-1 font-display text-3xl font-black uppercase tracking-[-0.04em]">{beat.t}</h3>
              <p className="mt-2 text-sm font-bold leading-6 text-[#5c523d]">{beat.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Daily Furrow ticker ---- */}
      <section aria-label="The Daily Furrow" className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[1.4rem] border-4 border-[#17150f] bg-[#17150f] text-[#f8f1dc] shadow-[4px_4px_0_var(--accent)] sm:shadow-[8px_8px_0_var(--accent)]">
          <div className="flex items-stretch">
            <div className="hidden shrink-0 items-center border-r-4 border-[var(--accent)] bg-[var(--accent)] px-5 font-display text-lg font-black uppercase leading-none tracking-[-0.03em] text-[#17150f] sm:flex">
              The Daily
              <br />
              Furrow
            </div>
            <div className="ticker-mask flex-1 overflow-hidden py-3">
              <div className="ticker-track flex w-max gap-12 whitespace-nowrap font-mono text-sm font-black uppercase tracking-[0.1em]">
                {[...dailyFurrow, ...dailyFurrow].map((line, i) => (
                  <span key={i} className="flex items-center gap-12">
                    <span className="text-[var(--accent)]" aria-hidden="true">✦</span>
                    {line}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- The Almanac ---- */}
      <section aria-labelledby="almanac" className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--accent-deep)]">Seed almanac</p>
            <h2 id="almanac" className="font-display text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
              The field guide
            </h2>
          </div>
          <p className="max-w-md text-sm font-bold leading-6 text-[#5c523d]">
            Twelve crops, sorted slowest-growing last. Profit-per-second climbs the longer the wait — the patient farmer
            wins. Fast crops settle quick, slow crops bank fortunes, and risky crops gamble part of the harvest.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {almanac.map((crop) => (
            <article key={crop.id} className="overflow-hidden rounded-[1.4rem] border-4 border-[#17150f] bg-[#f8f1dc] shadow-[4px_4px_0_#17150f] sm:shadow-[6px_6px_0_#17150f]">
              <div aria-hidden="true" className="h-2.5" style={{ backgroundColor: crop.accent }} />
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-2xl font-black uppercase tracking-[-0.03em]">{crop.name}</h3>
                  <span className="rounded-full border-2 border-[#17150f] bg-[#ede4ce] px-2.5 py-0.5 font-mono text-[0.55rem] font-black uppercase tracking-[0.12em]">
                    {crop.archetype}
                  </span>
                </div>
                <p className="mt-1.5 text-sm font-bold leading-6 text-[#5c523d]">{crop.blurb}</p>
                <dl className="mt-3 grid grid-cols-3 gap-1.5 font-mono text-[0.62rem] font-black uppercase tracking-tight">
                  <Stat label="Grows" value={growLabel(crop.growSeconds)} />
                  <Stat label="Seed" value={`${crop.seedCost}¢`} />
                  <Stat label="Sells" value={`${crop.sellValue.toLocaleString()}¢`} />
                </dl>
                <p className="mt-3 font-mono text-[0.58rem] font-bold uppercase tracking-[0.1em] text-[#8a7c5d]">
                  {crop.failChancePct ? `${crop.failChancePct}% fail · ` : ""}
                  Unlock: {unlockLabel(crop.unlock)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---- Under the hood ---- */}
      <section aria-labelledby="depth" className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--accent-deep)]">More than &quot;an idle game&quot;</p>
          <h2 id="depth" className="font-display text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
            What&apos;s under the hood
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { t: "The Market", d: "Fertilizer and Merchant's Scale buff a whole run. Hardier Strains de-risk your gambling crops. Buy a Scarecrow to chase off crows, rabbits and moles — and bank their bounty." },
            { t: "Land & the Greenhouse", d: "Grow from 3 starting plots to 10, then raise a glass Greenhouse for +6 and a 16-plot homestead full of exotic crops like the Dewmelon." },
            { t: "Per-plot automation", d: "Buy auto-harvest and auto-sow on individual plots so the field runs itself — pick the crop it replants, then leave it humming while you work." },
            { t: "Rebirth → Starseeds", d: "Reset a mature run for Starseeds (a square-root prestige curve) and spend them in the StarShop on permanent boosts: Rich Soil, Market Haggling, Gift Magnet, Stargazer's Almanac." },
            { t: "Live little moments", d: "Market Day, Bumper Demand and Warm Front events. Gift parcels at the gate. 1-in-100 golden harvests worth 100×. A 28-day moon that makes Moonberries shine. Lucky finds in the soil." },
            { t: "Kind by design", d: "No install, no password — your SSH key is the account. A skippable tutorial, a mercy-plant when you're broke, and a promise the game never punishes you for being away." },
          ].map((card) => (
            <div key={card.t} className="rounded-[1.4rem] border-4 border-[#17150f] bg-[#17150f] p-5 text-[#f8f1dc] shadow-[4px_4px_0_var(--accent)] sm:shadow-[6px_6px_0_var(--accent)]">
              <h3 className="font-display text-xl font-black uppercase tracking-[-0.03em] text-[var(--accent)]">{card.t}</h3>
              <p className="mt-2 text-sm font-bold leading-6 text-[#f8f1dc]/80">{card.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Support / CTA ---- */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 rounded-[2rem] border-4 border-[#17150f] bg-[#ede4ce] p-6 shadow-[5px_5px_0_#17150f] sm:shadow-[10px_10px_0_#17150f] lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--accent-deep)]">Free to play, honestly funded</p>
            <h2 className="mt-2 font-display text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em] sm:text-5xl">
              One command. <br /> No funnel.
            </h2>
            <p className="mt-4 max-w-md text-sm font-bold leading-6 text-[#5c523d]">
              The whole game is a string you can paste into any terminal. It costs almost nothing to run, and donations
              are the coin slot that keeps it online — never a guilt screen.
            </p>
            <button
              type="button"
              onClick={copyCommand}
              className="group mt-5 flex w-full max-w-md min-w-0 items-center justify-between gap-4 rounded-[1.15rem] border-4 border-[#17150f] bg-[#17150f] px-5 py-4 font-mono text-sm font-bold text-[#f8f1dc] shadow-[4px_4px_0_var(--accent)] transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-deep)] sm:shadow-[6px_6px_0_var(--accent)]"
            >
              <span className="min-w-0 truncate">{siteConfig.sshCommand}</span>
              <span className="shrink-0 rounded-full bg-[var(--accent)] px-3 py-1 font-display text-xs uppercase tracking-[0.16em] text-[#17150f]">
                {copied ? "Copied" : "Copy"}
              </span>
            </button>
          </div>
          <div className="grid content-center gap-3 font-mono text-xs font-black uppercase tracking-[0.16em]">
            <a className="rounded-xl border-4 border-[#17150f] bg-[var(--accent)] px-4 py-4 text-center text-[#17150f] shadow-[4px_4px_0_#17150f] transition-transform hover:-translate-y-0.5" href="https://ko-fi.com/snoigel" target="_blank" rel="noreferrer">
              Buy the farmer a coffee · Ko-fi
            </a>
            <div className="grid grid-cols-2 gap-3">
              <Link className="rounded-xl border-4 border-[#17150f] bg-[#f8f1dc] px-4 py-3 text-center transition-colors hover:bg-[#17150f] hover:text-[#f8f1dc]" href="/">
                ← Arcade
              </Link>
              <Link className="rounded-xl border-4 border-[#17150f] bg-[#f8f1dc] px-4 py-3 text-center transition-colors hover:bg-[#17150f] hover:text-[#f8f1dc]" href="/contact">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t-4 border-[#17150f] bg-[#17150f] px-4 py-6 text-[#f8f1dc]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 font-mono text-xs font-bold uppercase tracking-[0.16em] sm:flex-row">
          <span>Farm · cabinet F-01 · SSH-Arcade</span>
          <span>{siteConfig.sshCommand}</span>
        </div>
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[#ede4ce] px-1.5 py-1 text-center">
      <span className="block text-[0.5rem] tracking-[0.1em] text-[#8a7c5d]">{label}</span>
      <span className="block text-[#17150f]">{value}</span>
    </div>
  );
}
