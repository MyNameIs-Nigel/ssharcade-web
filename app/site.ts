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
    "A retro-future arcade for SSH-native terminal games. Insert coin, copy the SSH command, and play — Farm is the first cabinet on the floor.",
  tagline: "Insert coin. Start farm.",
  email: "hello@ssharcade.dev",
  sshCommand: "ssh farm.ssharcade.dev",
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
  { slug: "farm", title: "Farm", live: true, host: "farm.ssharcade.dev" },
  { slug: "moon-mine", title: "Moon Mine", live: false, host: "" },
  { slug: "packet-derby", title: "Packet Derby", live: false, host: "" },
] as const;

/** Standalone pages (not cabinets) that belong in the sitemap. */
export const pages = [
  { path: "/docs", title: "Docs" },
  { path: "/donate", title: "Donate" },
  { path: "/contact", title: "Contact" },
] as const;
