import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { cabinets, siteConfig } from "./site";

export const metadata: Metadata = {
  title: "Cabinet not found",
  description: "That route is not on the SSH-Arcade floor yet.",
  robots: { index: false, follow: true },
};

const liveCabinets = cabinets.filter((cabinet) => cabinet.live);

export default function NotFound() {
  return (
    <main
      className="theme-root flex min-h-screen flex-col bg-[#d7d1c3] text-[#17150f]"
      style={{ "--accent": siteConfig.themeColor, "--cabinet-accent": "#7c7669" } as CSSProperties}
    >
      <div aria-hidden="true" className="arcade-backdrop fixed inset-0 pointer-events-none" />
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none opacity-[0.34] mix-blend-multiply grain" />

      <header className="relative z-10 mx-auto w-full max-w-3xl px-4 pt-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 rounded-[1.5rem] border-4 border-[#17150f] bg-[#ede4ce] p-3 shadow-[4px_4px_0_#17150f] sm:shadow-[8px_8px_0_#17150f]">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full border-2 border-[#17150f] bg-[#17150f] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--accent)] shadow-[3px_3px_0_var(--accent)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-deep)]"
          >
            <span aria-hidden="true">←</span> Arcade floor
          </Link>
          <span className="font-mono text-[0.65rem] font-black uppercase tracking-[0.18em] text-[#5c523d] sm:text-xs">
            Error 404
          </span>
        </div>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <p className="mb-4 inline-flex w-fit rounded-full border-2 border-[#17150f] bg-[#17150f] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[var(--accent)]">
          Arcade OS / fault slot
        </p>

        <div className="relative">
          <div className="absolute -left-3 top-10 hidden h-24 w-7 rounded-l-2xl border-4 border-r-0 border-[#17150f] bg-[var(--accent-deep)] shadow-[5px_5px_0_#17150f] md:block" />
          <div className="absolute -right-3 top-20 hidden h-28 w-7 rounded-r-2xl border-4 border-l-0 border-[#17150f] bg-[var(--accent)] shadow-[5px_5px_0_#17150f] md:block" />

          <div className="rounded-[2.3rem] border-4 border-[#17150f] bg-[#4b4a42] p-4 shadow-[6px_6px_0_#17150f] sm:p-6 sm:shadow-[14px_14px_0_#17150f]">
            <div className="cabinet-stage rounded-[1.7rem] border-4 border-[#17150f] bg-[#f8f1dc] p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-[#17150f] px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-[var(--cabinet-accent)]">
                  ——
                </span>
                <span className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#4b4a42]">
                  Powered down
                </span>
              </div>

              <div className="cabinet-screen is-off relative overflow-hidden rounded-[1.1rem] border-4 border-[#17150f] bg-[#17150f] p-6 text-[#f8f1dc] sm:p-8">
                <div className="relative z-10 text-center">
                  <p className="mb-2 font-mono text-xs uppercase tracking-[0.24em] text-[var(--cabinet-accent)]">
                    SSH-Arcade reports
                  </p>
                  <h1 className="font-display text-[clamp(3rem,18vw,9rem)] font-black uppercase leading-none tracking-[-0.06em] sm:tracking-[-0.08em]">
                    404
                  </h1>
                  <p className="mt-4 font-display text-2xl font-black uppercase tracking-[-0.04em] sm:text-3xl">
                    Cabinet not found
                  </p>
                  <p className="mx-auto mt-4 max-w-md font-mono text-sm leading-6 text-[#f8f1dc]/80">
                    That route is not wired into the arcade floor yet. Pick a live cabinet or head back to the lobby.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/"
                  className="flex min-h-14 items-center justify-center rounded-[1.15rem] border-4 border-[#17150f] bg-[var(--accent-deep)] px-5 py-3 text-center text-sm font-black uppercase tracking-[0.16em] shadow-[3px_3px_0_#17150f] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] sm:shadow-[5px_5px_0_#17150f]"
                >
                  Return to lobby
                </Link>
                {liveCabinets.map((cabinet) => (
                  <Link
                    key={cabinet.slug}
                    href={`/${cabinet.slug}`}
                    className="flex min-h-14 items-center justify-center rounded-[1.15rem] border-4 border-[#17150f] bg-[#17150f] px-5 py-3 text-center text-sm font-black uppercase tracking-[0.16em] text-[var(--accent)] shadow-[3px_3px_0_var(--accent)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-deep)] sm:shadow-[5px_5px_0_var(--accent)]"
                  >
                    Play {cabinet.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t-4 border-[#17150f] bg-[#17150f] px-4 py-5 text-[#f8f1dc]">
        <p className="mx-auto max-w-3xl text-center font-mono text-xs font-bold uppercase tracking-[0.16em]">
          {siteConfig.name} · no cabinet at this address
        </p>
      </footer>
    </main>
  );
}
