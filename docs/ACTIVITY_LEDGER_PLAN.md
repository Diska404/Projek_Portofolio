# CR003 — Activity ledger, AI experience, community and gaming

Checkpoint: 17 October 2026, Asia/Jakarta. This is a new change request extending the original pack; original planning documents remain unchanged.

## Owner decisions and this task

The owner wants actual project effort captured independently of GitHub publication: automatic sessions from supported tools plus a manual journal and corrections. Daily public summaries are permitted, without conversation content or real-time presence. Personal uses Diska404 + RaizeiID; creator uses RaizeiID only and excludes academic projects. The owner's request does not imply connecting unspecified social identities, collecting third-party conversations, publishing every newly discovered repository, or reading raw local chat/database content.

CR003A is the current R0 review slice: requirements/capability audit, typed accounting rules with tests, and a reviewable public UI for work, AI experience, community and Steam. No durable journal, provider synchronization, bot, webhook, collector, OAuth grant or secret is installed in this slice. Technical tests are not owner visual approval; T006 remains IN_REVIEW and T007/T008 TODO.

## Measurements and provenance

- **Work:** finished, active intervals attributed to a project/category. Union overlapping intervals before reporting observed duration; separately report automatic and self-reported duration, their overlap, and union total. These source totals are not additive. Clip to the selected UTC interval and bucket by Asia/Jakarta day. A session spanning midnight counts each day it actually overlaps. Missing coverage means **observed**, never a complete record of a person's life. Work time, publication events, output and milestone progress are separate measurements.
- **GitHub:** repository-created, push, commit, PR, review, issue and release events are separately typed. Repository discovery goes to an owner review queue. Signed webhook delivery IDs and provider IDs deduplicate retries; periodic backfill repairs gaps within provider limits. Existing account and per-repository approval are both required. Language bytes from repository snapshots are not languages actively used in a session. GitHub publication never manufactures human work duration.
- **Languages:** record programming language and natural language separately. Indonesian/Chinese translation is work but not programming-language activity. Language duration is based on session/heartbeat observations; multiple languages must not each inherit the full session duration without attribution. Unsupported editors, offline translation and research can be self-reported with explicit provenance; file modification times are not reliable active duration.
- **Project output:** manually reviewed translation units/tasks and weighted milestones can describe results. Model output tokens, keystrokes, hours and commit counts do not prove accepted translation or project completion. A journal entry can reference a later commit/release without creating an extra work session.
- **AI:** distinguish provider, application, model identity/version, local runtime and quantization. Recognized/learning/tried/applied are owner-declared experience stages with optional evidence and project links, not automatically inferred skill levels. Used-model counts require successful inference evidence; downloaded/loaded models alone do not qualify. Quantization variants do not inflate model breadth. API requests/tokens, inference duration and human work duration remain separate; overlapping inference is not extra human time. Unknown model identity stays unknown. Never infer model identity from an app's brand or claim API reports cover all consumer chat subscriptions. Explicitly identify manually declared versus observed evidence; no universal expertise or AI-authorship percentage.
- **Community:** YouTube publication metrics remain prominent. Add approved GFL2/application project work and verified public contributions, support/review/release/event records. Discord activity is limited to authorized bot/app scopes in selected spaces; Facebook capability depends on account/Page type, current permissions and review. Message volume is not community impact. No universal cross-platform personal activity feed is promised.
- **Steam:** approved game library, lifetime playtime, provider-native recent 14-day playtime, and ranking by the selected basis. Missing/private game details are unavailable, not zero. Lifetime counters cannot reconstruct arbitrary historical days. Snapshot deltas describe the interval between verified snapshots, not an invented daily allocation. A counter decrease or mismatched game identity is a discontinuity. Steam playtime is Steam-reported running time, not a measure of focused human attention; non-Steam GFL2 work/play remains a distinct journal source. No live online status or exact session schedule is published.

## Private source → approved public summary

Source adapter → validated revision/event → private ledger → overlap/accounting review → owner project/field approval → sanitized daily summary → public snapshot. Revoke a record/project, rebuild or revoke its snapshots, invalidate caches, and preserve a private audit trail.

Work-session identity: connector + account alias + external event ID; correction uses an increasing revision and optional tombstone. Equal-revision conflicts are excluded for review. No public session IDs, account aliases, local paths, note bodies, prompts, source text, private repository names or exact timestamps. Public daily keys are date-only; no real-time presence. A record AND its project policy must approve the requested audience. Ambiguous source/coverage remains disclosed, and revoked latest revisions must not resurrect earlier approved records.

No source token from Git Credential Manager is reused by the website. Future device ingest remains outbound-only and scoped to its own device; no new inbound laptop port or hardware controls. Retention, journal export, device revocation and snapshot cache revocation require integration tests before release.

## Existing local AI audit (source only)

Read `Ecosystem v2.0/local-ai-control-center/backend/usage.py`, `database.py`, `main.py`, `models.py` and relevant telemetry code. It already stores `inference_runs` and `runtime_sessions`, with model/client/tokens/inference duration versus loaded duration. `/api/usage` is an existing local endpoint, but invoking it also runs session synchronization. This task does not call it or read the owner's database/config/chat.

Important adapter gaps: the summary's `models_used` currently includes loaded-only models; `models` and runtime timeline expose `model_path`; longest inference can contain private session metadata; daily bucketing follows host timezone; stored numeric nulls may become zero. Do not publish this endpoint wholesale or reuse its counts without normalization. Future adapter needs explicit completed/success status mapping, nullable numeric coverage, approved model aliases, stable event identity, UTC normalization, project attribution and a sanitized allowlist. No ecosystem code/database is modified by CR003A.

