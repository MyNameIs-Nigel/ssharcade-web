"use client";

import type { CSSProperties } from "react";

type TerminalScreenProps = {
  phase: "dock" | "scan" | "mine" | "summary" | "shipyard";
};

const Header = ({ damaged = false }: { damaged?: boolean }) => (
  <div className={`moon-terminal-header ${damaged ? "is-damaged" : ""}`}>
    <span>MOON MINER</span>
    <span>— PILOT: USER — ◈ {damaged ? "13198" : "77946"}</span>
    <span>FUEL {damaged ? "41%" : "93%"}</span>
    <span className="moon-fuel-meter" aria-hidden="true"><i /></span>
    <span>HULL {damaged ? "91%" : "100%"}</span>
    <span>SHD {damaged ? "5/20" : "20/20"} {damaged && "DAMAGED"}</span>
  </div>
);

const Cursor = () => <span aria-hidden="true" className="moon-terminal-cursor" />;

const Bar = ({ value, color = "var(--accent)" }: { value: string; color?: string }) => (
  <span className="moon-bar" style={{ "--bar-value": value, "--bar-color": color } as CSSProperties}><i /></span>
);

function DockScreen() {
  return (
    <div className="moon-terminal-screen">
      <Header />
      <div className="moon-terminal-grid moon-dock-grid">
        <aside className="moon-panel">
          <b>◇ STAR CHART</b>
          <ul>
            <li>CERES INNER BELT <em>▣ 8</em></li>
            <li>VESTA MAIN BELT <em>▣ 6</em></li>
            <li className="selected">▸ TITAN SATURN RINGS <em>▣ 20</em></li>
            <li>IO VOLCAN ORBIT <em>▣ 14</em></li>
          </ul>
          <p>Rare ices in the rings. A long, cold haul.</p>
        </aside>
        <section className="moon-panel">
          <b>◇ PORT SERVICES</b>
          <dl className="moon-service-list">
            <div><dt>FUEL</dt><dd><Bar value="41%" /> 41%</dd></div>
            <div><dt>[F] REFUEL TO 100%</dt><dd>◈ 531</dd></div>
            <div><dt>HULL</dt><dd><Bar value="91%" color="#6ee7ff" /> 91%</dd></div>
            <div><dt>[H] REPAIR — FULL</dt><dd>◈ 154</dd></div>
            <div><dt>SHIELD</dt><dd><Bar value="100%" color="#b8c8ff" /> 20/20</dd></div>
          </dl>
          <p className="moon-highlight">SHIELD SERVICE — CHARGED</p>
          <p>[S] SHIPYARD<br />[L] SHIP&apos;S LOG</p>
          <p>Bigger rocks pay more but attract pirates.</p>
        </section>
      </div>
      <div className="moon-terminal-footer">↑/↓ SELECT · ENTER DEPART · F REFUEL · H REPAIR · S SHIPYARD · L LOG · ? HELP · Q QUIT <Cursor /></div>
    </div>
  );
}

function ScanScreen() {
  const targets = [
    ["AX-4468", "2.7km", "UNKNOWN"], ["OB-6477", "2.9km", "COMMON"], ["ND-1218", "3.1km", "RARE"],
    ["TH-7942", "6.3km", "UNKNOWN"], ["AX-3141", "7.2km", "COMMON"], ["AX-6683", "9.1km", "OUT OF RANGE"],
  ];
  return (
    <div className="moon-terminal-screen">
      <Header />
      <div className="moon-screen-title">◇ ASTEROID BELT — CERES<br /><span>ORE SCAN</span></div>
      <div className="moon-scan-map" aria-hidden="true">
        <i className="asteroid a1" /><i className="asteroid a2" /><i className="asteroid a3" /><i className="asteroid a4" />
        <strong>AX-4468</strong>
      </div>
      <div className="moon-scan-list">
        {targets.map(([id, distance, type], index) => (
          <div key={id} className={index === 0 ? "selected" : type === "OUT OF RANGE" ? "out" : ""}>
            <b>{index === 0 && "▸ "}{id}</b><span>{distance}</span><span>{type}</span>{index > 0 && <small>VOL {1820 + index * 180}　◈ {2100 + index * 1125}</small>}
          </div>
        ))}
      </div>
      <p className="moon-scanning">SCANNING AX-4468 <Bar value="34%" color="#ffb35f" /> 0.9s remaining</p>
      <div className="moon-terminal-footer">↑/↓ SELECT · S SCAN · ENTER LOCK · V VIEW · Q DOCK <Cursor /></div>
    </div>
  );
}

