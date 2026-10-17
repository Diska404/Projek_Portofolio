# QA, Security, and Release Gates

## A. Core functional validation

- [ ] Public Home/About/Projects/Project Detail/Stats routes load with approved content.
- [ ] Hidden project returns safe 404 on direct navigation and API request.
- [ ] Project create/edit/archive works from owner dashboard only.
- [ ] Milestone weights reject zero/negative and nonnumeric values.
- [ ] Weighted progress formula matches test fixtures; zero milestones shows not_started.
- [ ] All date presets and custom date ranges are timezone-consistent; no invented rows outside coverage.
- [ ] GitHub contribution calendar labelled correctly; does not equate contribution count to commits.
- [ ] WakaTime duration and language breakdown return expected normalization/units.
- [ ] External API disconnection leaves previous data with clear stale/status marker.
- [ ] Connection not configured shows not_connected, not 0.
- [ ] Owner can retry failed sync without creating duplicate records.
- [ ] Public settings toggle updates published projection and invalidates stale cache.

## B. Access control and security

- [ ] No unauthenticated user can load `/api/owner/*`, `/dashboard/*` owner data.
- [ ] Owner ID tampering cannot fetch/edit another resource (IDOR prevention even single-owner).
- [ ] Public endpoint reveals no raw source records, secrets, cookies, tokens, sync cursors, hardware identifiers or unpublished fields.
- [ ] Rate limiting on login, sync trigger, local agent ingest.
- [ ] UI escapes unsafe user-controlled HTML; project external links validated.
- [ ] Credentials saved encrypted/secret store, not committed or logged.
- [ ] Session expiration, logout, revocation tested.
- [ ] Caching/CDN cannot continue serving revoked content after publish-toggle revoke.
- [ ] DB public role/RLS verified with negative integration tests.

## C. Sync and data quality

- [ ] Data contract provider/unit/timezone/period/record ID is persisted.
- [ ] Retry is idempotent across partial successes.
- [ ] API 401 → reconnect guidance; 403 → permission guidance; 429 → backoff; 500 → stale + retry.
- [ ] Timezone boundary tested at UTC midnight and local midnight.
- [ ] Duplicate contribution/overlapping time window handling documented.
- [ ] WakaTime API unavailable does not block public page.
- [ ] Null and missing provider fields handled without chart crash.
- [ ] Upstream provider changes captured as typed validation errors.

## D. Design fidelity and accessibility

- [ ] Screens visually compared with frames `video_0s`, `video_8s`, `video_50s`, `video_56s`, `video_76s`.
- [ ] Dark near-black design with restrained green metrics; same feel as video.
- [ ] Sidebar/profile/nav/cards/chart/heatmap visibly recognizable.
- [ ] Public page and private dashboard design coherent, not identical pages with a lock icon.
- [ ] Responsive 390px, 768px, 1440px and widescreen; no uncontrolled overflow.
- [ ] Keyboard traversal, focus state, accessible labels and tooltip alternatives.
- [ ] Reduced motion behavior works.
- [ ] Charts have text summary/table alternative where data meaning is important.
- [ ] Contrast check WCAG AA on normal UI text.

## E. Performance and operations

- [ ] Public pages have correct metadata, OG preview and canonical tags.
- [ ] Owner-only routes noindex.
- [ ] Target web vitals evaluated at agreed production-like test conditions.
- [ ] Logs redact secrets, user token and private telemetry.
- [ ] Schedulers within hosting plan limits and with observability.
- [ ] Migration / backup / rollback procedures documented and rehearsed.
- [ ] CI runs lint, typecheck, unit/integration tests, and production build.

## F. Release approval record

```text
Release: R0 / R1A / R1B / R2 / R3
Date:
Completed tasks:
Open blocking issues:
Test evidence:
Security review:
Owner visual signoff:
Deployment URL/environment:
Rollback point:
Decision: GO / NO-GO
```

R0→R1 and R1→R2 transitions require explicit review. "Feature implemented" cannot be equated with "verified on production".
