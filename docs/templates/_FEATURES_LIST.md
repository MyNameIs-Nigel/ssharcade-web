# FEATURES LIST TEMPLATE

This is a template for the Features List document. Copy this file to `docs/FEATURES_LIST.md` and follow the checklist below. Every placeholder in the raw template has been filled in with a concrete example — follow the same pattern for your own project.

## Features List Checklist

Use this checklist each time you create or audit `FEATURES_LIST.md`:

1. Check whether `docs/FEATURES_LIST.md` exists.
2. If it does not exist, scan every `.md` file in `docs/features/` and extract its **Metadata** table (Feature ID, Section, Severity, Status, Estimated Effort).
3. Build `FEATURES_LIST.md` from that metadata: one row per feature, sorted by Feature ID.
4. If `docs/FEATURES_LIST.md` already exists, open every `docs/features/*.md` file and compare its current metadata against the corresponding row — update any stale values.
5. Mark a feature as **Completed** only when its Status field reads `DONE` and at least one acceptance criterion has been verified.
6. Remove rows for any feature files that have been deleted.
7. Validate the table renders correctly (no broken columns, no missing pipes).

## Features List Format

Your work should follow this format:

**Disclaimer:** The features in the table below are entirely made up and bear no relation to this project. They exist solely to illustrate the expected table structure.

| # | Name | Description | Completed |
|---|------|-------------|-----------|
| 1.1 | User Authentication | Allow players to register and log in via SSH key or password. | ✅ Yes |
| 1.2 | Cabinet Discovery | Display available game cabinets on the landing page with real-time availability. | ❌ No |
| 1.3 | Score Leaderboard | Persist high scores per cabinet and expose a public leaderboard endpoint. | ❌ No |
| 2.1 | Coin Insert Animation | Play a retro coin-drop animation when a user initiates a new SSH session. | ✅ Yes |
| 2.2 | Idle Timeout | Disconnect idle SSH sessions after a configurable grace period with a warning prompt. | ❌ No |
| 3.1 | Admin Dashboard | Authenticated web UI for operators to manage cabinets and moderate players. | ❌ No |

## Completion Criteria

Before `FEATURES_LIST.md` is considered complete and accurate, verify each of the following:

1. **Coverage** — Every `.md` file in `docs/features/` has exactly one corresponding row; no features are missing or duplicated.
2. **ID alignment** — The `#` column matches the `Feature ID` field in each feature file's Metadata table exactly.
3. **Name alignment** — The `Name` column matches the title of the feature file exactly.
4. **Description accuracy** — The `Description` is a single-sentence summary drawn from the feature file's Problem Statement section.
5. **Completion truthfulness** — A row is marked `✅ Yes` only if the feature file's `Status` field is `DONE`; all others show `❌ No`.
6. **Sorted order** — Rows are sorted numerically by Feature ID (e.g. 1.1 before 1.2 before 2.1).
7. **Table integrity** — The Markdown table renders without broken columns in both a plain-text viewer and GitHub's renderer.
8. **No stale data** — Any Feature ID present in the list but missing from `docs/features/` is flagged or removed before the document is published.
