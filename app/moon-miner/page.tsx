import type { Metadata } from "next";
import { siteConfig } from "../site";
import MoonMinerCabinet from "./MoonMinerCabinet";

const title = "Moon Miner";
const description =
  "Moon Miner is a terminal-native extraction game: scan asteroid belts, mine rare ore, outrun pirates, and upgrade your ship over SSH.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/moon-miner" },
  openGraph: {
    type: "website",
    title: `${title} | ${siteConfig.name}`,
    description,
    url: `${siteConfig.url}/moon-miner`,
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${siteConfig.name}`,
    description,
  },
};

export default function MoonMinerPage() {
  return <MoonMinerCabinet />;
}
