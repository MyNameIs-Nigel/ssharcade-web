/**
 * Single source of truth for SSH-Arcade's identity.
 *
 * The production domain is `ssharcade.dev` (no hyphen). Keep every public
 * reference — metadata, sitemap, robots, llms.txt, manifest, and the landing
 * copy — pointed here so the identity can never drift again.
 */
export const siteConfig = {
  name: "SSH-Arcade",
  domain: "ssharcade.dev",
  url: "https://ssharcade.dev",
  title: "SSH-Arcade — Terminal games in arcade cabinets",
  description:
    "A retro-future arcade for SSH-native terminal games. One address opens the whole floor — ssh play.ssharcade.dev, pick a cabinet, and play. Farm is the first machine up.",
  tagline: "Insert coin. Start farm.",
  email: "hello@ssharcade.dev",
  sshCommand: "ssh play.ssharcade.dev",
  ogImageAlt: "SSH-Arcade — terminal games in arcade cabinets",
  locale: "en_US",
  // Brand colors (mirrors globals.css)
  themeColor: "#ffb000",
  backgroundColor: "#d7d1c3",
} as const;

/**
 * The cabinet row. `slug` drives the per-game routes that live in the sitemap
 * (e.g. /farm). These pages are not built yet — only listed for crawlers.
 */
export const cabinets = [
  { slug: "farm", title: "Farm", live: true },
  { slug: "moon-mine", title: "Moon Mine", live: true },
  { slug: "packet-derby", title: "Packet Derby", live: false },
] as const;

/** Standalone pages (not cabinets) that belong in the sitemap. */
export const pages = [
  { path: "/docs", title: "Docs" },
  { path: "/donate", title: "Donate" },
  { path: "/contact", title: "Contact" },
] as const;
