# 1.1 — Documentation Tree & Table of Contents

> Implementation plan. Source: [docs/MISSING_FEATURES.md](../MISSING_FEATURES.md) §1 Repository Documentation System.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | 1.1 |
| **Section** | Repository Documentation System |
| **Severity** | MAJOR |
| **Markets** | Internal / DX (not market-facing) |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | Maintainer (Nigel) / DX |
| **Depends on** | — |
| **Unblocks** | 1.2, 1.3, 1.4 |
| **Completed** | FALSE |

---

## 1. Problem Statement

An agent (or new contributor) dropped into this repo has no fast, structured way
to learn what each file does and — critically — *why* it exists. Today that
knowledge lives only in scattered code comments, `AGENTS.md`, and git history,
so every session re-derives context from scratch and the *why* (why amber
`#ffb000`? why a route handler for `llms.txt`? why is selection `null` at rest?)
is routinely lost or guessed at. This feature defines the **skeleton** — the
`docs/reference/` tree, the agent-navigable table of contents, and the per-file
doc schema — that Features 1.2 and 1.3 fill in and 1.4 keeps fresh. It is the
foundation; nothing else in §1 can land without it.

## 2. Goals

- Establish a single `docs/reference/` tree as the agent's entry point for
  understanding the codebase, with one landing **table of contents** an agent
  reads first.
- Define a **stable doc-file schema** (front-matter + fixed body sections) so
  every per-file doc looks the same and is mechanically parseable.
- Provide a **machine-navigable manifest** (source path → doc path → coverage
  status → last-audited commit) that 1.4 can diff to detect drift.
- Make the structure **agent-first**: terse, structured, llms.txt-style, with the
  *Why* section first-class and `UNKNOWN` whys explicitly representable.
- Ship the tree as a **skeleton of stubs** that mirrors the repo's real areas, so
  1.2/1.3 only have to fill bodies, never invent structure.

## 3. Non-Goals

- **Writing the actual doc content.** Filling the technical bodies is 1.2; the
  UX/UI bodies are 1.3. This feature only creates the empty, schema-correct shells.
- **Auditing / freshness enforcement.** That is 1.4.
- **Human onboarding prose / tutorials.** The audience is agent-first (see §6);
  polished narrative onboarding is out of scope.
- **Documenting unbuilt routes.** Cabinet/page routes that 404 by design
  (`/packet-derby`, `/donate`, etc.) are not given doc
  shells until they exist in code — see [FEATURE_1.4.md](FEATURE_1.4.md) for how
  new files get shells later.
- **Auto-generated API doc dumps** (e.g. TypeDoc). The value here is curated
  *why*, not regenerated signatures.

## 4. Personas & User Stories

- **As an AI agent** starting a task, I want to open one table of contents and
  jump to the doc for the file I'm about to touch, so I build correct context in
  one hop instead of re-reading the whole repo.
- **As the maintainer (Nigel)**, I want a fixed place and shape for codebase
  docs, so the *why* behind a decision is captured once and not re-litigated.
- **As a new contributor**, I want to see which files are documented and which
  are still stubs, so I know what is trustworthy.
- **As the audit skill (1.4)**, I want a manifest I can parse and diff against
  git, so I can flag stale or missing docs without scraping prose.

## 5. Functional Requirements

- **FR-1.** The system MUST create a `docs/reference/` directory tree whose
  subfolders mirror the repo's real areas (at minimum: `app/` and its metadata
  routes, `app/farm/`, styling (`globals.css`), and root config such as
  `app/site.ts`).
- **FR-2.** The system MUST provide a single landing **table of contents** at
  `docs/reference/README.md` that groups every doc by area and links to it.
- **FR-3.** Every per-file doc MUST begin with YAML front-matter containing at
  least: `doc_id`, `source_path`, `area`, `status` (`STUB|PARTIAL|COMPLETE`),
  `last_audited_sha`, `last_audited_date`, `related` (list), and `why_unknowns`
  (integer count).
- **FR-4.** Every per-file doc MUST contain, in order, the fixed body sections:
  **Summary**, **What**, **How**, **Why**, **Gotchas / Invariants**, **Related**,
  **Open Questions (UNKNOWN whys)**.
- **FR-5.** The **Why** section MUST support per-item rationale written as
  `**Why <question>?** → <answer>` and MUST allow an item to be marked `UNKNOWN`
  when no answer is derivable (the value Feature 1.2/1.3 leans on).
- **FR-6.** The system MUST generate a machine-navigable **manifest** at
  `docs/reference/manifest.json` (or `_index.md` with a parseable table) listing
  one entry per documented source file: `source_path`, `doc_path`, `status`,
  `last_audited_sha`, `why_unknowns`.
- **FR-7.** Newly created doc shells MUST default to `status: STUB` and
  `why_unknowns: 0`, with body sections present but empty/`TODO`, so coverage is
  honestly reported.
