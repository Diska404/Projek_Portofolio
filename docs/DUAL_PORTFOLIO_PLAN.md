# Change request CR001 — two audiences and a guarded shortcut

Date: 17 October 2026, Asia/Jakarta. User confirmed: only the shortcut from the YouTube portfolio to the personal portfolio requires a passphrase; the personal site itself remains public.

## Scope and acceptance

1. Personal application (`apps/web`, local port 3100): personal-photo placeholder; college work, translation/community work, translation application and social profile sections. Project names/details not supplied remain explicitly awaiting content, with no invented statistics or release claims.
2. Creator application (`apps/creator`, local port 3101): separate public root, metadata and client projection; community translation/GFL2, translation application and YouTube sections. No college cards, personal photo, legal name/contact or personal-site URL in its HTML/RSC/client JavaScript.
3. Shared original components and tokens; server content is projected for the selected audience before it reaches client components. The creator app has no personal route or owner design-review route. It cannot switch audience using query parameters.
4. Personal-to-creator shortcut uses the creator avatar and suppresses referrer disclosure. Creator-to-personal shortcut uses a neutral invitation avatar rather than exposing a personal photo before access.
5. Server-only passphrase check and encrypted destination. No default/demo passphrase; missing configuration denies disclosure. Wrong passphrase, invalid origin, unsupported method, oversized body and attempt exhaustion deny disclosure. Secrets live outside the Git/OneDrive workspace.
6. This bounded link-disclosure feature is explicitly requested by the owner. It does not implement owner login, grant dashboard/API access, protect the public personal site or satisfy T008. The original PRD's provider-managed owner authentication remains required. No database/provider/analytics integration is added.
7. Local single-process attempt limiting is tested, but public deployment of the bridge remains disabled until a shared abuse-control backend/hosting review is implemented. Public site pages remain reviewable independently of the configured bridge.
8. Commit identity moves to RaizeiID for both repositories. Verify credentials/permissions and remote state; retain repository ownership and existing history.

## Privacy boundary

The destination is private server configuration, encrypted using AES-256-GCM; the password is salted and hashed using scrypt (N=131072, r=8, p=1), not recoverably encrypted. Keys/configuration are outside the repository. Neither credential nor destination is a NEXT_PUBLIC variable. Only an accepted passphrase receives the destination, with no-store/no-referrer headers. Production transport must use HTTPS.

Both portfolios being public means this reduces direct discovery from the creator page; it cannot prevent search, guessing, links shared by an authorized visitor or correlation through public GitHub commits. Public college-repository contributions under RaizeiID can correlate the identities. The owner was informed of this boundary.

## Video evidence

The supplied 95-second portrait video was sampled locally, including the initial sidebar, WakaTime, Umami and Monkeytype screens. Reference traits: near-black surfaces, muted borders, compact sidebar/profile, green values, restrained card layout. The original reference person's name, avatar, account values and product identity are not copied. Source video/derived frames remain local evidence, not public product assets.

## Validation / checkpoint

Run lint/format/typecheck/unit tests, both production builds, public/private boundary smoke, creator isolation checks, live bridge success/negative tests and responsive keyboard/browser QA. Update this document and IMPLEMENTATION_LOG after execution. T006 remains IN_REVIEW until owner visual review; T007/T008 and R1 are not silently advanced by this change.

Security references: [Node crypto](https://nodejs.org/api/crypto.html), [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).

## Executed local checkpoint

- Implemented both applications and asymmetric shortcuts; personal and creator run concurrently on separate origins/build directories.
- Personal draft entries include campus work and the two owner-requested community/application projects; creator has only the latter two. Social/channel URLs not supplied remain visibly unconfigured. The personal photograph/name and actual project details are not invented.
- Salted scrypt passphrase verification; AES-256-GCM destination; no client credential/destination; same-origin POST, bounded JSON body, no-store/no-referrer, ten attempts per ten minutes and one concurrent verification per local process. Production bridge returns 503 until deployment/abuse-control work is reviewed.
- Owner setup creates a random code only in its interactive console, stores hash/encrypted configuration/key outside the workspace, and self-checks the live Next endpoint without capturing the code in agent logs. Successful live disclosure was verified; a separate wrong-code request returned 401 with no destination.
- A real integration check found that Next's internal request URL can differ from the browser origin. The route now checks a trusted server-side `DEVPULSE_CREATOR_ORIGIN` (local default 127.0.0.1:3101), rather than client Host/forwarded headers. A regression covers that normalization and rejects other origins.
- Validation: lint/format/strict typecheck PASS; 20 unit/security tests PASS; 16 Chromium E2E PASS at 390/768/1440/1920; both production builds PASS; personal boundary smoke PASS; creator production HTML/RSC/client-bundle isolation, invalid audience query, hidden routes and owner denial PASS. Final GitHub CI is checked against the pushed commit separately.
- Combined BAT: nine tests PASS; starts the fifth service and reuses all five without changing listener PIDs. All bind only to 127.0.0.1.
- GitHub: RaizeiID has Write (not Admin) access on the two existing Diska404 repositories. Repository-local author, no-reply email and credential selection are RaizeiID. Ownership/visibility/global configuration are unchanged.

Changed groups: `apps/creator/**`; shared audience DTO/content/components/styles and personal home/metadata/identity endpoint; owner setup script/BAT; workspace scripts/lockfile; bridge/creator E2E/production tests; plan/checkpoints/account docs; parent launcher and versioned ecosystem launcher bundle. No AI/runtime/hardware application source was changed by this request.

Still open: T006 owner visual review, final personal/channel names/photos/URLs and project descriptions, T007 database, T008 provider-managed owner auth, real source statistics, production bridge abuse-control backend/HTTPS/hosting, full WCAG audit. Do not put real personal identity content or the hidden destination into this public Git repository; future publication should use audience-scoped records/private storage and an approved public projection. Public source/commit history, public search and authorized visitors sharing the personal URL remain discovery channels.

Resume locally with the parent BAT, review both homes and `/access`, and keep the owner setup code in a password manager. To rotate a lost code use `SETUP-AKSES-PORTOFOLIO.bat --rotate`; the old code is invalidated and the new code is shown only in that terminal. The live code is not needed by CI and must never be added to tests or commits.
