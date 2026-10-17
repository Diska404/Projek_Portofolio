# Development Plan & Task Board

## Process

- Each task is independent where possible, with explicit dependencies.
- Agent must perform `inspect → plan → change minimal scope → test → report → checkpoint`; do not implement P1/P2 while P0 gate is open.
- Status: `TODO`, `IN_PROGRESS`, `BLOCKED`, `IN_REVIEW`, `DONE`.
- Task done only after its local acceptance criteria and test pass, not just code compilation.
- Before implementation, review environment/version compatibility and approve core tradeoffs.

## Release R0 — Design/System Foundation

| Task ID | Priority | Scope/Deliverable | Depends on | Acceptance |
|---|---|---|---|---|
| T001 | P0 | Initialize monorepo and strict TypeScript | — | Installs, dev server starts, typecheck passes |
| T002 | P0 | Repo conventions, lint/format/husky/CI | T001 | CI runs lint/typecheck/test/build |
| T003 | P0 | Define design tokens and dark green theme | T001 | Consistent theme documented; contrast checked |
| T004 | P0 | Public navigation, owner dashboard sidebar/shell | T003 | Responsive and accessible navigation |
| T005 | P0 | Card/chart skeleton, loading/error/empty components | T003 | Storybook/demo with every required state |
| T006 | P0 | Visual prototype Overview based on video | T004,T005 | Owner approval: layout/look resembles video |
| T007 | P0 | Initial database models, migrations, seeds for DEV only | T001 | Recreate database from migration; no production fake data |
| T008 | P0 | Auth provider setup and private route guards | T007 | Visitor cannot access owner API/route |

**Gate R0:** Owner approves dark-green look, routes, and prototype; foundation tests pass.

## Release R1A — Public Portfolio & CMS

| Task ID | Priority | Scope/Deliverable | Depends on | Acceptance |
|---|---|---|---|---|
| T009 | P0 | Public homepage, profile/CTA | T004,T007 | Responsive home; content from DB |
| T010 | P0 | Public project gallery and filters | T007,T009 | Approved projects only |
| T011 | P0 | Project detail route and media cards | T010 | Hidden projects return safe not-found |
| T012 | P0 | Owner project CRUD + validation | T007,T008 | Create/edit/archive safely |
| T013 | P0 | Milestone/task CRUD and weighted progress | T012 | Unit tests for progress/edge cases |
| T014 | P0 | Visibility controls for projects/media/milestones | T012,T011 | Revocation blocks public fetch |
| T015 | P0 | Project activity timeline | T013 | Source attribution; only approved public events |
| T016 | P0 | SEO metadata, robots, sitemap, a11y polish | T009,T011 | Owner pages noindex; public metadata valid |

**Gate R1A:** Portfolio publishable without GitHub/WakaTime; owner content changes through UI.

## Release R1B — Reliable Analytics Core

| Task ID | Priority | Scope/Deliverable | Depends on | Acceptance |
|---|---|---|---|---|
| T017 | P0 | Metrics schema and units/timezone normalization | T007 | Deterministic aggregation fixture tests |
| T018 | P0 | Integration credential configuration with secret storage | T008 | Server-only secrets, revoke capability |
| T019 | P0 | Sync run status, job adapter, retry/error handling | T017,T018 | Retries idempotent; no duplicate stats |
| T020 | P0 | GitHub API adapter and contribution parser | T019 | Fixture + provider contract test |
| T021 | P0 | WakaTime API adapter and duration parser | T019 | Fixture + normalized duration tests |
| T022 | P0 | Historical backfill, cursor, period coverage | T020,T021 | No duplicate records on re-run |
| T023 | P0 | Owner Overview KPI and source badges | T006,T017,T022 | Accurate source/timezone/status |
| T024 | P0 | Coding charts, languages breakdown, Github heatmap | T023 | Keyboard summary; no dummy production data |
| T025 | P0 | Public-approved metrics snapshots + revocation | T014,T024 | Owner-only data absent from public API |
| T026 | P0 | Source status, manual sync owner action | T019,T023 | Authorized action; throttled; status visible |
| T027 | P0 | Security tests (401/403, IDOR, secret exposure) | T008,T025 | All critical tests pass |
| T028 | P0 | Staging deployment, telemetry/logging, backup/restore | T025,T027 | Deployed; rollback and restore documented |
| T029 | P0 | Smoke/E2E/responsive review and MVP release | T028 | R1 acceptance checklist signed |

