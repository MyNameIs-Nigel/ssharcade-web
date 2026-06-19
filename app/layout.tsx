import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SSH-Arcade | Terminal games in arcade cabinets",
  description:
    "A retro-future arcade for SSH-native terminal games, featuring Farm as the first playable cabinet.",
  openGraph: {
    title: "SSH-Arcade",
    description:
      "Insert coin, copy the SSH command, and play terminal-native arcade games.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
