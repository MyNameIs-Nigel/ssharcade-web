import { siteConfig, cabinets, pages } from "../site";

// Static text file served at /llms.txt — see https://llmstxt.org
export const dynamic = "force-static";

export function GET() {
  const { name, url, description } = siteConfig;

  const cabinetLines = cabinets
    .map((cabinet) => {
      const route = `${url}/${cabinet.slug}`;
      const note = cabinet.live
        ? `live now — \`${siteConfig.sshCommand}\` and pick ${cabinet.title} from the arcade menu`
        : "in development, not yet playable";
      return `- [${cabinet.title}](${route}): ${note}`;
    })
    .join("\n");

  const pageLines = pages
    .map((page) => `- [${page.title}](${url}${page.path}): ${page.title} page`)
    .join("\n");

  const body = `# ${name}

> ${description}

${name} is a retro-future arcade where every cabinet is a game you play over SSH — no install, no client, just a terminal. Every cabinet lives behind one address: \`${siteConfig.sshCommand}\` drops you at the arcade menu to pick a game. Farm is the first playable cabinet; more are warming up. The arcade is free to play and funded by optional supporter donations.

## Cabinets

${cabinetLines}

## Pages

${pageLines}

## Contact

- Email: ${siteConfig.email}
- Site: ${url}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
