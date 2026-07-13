# 1.4 — Periodic Documentation Audits

> Implementation plan. Source: [docs/MISSING_FEATURES.md](../MISSING_FEATURES.md) §1 Repository Documentation System.

## Metadata

| Field | Value |
|---|---|
| **Feature ID** | 1.4 |
| **Section** | Repository Documentation System |
| **Severity** | MINOR |
| **Markets** | Internal / DX (not market-facing) |
| **Status (today)** | MISSING |
| **Estimated effort** | S (1w) |
| **Owner (proposed)** | Maintainer (Nigel) / DX |
| **Depends on** | 1.1, 1.2, 1.3 |
| **Unblocks** | — |
| **Completed** | FALSE |

---

## 1. Problem Statement

Codebase docs rot the instant source moves on. Once 1.2/1.3 fill the reference
tree, every commit that touches `app/**` can silently invalidate a doc's *what*,
*how*, or *why* — and a confidently *wrong* doc is worse than a missing one,
because an agent will trust it. There is currently no mechanism to detect that a
documented file changed since its doc was written, to find newly added files that
have no doc, or to prune docs for deleted files. This feature adds a **manual
audit skill** plus a **CI staleness nudge** that compares each doc's stamped
`last_audited_sha` against the file's current state and reports drift — keeping
the whole tree honest over time without forcing a full rewrite.

## 2. Goals

- Detect **stale docs**: documented files whose source changed since the doc's
  `last_audited_sha`.
- Detect **coverage gaps**: source files (esp. new cabinets/pages/routes) with no
  doc and no manifest entry.
- Detect **orphans**: docs/manifest entries whose source file was deleted or
  moved.
- Provide a **manual audit skill** that produces a clear report and can re-stamp
  or re-fill docs, plus a **CI check** that nudges (warns/comments) when a PR
  changes a documented file without updating its doc.
- Track **`why_unknowns`** over time so the team can chip away at unanswered whys.

## 3. Non-Goals

- **Blocking merges.** The CI check nudges (warns / comments); it does not fail
  the build by default (a `--strict` mode is an Open Question, not a default).
- **Auto-rewriting *why* unattended.** The audit may re-stamp `last_audited_sha`
  for trivially-unchanged docs, but rewriting rationale requires the same
  anti-fabrication discipline as 1.2/1.3 and stays agent-assisted, not silent.
- **Defining the schema or initial content** (1.1/1.2/1.3 own those).
- **Git hooks or scheduled cron.** Decided trigger model is *manual skill + CI
  nudge*; commit hooks and cron are explicitly out (see §15 / Open Questions).
- **Documenting unbuilt routes' content** — but the audit DOES flag when a
  previously-unbuilt route (e.g. `/donate`, `/packet-derby`) gains a real file so a
  doc shell can be created.

## 4. Personas & User Stories

- **As the maintainer**, I want to run one audit skill and get a list of stale,
  missing, and orphaned docs, so I know exactly what to refresh.
- **As a PR author**, I want CI to comment "you changed `app/sitemap.ts` but
  `docs/reference/app/sitemap.md` wasn't updated", so docs don't drift unnoticed.
- **As an agent**, I want to trust that a `COMPLETE` doc reflects current code, so
  I can build context without re-reading the source every time.
- **As the maintainer**, I want a running count of `why_unknowns` so I can see the
  *why* coverage improving release over release.

## 5. Functional Requirements

- **FR-1.** The system MUST provide a **manual audit skill** (sibling to
  `feature-spec`) that scans `docs/reference/manifest.json` and the repo and emits
  a report classifying every doc as `FRESH`, `STALE`, `ORPHAN`, or `MISSING-DOC`.
- **FR-2.** A doc MUST be flagged `STALE` when its `source_path` has any commit
  newer than its `last_audited_sha` (i.e. `git log <sha>..HEAD -- <source_path>`
  is non-empty).
- **FR-3.** The audit MUST flag `MISSING-DOC` for any source file under the
  documented areas (e.g. `app/**`) that has no manifest entry — explicitly
  catching newly added cabinets/pages/routes.
- **FR-4.** The audit MUST flag `ORPHAN` for any manifest entry or doc whose
  `source_path` no longer exists on disk, and SHOULD propose pruning it.
- **FR-5.** The audit MUST report aggregate metrics: counts per status and the
  total `why_unknowns` across the tree.
- **FR-6.** The system MUST provide a **CI check** that, on a PR, lists
  documented files changed in the diff whose docs were not updated in the same PR,
  and posts them as a **non-blocking** warning/comment (the "nudge").
- **FR-7.** The audit skill SHOULD support a **re-stamp** action that, for a
  `STALE` doc whose source change is verified to not affect the doc's content,
  updates `last_audited_sha`/`last_audited_date` without rewriting the body — and
  MUST record that a human/agent reviewed it, not auto-bumped blindly.
