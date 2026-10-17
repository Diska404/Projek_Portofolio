# Feature Specifications — DevPulse Portfolio

**Format:** feature → scenario → acceptance criteria. `P0` launch-critical; `P1` extension; `P2` local integrations.

## F01 — Design System & Responsive Shell [P0]
**Scenarios:** Visitor opens public website; owner opens private dashboard on desktop/mobile.
**Required:** dark-green brand tokens, sidebar and public navbar, responsive cards, consistent charts, accessible navigation, loading/empty/stale/error components, mobile support.
**Acceptance:** matches layout language of video reference; keyboard navigable; 390/768/1440 widths verified; no horizontal page overflow; no real data hardcoded.

## F02 — Public Profile/Home [P0]
**Scenarios:** Visitor learns who developer is and reaches projects or stats.
**Required:** hero, biography, social/contact CTAs, featured projects, latest approved activity, SEO meta, accessible media.
**Acceptance:** owner can edit publicly visible content through authenticated dashboard; unpublished fields absent in HTML/API responses.

## F03 — Public Projects [P0]
**Scenarios:** Visitor filters projects, opens details, sees screenshots and milestones.
**Required:** slug route, tag/category filters, featured badge, project status, tech stack, owner-approved media and demo links.
**Acceptance:** draft/hidden projects not resolvable from public endpoint; broken links have fallbacks; image alt and responsive sizes.

## F04 — Owner Identity & Permissions [P0]
**Scenarios:** Owner logs in; visitor attempts to access dashboard or API.
**Required:** provider-managed auth, server-side authorization, safe logout, session expiration, deny-by-default, MFA recommended.
**Acceptance:** unauthenticated private API returns 401, unauthorized returns 403; direct access to private project IDs denied; owner tokens never reach browser bundle.

## F05 — Dashboard Overview [P0]
**Scenarios:** Owner sees source-specific stats, trends and source health.
**Required:** 4+ KPI cards, charts, custom date range, sync freshness status, status when provider not configured; no fabricated data.
**Acceptance:** filter changes all selected cards consistently; timezone shown; stale data marked; loading/error/retry behave safely.

## F06 — Projects & Milestones Manager [P0]
**Scenarios:** Owner creates project, documents tasks and sets milestone weights.
**Required:** project CRUD, milestone CRUD, task state, weighted progress, evidence links, publish preview, timeline.
**Acceptance:** non-positive weights rejected, project without milestones displays not_started, owner can toggle visibility, progress calculations unit-tested.

## F07 — GitHub Connector [P0]
**Scenarios:** Owner connects GitHub and sees contributions.
**Required:** secure auth/token configuration, GraphQL contributions calendar, repository overview, attribution, incremental sync, backfill control.
**Acceptance:** source data labelled; private repository content excluded from public projection by default; response 429 and token expiration yield error/stale status, not zero.

## F08 — WakaTime Connector [P0]
**Scenarios:** Owner sees duration coded and breakdown by language/project/editor.
**Required:** authenticated server-side integration, daily history, top languages, date range; respects access and per-account limitations.
**Acceptance:** no secret in frontend, provider failure does not delete stored stats, duration in seconds normalized, timezone and coverage clear.

## F09 — Privacy, Publication, Audit [P0]
**Scenarios:** Owner enables/disables public visibility for selected data.
**Required:** per-project/metric controls, sanitization, snapshot publish and revoke, preview, audit log.
**Acceptance:** revocation effective immediately for new public requests incl. caches; zero possibility of raw credential or private metadata exposure.

## F10 — Monkeytype + Umami [P1]
**Scenarios:** Typing stats and visitor analytics on owner dashboard; optional subset public.
**Required:** ApeKey server-side Monkeytype, mode-specific PB stats; Umami authenticated pageview/visitor reports; retain provider definitions.
**Acceptance:** no mixing WPM modes; no claiming visitor count equivalent to pageviews; support API rate-limit and empty states.

## F11 — Widget Customization & Reports [P1]
**Scenarios:** Owner chooses prebuilt layouts, changes chart type, compares periods, exports reports.
**Required:** presets (Developer Overview, Project Focus, Full Analytics), widget configuration schema, ECharts visualization, persisted per-owner settings, CSV export.
**Acceptance:** card ordering persists, widgets disabled when incompatible data type, exported report contains source/time range/timezone.

## F12 — Local AI & SignalDeck Telemetry [P2]
**Scenarios:** Owner tracks runtime inference/hardware utilization remotely from private dashboard.
**Required:** Windows collector, adapter configuration, aggregate ingestion, offline buffer, secure token rotation, last seen, opt-in source access.
**Acceptance:** inbound laptop network access not required; no remote OC/UV control; missing runtime metrics remain N/A; no prompts/file paths/secret data ingested.

## Cross-feature acceptance

- All widgets support empty/not_connected/loading/ready/stale/error where meaningful.
- All protected API authorization tests pass, even with direct URL/ID tampering.
- UI demo/fixtures are visually marked and never displayed as actual production history.
- Changing global date range never implies data exists outside the actual collected coverage.
- All server/worker endpoints validate input and are logged without secrets.
