# CR002 — engineering versus creator analytics

Date: 17 October 2026, Asia/Jakarta. Owner confirmed personal GitHub sources **Diska404 + RaizeiID**; creator GitHub source **RaizeiID only**, excluding Diska404. This supersedes CR001's conservative default of leaving the creator GitHub profile unlinked. RaizeiID's public link is now explicitly approved.

## Current authorized scope

Replace the shared generic statistics placeholder with audience-specific dashboard compositions/contracts, move activity ahead of project cards, and refine portfolio copy around the requested focus. Keep real data unconfigured until the remaining R0 database/provider-auth prerequisites and publication pipeline are validated. No fabricated counts, ranked languages, invented history or expert score. No provider token, Git Credential Manager credential, or owner secret is copied into the application.

## Personal: engineering evidence

- Two account scopes, shown separately, plus an explicitly deduplicated combined view.
- GitHub contributions, authored commits, active days, PRs, code reviews, issues/releases and CI evidence are distinct concepts. A push can contain multiple commits; editing a file is not one GitHub contribution. Never label an Events API count as lifetime push/upload history.
- Language use has two separate views: WakaTime recorded active coding duration by language, versus GitHub repository language composition by code bytes. Neither is a proficiency score. WakaTime plugin/coverage must be disclosed; repository bytes are not time or frequency of use.
- Combined commit observations deduplicate by stable repository ID + SHA; coauthor attribution across two accounts must not double the same commit. Missing source coverage is not zero and must not produce a complete combined total.

## Creator: publishing evidence

- Primary: published non-live videos (Shorts included unless classified by verified metadata/owner curation), completed live broadcasts, verified Community posts and publication-active days.
- Secondary: period views/watch time (owner-authorized YouTube Analytics), actual live duration, upload cadence and engagement. Do not substitute lifetime public counters for selected-period analytics.
- Live replays and normal uploads are mutually exclusive; scheduled/ongoing broadcasts are not completed lives. Unknown/missing classification must remain unknown, rather than silently counted as a normal upload.
- Community posts: the official Data API resource index inspected for this checkpoint does not expose a supported Community-post collection. Treat this as a current integration limitation; use owner-verified manual records/import until an official source is confirmed. No scraping or inferred zero.
- GitHub is secondary, restricted to RaizeiID and approved community repositories. Do not import Diska404 or academic repository records merely because RaizeiID contributed. Repository allowlist remains unset until provided. The explicitly approved profile link can lead to public GitHub history; existing identity-discovery limitations still apply.

## UI and privacy acceptance

Interactive 7/30/90-day periods, account scope, language basis and activity-type controls must update the context without simulating observations. KPI cards, chart panels, source/coverage, last sync and metric definitions are visible. Unconnected values use —; no green activity cells, percentages, bars, rankings or timeline events represent user activity before verified data exists. Public creator HTML/RSC/client bundles may contain the approved RaizeiID identity, but not Diska404, campus records or personal destination. The invitation gate is unchanged.

## Gate and continuation

CR002 is an extension of the R0 visual review. T006 remains IN_REVIEW; T007 database and T008 provider-managed owner auth remain TODO. Provider adapters, jobs and approved snapshots follow their dependencies. Detailed YouTube integration is a newly requested scope item and requires its own capability/consent review before implementation. Real channel URL/ID, WakaTime account/plugin setup and approved repository lists are not supplied yet.

## Primary references checked

- [GitHub repository languages](https://docs.github.com/en/rest/repos/repos#list-repository-languages): language values are bytes.
- [GitHub events](https://docs.github.com/en/rest/activity/events): activity feed is not a complete lifetime history.
- [WakaTime API](https://wakatime.com/developers): language/time summaries and scoped access.
- [YouTube Data API resources](https://developers.google.com/youtube/data/reference/rest): supported resource surface, uploads playlist/video/channel resources.
- [YouTube video metadata](https://developers.google.com/youtube/data/reference/rest/v3/videos): actual/scheduled live times.
- [YouTube Live Broadcasts](https://developers.google.com/youtube/data/live/reference/rest/v3/liveBroadcasts/list): authorized owner access and broadcast states.


## Implemented review checkpoint

The public composition is now implemented in `apps/web/src/components/public-analytics.tsx` with selected server projection in `apps/web/src/lib/analytics-content.ts`, shared observation/counting contracts and audience-specific pages. The personal account filter affects GitHub only; WakaTime is independently sourced. All cards remain unconnected. Filters change review context, not invented observations. Creator links only the approved RaizeiID public profile; community repository approval remains pending.

Local verification: full check/build PASS, 28 unit/security tests PASS, 18 Chromium E2E PASS, both isolated production smoke checks PASS. Technical validation does not imply owner visual acceptance or completion of provider adapters. CR002 remains IN_REVIEW alongside T006.

Changed file inventory: both app `src/app/page.tsx` and `layout.tsx`; `apps/web/src/app/analytics.css`; `apps/web/src/components/public-analytics.tsx` and `audience-portfolio.tsx`; `apps/web/src/lib/analytics-content.ts` and `public-content.ts`; `packages/contracts/src/public-analytics.ts`; `tests/public-analytics.test.ts`, `tests/e2e/analytics.spec.ts`, `tests/e2e/creator.spec.ts`, `tests/bridge.test.ts`; `scripts/creator-production-smoke.mjs`; README and current review/status/implementation documents.

Additional local evidence: personal/creator analytics manually inspected in the in-app browser; screenshots saved to ignored docs/evidence/personal-analytics-review.png and creator-analytics-review.png. HTTP smoke PASS. The existing START-SEMUA-WEB.bat successfully started all five services; read-only status reported hub/AI/SignalDeck/personal/creator online. Authenticated GitHub API identity verified as RaizeiID before push.
