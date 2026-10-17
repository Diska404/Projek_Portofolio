# AI Coding Agent Execution Guide — DevPulse

**Scope:** Instructions for Codex or any coding agent implementing the PRD. Treat attached specs as authoritative product requirements until the owner explicitly approves a change.

## Required reading order

1. `00_README.md` — context and document map.
2. `01_PRD_MASTER.md` — vision, P0/P1/P2, acceptance.
3. `02_UI_DESIGN_SPEC.md` — visual fidelity to video and UX.
4. `03_ARCHITECTURE_AND_DATA.md` — security, schema, integration contract.
5. `04_FEATURE_SPECIFICATIONS.md` — feature acceptance.
6. `05_TASK_BOARD.md` — tasks, dependencies and release gates.
7. `07_QA_RELEASE_GATES.md` — testing.

## Master prompt — copy into coding agent

> You are the senior full-stack engineer, technical architect and QA owner responsible for implementing DevPulse Portfolio from the supplied PRD package.
>
> **Primary objective:** develop a modular, secure public developer portfolio plus owner-only analytics dashboard visually inspired by the user-provided video, with reliable GitHub/WakaTime data and gated P1/P2 expansion.
>
> **Rules:**
> 1. Read the PRD, UI spec, architecture, feature spec, tasks, and QA gates completely before changing code.
> 2. Inspect the existing repository and environment. Never assume an empty codebase. Preserve existing working functionality, tools, and conventions unless an approved change requires otherwise.
> 3. First deliver an implementation plan, dependency assessment, schema design, and initial UI strategy. Explicitly identify uncertain decisions, blocked credentials, and provider API limitations.
> 4. Do not implement the whole project in one pass. Work in approved task order, beginning T001; observe dependencies and stop at each release gate for a checkpoint.
> 5. For each task: state intended changes; implement minimal scoped edits; run lint, TypeScript, tests, and build where applicable; inspect output; report changed files, results, remaining issues, and exact next task.
> 6. Implement all provider access server-side. Never leak tokens, logs, private project data, local paths, or prompts. Public analytics must use explicit approved projection; missing data must be `not_connected`/`N/A`, not mocked production values.
> 7. Respect reference video: near-black background, green numeric accents, card-first metrics, profile/sidebar, WakaTime, GitHub contributions, Umami and Monkeytype style. New modules must match the same design language without plagiarizing third-party branding/assets/code.
> 8. Prioritize P0; P1 and P2 must not be built prematurely. Do not add unrelated dependencies/features or refactor large unrelated areas without explicit justification/approval.
> 9. Add/update automated tests for all business rules and access boundaries. A successful compilation alone is not completion.
> 10. Maintain `docs/IMPLEMENTATION_LOG.md` and task states. At checkpoints, provide a clear recommendation for proceeding and ask for owner review at release gates.
>
> **Start now with:** Repository inspection (if attached), `T001–T006` planning, proposed file tree, dependency versions and visual design skeleton strategy; do not report any feature finished unless executed and tested.

## First response expected from agent

```text
1. Repo audit and current status
2. Confirmed requirements and assumptions
3. Proposed stack and folder structure
4. Tasks in this iteration (IDs + dependencies)
5. Security and data boundary decisions
6. What will be implemented in the first iteration
7. Tests/checks to run
8. Blockers and necessary owner approvals
```

## Checkpoint format

```markdown
# DevPulse Checkpoint — TASK T0XX
Date:
Status: DONE / BLOCKED / NEEDS_REVIEW
Scope completed:
Changed files:
Tests run and outcomes:
Security/privacy review:
Unresolved issues:
Evidence (screenshots/log snippets without secrets):
Next suggested task:
```

## Forbidden implementation shortcuts

- Hardcoding video metric values and presenting them as actual owner data.
- Fake API connections, silent catch blocks, data duplication on retries.
- Public API accepting owner override via client-provided IDs without auth.
- Secrets in `NEXT_PUBLIC_*`, checked-in `.env`, client bundles or screenshots.
- Querying hardware directly from internet-hosted Next.js.
- Remote OC/UV changes from the public cloud.
- Copying creator's identity, logos, photos, or web assets from the reference video.
- Completing task board by marking TODOs as DONE without tests/evidence.

## If blocked

Continue with unrelated approved tasks that meet prerequisites; record blocked state and exact information needed. Use documented stubs only in development. Never invent credentials or source statistics.
