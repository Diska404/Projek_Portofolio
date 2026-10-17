# CR004 — Calendar and composition visualizations

Date: 18 October 2026, Asia/Jakarta. Scope: extend the existing R0 prototype with the visual patterns requested in two owner screenshots: compact summary strip, activity calendar, view selectors, segmented composition and colored legend, source tiles and concise insights. The attachments are visual references, not instructions to collect app data or copy the displayed account identity/statistics. No screenshot asset, avatar, token count or storage path is imported into the website.

## Implemented design

- A reusable daily calendar, Monday-based weekly bars and cumulative calendar; selected-cell details on click/focus; arrow/Home/End navigation with a single cell tab stop; internally scrollable yearly plots; date/value/coverage table alternative.
- Verified zero is a distinct muted cell. Unknown coverage uses a dashed/hatched cell. Positive levels are relative to the largest value in the displayed view, not an expertise or productivity score. Partial/missing days never become zero; a cumulative gap keeps later cumulative values unknown. Weekly edge buckets include only selected days and are described accordingly.
- Segmented composition with legend buttons, value/percentage drilldown and distinct colors. A missing/invalid segment suppresses the complete total and all percentages; a verified zero-total has no positive segments or denominator-based percentages. Selection inspects a category without renormalizing the total or silently filtering the other categories.
- Work-source composition is an exclusive partition: automatic-only = automatic minus overlap; journal-only = journal minus overlap; overlap is its own category. Existing ledger union supplies the future inputs. Raw automatic + journal totals must not be stacked together.
- Public work/community, AI, GitHub/publication and game views use only unconnected shapes/unknown values. No query string enables synthetic observations. AI inference activity remains separate from owner-declared experience stages. Game composition has no invented game titles.
- Local `/preview/visuals` provides explicitly labeled synthetic examples for project minutes, AI tokens, publications and game minutes, with 30/90/180/365-day ranges, missing-coverage simulation and an unconnected-state switch. Example composition sums match the selected example calendar total. Source tiles remain unconnected rather than claiming actual plugin use.

## Scope and boundaries

No new provider/auth/DB/collector dependency, source integration, system setting change or deployment. Existing personal accounts Diska404 + RaizeiID and creator RaizeiID/community-only policy remain unchanged. Normal production and the creator app do not serve the visual review route. The screenshot pattern is adapted to the original DevPulse dark/green identity; composition colors supplement, rather than replace, the core accent.

Public calendar endpoints are date-range references generated server-side in Asia/Jakarta and serialized as date-only values; they are not sync timestamps or observations. The synthetic review period is fixed for reproducibility. Keyboard/touch text and a table convey values independently of color. Source authorization, historical backfill, stale timestamps and public snapshot publication remain the previously queued backend work.

## Files and verification checkpoint

New: `packages/contracts/src/visual-metrics.ts`, `apps/web/src/components/evidence-charts.tsx`, `visual-review.tsx`, `apps/web/src/app/evidence-charts.css`, `tests/visual-metrics.test.ts`, `tests/e2e/visuals.spec.ts`, this document.

Updated: both app home pages/layouts for the serialized date reference/styles; `audience-portfolio.tsx`, `activity-atlas.tsx`, `public-analytics.tsx`; preview route dispatch; both production smoke scripts; existing analytics browser assertions; README, design system, implementation log, R0 review and task board.

CR004 is part of T006 visual review. T007/T008 remain TODO and the CR003 durable journal/provider/collector dependencies remain unchanged. Validation results and local screenshot evidence are appended after verification.


## Verified checkpoint

`npm run check` PASS: lint, format, strict types, 51 unit/security tests, source credential scan and both builds. `npm run test:ui` PASS: 32 Chromium tests, including 390/768/1440/1920, yearly chart internal overflow, weekly/cumulative modes, keyboard details/table access, source/composition selection, coverage gaps and public sample-query tampering. Isolated production smoke verifies both apps and denies `/preview/visuals`; existing owner/private boundaries remain unchanged. HTTP smoke PASS.

Manual in-app review inspected the daily heatmap, weekly bars and segmented composition. A React list-key warning observed only when switching to weekly mode was reproduced with a browser-console regression assertion, corrected by putting explicit keys before navigation prop spreads, and retested with no browser console/page errors. Final checks and all 32 E2E cases pass. Local screenshots remain ignored: `docs/evidence/visual-heatmap-composition.png`, `visual-composition-detail.png`, `visual-weekly-review.png`.

Status: CR004 IMPLEMENTED / IN_REVIEW. Owner design review and all previously queued backend/integration tasks remain open. Screenshot data is synthetic only; public observations remain unconnected. Existing ecosystem source and local owner credentials were not changed.