## Dependencies and tasks

| Task | Priority | Deliverable | Dependencies / gate |
|---|---|---|---|
| CR003A | P0 | Accounting contracts, capability audit, work/AI/community/Steam prototype | T004/T005, CR002; current IN_REVIEW |
| CR003B | P0 | Durable private journal, corrections/tombstones, provenance and public approval/revocation | T007/T008/T012/T014/T017; queued |
| CR003C | P0 | GitHub events/discovery + WakaTime session mapping, reconciliation and language attribution | CR003B + T018–T022/T025; queued |
| CR003D | P1 | AI experience catalogue, evidence links, supported cloud imports and public summaries | CR003B + T025/T029; capability-specific consent; queued |
| CR003E | P1 | Steam snapshots/rankings + approved social/community adapters | T019/T025/T029 + CR003B; account IDs/scopes/capability review; queued |
| CR003F | P2 | Opt-in local work/AI adapters, device identity, offline spool and outbound ingest | T040/T042–T044/T046 + CR003B/CR003D; queued |

This order preserves the original release gates and avoids treating the new modules as already-connected production features. Future setup needs approved project/repository mappings, supported work applications, chosen AI evidence/model aliases, Steam profile/ID, YouTube channel, Discord space/app authorization and Facebook account/Page type. Secrets are entered through owner configuration, never chat/source code.

## Acceptance and tests for CR003A

- Overlap union; period clipping; timezone midnight; source provenance; idempotency; corrected/tombstoned records and equal-revision conflicts.
- Natural versus programming language; a GitHub publication or runtime-only record cannot add human work time.
- Separate audience policies; same record approval cannot override a hidden project; no private fields in public daily DTOs.
- Successful inference deduplication, loaded-only exclusion, model variant normalization, missing-token coverage; invalid/private/reset Steam counters cannot become valid deltas.
- Public UI has unknown values until real sources exist; work/AI and community/game tabs, project scope, AI evidence stage and native Steam period controls work. No invented model list, game ownership, graphs, sessions or totals.
- Four responsive widths, keyboard controls, privacy/production boundaries, lint/types/unit/build/secret scans and GitHub CI.

## References checked

- [GitHub webhook events](https://docs.github.com/en/webhooks/webhook-events-and-payloads): delivery identity, signatures, event availability and repository events.
- [WakaTime developer documentation](https://wakatime.com/developers): summaries/heartbeats, project/language/category attribution and plugin coverage.
- [Ollama generate response](https://docs.ollama.com/api/generate): reported model, token counts, inference/load durations.
- [Anthropic usage API](https://docs.anthropic.com/en/api/admin-api/usage-cost/get-messages-usage-report): scoped organization API reports, not a universal consumer activity feed.
- [Steam IPlayerService](https://partner.steamgames.com/doc/webapi/IPlayerService): owned/recent games depend on visible game details and authorized access.
- [Discord Gateway](https://docs.discord.com/developers/events/gateway): app event permissions/intents; [official self-bot restriction](https://support.discord.com/hc/en-us/articles/115002192352-Automated-User-Accounts-Self-Bots).
- Meta Pages/permission documentation returned HTTP 429 during this audit. Facebook capabilities remain **unverified/pending review**; no unsupported endpoint or automatic collection is claimed.


## CR003A implementation evidence — 18 October 2026

Implemented selected-audience public work/community, AI and Steam compositions with project/period/source/stage/native-game-period controls; moved personal work ahead of GitHub metrics while keeping YouTube publication metrics first on the creator site. All owner observations remain unknown. The local-only `/preview/activity` simulation uses explicit synthetic intervals, runs the same union function as the contract tests, saves nothing, and is unavailable in normal production or the creator app.

Validation: `npm run check` PASS (lint, format, strict types, 44 unit/security tests, source credential scan, both builds); `npm run test:ui` PASS (25 Chromium cases, including four widths and keyboard simulation); `npm run test:production` PASS (both apps, new preview route denied, creator bundles/HTML/RSC isolated). Initial E2E findings were corrected: explicit accessible period-control name, and existing gallery assertions scoped to the gallery now that ledger headings can repeat project names. No assertion against the real privacy boundary was relaxed.

Manual in-app browser review covered project work, AI experience, Steam and the interval simulation. Local ignored screenshots: `docs/evidence/activity-work-review.png`, `activity-ai-review.png`, `activity-community-review.png`, `activity-steam-review.png`, `activity-method-review.png`. The existing parent launcher started/reused five services. No dependency or ecosystem source changes were needed.

Changed files: `packages/contracts/src/activity-ledger.ts`; `apps/web/src/lib/ledger-content.ts`, `analytics-content.ts`, `public-content.ts`; `apps/web/src/components/activity-atlas.tsx`, `activity-method-review.tsx`, `audience-portfolio.tsx`; `apps/web/src/app/activity-atlas.css`, `page.tsx`, `layout.tsx`, `preview/[screen]/page.tsx`; creator `src/app/page.tsx` and `layout.tsx`; `tests/activity-ledger.test.ts`, `tests/e2e/activity-ledger.spec.ts`, existing creator/review browser specs; both production-smoke scripts; README, design-system, implementation log, R0 plan/review and task-status records.

Checkpoint: CR003A IMPLEMENTED / IN_REVIEW. CR003B–F queued behind their documented gates. The public UI and simulation are not a durable owner journal, active recorder, connected Steam library or live social/AI/GitHub integration. Do not infer complete coverage from an empty observed ledger. Adapter error/schema/consent and migration/cache-revocation tests remain future work with the respective adapters.
