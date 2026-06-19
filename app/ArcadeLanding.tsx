"use client";

import { useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";

const games = [
  {
    title: "Farm",
    status: "Now featuring",
    accent: "#ffb000",
    cabinet: "F-01",
    summary:
      "A cozy idle farm that lives in your terminal. Plant, wait, harvest, and let the field keep time while you are away.",
    command: "ssh farm.ssh-arcade.dev",
    meter: "Live cabinet",
  },
  {
    title: "Moon Mine",
    status: "Cabinet warming",
    accent: "#6ee7ff",
    cabinet: "M-02",
    summary:
      "A quiet extraction loop for late-night operators, planned for the next bay in the arcade.",
    command: "coming soon",
    meter: "Prototype",
  },
  {
    title: "Packet Derby",
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
  const [activeGame, setActiveGame] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [coins, setCoins] = useState(37);
  const [copied, setCopied] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playTone = (frequency: number, duration = 0.08, force = false) => {
    if ((!soundOn && !force) || typeof AudioContext === "undefined") {
      return;
    }

    const context = audioContextRef.current ?? new AudioContext();
    audioContextRef.current = context;

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "square";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration + 0.02);
  };

  const selectGame = (index: number) => {
    setActiveGame(index);
    playTone(220 + index * 90, 0.07);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectGame((activeGame + 1) % games.length);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectGame((activeGame - 1 + games.length) % games.length);
    }
  };

  const insertCoin = () => {
    setCoins((value) => Math.min(value + 1, 64));
    playTone(880, 0.06);
    window.setTimeout(() => playTone(440, 0.09), 90);
  };

  const copyCommand = async () => {
    await navigator.clipboard.writeText(games[0].command);
    setCopied(true);
    playTone(660, 0.05);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const progress = Math.min(Math.round((coins / 64) * 100), 100);
  const featuredGame = games[activeGame];

  return (
    <main className="min-h-screen overflow-hidden bg-[#d7d1c3] text-[#17150f]">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(255,176,0,0.24),transparent_28%),linear-gradient(90deg,rgba(23,21,15,0.06)_1px,transparent_1px),linear-gradient(rgba(23,21,15,0.05)_1px,transparent_1px)] bg-[size:auto,42px_42px,42px_42px]" />
      <div className="fixed inset-0 pointer-events-none opacity-[0.18] mix-blend-multiply grain" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="z-10 flex items-center justify-between rounded-[1.5rem] border-4 border-[#17150f] bg-[#ede4ce] p-3 shadow-[8px_8px_0_#17150f]">
          <a
            href="#top"
            className="rounded-full border-2 border-[#17150f] bg-[#ffb000] px-4 py-2 text-sm font-black uppercase tracking-[0.18em] shadow-[3px_3px_0_#17150f] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ff6b00]"
          >
            SSH-Arcade
          </a>
          <div className="hidden items-center gap-3 text-xs font-black uppercase tracking-[0.22em] md:flex">
            <span className="h-3 w-3 animate-pulse rounded-full bg-[#73d13d] shadow-[0_0_18px_#73d13d]" />
            Now featuring: Farm
          </div>
          <button
            type="button"
            onClick={() => {
              setSoundOn((value) => !value);
              if (!soundOn) {
                window.setTimeout(() => playTone(520, 0.06, true), 0);
              }
            }}
            className="rounded-full border-2 border-[#17150f] bg-[#f8f1dc] px-4 py-2 text-sm font-black uppercase tracking-[0.14em] shadow-[3px_3px_0_#17150f] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ff6b00]"
            aria-pressed={soundOn}
          >
            Sound {soundOn ? "on" : "off"}
          </button>
        </header>

        <div id="top" className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr] lg:py-14">
          <div className="relative z-10">
            <p className="mb-4 inline-flex rounded-full border-2 border-[#17150f] bg-[#17150f] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#ffb000]">
              Arcade OS / boot slot 01
            </p>
            <h1 className="max-w-4xl text-balance font-display text-[clamp(3.25rem,11vw,8.8rem)] font-black uppercase leading-[0.78] tracking-[-0.08em]">
              Insert coin. Start farm.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-bold leading-8 text-[#433c2d] sm:text-xl">
              A terminal-native arcade where every cabinet is an SSH game. Farm is the first machine on the floor:
              tactile, patient, free to play, and funded by honest spare-change support.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto]">
              <button
                type="button"
                onClick={copyCommand}
                className="group flex min-h-16 items-center justify-between gap-4 rounded-[1.15rem] border-4 border-[#17150f] bg-[#17150f] px-5 py-4 font-mono text-sm font-bold text-[#f8f1dc] shadow-[7px_7px_0_#ffb000] transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ff6b00]"
              >
                <span>{games[0].command}</span>
                <span className="rounded-full bg-[#ffb000] px-3 py-1 font-display text-xs uppercase tracking-[0.16em] text-[#17150f]">
                  {copied ? "Copied" : "Copy"}
                </span>
              </button>
              <a
                href="#coin-slot"
                className="flex min-h-16 items-center justify-center rounded-[1.15rem] border-4 border-[#17150f] bg-[#ff6b00] px-6 py-4 text-sm font-black uppercase tracking-[0.18em] shadow-[7px_7px_0_#17150f] transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ffb000]"
              >
                Support costs
              </a>
            </div>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-xl">
            <div className="absolute -left-4 top-10 h-24 w-7 rounded-l-2xl border-4 border-r-0 border-[#17150f] bg-[#ff6b00] shadow-[5px_5px_0_#17150f]" />
            <div className="absolute -right-4 top-24 h-32 w-7 rounded-r-2xl border-4 border-l-0 border-[#17150f] bg-[#ffb000] shadow-[5px_5px_0_#17150f]" />
            <div className="rounded-[2.3rem] border-4 border-[#17150f] bg-[#4b4a42] p-4 shadow-[14px_14px_0_#17150f] sm:p-6">
              <div className="rounded-[1.7rem] border-4 border-[#17150f] bg-[#f8f1dc] p-4 shadow-inner">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-[#17150f] px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-[#ffb000]">
                    {featuredGame.cabinet}
                  </span>
                  <span className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#4b4a42]">
                    {featuredGame.status}
                  </span>
                </div>

                <div
                  className="cabinet-screen relative overflow-hidden rounded-[1.1rem] border-4 border-[#17150f] bg-[#17150f] p-4 text-[#f8f1dc]"
                  style={{ "--cabinet-accent": featuredGame.accent } as CSSProperties}
                >
                  <div className="scanline" />
                  <div className="relative z-10">
                    <p className="mb-2 font-mono text-xs uppercase tracking-[0.24em] text-[var(--cabinet-accent)]">
                      SSH-Arcade presents
                    </p>
                    <h2 className="font-display text-6xl font-black uppercase leading-none tracking-[-0.08em] sm:text-8xl">
                      {featuredGame.title}
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
                      {featuredGame.summary}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-[1fr_auto] items-end gap-4">
                  <div>
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#4b4a42]">Cabinet controls</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => selectGame((activeGame - 1 + games.length) % games.length)}
                        className="h-12 w-12 rounded-full border-4 border-[#17150f] bg-[#ffb000] font-black shadow-[3px_4px_0_#17150f] transition-transform active:translate-y-1 active:shadow-none focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ff6b00]"
                        aria-label="Previous cabinet"
                      >
                        LT
                      </button>
                      <button
                        type="button"
                        onClick={() => selectGame((activeGame + 1) % games.length)}
                        className="h-12 w-12 rounded-full border-4 border-[#17150f] bg-[#ff6b00] font-black shadow-[3px_4px_0_#17150f] transition-transform active:translate-y-1 active:shadow-none focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ffb000]"
                        aria-label="Next cabinet"
                      >
                        RT
                      </button>
                    </div>
                  </div>
                  <div className="rounded-xl border-4 border-[#17150f] bg-[#17150f] px-4 py-3 text-right font-mono text-xs font-bold uppercase text-[#ffb000]">
                    {featuredGame.meter}
                    <br />
                    <span className="text-[#f8f1dc]">{featuredGame.command}</span>
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
        <div className="rounded-[2rem] border-4 border-[#17150f] bg-[#ede4ce] p-4 shadow-[10px_10px_0_#17150f] sm:p-6">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff6b00]">Arrow keys welcome</p>
              <h2 id="cabinet-row" className="font-display text-4xl font-black uppercase tracking-[-0.05em] sm:text-6xl">
                Cabinet row
              </h2>
            </div>
            <p className="max-w-md text-sm font-bold leading-6 text-[#5c523d]">
              Swipe on mobile, click or use left/right on desktop. Adding the next game should feel like rolling in
              another machine, not redesigning the room.
            </p>
          </div>

          <div
            className="grid gap-4 overflow-x-auto pb-3 md:grid-cols-3 md:overflow-visible"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            aria-label="Choose an arcade cabinet"
          >
            {games.map((game, index) => (
              <button
                type="button"
                key={game.title}
                onClick={() => selectGame(index)}
                onMouseEnter={() => playTone(180 + index * 80, 0.04)}
                className={`min-w-[16rem] snap-center rounded-[1.4rem] border-4 border-[#17150f] p-4 text-left shadow-[6px_6px_0_#17150f] transition-all focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ff6b00] ${
                  activeGame === index ? "translate-y-[-4px] bg-[#17150f] text-[#f8f1dc]" : "bg-[#f8f1dc] text-[#17150f]"
                }`}
              >
                <div
                  className="mb-4 rounded-xl border-4 border-current px-3 py-5 text-center font-display text-3xl font-black uppercase tracking-[-0.05em]"
                  style={{ backgroundColor: game.accent }}
                >
                  {game.title}
                </div>
                <p className="font-mono text-xs font-black uppercase tracking-[0.18em] opacity-70">{game.status}</p>
                <p className="mt-3 text-sm font-bold leading-6 opacity-85">{game.summary}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        id="coin-slot"
        aria-labelledby="coin-heading"
        className="relative z-10 mx-auto grid w-full max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8"
      >
        <div className="rounded-[2rem] border-4 border-[#17150f] bg-[#17150f] p-6 text-[#f8f1dc] shadow-[10px_10px_0_#ffb000]">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffb000]">Free games, transparent costs</p>
          <h2 id="coin-heading" className="mt-3 font-display text-5xl font-black uppercase leading-none tracking-[-0.06em] sm:text-7xl">
            Insert coin.
          </h2>
          <p className="mt-5 text-lg font-bold leading-8 text-[#f8f1dc]/80">
            Donations are not a guilt screen. They are the coin slot that keeps the cabinets online: hosting,
            domains, backups, and enough runway to build the next machine.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-2 font-mono text-xs font-black uppercase tracking-[0.16em]">
            <a className="rounded-xl border-2 border-[#f8f1dc] px-3 py-3 text-center transition-colors hover:bg-[#f8f1dc] hover:text-[#17150f]" href="https://github.com/sponsors" target="_blank" rel="noreferrer">
              Sponsors
            </a>
            <a className="rounded-xl border-2 border-[#f8f1dc] px-3 py-3 text-center transition-colors hover:bg-[#f8f1dc] hover:text-[#17150f]" href="https://ko-fi.com" target="_blank" rel="noreferrer">
              Ko-fi
            </a>
            <a className="rounded-xl border-2 border-[#f8f1dc] px-3 py-3 text-center transition-colors hover:bg-[#f8f1dc] hover:text-[#17150f]" href="mailto:hello@ssh-arcade.dev?subject=Support%20SSH-Arcade">
              Contact
            </a>
          </div>
        </div>

        <div className="rounded-[2rem] border-4 border-[#17150f] bg-[#ede4ce] p-5 shadow-[10px_10px_0_#17150f]">
          <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#5c523d]">
                Server costs: 64 coins / month
              </p>
              <div className="mt-3 h-8 overflow-hidden rounded-full border-4 border-[#17150f] bg-[#f8f1dc]">
                <div className="h-full bg-[#ff6b00] transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 font-mono text-sm font-black">{coins} / 64 coins stacked ({progress}%)</p>
            </div>
            <button
              type="button"
              onClick={insertCoin}
              className="coin-button rounded-[1.5rem] border-4 border-[#17150f] bg-[#ffb000] px-7 py-6 font-display text-2xl font-black uppercase leading-none tracking-[-0.04em] shadow-[6px_8px_0_#17150f] transition-transform active:translate-y-2 active:shadow-none focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#ff6b00]"
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
