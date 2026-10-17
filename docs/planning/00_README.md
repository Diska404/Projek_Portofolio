# DevPulse Portfolio — Planning Pack v1.0

A full, implementation-oriented PRD package for an AI coding agent. **No website has been built yet.** The videos/images are design inspiration supplied by the owner.

## What this project is

**A:** Public developer portfolio, projects, timelines, filtered public statistics.  
**B:** Private owner dashboard, analytics, project manager, integrations, privacy and publishing controls.  
**C (P2):** Local AI and SignalDeck telemetry ingestion into owner dashboard only.

Core styling mirrors the **dark + green metrics + sidebar + Umami / WakaTime / Monkeytype / GitHub Contributions** atmosphere of the attached reference video. Work products are original; do not reuse the video's creator identity.

## Documentation index

1. `01_PRD_MASTER.md` — product requirements, goals, modules, KPIs, priority, scope and release gates.
2. `02_UI_DESIGN_SPEC.md` — design system, exact reference elements, screens, responsive wireframe.
3. `03_ARCHITECTURE_AND_DATA.md` — technical architecture, schema, sync pipeline, privacy architecture.
4. `04_FEATURE_SPECIFICATIONS.md` — functional specs + acceptance for F01–F12.
5. `05_TASK_BOARD.md` — ordered tasks T001–T049 and milestone gates.
6. `06_AGENT_EXECUTION_GUIDE.md` — master prompt, development workflow, checkpoints.
7. `07_QA_RELEASE_GATES.md` — end-to-end QA, authorization, reliability, visual review.
8. `references/` — screenshots from user-supplied video; not to publish as website assets.

## Decision log

- Working title **DevPulse Portfolio**, owner may rename.
- Owner has selected **public + private hybrid**.
- Public metrics are opt-in, never direct access to private integration data.
- MVP prioritizes profile/projects, GitHub, WakaTime, auth, and consistent UI.
- Monkeytype/Umami included in the planned product but not blocking MVP.
- Local AI/SignalDeck added later only after source-adapter feasibility review.
- Accounts/tokens/domain/budget not yet supplied; connectors must support unconfigured states.

## Recommended development workflow

1. Review R0 visual design mockup with owner.
2. Start agent using `06_AGENT_EXECUTION_GUIDE.md` and full pack.
3. Implement tasks T001–T008 only; present evidence and request R0 signoff.
4. Continue in task dependency order; one release gate at a time.
5. Deploy only after QA checklist and owner approval.

## Key public references consulted

- NgodingPakeAI Bikin Plan: https://www.ngodingpakeai.com/
- GitHub GraphQL contributions: https://docs.github.com/en/graphql/reference/users
- WakaTime API: https://wakatime.com/developers/
- Monkeytype API: https://api.monkeytype.com/docs
- Umami website stats: https://docs.umami.is/docs/api-reference/get-website-event-stats

**Important:** This planning package is an original derivative of the user's feature request and video observations. It is not a copy of NgodingPakeAI's proprietary product or internal prompts.
