# SSH-Arcade

The web front for **[ssharcade.dev](https://ssharcade.dev)** — a retro-future arcade where every cabinet is a game you play over SSH. One address opens the whole floor: `ssh play.ssharcade.dev` drops you at the arcade menu to pick a game. Farm is the first cabinet running.

Built with Next.js (App Router) + Tailwind CSS v4.

## Develop

```bash
npm run dev    # http://localhost:3000
npm run build  # production build
npm run lint
```

## Identity & SEO

Brand identity lives in one place — [`app/site.ts`](app/site.ts) (name, domain, copy, colors, the cabinet list, and standalone pages). Update it there and the rest follows.

Generated from that config:

- `app/layout.tsx` — page metadata (title template, canonical, OpenGraph, Twitter, robots, theme color)
- `app/opengraph-image.tsx` — social share card (also used as the Twitter image)
- `app/icon.svg`, `app/apple-icon.tsx` — favicons / touch icon
- `app/manifest.ts` — PWA web manifest
- `app/robots.ts` → `/robots.txt`
- `app/sitemap.ts` → `/sitemap.xml`
- `app/llms.txt/route.ts` → `/llms.txt`

`/farm`, `/moon-miner`, and `/contact` are built. The cabinet route (`/packet-derby`) and pages (`/docs`, `/donate`) are listed in the sitemap and `llms.txt` but not built yet.
