"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { siteConfig } from "../site";
import TerminalScreen from "./terminalScreens";

const phases = [
  {
    id: "dock",
    eyebrow: "01 / Port service",
    title: "Plot a course past the last safe light.",
    copy: "The dock is where every shift begins. Choose a belt, top up the tanks, and decide how much hull you can afford to lose for a richer haul.",
    accent: "#59d9ff",
    glow: "#0e6a93",
    terminal: "dock",
  },
  {
    id: "scan",
    eyebrow: "02 / Ore scan",
    title: "The belt is a field of signals.",
    copy: "Sweep the dark for ordinary stone, rare seams, and the one bright unknown. The best targets sit just beyond the part of space that feels sensible.",
    accent: "#6ee7ff",
    glow: "#187b9c",
    terminal: "scan",
  },
  {
    id: "mine",
    eyebrow: "03 / Extraction loop",
    title: "Drill deep. Watch the radar.",
    copy: "Every second converts rock into cargo, and every second brings the pirate signal closer. Hold your nerve for a legendary load—or bail while you still can.",
    accent: "#ffb35f",
    glow: "#9b611f",
    terminal: "mine",
  },
  {
    id: "summary",
    eyebrow: "04 / Run summary",
    title: "Bring the cargo home. Carry the scars.",
    copy: "The run ends in a terse account: credits recovered, fuel burned, hull opened by fire. Moon Miner treats every escape like a story worth logging.",
    accent: "#ff6e78",
    glow: "#8f263c",
    terminal: "summary",
  },
  {
    id: "shipyard",
    eyebrow: "05 / Shipyard",
    title: "Build a ship for the next impossible run.",
    copy: "Spend your haul on range, hull, scanners, and a little more room in the hold. A humble Skiff becomes a machine that can stay out where the good rocks live.",
    accent: "#c995ff",
    glow: "#5d3c95",
    terminal: "shipyard",
  },
] as const;

type PhaseId = (typeof phases)[number]["id"];

export default function MoonMinerCabinet() {
  const [activePhase, setActivePhase] = useState<PhaseId>("dock");
  const [copied, setCopied] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const active = phases.find((phase) => phase.id === activePhase) ?? phases[0];

  useEffect(() => {
    let animationFrame: number | null = null;

    const updatePhase = () => {
      animationFrame = null;
      const marker = window.innerHeight * 0.45;
      let nextPhase: PhaseId = phases[0].id;

      // A single point in the viewport determines the active screen. Unlike
      // intersection ratios, this cannot toggle back and forth at boundaries.
      sectionRefs.current.forEach((section) => {
        if (section && section.getBoundingClientRect().top <= marker) {
          nextPhase = section.id as PhaseId;
        }
      });

      setActivePhase((current) => current === nextPhase ? current : nextPhase);
    };

    const scheduleUpdate = () => {
      if (animationFrame === null) animationFrame = window.requestAnimationFrame(updatePhase);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const copyCommand = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.sshCommand);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // The command remains visible if clipboard permissions are unavailable.
    }
  }, []);

  return (
    <main
      className="theme-root moon-miner-root min-h-screen overflow-x-clip text-[#dcecff]"
      data-phase={activePhase}
      style={{ "--accent": active.accent, "--moon-glow": active.glow } as CSSProperties}
    >
      <div aria-hidden="true" className="moon-starfield fixed inset-0 pointer-events-none" />
      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="moon-nav-link">
          <span aria-hidden="true">←</span> Arcade floor
        </Link>
        <p className="shrink-0 font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#b4c7e5] sm:text-xs sm:tracking-[0.22em]">
          <span className="hidden min-[360px]:inline">Cabinet M-02 </span><span className="hidden min-[360px]:inline mx-1 text-[var(--accent)]">/</span> live
        </p>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
        <p className="moon-kicker">A terminal extraction game / live over SSH</p>
        <h1 className="max-w-5xl text-balance font-display text-[clamp(2.65rem,10vw,8.75rem)] font-black uppercase leading-[0.9] tracking-[-0.05em] sm:leading-[0.82] sm:tracking-[-0.075em]">
          Mine the <span className="text-[var(--accent)]">quiet</span> side of the moon.
        </h1>
        <div className="mt-8 flex max-w-2xl flex-col gap-4 sm:flex-row">
          <button type="button" onClick={copyCommand} className="moon-command-button min-w-0 w-full">
            <span className="min-w-0 truncate">{siteConfig.sshCommand}</span>
            <span className="shrink-0">{copied ? "Copied" : "Copy"}</span>
          </button>
          <a href="#dock" className="moon-ghost-button">Begin the run <span aria-hidden="true">↓</span></a>
        </div>
        <p className="mt-6 max-w-xl font-mono text-sm leading-6 text-[#91a8ca]">
          Five screens from the alpha, reconstructed in the language of the terminal. Scroll the flight log; paste the command when you are ready to fly.
        </p>
      </section>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-4 pb-24 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] lg:items-start lg:px-8">
        <div className="order-2 space-y-10 lg:order-1">
          {phases.map((phase, index) => (
            <section
              key={phase.id}
              id={phase.id}
              ref={(element) => { sectionRefs.current[index] = element; }}
              className="moon-story-section scroll-mt-16"
              aria-labelledby={`${phase.id}-title`}
            >
              <p className="moon-kicker">{phase.eyebrow}</p>
              <h2 id={`${phase.id}-title`} className="mt-3 max-w-xl font-display text-[clamp(2.15rem,5vw,5rem)] font-black uppercase leading-[0.92] tracking-[-0.045em] sm:leading-[0.86] sm:tracking-[-0.06em]">
                {phase.title}
              </h2>
              <p className="mt-6 max-w-lg text-lg font-medium leading-8 text-[#b9c9e1]">{phase.copy}</p>
              <div className="mt-8 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
                <span className="h-px w-12 bg-current" /> Screen {String(index + 1).padStart(2, "0")}
              </div>
              <div className="mt-8 lg:hidden">
                <TerminalScreen phase={phase.terminal} />
              </div>
            </section>
          ))}
        </div>

        <aside className="order-1 hidden lg:sticky lg:top-8 lg:order-2 lg:block" aria-label="Moon Miner terminal display">
          <div className="moon-cabinet-frame">
            <div className="moon-cabinet-marquee">
              <span>✦ MOON MINER ✦</span>
              <span>ALPHA FLIGHT LOG</span>
            </div>
            <div className="moon-cabinet-screen">
              <TerminalScreen phase={active.terminal} />
            </div>
            <div className="moon-cabinet-controls">
              <span>PHASE {String(phases.findIndex((phase) => phase.id === activePhase) + 1).padStart(2, "0")}/05</span>
              <span className="text-[var(--accent)]">● SIGNAL LOCKED</span>
            </div>
          </div>
        </aside>
      </div>

      <footer className="relative z-10 border-t border-[#244061] bg-[#030712]/70 px-4 py-8 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#91a8ca] sm:flex-row">
          <span>Moon Miner · cabinet M-02 · SSH-Arcade</span>
          <span className="break-all sm:break-normal">{siteConfig.sshCommand}</span>
        </div>
      </footer>
    </main>
  );
}