- **FR-8.** When the audit re-fills or corrects a doc's content, it MUST obey the
  shared **anti-fabrication rule**: unanswerable *whys* become/stay `UNKNOWN`,
  never invented (consistent with [FEATURE_1.2.md](FEATURE_1.2.md) FR-4 and
  [FEATURE_1.3.md](FEATURE_1.3.md) FR-3).
- **FR-9.** The audit MUST verify manifest integrity: no duplicate `source_path`,
  every `doc_path` resolves, `schema_version` recognized.
- **FR-10.** The audit report SHOULD be writable to a known path
  (`docs/reference/AUDIT.md`) so the latest state is reviewable in-repo, and MUST
  also print to stdout for ad-hoc runs.
- **FR-11.** The CI nudge MUST be configurable to `--strict` (fail the check) but
  MUST default to non-blocking.

## 6. Non-Functional Requirements

- **Performance** — A full audit MUST complete in seconds for this repo size
  (tens of files); it uses `git log`/`git diff`, not content re-analysis, for
  staleness.
- **Security** — The CI job needs read access to the repo and PR comment
  permission only; no secrets beyond the default token.
- **Privacy & Compliance** — N/A.
- **Accessibility** — `AUDIT.md` is valid Markdown with nested headings.
- **Scalability** — Staleness is per-file git queries; scales linearly with
  documented files and stays cheap.
- **Reliability** — The audit MUST be deterministic for a given commit; same
  inputs → same report. False "fresh" is the dangerous failure mode and is
  avoided by trusting `git log` over heuristics.
- **Observability** — Status counts + `why_unknowns` total are the metrics; the
  CI comment is the alert channel.
- **Maintainability** — Staleness logic is one function over the manifest; adding
  a documented area is a config/glob change.
- **Internationalization** — English only.
- **Backward compatibility** — Audit MUST handle docs written under an older
  `schema_version` (warn + suggest migration rather than crash).

## 7. Acceptance Criteria

- **AC-1.** *Given* a doc whose source changed after its `last_audited_sha`,
  *When* the audit runs, *Then* that doc is reported `STALE` with the offending
  commit range.
- **AC-2.** *Given* a newly added `app/**` source file with no manifest entry,
  *When* the audit runs, *Then* it is reported `MISSING-DOC`.
- **AC-3.** *Given* a manifest entry whose `source_path` was deleted, *When* the
  audit runs, *Then* it is reported `ORPHAN` with a prune suggestion.
- **AC-4.** *Given* a PR that edits `app/sitemap.ts` without touching its doc,
  *When* CI runs, *Then* a non-blocking comment names the stale doc.
- **AC-5.** *Given* a fully fresh tree, *When* the audit runs, *Then* every doc is
  `FRESH`, the report shows 0 stale/orphan/missing, and the `why_unknowns` total
  is printed.
- **AC-6.** *Given* `--strict` is set, *When* CI finds a stale-without-update doc,
  *Then* the check fails; *When* `--strict` is unset, *Then* it only warns.

## 8. Data Model

No database. Reads the 1.1 `manifest.json` and git history; writes an audit
report. Report shape (`docs/reference/AUDIT.md` + stdout):

```
Audited at: <HEAD sha> on <date>
Summary: FRESH=<n> STALE=<n> ORPHAN=<n> MISSING-DOC=<n>  why_unknowns=<n>

STALE
- app/sitemap.ts  doc=docs/reference/app/sitemap.md
  stamped <sha8>, changed in <sha8>..HEAD (3 commits)
MISSING-DOC
- app/donate/page.tsx  (new file, no manifest entry)
ORPHAN
- docs/reference/app/old-thing.md  (source app/old-thing.ts missing)
```

Staleness key = `git log <last_audited_sha>..HEAD -- <source_path>` non-empty.

## 9. API Surface

No HTTP surface. Two interfaces:

- **Audit skill CLI/contract:** invoked manually; flags `--strict`, `--write`
  (emit `AUDIT.md`), `--restamp <doc>` (verified re-stamp per FR-7).
- **CI check:** runs in the PR workflow, reads the diff + manifest, posts a
  comment via the platform API (GitHub Actions). Non-blocking unless `--strict`.

## 10. UI / UX

No product UI. The "UX" is the maintainer's audit report and the PR comment:

- **Audit report** groups by status, most-actionable first (STALE → MISSING-DOC →
  ORPHAN), with copy-pasteable file paths.
- **PR comment** is concise: "N documented file(s) changed without doc updates",
  then a bulleted list; updates in place on re-push rather than spamming.
- **Empty/healthy state** — "All N docs FRESH ✅; why_unknowns=K" so a clean run
  is unambiguous.

## 11. AI / ML Considerations

- Staleness detection is **pure git**, not model inference — deliberately, so the
  "is this stale?" signal is deterministic and trustworthy.
- When the audit *refreshes content* (optional, agent-assisted), it inherits the
  anti-fabrication rule (FR-8): unknown *whys* stay `UNKNOWN`. The audit can also
  surface long-standing `UNKNOWN`s back to the maintainer to finally answer.