- **FR-8.** The TOC and manifest MUST list a source file at most once (no
  duplicate doc entries), and every manifest entry MUST point at a doc file that
  exists.
- **FR-9.** The structure SHOULD be defined as a reusable **skill** (sibling to
  the existing `feature-spec` skill under `.claude/skills/`) so 1.2/1.3/1.4 can
  invoke it rather than re-describe the schema.
- **FR-10.** The doc schema SHOULD be captured in a template file
  (`docs/reference/_DOC_TEMPLATE.md`) so every doc is copied from one source of
  truth, mirroring how `docs/templates/_TEMPLATE.md` seeds features.

## 6. Non-Functional Requirements

- **Performance** — The TOC and manifest MUST be readable by an agent in a single
  file read each (< ~2k lines); large areas link out rather than inline.
- **Security** — Docs are public-repo content; they MUST NOT embed secrets, host
  credentials, or anything beyond what is already in source. SSH host strings
  already public in `app/site.ts` are fine.
- **Privacy & Compliance** — N/A (no user data). License/attribution of any
  copied prose stays within this repo.
- **Accessibility** — Docs are Markdown; headings MUST be properly nested so
  GitHub's renderer and screen readers produce a valid outline.
- **Scalability** — Schema MUST scale to every file in `app/` and survive new
  cabinets/pages being added (1.4 appends shells; structure does not change).
- **Reliability** — The manifest MUST stay in sync with files on disk; a missing
  doc referenced by the manifest is a hard error 1.4 will catch.
- **Observability** — `status` + `why_unknowns` in front-matter are the metrics;
  the manifest is the aggregate dashboard.
- **Maintainability** — One template, one schema. Changing the schema means
  editing `_DOC_TEMPLATE.md` and the skill, nothing else.
- **Internationalization** — English-only; not user-facing.
- **Backward compatibility** — If the schema changes later, the manifest MUST
  carry a `schema_version` so 1.4 can migrate older docs.

## 7. Acceptance Criteria

- **AC-1.** *Given* a clean repo, *When* the structure skill runs, *Then*
  `docs/reference/README.md`, `docs/reference/_DOC_TEMPLATE.md`, and
  `docs/reference/manifest.json` all exist and the README links to one doc shell
  per real source area.
- **AC-2.** *Given* the generated tree, *When* an agent opens `README.md`,
  *Then* it can reach the doc shell for any listed file in exactly one link hop.
- **AC-3.** *Given* any generated doc shell, *When* it is parsed, *Then* it has
  valid front-matter with all required keys and the seven fixed body sections in
  order, with `status: STUB`.
- **AC-4.** *Given* the manifest, *When* it is compared to disk, *Then* every
  entry's `doc_path` resolves to an existing file and no source file appears twice.
- **AC-5.** *Given* a Why item with no derivable answer, *When* it is recorded,
  *Then* it appears as `UNKNOWN` and increments `why_unknowns` in front-matter.

## 8. Data Model

No database. The "data model" is the on-disk doc schema:

- **`docs/reference/manifest.json`** — array of entries:
  `{ schema_version, source_path, doc_path, area, status, last_audited_sha, why_unknowns }`.
- **Per-doc front-matter** (YAML) — keys listed in FR-3.
- **Folder layout** (initial skeleton, mirrors the repo):
  ```
  docs/reference/
    README.md                 # table of contents (FR-2)
    _DOC_TEMPLATE.md          # doc schema source (FR-10)
    manifest.json             # machine index (FR-6)
    app/
      site.md                 # app/site.ts — identity source of truth
      page.md                 # app/page.tsx
      layout.md               # app/layout.tsx (metadata + viewport)
      globals.md              # app/globals.css (theming)  -> UX side, 1.3
      arcade-landing.md       # app/ArcadeLanding.tsx      -> UX side, 1.3
      not-found.md            # app/not-found.tsx
      metadata-routes.md      # icon/apple-icon/opengraph/manifest/robots/sitemap/llms
      farm/
        page.md
        farm-cabinet.md
        terminal-demo.md
        crops.md
  ```
  (Exact file list is reconciled against the repo at generation time; 1.2 owns the
  technical bodies, 1.3 owns `globals.md`/`arcade-landing.md`.)

## 9. API Surface

No HTTP surface. The "interface" other features consume:

- The **skill contract**: invoking the structure skill (re)generates README +
  manifest + missing shells idempotently (running twice changes nothing).
- The **manifest JSON shape** in §8 is the read API for Feature 1.4.

## 10. UI / UX

No product UI. The "UX" is the agent's reading experience:

- **README.md** is grouped by area with a one-line description per file and a
  status badge (`STUB`/`PARTIAL`/`COMPLETE`) so coverage is visible at a glance.
- **Empty/STUB state** — a freshly generated shell clearly reads `STUB` and its
  body sections say `TODO (filled by 1.2)` / `TODO (filled by 1.3)`.
