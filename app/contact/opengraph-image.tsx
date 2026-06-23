import { ImageResponse } from "next/og";
import { siteConfig } from "../site";

export const alt = "Page the operator — open a line to the SSH-Arcade booth | SSH-Arcade";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Operator booth social share card. Comms-line teal accent, same arcade chassis.
const accent = "#5fd1c4";
const accentDeep = "#3f9e93";

export default function ContactOpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#d7d1c3",
          color: "#17150f",
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
                width: 88,
                height: 88,
                borderRadius: 20,
                marginRight: 28,
                background: "#17150f",
                color: accent,
                fontSize: 56,
                fontWeight: 800,
                fontFamily: "monospace",
              }}
            >
              {">_"}
            </div>
            <div style={{ display: "flex", fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>
              SSH-ARCADE
            </div>
          </div>
          <div
            style={{
              display: "flex",
              padding: "16px 28px",
              borderRadius: 999,
              background: "#17150f",
              color: accent,
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 2,
            }}
          >
            CABINET OP-00
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 120, fontWeight: 900, lineHeight: 1, letterSpacing: -4 }}>
            PAGE THE
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 120,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -4,
              color: accentDeep,
            }}
          >
            OPERATOR.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              marginRight: 20,
              padding: "20px 30px",
              borderRadius: 16,
              background: "#17150f",
              color: "#f8f1dc",
              fontSize: 34,
              fontFamily: "monospace",
            }}
          >
            ssh operator@{siteConfig.domain}
          </div>
          <div
            style={{
              display: "flex",
              padding: "20px 30px",
              borderRadius: 16,
              background: accent,
              color: "#17150f",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            Line open
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
