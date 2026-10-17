# DevPulse design system — R0 proposal

Status: implemented for review, visual signoff pending. Working title: DevPulse.

## Direction

Dark technical minimalism: near-black canvas, restrained green signals, fine borders and legible cards. The public portfolio uses open editorial spacing and original project illustrations. The owner workspace uses a persistent sidebar, denser information hierarchy and explicit source/status context. They share tokens without presenting the same page with a lock added.

The pulse mark, typography composition, code-native project illustrations and layout are original. No reference screenshot, portrait, creator identity, website logo or reference metric is used as a website asset. UI copy is English for this first visual proposal; localization is not implemented.

## Tokens

Source of truth: packages/ui/tokens.css. All text tokens are tested at 4.5:1 or above on canvas, surface and raised surface. This tests the palette, not a complete WCAG audit of every component.

| Token | Value | Use |
|---|---|---|
| Canvas | #090B0B | Page background |
| Surface | #111615 | Cards |
| Raised | #171E1B | Controls, nested panels |
| Border | #26332C | Structure; not the sole signal for state |
| Main text | #F3F6F3 | Titles and primary copy |
| Muted | #A0AFA5 | Supporting copy; adjusted for contrast |
| Subtle | #84998B | Secondary metadata |
| Accent | #45D483 | Metrics, selected navigation, primary CTA |
| Accent ink | #08170E | Text on green actions |
| Warning | #F3C36A | Sample/retry/rate-limit context |
| Danger | #EF7D78 | Error/permission context |
| Information | #80A9E8 | Informational badge |

Spacing: 4/8/12/16/20/24/32/40/48px. Card radius 12px; larger composition 16px; controls 6–8px. Desktop sidebar 248px, compact desktop 220px. Main content maximum 1400px.

Typeface: local system sans (Segoe UI/Helvetica/Arial); tabular metric figures; local system monospace for compact metadata. No remote font request. Public hero 45–68px; workspace headline 29–36px; body default 14px; compact labels and provenance use a smaller scale. Review readability and preferred density with the owner before adding real datasets.

## Components and interaction

- Wordmark, badges, primary/secondary/unavailable buttons, section and card headings.
- Public project filters and read-only sample detail notice. No invented external contact or demo URL.
- Workspace sidebar, mobile drawer, backdrop, focus trap, Escape close and focus return. Public mobile disclosure also supports Escape and focus return.
- Metric cards: value, source, period/coverage and sample/unconfigured state.
- Synthetic coding bar chart with an accessible observations table; contribution heatmap with range selection and text/table alternative. Contributions are never labeled total commits.
- Nine-state gallery: loading, ready, empty, not_connected, syncing, stale, rate_limited, error, permission_denied. Not connected never falls back to zero.
- Date presets 7D/30D/90D update review totals. A 90D request with only 30 coding fixture days shows the actual coverage; missing dates are not filled.
- Integration, project and privacy screens are read-only design studies. Disabled future controls show their release. No fake connect/save/publish action or credential form.

Transitions use 160ms; reduced-motion preference disables transitions, pulse animation and smooth scrolling. Keyboard focus is explicit. Chart tooltips are supplemental; tables provide the meaningful observations without hovering. Horizontal heatmap scrolling stays inside its card on narrow screens.

## Responsive composition

Desktop ≥1280px: full sidebar, four KPI cards, activity/languages columns, full-width contribution calendar. Intermediate: two KPI columns and a compact sidebar; below 1024px the sidebar is a drawer. Mobile <768px: stacked chart cards and two KPI columns. Review widths: 390, 768, 1440 and 1920px. A 360px check is also included in the review follow-up if requested; no claims of testing devices beyond the recorded widths.

## Reference comparison

| Supplied frame | Observed evidence | DevPulse treatment | Limitation |
|---|---|---|---|
| video_0s | Dark project gallery | Original three-card sample gallery and artwork | No source identity/assets copied |
| video_8s | Profile/sidebar, muted navigation, green accent | Workspace/profile placeholder, grouped navigation and active green row | No source portrait or account name copied |
| video_50s | Traffic totals on a presentation slide | Distinct Umami/visitor module reserved for R2 | Not a detailed dashboard frame; no totals reused |
| video_56s | Monkeytype profile and mode-specific metrics | Planned typing module, coherent dark card shell | Full typing functionality is R2; no PB numbers reused |
| video_76s | Editor scene | Confirms development context only | Does not establish dashboard layout |

Overview/WakaTime/GitHub layout follows 02_UI_DESIGN_SPEC.md rather than claiming an exact video-frame match. More frames can refine fidelity after this concrete baseline is reviewed.

## Data and identity boundaries

The overview preview defaults to visibly marked deterministic SAMPLE DATA. The actual integration states remain Not connected. A switch previews the unconfigured experience. No accounts, private projects, local telemetry or real owner identity are loaded. The public portfolio shows explicitly labeled sample project compositions and an unpublished statistics state.

/preview pages are development-only by default; an explicit local review override can enable them for a production-build check. A normal production run returns 404 for preview routes. /dashboard always redirects to a disabled /login boundary; /api/owner always denies all supported methods with 401/no-store. This is not provider authentication, completed T008, or production authorization signoff.

## Review checklist

- Approve or revise dark/green palette, typography size and density.
- Approve the distinct public and workspace compositions.
- Review sidebar groups, KPI order, chart composition and empty states.
- Confirm English-first UI or request an Indonesian language pass.
- Provide approved identity/content only when beginning content tasks.
- Keep T006 IN_REVIEW and full R0 open until the explicit gate decisions are recorded.


## CR001 audience layout

The full supplied video confirms the profile-sidebar/card/green-number direction. Both portfolio homes now use an original compact identity rail with dark surfaces, restrained borders and green emphasis, aligned with the owner workspace. Personal and creator content are projected server-side into the shared shell. Creator has its own brand label, translation illustration, community cards and a neutral invitation avatar; no legal-name/photo teaser appears before verification. Personal has a photograph placeholder and a direct creator-avatar shortcut. Original code-native artwork replaces public fictional project samples with owner-requested draft project slots. The internal dashboard retains clearly labeled synthetic data for review. Responsive evidence is in docs/evidence; owner visual signoff remains pending.


## Activity atlas extension (CR003A)

Personal hierarchy: work process/AI before GitHub/coding; creator hierarchy: YouTube publications before community/game context. Segmented controls use native buttons with aria-pressed; select labels identify work period/project/source unambiguously. Unknown values remain em dashes; no synthetic graph or ranking becomes account history. Source labels distinguish automatic, owner-declared and pending capability. Work-source durations are not stacked without overlap correction. The separate local method simulator carries an explicit synthetic-data banner and does not persist input.


## Calendar and composition family (CR004)

Square activity cells use four relative green intensity levels, a distinct verified-zero fill and hatched unknown cells. Daily/cumulative calendars align Monday–Sunday; weekly mode uses bars. Each chart has date/unit/provenance, click/focus details, roving keyboard focus, a table and bounded internal scrolling. Composition colors (gold/purple/teal plus optional blue/coral/gray) identify exclusive categories; labels/values communicate meaning without color. Unknown data has no positive segment/percentage. The compact summary strip and source tiles are demonstrated only with explicitly marked synthetic values in the gated local visual lab.
