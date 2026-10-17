# DevPulse — R0 implementation plan

Date: 17 October 2026 · Asia/Jakarta
Scope: repository audit, R0 foundation, design system and reviewable UI prototype.

## Audit and authority

The supplied pack contains nine text documents (including the CSV task import) and five reference images. All were read before code changes. Source copies and archive SHA-256 are preserved under docs/planning. The named target folder was empty, including hidden files, with no Git repository, package manifest, lockfile, AGENTS.md, source, database, environment files or tests. The neighboring Ecosystem v2.0 application is an independent existing product; no changes to it are authorized by this task.

The user's request defines this iteration. The pack supplies product requirements, proposed architecture and task dependencies; its embedded agent prompt is not independent authorization to deploy, obtain credentials, change local systems or advance release phases.

Reference evidence: video_0s shows a project gallery; video_8s shows profile/sidebar; video_56s shows Monkeytype cards; video_50s is an Umami traffic summary rather than a dashboard; video_76s is an editor scene. No full Overview/WakaTime/GitHub chart frame exists in the pack. Those layouts will follow the written UI spec and remain subject to owner visual review. Reference identity, photos, metrics and screenshots will not be reused as product assets.

## Dependency and scope decisions

- npm workspaces: apps/web, packages/ui, packages/contracts. Strict TypeScript. Next.js App Router with React. Versions are pinned after registry verification and recorded in package-lock.json; local Node 24.19.0 satisfies Next's documented minimum Node 20.9.
- CSS design tokens and small original accessible components. No component/chart framework is required for the initial visual prototype. Tailwind/shadcn and a full chart library remain architectural options for later functional modules; this avoids unused dependencies in T003–T006. SVG/CSS review charts include text/table alternatives.
- PostgreSQL/Drizzle and Supabase Auth remain the proposed backend. No database, seed, provider account or credential is created in this iteration.
- Public/owner separation starts now: actual /dashboard routes redirect to a disabled login boundary; /api/owner routes deny access. Review-only fixture data is served solely in development-enabled /preview routes. This is a deny-all baseline, not completed T008 authentication.
- Every synthetic value is visibly identified as SAMPLE/DEMO. Disconnected state uses null and Not connected, never zero. Public routes receive only explicitly labeled sample portfolio composition; they contain no owner integration or local-system data.
- Local-only review. No deployment, GitHub/WakaTime calls, analytics tracking, or connection to the neighboring AI/hardware ecosystem. P1/P2 modules appear only as labeled future visual placeholders.

## Ordered task plan

| Task | Depends on | Current iteration deliverable | Validation | Gate |
|---|---|---|---|---|
| T001 | — | npm workspace, pinned Next/React, strict TS, loopback preview | install, dev readiness, typecheck, build | technical |
| T002 | T001 | conventions, ESLint, Prettier, CI, local hook configuration, testing scripts | lint, format, tests, real hook and hosted CI PASS; run 39009300832 | technical |
| T003 | T001 | dark/green tokens, type/space/radius/motion scale, contrast checks | contrast calculations and component review | visual review |
| T004 | T003 | distinct public navigation and owner-review sidebar; mobile drawer | keyboard, escape/focus, responsive navigation | visual review |
| T005 | T003 | component/state gallery: all nine required data states | state contract unit tests, rendering, text alternatives | technical/review |
| T006 | T004,T005 | Overview prototype and public portfolio composition | browser/screenshots at 390/768/1440/wide, fixture/privacy checks | owner review |
| T007 | T001 | **Planned only:** Drizzle models/migrations, disposable dev-only seeds | migration replay, constraints, fixture isolation | after visual review |
| T008 | T007 | **Planned only:** Supabase provider, owner allowlist, session/CSRF/rate limits | 401/403, expiration/revoke, IDOR and direct URL tests | required before R1 |

User-requested checkpoint R0a ends at T006 review. Full R0 still includes T007/T008; it is not marked complete by a working prototype. T006 remains IN_REVIEW until explicit visual signoff. Do not start R1A T009–T016, R1B providers, P1 Monkeytype/Umami or P2 local agent at this checkpoint.

## Proposed tree

```text
apps/web/src/app/          public composition, preview-only pages, denied owner routes
apps/web/src/components/   public shell, review dashboard, chart/state components
packages/ui/               shared tokens
packages/contracts/        typed metric/state contracts and deterministic review fixtures
tests/                     contract, boundary, contrast and HTTP smoke tests
scripts/                   secret scan and review helpers
docs/planning/             original pack, review-only reference images
docs/DESIGN_SYSTEM.md      tokens, components, reference mapping
docs/IMPLEMENTATION_LOG.md per-task changes/results/checkpoints
docs/R0_REVIEW.md          evidence, open issues, GO/NO-GO record
```

## Initial backend design, without implementation

Content: owner_profiles → projects → media/milestones/tasks → approved activity. All ownership and visibility checks will be server-side. Positive milestone weights and deterministic weighted progress; no milestones means not_started.

Analytics: integrations with secret references → sync_runs/source_records → metric_points/aggregates → explicit public_snapshots. UTC timestamps at rest, Asia/Jakarta presentation, unit/source/coverage/freshness on each metric. Provider adapters validate all responses and use deterministic upserts. Failure retains last-known data with stale status. Revocation invalidates the public projection before serving a new request.

Supabase authentication will be integrated once project/configuration are supplied. No custom password implementation. Server-only credentials, owner allowlist, secure session lifecycle, rate limits, CSRF and negative access tests are required before real private data is added. Local collector remains outbound-only P2 with scoped device tokens and no remote hardware control.

## Review prerequisites and unresolved decisions

Owner identity/biography/avatar, publishable projects, accounts/tokens, domain, hosting budget, Supabase project and final name remain unknown. They do not block a local labeled prototype. No secrets are requested for R0a. Review dark/green direction, density, public/private distinction, navigation and widget composition before T007/T008.

Official framework references checked: https://nextjs.org/docs/app/getting-started/installation and https://nextjs.org/docs/app/api-reference/functions/redirect . Provider-specific API capabilities will be reverified when their adapter tasks begin.


## CR003 scope extension — 18 October 2026

Owner requested actual project activity independent of publication, automatic + manual source provenance, AI experience across cloud/local models, community contributions and Steam playtime. CR003A delivers tested accounting contracts and local public/prototype review only. The remaining tasks do not bypass original gates: CR003B durable private journal depends on database/auth/project approval/metric schema; CR003C connects GitHub/WakaTime; CR003D–E add AI experience and community/Steam after approved snapshots/MVP; CR003F local collectors remain P2 after device/ingest prerequisites. See ACTIVITY_LEDGER_PLAN.md for scope, acceptance and current evidence. T006 remains IN_REVIEW, T007/T008 TODO.