function MineScreen() {
  return (
    <div className="moon-terminal-screen">
      <Header />
      <div className="moon-screen-title">◇ MINING SITE — OB-7311 <span>(★ LEGENDARY)</span></div>
      <div className="moon-mining-layout">
        <div>
          <p>RESOURCE LEFT <Bar value="71%" /></p>
          <p>☠ HULL <Bar value="100%" color="#6ee7ff" /> 100%　SHIELD 20/20</p>
          <p>▣ FUEL <Bar value="49%" color="#ffb35f" /> 49%</p>
          <p className="moon-cargo">CARGO VALUE IN HOLD　◈ 6283 of ◈ 42175 (not sold)</p>
          <p className="moon-bail">[B] BAIL</p>
        </div>
        <div className="moon-radar">
          <b>PIRATE ETA ~2–4s</b>
          <span>· · · · · · · · · ·</span><span className="pirate">●</span>
          <span>· · · · · · · · · ·</span><span className="ship">▲</span>
          <span>· · · · · · · · · ·</span>
        </div>
      </div>
      <div className="moon-terminal-log">B BAIL</div>
      <div className="moon-terminal-footer"><Cursor /></div>
    </div>
  );
}

function SummaryScreen() {
  return (
    <div className="moon-terminal-screen">
      <Header damaged />
      <section className="moon-summary">
        <b>◇ RUN SUMMARY</b>
        <h3>ESCAPED UNDER FIRE</h3>
        <p>Hull torn open, engines screaming, cargo still aboard.</p>
        <dl>
          <div><dt>ASTEROID:</dt><dd>OB-7311</dd></div>
          <div><dt>CARGO RECOVERED:</dt><dd>+◈ 9560</dd></div>
          <div><dt>HULL DELTA:</dt><dd>-11　 FUEL DELTA: -21</dd></div>
          <div><dt>BALANCE:</dt><dd>◈ 13198</dd></div>
        </dl>
        <p className="moon-actions">[ENTER] RETURN TO BELT<br />[Q] DOCK AT PORT</p>
      </section>
      <div className="moon-terminal-log">[ENTER] RETURN TO BELT　[Q] DOCK AT PORT <Cursor /></div>
    </div>
  );
}

function ShipyardScreen() {
  return (
    <div className="moon-terminal-screen">
      <Header />
      <div className="moon-terminal-grid moon-shipyard-grid">
        <aside className="moon-panel">
          <b>◇ HANGAR</b>
          <ul><li className="selected">▸ SKIFF <strong>ACTIVE</strong></li><li>CICADA 9000 cr</li><li>WIDEN 18000 cr</li><li>MULE 26000 cr</li></ul>
        </aside>
        <section className="moon-panel">
          <b>◇ SKIFF — INDEPENDENT MINER</b>
          <dl className="moon-upgrade-list">
            <div><dt>THRUSTERS</dt><dd>○○○ D 1100 cr</dd></div><div><dt>HULL</dt><dd>●● D CAPPED</dd></div>
            <div><dt>FUEL EFFICIENCY</dt><dd>●● D 1210 cr</dd></div><div><dt>POWER GENERATOR</dt><dd>●● E 650 cr</dd></div>
            <div><dt>SCANNER</dt><dd>○○ E 700 cr</dd></div>
          </dl>
          <b>UTILITY</b>
          <dl className="moon-upgrade-list"><div><dt>U EXTRA CARGO</dt><dd>○○○○○ E</dd></div><div><dt>U SHIELD</dt><dd>○○○○○ E　↯ 3</dd></div></dl>
          <p>INTERNAL<br />　I empty — enter to install</p>
        </section>
      </div>
      <div className="moon-terminal-footer">↑/↓ SELECT · TAB PANE · ENTER BUY/PICK · X REMOVE · ESC/Q CHART <Cursor /></div>
    </div>
  );
}

export default function TerminalScreen({ phase }: TerminalScreenProps) {
  const screens = { dock: <DockScreen />, scan: <ScanScreen />, mine: <MineScreen />, summary: <SummaryScreen />, shipyard: <ShipyardScreen /> };
  return <div className="moon-terminal" role="img" aria-label={`Moon Miner ${phase} terminal screen`}>{screens[phase]}</div>;
}
