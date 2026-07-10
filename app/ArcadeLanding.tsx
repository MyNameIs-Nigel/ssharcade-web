"use client";

import { useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { siteConfig } from "./site";

const games = [
  {
    title: "Farm",
    slug: "farm",
    status: "Now featuring",
    accent: "#5fc868",
    cabinet: "F-01",
    summary:
      "A cozy idle farm that lives in your terminal. Plant, wait, harvest, and let the field keep time while you are away.",
    command: siteConfig.sshCommand,
    meter: "Live cabinet",
  },
  {
    title: "Moon Mine",
    slug: "moon-mine",
    status: "Now playing",
    accent: "#6ee7ff",
    cabinet: "M-02",
    summary:
      "A quiet extraction loop for late-night operators: scan the belt, mine rare ore, and get home before the pirates arrive.",
    command: siteConfig.sshCommand,
    meter: "Live cabinet",
  },
  {
    title: "Packet Derby",
    slug: "packet-derby",
    status: "Under repair",
    accent: "#ff6b8a",
    cabinet: "P-03",
    summary:
      "A keyboard-first race where routing tables, lag, and tiny wagers become the track.",
    command: "coming soon",
    meter: "Sketch",
  },
];

const supporters = ["root", "fieldhand", "tty-friend", "packet-pal", "night-ops"];

export default function ArcadeLanding() {
  // No cabinet is powered on until the visitor picks one.
  const [selectedGame, setSelectedGame] = useState<number | null>(null);
  const [coins, setCoins] = useState(37);
  const [copied, setCopied] = useState(false);

  const selectGame = (index: number) => {
    setSelectedGame(index);
  };

  // Used by the LT / RT controls and arrow keys; powers on from "off".
  const stepGame = (direction: 1 | -1) => {
    setSelectedGame((current) => {
      if (current === null) {
        return direction === 1 ? 0 : games.length - 1;
      }
      return (current + direction + games.length) % games.length;
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepGame(1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepGame(-1);
    }
  };

  const insertCoin = () => {
    setCoins((value) => Math.min(value + 1, 64));
  };

  const copyCommand = async () => {
    await navigator.clipboard.writeText(games[0].command);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const progress = Math.min(Math.round((coins / 64) * 100), 100);

  // Selection drives the whole page's accent. When nothing is selected the
  // hero reads as "powered down" and the accent rests on the brand amber.
  const view = selectedGame !== null ? games[selectedGame] : null;
  const powered = view !== null;
  const accent = view ? view.accent : "#ffb000";
  const cabinetAccent = view ? view.accent : "#7c7669";
  const screen = {
    cabinet: view ? view.cabinet : "—",
    status: view ? view.status : "Powered down",
    presents: view ? "SSH-Arcade presents" : "Insert a coin to boot",
    title: view ? view.title : "Standby",
    summary: view
      ? view.summary
      : "No cabinet selected. Tap the LT / RT controls or pick a machine from the cabinet row to power one on.",
    meter: view ? view.meter : "Idle",
    command: view ? view.command : "awaiting selection",
  };

  return (
    <main
      className="theme-root min-h-screen overflow-hidden bg-[#d7d1c3] text-[#17150f]"
      style={{ "--accent": accent } as CSSProperties}
    >
      <div aria-hidden="true" className="arcade-backdrop fixed inset-0 pointer-events-none" />
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none opacity-[0.34] mix-blend-multiply grain" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="z-10 flex items-center justify-between gap-3 rounded-[1.5rem] border-4 border-[#17150f] bg-[#ede4ce] p-3 shadow-[4px_4px_0_#17150f] sm:shadow-[8px_8px_0_#17150f]">
          <a
            href="#top"
            className="rounded-full border-2 border-[#17150f] bg-[var(--accent)] px-4 py-2 text-sm font-black uppercase tracking-[0.18em] shadow-[3px_3px_0_#17150f] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-deep)]"
          >
            SSH-Arcade
          </a>
          <nav aria-label="Cabinets" className="flex items-center gap-2">
            <span
              className={`hidden font-mono text-[0.7rem] font-black uppercase tracking-[0.18em] text-[#5c523d] sm:inline ${
                powered ? "opacity-60" : ""
              }`}
            >
              {powered ? "Cabinet" : "Select ▸"}
            </span>
            {games.map((game, index) => {
              const active = selectedGame === index;
              return (
                <button
                  key={game.title}
                  type="button"
                  onClick={() => selectGame(index)}
                  aria-label={`Select the ${game.title} cabinet`}
                  aria-pressed={active}
                  className={`group flex h-10 items-center overflow-hidden rounded-full border-2 border-[#17150f] shadow-[2px_2px_0_#17150f] transition-all duration-300 ease-out hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-deep)] ${
                    active ? "-translate-y-0.5" : ""
                  } ${!powered ? "hint-pill" : ""}`}
                  style={{ backgroundColor: game.accent }}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center font-display text-base font-black text-[#17150f]">
                    {game.title.charAt(0)}
                  </span>
                  <span
                    className={`overflow-hidden whitespace-nowrap font-display text-sm font-black uppercase tracking-[0.08em] text-[#17150f] transition-all duration-300 ease-out ${
                      active ? "max-w-[9rem] pr-4" : "max-w-0 group-hover:max-w-[9rem] group-hover:pr-4"
                    }`}
                  >
                    {game.title}
                  </span>
                </button>
              );
            })}
          </nav>
        </header>

        <div id="top" className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:py-14">
          <div className="relative z-10">
            <p className="mb-4 inline-flex rounded-full border-2 border-[#17150f] bg-[#17150f] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[var(--accent)]">
              Arcade OS / boot slot 01
            </p>
            <h1 className="max-w-4xl text-balance font-display text-[clamp(3.25rem,11vw,8.8rem)] font-black uppercase leading-[0.78] tracking-[-0.08em]">
              Insert coin. Start farm.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-bold leading-8 text-[#433c2d] sm:text-xl">
              A terminal-native arcade where every cabinet is an SSH game — all behind one door.{" "}
              <span className="font-mono">{siteConfig.sshCommand}</span> drops you on the floor; Farm is the first
              machine running.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto]">
              <button
                type="button"
                onClick={copyCommand}
                className="group flex min-h-16 min-w-0 items-center justify-between gap-4 rounded-[1.15rem] border-4 border-[#17150f] bg-[#17150f] px-5 py-4 font-mono text-sm font-bold text-[#f8f1dc] shadow-[4px_4px_0_var(--accent)] transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-deep)] sm:shadow-[7px_7px_0_var(--accent)]"
              >
                <span className="min-w-0 truncate">{games[0].command}</span>
                <span className="shrink-0 rounded-full bg-[var(--accent)] px-3 py-1 font-display text-xs uppercase tracking-[0.16em] text-[#17150f]">
                  {copied ? "Copied" : "Copy"}
                </span>
              </button>
              <a
                href="#coin-slot"
                className="flex min-h-16 items-center justify-center rounded-[1.15rem] border-4 border-[#17150f] bg-[var(--accent-deep)] px-6 py-4 text-sm font-black uppercase tracking-[0.18em] shadow-[4px_4px_0_#17150f] transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] sm:shadow-[7px_7px_0_#17150f]"
              >
                Support costs
              </a>
            </div>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-xl">
            <div className="rounded-[2.3rem] border-4 border-[#17150f] bg-[#4b4a42] p-4 shadow-[6px_6px_0_#17150f] sm:p-6 sm:shadow-[14px_14px_0_#17150f]">
              <div
                className="cabinet-stage rounded-[1.7rem] border-4 border-[#17150f] bg-[#f8f1dc] p-4 shadow-inner"
                style={{ "--cabinet-accent": cabinetAccent } as CSSProperties}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-[#17150f] px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-[var(--cabinet-accent)]">
                    {screen.cabinet}
                  </span>
                  <span className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#4b4a42]">
                    {screen.status}
                  </span>
                </div>

                <div
                  className={`cabinet-screen relative overflow-hidden rounded-[1.1rem] border-4 border-[#17150f] bg-[#17150f] p-4 text-[#f8f1dc] [container-type:inline-size] ${
                    powered ? "" : "is-standby"
                  }`}
                >
                  {powered ? (
                    <>
                      <div className="scanline" />
                      <div className="relative z-10">
                        <p className="mb-2 font-mono text-xs uppercase tracking-[0.24em] text-[var(--cabinet-accent)]">
                          {screen.presents}
                        </p>
                        <h2 className="font-display text-[clamp(2rem,21cqw,7rem)] font-black uppercase leading-none tracking-[-0.08em] [overflow-wrap:normal] [word-break:keep-all]">
                          {screen.title}
                        </h2>
                        <div className="mt-8 grid grid-cols-4 gap-2">
                          {Array.from({ length: 16 }).map((_, index) => (
                            <span
                              key={index}
                              className="h-8 rounded-md border-2 border-[#f8f1dc]/25 bg-[var(--cabinet-accent)]/80 shadow-[inset_0_-8px_0_rgba(0,0,0,0.22)]"
                              style={{ opacity: index % 5 === 0 ? 0.35 : 1 }}
                            />
                          ))}
                        </div>
                        <p className="mt-6 max-w-sm font-mono text-sm leading-6 text-[#f8f1dc]/85">
                          {screen.summary}
                        </p>
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => selectGame(0)}
                      aria-label="Press start to power on the Farm cabinet"
                      className="start-pulse relative z-10 flex w-full flex-col items-center justify-center gap-3 rounded-[0.85rem] border-4 border-[var(--accent)] bg-[var(--accent)]/10 px-5 py-12 text-center transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
                    >
                      <span className="font-display text-[clamp(2.25rem,18cqw,5rem)] font-black uppercase leading-none tracking-[-0.06em] text-[var(--accent)]">
                        ▶ Press Start
                      </span>
                      <span className="blink font-mono text-xs font-black uppercase tracking-[0.28em] text-[#f8f1dc]">
                        Insert coin to boot
                      </span>
                      <span className="mt-1 max-w-xs font-mono text-[0.72rem] leading-5 text-[#f8f1dc]/70">
                        Powers on Farm — or pick a cabinet from the row below, the navbar, or the LT / RT controls.
                      </span>
                    </button>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-[1fr_auto] items-end gap-4">
                  <div>
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#4b4a42]">Cabinet controls</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => stepGame(-1)}
                        className="h-12 w-12 rounded-full border-4 border-[#17150f] bg-[var(--accent)] font-black shadow-[3px_4px_0_#17150f] transition-transform active:translate-y-1 active:shadow-none focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-deep)]"
                        aria-label="Previous cabinet"
                      >
                        LT
                      </button>
                      <button
                        type="button"
                        onClick={() => stepGame(1)}
                        className="h-12 w-12 rounded-full border-4 border-[#17150f] bg-[var(--accent-deep)] font-black shadow-[3px_4px_0_#17150f] transition-transform active:translate-y-1 active:shadow-none focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
                        aria-label="Next cabinet"
                      >
                        RT
                      </button>
                    </div>
                  </div>
                  <div className="rounded-xl border-4 border-[#17150f] bg-[#17150f] px-4 py-3 text-right font-mono text-xs font-bold uppercase text-[var(--cabinet-accent)]">
                    {screen.meter}
                    <br />
                    <span className="text-[#f8f1dc]">{screen.command}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="cabinet-row"
        className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8"
      >
        <div className="rounded-[2rem] border-4 border-[#17150f] bg-[#ede4ce] p-4 shadow-[5px_5px_0_#17150f] sm:p-6 sm:shadow-[10px_10px_0_#17150f]">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--accent-deep)]">Terminal UI games</p>
              <h2 id="cabinet-row" className="font-display text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
                Cabinet row
              </h2>
            </div>
            <p className="max-w-md text-sm font-bold leading-6 text-[#5c523d]">
              A TUI — terminal user interface — is a game drawn entirely with text inside your terminal. No browser, no
              mouse: just the keyboard, the prompt, and whatever the cabinet renders in characters.
            </p>
          </div>

          <div
            className="-mx-1 grid snap-x snap-mandatory auto-cols-[min(100%,16rem)] grid-flow-col gap-4 overflow-x-auto px-1 pb-3 md:mx-0 md:grid-cols-3 md:grid-flow-row md:overflow-visible md:px-0"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            aria-label="Choose an arcade cabinet"
          >
            {games.map((game, index) => {
              const active = selectedGame === index;
              const cardBase =
                "min-w-[16rem] snap-center rounded-[1.4rem] border-4 border-[#17150f] p-4 text-left shadow-[4px_4px_0_#17150f] transition-all focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-deep)] sm:shadow-[6px_6px_0_#17150f]";

              if (active) {
                return (
                  <div key={game.title} className={`${cardBase} translate-y-[-4px] bg-[#17150f] text-[#f8f1dc]`}>
                    <a
                      href={`/${game.slug}`}
                      aria-label={`Enter the ${game.title} cabinet`}
                      style={{ backgroundColor: game.accent }}
                      className="enter-pulse mb-4 flex items-center justify-center rounded-xl border-4 border-[#f8f1dc] px-3 py-5 text-center font-display text-3xl font-black uppercase tracking-[-0.05em] text-[#17150f] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-deep)]"
                    >
                      {"<ENTER>"}
                    </a>
                    <p className="font-mono text-xs font-black uppercase tracking-[0.18em] opacity-70">{game.status}</p>
                    <p className="mt-3 text-sm font-bold leading-6 opacity-85">{game.summary}</p>
                  </div>
                );
              }

              return (
                <button
                  type="button"
                  key={game.title}
                  onClick={() => selectGame(index)}
                  className={`${cardBase} bg-[#f8f1dc] text-[#17150f] hover:-translate-y-0.5`}
                >
                  <div
                    className="mb-4 rounded-xl border-4 border-current px-3 py-5 text-center font-display text-3xl font-black uppercase tracking-[-0.05em]"
                    style={{ backgroundColor: game.accent }}
                  >
                    {game.title}
                  </div>
                  <p className="font-mono text-xs font-black uppercase tracking-[0.18em] opacity-70">{game.status}</p>
                  <p className="mt-3 text-sm font-bold leading-6 opacity-85">{game.summary}</p>
                  <span
                    className={`mt-4 inline-flex items-center gap-1 rounded-full border-2 border-[#17150f] bg-[var(--accent)] px-3 py-1 font-mono text-[0.7rem] font-black uppercase tracking-[0.16em] text-[#17150f] ${
                      !powered ? "hint-tag" : ""
                    }`}
                  >
                    ▸ Tap to power on
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="coin-slot"
        aria-labelledby="coin-heading"
        className="relative z-10 mx-auto grid w-full max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8"
      >
        <div className="rounded-[2rem] border-4 border-[#17150f] bg-[#17150f] p-6 text-[#f8f1dc] shadow-[5px_5px_0_var(--accent)] sm:shadow-[10px_10px_0_var(--accent)]">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--accent)]">Free games, transparent costs</p>
          <h2 id="coin-heading" className="mt-3 font-display text-5xl font-black uppercase leading-none tracking-[-0.06em] sm:text-7xl">
            Insert coin.
          </h2>
          <p className="mt-5 text-lg font-bold leading-8 text-[#f8f1dc]/80">
            Donations are not necessary, but they are the coin slot that keeps the cabinets online: 
            hosting, domains, backups, and enough runway to build the next machine.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-2 font-mono text-xs font-black uppercase tracking-[0.16em]">
            <a className="rounded-xl border-2 border-[#f8f1dc] px-3 py-3 text-center transition-colors hover:bg-[#f8f1dc] hover:text-[#17150f]" href="https://nigel-smith.dev" target="_blank" rel="noreferrer">
              Portfolio
            </a>
            <a className="rounded-xl border-2 border-[#f8f1dc] px-3 py-3 text-center transition-colors hover:bg-[#f8f1dc] hover:text-[#17150f]" href="https://ko-fi.com/snoigel" target="_blank" rel="noreferrer">
              Ko-fi
            </a>
            <a className="rounded-xl border-2 border-[#f8f1dc] px-3 py-3 text-center transition-colors hover:bg-[#f8f1dc] hover:text-[#17150f]" href="/contact">
              Contact
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] border-4 border-[#17150f] bg-[#ede4ce] p-5 shadow-[5px_5px_0_#17150f] sm:shadow-[10px_10px_0_#17150f]">
          <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#5c523d]">
                Server costs: 64 coins / month
              </p>
              <div
                className="mt-3 h-8 overflow-hidden rounded-full border-4 border-[#17150f] bg-[#f8f1dc]"
                role="progressbar"
                aria-label="Monthly server costs covered"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                aria-valuetext={`${coins} of 64 coins stacked (${progress}%)`}
              >
                <div aria-hidden="true" className="h-full bg-[var(--accent-deep)] transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 font-mono text-sm font-black">{coins} / 64 coins stacked ({progress}%)</p>
            </div>
            <button
              type="button"
              onClick={insertCoin}
              className="coin-button rounded-[1.5rem] border-4 border-[#17150f] bg-[var(--accent)] px-7 py-6 font-display text-2xl font-black uppercase leading-none tracking-[-0.04em] shadow-[6px_8px_0_#17150f] transition-transform active:translate-y-2 active:shadow-none focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-deep)]"
            >
              Insert
              <br />
              Coin
            </button>
          </div>

          <div className="mt-6 rounded-[1.4rem] border-4 border-[#17150f] bg-[#f8f1dc] p-4">
            <p className="mb-3 font-mono text-xs font-black uppercase tracking-[0.2em] text-[#5c523d]">
              supporters.txt
            </p>
            <div className="flex flex-wrap gap-2">
              {supporters.map((name) => (
                <span key={name} className="rounded-full border-2 border-[#17150f] bg-[#ede4ce] px-3 py-1 font-mono text-xs font-bold">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t-4 border-[#17150f] bg-[#17150f] px-4 py-6 text-[#f8f1dc]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 font-mono text-xs font-bold uppercase tracking-[0.16em] sm:flex-row">
          <span>SSH-Arcade boots from the terminal.</span>
          <span>Primary command: {games[0].command}</span>
        </div>
      </footer>
    </main>
  );
}
