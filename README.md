# DevPulse Portfolio — R0 review

Two local public-portfolio prototypes with separate audiences: a personal portfolio (`apps/web`, port 3100) and a creator/community portfolio (`apps/creator`, port 3101). Shared original design components, separate server projections and routes. This continues the supplied planning pack plus the owner's CR001 request; no production database, provider integration, analytics tracker or local agent is connected.

## Run on Windows

From this folder, with Node 20.9+ (tested: 24.19.0) and npm:

```powershell
npm ci
npm run dev
```

In another terminal, `npm run dev:creator` starts the YouTube/community portfolio on http://127.0.0.1:3101/ . The parent workspace's `START-SEMUA-WEB.bat` now starts both portfolios and all three ecosystem services. The applications have separate Next build directories and do not share a single route tree.

Personal → creator: click the Raizei avatar in the sidebar. Creator → personal: choose **Ruang undangan** and enter the access code. `SETUP-AKSES-PORTOFOLIO.bat` generates a random local code and shows it only in the owner's interactive console; the password hash, encrypted destination and separate encryption key live outside Git/OneDrive under the user's local app-data directory. The original code is not stored and cannot be recovered from its hash. Rotate with `npm run setup:bridge -- --rotate`. Setup does not overwrite existing configuration without that flag.

This guards discovery through the shortcut; the personal site itself remains public. The bridge is enabled only in development: normal production denies disclosure with 503 until shared abuse-control storage and deployment review exist. It never grants owner dashboard/API access. See `docs/DUAL_PORTFOLIO_PLAN.md` for limits, encryption choices and privacy acceptance. The default local destination is 127.0.0.1:3100; a real destination is configured privately through `DEVPULSE_PERSONAL_DESTINATION` during owner setup, never through a NEXT_PUBLIC variable.

Both servers bind only to 127.0.0.1. Use Ctrl+C in each terminal to stop its portfolio. Node modules are reproducible from package-lock.json; do not distribute node_modules or .next.

Review routes:

- http://127.0.0.1:3100/ — personal composition, college/community/application draft entries, unpublished stats.
- http://127.0.0.1:3101/ — creator composition, community/application draft entries, no college/personal content.
- http://127.0.0.1:3101/access — guarded invitation shortcut; no personal photograph or destination is sent before verification.
- http://127.0.0.1:3100/preview/overview — dashboard study; Sample data / Not connected modes.
- http://127.0.0.1:3100/preview/design-system — tokens, component family, all nine data states.
- http://127.0.0.1:3100/preview/projects — read-only project composition.
- http://127.0.0.1:3100/preview/integrations — unconfigured provider states.
- http://127.0.0.1:3100/preview/privacy — read-only privacy study.
- /dashboard/* redirects to /login; /api/owner/* denies requests. No login credential exists in R0.

Preview routes are disabled in a normal production start. All routes are noindex during R0. A local-only DEVPULSE_REVIEW_MODE=1 override exists for reviewing a production build, not for hosting sample analytics as real data.

## Checks

```powershell
npm run check
npm run test:http
npx playwright install chromium
npm run test:ui
npm run test:production
npm audit
```

`check` runs ESLint, formatting, strict TypeScript, unit tests, credential-pattern scan and production build. HTTP checks need the development server running. E2E starts a local dev server if necessary. Browser screenshots are written to docs/evidence and ignored by Git. Palette contrast checks do not replace a full WCAG audit.

Source is versioned at https://github.com/Diska404/Projek_Portofolio under the verified Diska404 account. The real pre-commit hook and the [initial hosted CI run](https://github.com/Diska404/Projek_Portofolio/actions/runs/39009300832) passed. CI runs lint, formatting, typecheck, unit tests, credential scan, production build/boundary smoke and Chromium E2E. See docs/GITHUB_WORKFLOW.md for account settings and upload evidence.

The initial lint preset included a vulnerable transitive glob chain. It was replaced with direct ESLint 10 + typescript-eslint + React Hooks rules; npm audit then reported zero findings. The generated initial dependency directory was isolated under .r0-dependency-backup and ignored by Git; it is unused by the current app. It can be discarded after review, with no source or user data involved.

## Repository map

```text
apps/web/              Next.js App Router, public/preview shells, deny-only owner boundary
apps/creator/          separate creator routes, metadata, invitation UI and local bridge
packages/ui/           shared CSS tokens
packages/contracts/    typed data states and clearly separated synthetic review fixtures
tests/                 unit and headless browser regression
scripts/               HTTP boundary checks and credential-pattern scan
docs/planning/         original planning documents and review-only reference images
docs/                  implementation plan, design system, log and review checkpoint
```

Reference images stay in docs/planning and are not served as public assets. The supplied full video and derived QA frames remain outside published source. The neighboring ecosystem's portable launcher bundle was updated for the fifth service; its application/runtime/hardware behavior was not changed by CR001.

## Current gate

R0a: T001–T005 verified, including T002 real pre-commit and hosted CI evidence; T006 visual review pending. T007 database and T008 provider authentication are planned but not implemented, following the user's requested prototype-before-backend checkpoint. Full R0 and R1 are not approved. Monkeytype/Umami integrations are R2; local AI/SignalDeck ingestion is R3.

See docs/R0_IMPLEMENTATION_PLAN.md, docs/DESIGN_SYSTEM.md, docs/IMPLEMENTATION_LOG.md and docs/R0_REVIEW.md for evidence and exact next steps.