- **Navigation** — every doc's `Related` links are relative paths so they work in
  GitHub's renderer and in an agent's file reads.

## 11. AI / ML Considerations

This tree exists to be consumed *by* an LLM agent building context, and is itself
generated *by* an agent (the skill). Therefore:

- **Agent-first format** (terse, structured, stable headings) is a hard
  requirement — see §6 — because predictable structure lets an agent skim cheaply.
- The skill MUST NOT invent *why* rationale; unknown whys are recorded as
  `UNKNOWN` (the §5/FR-5 rule shared with 1.2/1.3). No fabricated justification.
- No model is fine-tuned or called at runtime; the only "model" is whatever agent
  runs the skill. No PII, no cost budget beyond normal tool calls.

## 12. Integration Points

- **Internal modules documented (read-only):** `app/site.ts`, `app/page.tsx`,
  `app/layout.tsx`, `app/globals.css`, `app/ArcadeLanding.tsx`, the metadata
  routes (`app/icon.svg`, `app/apple-icon.tsx`, `app/opengraph-image.tsx`,
  `app/manifest.ts`, `app/robots.ts`, `app/sitemap.ts`, `app/llms.txt/route.ts`),
  and `app/farm/*`.
- **Skill home:** `.claude/skills/` (sibling to `feature-spec`).
- **Templates precedent:** mirrors `docs/templates/_TEMPLATE.md` and
  `docs/templates/_FEATURES_LIST.md`.
- No external services, webhooks, or events.

## 13. Dependencies & Sequencing

- **Must ship after:** nothing — this is the foundation.
- **Must ship before:** 1.2 (technical bodies), 1.3 (UX/UI bodies), 1.4 (audits).
- **Shared infra needed:** none beyond the repo and the skills runner.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Schema churns after 1.2/1.3 start filling bodies | M | M | Add `schema_version` to manifest + front-matter; freeze schema before 1.2 begins. |
| Tree drifts from real `app/` files | M | M | 1.4 reconciles manifest vs. disk; structure skill is idempotent and re-scans. |
| Over-structuring makes docs tedious to fill | L | M | Keep to seven body sections; STUB default lets coverage land incrementally. |
| Agent format too terse to be human-useful | M | L | Audience is explicitly agent-first (decided); humans get the same files, just lean. |

## 15. Rollout Plan

- **Feature flag:** none — docs are inert files; no runtime behavior changes.
- **Sequencing:** (1) write `_DOC_TEMPLATE.md` + schema, (2) build the structure
  skill, (3) generate README + manifest + STUB shells, (4) commit.
- **Dogfood:** the maintainer runs the structure skill, then opens README and
  navigates to three random shells to confirm reachability.
- **GA criteria:** all of §7 ACs pass; 1.2 can begin filling bodies.
- **Rollback:** delete `docs/reference/` — no other part of the repo imports it.

## 16. Test Plan

- **Unit / lint** — a small validator (script or skill step) asserts each doc has
  required front-matter keys and the seven sections in order.
- **Integration** — manifest entries all resolve to existing files; no source
  documented twice; README links all resolve.
- **End-to-end** — run the structure skill on a clean checkout; assert the full
  tree + manifest appear and re-running is a no-op (idempotent).
- **Security** — grep generated docs for obvious secret patterns; assert none.
- **Accessibility** — Markdown heading nesting validates (no skipped levels).
- **Manual exploratory** — maintainer spot-checks README grouping and badges.

## 17. Documentation & Training

- A short "How the reference tree works" note in `docs/reference/README.md`
  itself (self-describing).
- Update `AGENTS.md` to point agents at `docs/reference/README.md` as the first
  stop for codebase context.
- The structure skill's own `SKILL.md` documents the schema for future runs.

## 18. Open Questions

1. `manifest.json` vs. a parseable `_index.md` table — JSON is cleaner to diff,
   Markdown renders on GitHub. Pick one before 1.2 starts. *(Leaning JSON for 1.4.)*
2. Should the skeleton include shells for the file-convention metadata routes
   individually, or one consolidated `metadata-routes.md`? (Affects 1.2 effort.)
3. Exact `area` taxonomy values (identity / routing / metadata / ui / styling /
   ux / build) — confirm the closed set before shells are stamped.
4. Where should the structure skill live and what is it named
   (`.claude/skills/doc-tree`?), and is it one skill shared by 1.2–1.4 or three?

## 19. References

- Files this work touches: `docs/reference/**` (new), `.claude/skills/**` (new),
  `AGENTS.md` (pointer), and read-only: all of `app/**`.
- Repo conventions: `docs/templates/_TEMPLATE.md`,
  `docs/templates/_FEATURES_LIST.md`, `AGENTS.md`.
- Related plans: [FEATURE_1.2.md](FEATURE_1.2.md), [FEATURE_1.3.md](FEATURE_1.3.md),
  [FEATURE_1.4.md](FEATURE_1.4.md).
