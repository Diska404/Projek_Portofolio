# DevPulse Portfolio — R0 review

Local visual prototype and foundation for a public developer portfolio plus a future owner-only dashboard. This continues the supplied DevPulse planning pack; no production backend, database, provider integration, analytics tracker or local agent is connected.

## Run on Windows

From this folder, with Node 20.9+ (tested: 24.19.0) and npm:

```powershell
npm ci
npm run dev
```

The server binds only to 127.0.0.1:3100. Use Ctrl+C in its terminal to stop it. Node modules are reproducible from package-lock.json; do not distribute node_modules or .next.

Review routes:

- http://127.0.0.1:3100/ — public composition, sample projects, unpublished stats.
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
packages/ui/           shared CSS tokens
packages/contracts/    typed data states and clearly separated synthetic review fixtures
tests/                 unit and headless browser regression
scripts/               HTTP boundary checks and credential-pattern scan
docs/planning/         original planning documents and review-only reference images
docs/                  implementation plan, design system, log and review checkpoint
```

Reference images stay in docs/planning and are not served as public assets. The neighboring Ecosystem v2.0 project has not been modified by this work.

## Current gate

R0a: T001–T005 verified, including T002 real pre-commit and hosted CI evidence; T006 visual review pending. T007 database and T008 provider authentication are planned but not implemented, following the user's requested prototype-before-backend checkpoint. Full R0 and R1 are not approved. Monkeytype/Umami integrations are R2; local AI/SignalDeck ingestion is R3.

See docs/R0_IMPLEMENTATION_PLAN.md, docs/DESIGN_SYSTEM.md, docs/IMPLEMENTATION_LOG.md and docs/R0_REVIEW.md for evidence and exact next steps.
