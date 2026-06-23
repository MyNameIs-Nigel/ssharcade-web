import type { Metadata } from "next";
import { siteConfig } from "../site";
import OperatorTerminal from "./OperatorTerminal";

const title = "Contact";
const description =
  "Page the SSH-Arcade operator booth. Open a line in the terminal, leave a transmission, and the booth rings you back — bug reports, cabinet ideas, or just a hello.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/contact" },
  openGraph: {
    type: "website",
    title: `${title} | ${siteConfig.name}`,
    description,
    url: `${siteConfig.url}/contact`,
    // og:image is supplied automatically by app/contact/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | ${siteConfig.name}`,
    description,
    // twitter:image falls back to the generated opengraph-image
  },
};

export default function ContactPage() {
  return <OperatorTerminal />;
}
