import { ImageResponse } from "next/og";
import { siteConfig } from "../site";

export const alt = "Moon Miner — terminal asteroid mining over SSH | SSH-Arcade";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const accent = "#6ee7ff";

export default function MoonMineOpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 76,
          background: "#030712",
          color: "#dcecff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 84,
                height: 84,
                borderRadius: 20,
                marginRight: 24,
                background: accent,
                color: "#030712",
                fontSize: 48,
                fontWeight: 900,
                fontFamily: "monospace",
              }}
            >
              M
            </div>
            <div style={{ display: "flex", fontSize: 42, fontWeight: 800, letterSpacing: -1 }}>SSH-ARCADE</div>
          </div>
          <div style={{ display: "flex", padding: "15px 24px", borderRadius: 999, border: `2px solid ${accent}`, color: accent, fontSize: 26, fontWeight: 800, letterSpacing: 2 }}>
            CABINET M-02
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 108, fontWeight: 900, lineHeight: 0.88, letterSpacing: -5 }}>MINE THE</div>
          <div style={{ display: "flex", fontSize: 108, fontWeight: 900, lineHeight: 0.88, letterSpacing: -5, color: accent }}>QUIET SIDE.</div>
          <div style={{ display: "flex", marginTop: 26, color: "#91a8ca", fontSize: 28, fontFamily: "monospace" }}>SCAN · EXTRACT · EVADE · UPGRADE</div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", marginRight: 18, padding: "18px 26px", borderRadius: 14, background: "#111d31", color: "#dcecff", fontSize: 32, fontFamily: "monospace" }}>
            {siteConfig.sshCommand}
          </div>
          <div style={{ display: "flex", padding: "18px 26px", borderRadius: 14, background: accent, color: "#030712", fontSize: 30, fontWeight: 800 }}>
            Live now
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
