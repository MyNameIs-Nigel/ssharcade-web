<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# SSH-Arcade — web front

The landing page for **[ssharcade.dev](https://ssharcade.dev)** — a retro-future
arcade where every cabinet is a game you play over SSH. One address opens the whole
floor: `ssh play.ssharcade.dev` drops you at the arcade menu to pick a game. Farm is
the first cabinet running.

## Stack

- **Next.js 16.2.9** (App Router, Turbopack) — modified; see the warning above
- **React 19.2.4** + **TypeScript**
- **Tailwind CSS v4** — `@import "tailwindcss"` + `@theme inline` in `app/globals.css`;
  prefer arbitrary-value utilities (e.g. `bg-[var(--accent)]`) over a config file
- Deployed on Vercel

## Commands

```bash
npm run dev    # dev server (Turbopack) — http://localhost:3000
npm run build  # production build; all routes prerender as static
npm run lint   # eslint (eslint-config-next)
```

If you hit `Could not find the module ... in the React Client Manifest`, the
`.next` cache is stale (usually from switching between `build` and `dev`). Stop
the dev server, delete `.next`, and restart — it is not a code bug.

## Architecture

- **`app/site.ts` is the single source of identity.** `siteConfig` (name, domain,
  copy, colors, ssh command), the `cabinets` list, and the standalone `pages`
  list all live here. Edit identity *here* and everything below follows — do not
  hardcode the domain, title, or copy anywhere else.
- **File-convention metadata routes** (all in `app/`, auto-injected by Next — do
  not also set them in `metadata`):
  - `layout.tsx` — `metadata` (title template, canonical, OpenGraph, Twitter,
    robots) and `viewport` (theme color)
  - `icon.svg`, `apple-icon.tsx` — favicon / touch icon
  - `opengraph-image.tsx` — social card (also reused as the Twitter image)
  - `manifest.ts` → `/manifest.webmanifest`
  - `robots.ts` → `/robots.txt`, `sitemap.ts` → `/sitemap.xml`
  - `llms.txt/route.ts` → `/llms.txt` (route handler, `force-static`); cabinets
    may also have their own, e.g. `moon-miner/llms.txt/route.ts` →
    `/moon-miner/llms.txt`, for deeper per-game context
- **`app/page.tsx`** is a thin server wrapper around **`app/ArcadeLanding.tsx`**,
  the client component holding all interactive arcade UI.

## Conventions / gotchas

- **Accent theming.** The arcade's accent follows the selected cabinet.
  `--accent` and `--cabinet-accent` are registered with `@property { syntax:
  "<color>" }` in `globals.css` so they *animate*; a `transition` on
  `.theme-root` cross-fades the background gradient and every accent surface.
  Per-cabinet colors live on each game's `accent` in `ArcadeLanding.tsx`; the
  resting (nothing-selected) accent is amber `#ffb000`.
- **Powered-off default.** Selection starts at `null` — the hero renders a
  grayed-out "Standby" state (`.is-off`, no scanline) until the user picks a
  cabinet.
- **Reduced motion.** `globals.css` disables all animation/transition under
  `prefers-reduced-motion: reduce`. Keep new motion CSS-driven so it inherits this.
- **`next/og` / satori** (OG + apple icons): multi-child flex needs explicit
  `display: flex`; use `marginRight` not `gap`. Works with the built-in font —
  do not add custom fonts unless needed.
- **Unbuilt routes are intentional.** The cabinet route (`/packet-derby`) and
  pages (`/docs`, `/donate`) are listed in the sitemap and `llms.txt` but not
  built yet — they 404 by design. Add them to `app/site.ts` first if you build
  them. `/farm`, `/moon-miner`, and `/contact` are built.
- **`/moon-miner` mirrors the real game.** Copy, ship names, and terminal
  screens in `app/moon-miner/` should stay consistent with the story spec in
  `../ssh-games/ssh-moonminer/docs/01-concept-and-story.md` — that doc (not
  this site) is authoritative for lore, ship names, and mechanics.
- **`/contact` is the operator booth.** A CRT-housed multi-step "operator
  terminal" (`app/contact/OperatorTerminal.tsx`) collects callsign → reply
  channel → message and POSTs to the `app/api/contact/route.ts` route handler,
  which forwards a Discord embed to the `DISCORD_WEBHOOK` env var. The
  validation contract lives in `app/contact/contact.{types,constants,validation}.ts`.
<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (60-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk go test             # Go test failures only (90%)
rtk jest                # Jest failures only (99.5%)
rtk vitest              # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk pytest              # Python test failures only (90%)
rtk rake test           # Ruby test failures only (90%)
rtk rspec               # RSpec test failures only (60%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%). Format flags (-c, -l, -L, -o, -Z) run raw.
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```

## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->