- No runtime model; the agent cost is only incurred on content refresh, not on
  the staleness scan or CI nudge.

## 12. Integration Points

- **Reads:** `docs/reference/manifest.json`, `docs/reference/**`, `git log`/`git
  diff`, and the documented globs (e.g. `app/**`).
- **Writes:** `docs/reference/AUDIT.md`, and (on refresh) doc bodies + manifest
  re-stamps.
- **CI:** a GitHub Actions workflow (the repo deploys on Vercel; CI here is just
  for the doc nudge) that comments on PRs.
- **Skill home:** `.claude/skills/` alongside the 1.1 structure skill and
  `feature-spec`.

## 13. Dependencies & Sequencing

- **Must ship after:** 1.1 (manifest), 1.2 and 1.3 (so there are stamped docs to
  audit). Can be built in parallel but is only *useful* once docs exist.
- **Must ship before:** nothing in §1.
- **Shared infra:** a CI runner (GitHub Actions) with PR-comment permission.

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Re-stamping hides real content drift | M | H | FR-7 requires verified review before re-stamp; never auto-bump on any source change. |
| CI nudge becomes noise and is ignored | M | M | Non-blocking + concise, in-place comment; `--strict` only opt-in. |
| `last_audited_sha` missing/garbage on a doc | L | M | Treat as `STALE` (fail safe), not `FRESH`. |
| New file areas escape the documented globs | M | M | Audit reports `MISSING-DOC` against a configurable area glob; review the glob in audits. |
| Schema version drift breaks the parser | L | M | FR-9/§6 backward-compat: warn + suggest migration, don't crash. |

## 15. Rollout Plan

- **Feature flag:** none for the manual skill. The CI check ships **non-blocking**
  first (warn only); `--strict` is a later, opt-in flip.
- **Sequencing:** (1) build the staleness/coverage scanner over the manifest, (2)
  ship the manual audit skill + `AUDIT.md` output, (3) add the CI workflow in
  warn-only mode, (4) optionally enable `--strict` once the team trusts it.
- **Dogfood:** run the audit right after 1.2/1.3 land; confirm a deliberately
  edited file shows `STALE`.
- **GA criteria:** §7 ACs pass; CI posts a correct nudge on a test PR.
- **Rollback:** disable the CI workflow; delete the skill — docs are unaffected.

## 16. Test Plan

- **Unit** — staleness function: stamped==HEAD → FRESH; source commit after stamp
  → STALE; missing source → ORPHAN; source with no entry → MISSING-DOC.
- **Integration** — run against a fixture repo state with one of each condition;
  assert the report matches.
- **End-to-end** — open a test PR editing a documented file without its doc;
  assert the CI comment appears and the check stays green (non-strict).
- **Security** — CI job uses least-privilege token; no secret exposure in
  comments.
- **Accessibility** — `AUDIT.md` heading nesting valid.
- **Manual exploratory** — maintainer runs `--write`, reviews `AUDIT.md`, tries a
  verified `--restamp`.

## 17. Documentation & Training

- `docs/reference/README.md` gains an "Auditing" note pointing at the skill and
  `AUDIT.md`.
- The audit skill's `SKILL.md` documents flags (`--strict`, `--write`,
  `--restamp`) and the staleness definition.
- `AGENTS.md` note: before editing `app/**`, check whether a `docs/reference/`
  doc exists and update/re-stamp it (the CI nudge will remind you).

## 18. Open Questions

1. Should `--strict` ever become the CI default once trust is established, or stay
   permanently opt-in? (Decided start: non-blocking.)
2. Granularity of staleness — any commit to the source vs. only commits that
   change "significant" lines (ignoring formatting). Start coarse (any commit).
3. Does the audit attempt automated content refresh (agent-assisted) or only
   *report* drift and leave fixing to a human-invoked 1.2/1.3 re-run? Start:
   report-only + verified re-stamp; full refresh is a stretch goal.
4. Where does the CI workflow live and trigger (PR `paths:` filter on `app/**` +
   `docs/reference/**`), and does it run on forks?
5. Should `AUDIT.md` be committed (history of doc health) or git-ignored
   (transient)? Leaning committed for trend visibility.

## 19. References

- Files this work touches: `.claude/skills/**` (audit skill, new), CI workflow
  (e.g. `.github/workflows/docs-audit.yml`, new), `docs/reference/AUDIT.md` (new),
  read-only `docs/reference/manifest.json`, `docs/reference/**`, git history,
  `app/**`.
- Repo conventions: `AGENTS.md`, `docs/templates/_FEATURES_LIST.md` (audit-style
  checklist precedent), `docs/templates/_TEMPLATE.md`.
- Related plans: [FEATURE_1.1.md](FEATURE_1.1.md) (manifest/schema),
  [FEATURE_1.2.md](FEATURE_1.2.md) (technical bodies), [FEATURE_1.3.md](FEATURE_1.3.md) (UX/UI bodies).