**Gate R1B/MVP:** Public + owner dashboard, projects, Github/WakaTime and privacy work end-to-end; no fake data; monitoring active.

## Release R2 — Expanded Analytics

| Task ID | Priority | Scope/Deliverable | Depends on | Acceptance |
|---|---|---|---|---|
| T030 | P1 | Umami setup and server-side stats adapter | T019,T029 | Pageviews vs visitors labelled |
| T031 | P1 | Monkeytype ApeKey and personal bests adapter | T019,T029 | Mode-specific WPM and accuracy |
| T032 | P1 | Visitors dashboard and geographic/referrer filters | T030 | Privacy-friendly stats, graceful empty state |
| T033 | P1 | Typing dashboard | T031 | Modes visible; data source specified |
| T034 | P1 | Preset layouts and widget registry | T023,T029 | Presets persist |
| T035 | P1 | ECharts advanced plot types with guards | T034 | Chart type matches data semantics |
| T036 | P1 | Global and per-widget date/compare filters | T035 | Valid only for available date coverage |
| T037 | P1 | CSV reporting + audit metadata | T036 | Exports source/unit/timezone/interval |
| T038 | P1 | Accessibility/performance/SEO regression | T030–T037 | No P0 regressions |
| T039 | P1 | R2 release regression and documentation | T038 | Versioned release notes and smoke tests |

## Release R3 — Private Local Systems (later)

| Task ID | Priority | Scope/Deliverable | Depends on | Acceptance |
|---|---|---|---|---|
| T040 | P2 | Audit AI runtime telemetry capabilities | R2 | Feasible fields & adapter contract documented |
| T041 | P2 | Audit SignalDeck telemetry capabilities | R2 | Supported data sources documented |
| T042 | P2 | Local device registry and scoped ingest auth | T018,T040 | Rotatable/revocable device token |
| T043 | P2 | Windows collector baseline + opt-in config | T042 | Offline buffer; no inbound ports |
| T044 | P2 | AI metrics adapter | T040,T043 | Token/s and runtime data only if supported |
| T045 | P2 | SignalDeck adapter | T041,T043 | Sensor schema/time units verified |
| T046 | P2 | Cloud aggregation and retention configuration | T044,T045 | Idempotent ingest; retention tests |
| T047 | P2 | Private Local Systems dashboard | T046 | Latest/stale/offline states accurate |
| T048 | P2 | P2 threat model, stress test, security review | T047 | No remote OC/UV endpoints; no sensitive payload |
| T049 | P2 | R3 release and operational guide | T048 | Installation/uninstall/rollback documented |

## Sprint allocation (suggested; flexible)

1. Sprint 0: T001–T008 (foundation & UI signoff)
2. Sprint 1: T009–T016 (public + projects)
3. Sprint 2: T017–T024 (data plumbing)
4. Sprint 3: T025–T029 (privacy, hardening, MVP)
5. Sprint 4: T030–T039 (extended analytics)
6. Sprint 5: T040–T049 (local integrations)

Do **not** assume one sprint equals one week. Estimate after initial scaffold, account readiness, actual API integration, and owner availability are confirmed.

## Task execution template

```markdown
### TASK T0XX — <Name>
Goal:
Dependencies:
Files expected to change:
Excluded scope:
Implementation steps:
Test plan:
Acceptance criteria:
Risks/rollback:
Outcome/status:
```

## Definition of Done per task

- Functionality matches task spec; data real or explicitly fixture; no regressions.
- Lint + typecheck + relevant tests + build pass.
- Auth, privacy and edge cases reviewed if touching API/data.
- Changed files and tests reported in agent handoff.
- No unapproved refactors; no unrelated modifications.
- Updated task status and brief checkpoint committed.
