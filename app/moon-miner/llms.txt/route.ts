import { siteConfig } from "../../site";

// Static text file served at /moon-miner/llms.txt — see https://llmstxt.org
export const dynamic = "force-static";

export function GET() {
  const body = `# Moon Miner | ${siteConfig.name}

> Moon Miner is a hard roguelite asteroid-mining game played entirely over SSH. Scan asteroid belts, mine rare ore, outrun pirates, and upgrade your ship — no client install, your SSH key is your account.

## Play

- \`${siteConfig.sshCommand}\` — drops you at the arcade menu; pick Moon Miner (cabinet M-02)
- Web page: ${siteConfig.url}/moon-miner

## Story

It's the far edge of settled space. Corporate haulers own the safe lanes; everyone else scrapes a living in locked-down systems where a route permit can cost more than a ship. You are an independent rig pilot — one disposable ship, one drill, one tank of fuel, and a cargo hold that turns every escape into a liability. Ore pays. Rare ice pays better. But every minute your drill is spun up, your reactor signature is a beacon, and belt pirates triangulate closer.

Ships are lives. When the hull breaches, the ship is destroyed along with its installed upgrades and unsold cargo, and the pilot falls back to a starter salvage skiff (or buys the same ship back at a discount). Banked credits, permits, stations, and cosmetics survive death.

There is no narrator and no cut scenes — the fiction is delivered through the cockpit terminal itself: star chart, belt scanner, drill console, and ship's log, rendered like a phosphor CRT.

## Core loop

1. **Star Chart** — pick a system and destination, refuel/repair, buy ships and upgrades, sell cargo.
2. **Asteroid Belt** — scan procedurally generated contacts and lock a target.
3. **Mining Site** — drill in real time while a pirate radar closes; leave manually (BAIL early, DEPART once depleted).
4. **Escape / Pirate Contact** — a full cargo hold slows escape; pirates may demand tribute or attack.
5. **Run Summary** — a ship's-log entry of what was recovered, spent, and lost.

## Systems

- **Sol** — unlocked; the tutorial economy
- **Eridani Drift** — locked behind a Jump Drive; harsher rings, distant pirates
- **Kepler Reach** — late-game, high station value
- **Redline Expanse** — endgame; extremely profitable, routinely lethal

## More

- Full arcade: ${siteConfig.url}/llms.txt
- Contact: ${siteConfig.email}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
