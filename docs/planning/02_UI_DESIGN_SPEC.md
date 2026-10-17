# UI/UX Specification — DevPulse Portfolio

**Version:** 1.0  
**Goal:** Mengikuti *visual language* dashboard dalam video, lalu menambah public portfolio profesional dan private command center.

## 1. Pemetaan referensi video vs usulan baru

| Bukti pada video | Penggunaan dalam desain | Kategori |
|---|---|---|
| Black/dark canvas + angka hijau mencolok | Brand palette, visual hierarchy, metric cards | Video-derived |
| Sidebar dengan avatar/profil/menu | Desktop shell, navigation groups, active state | Video-derived |
| Bar chart Umami | Visitor breakdown/history | Video-derived |
| WakaTime cards + top languages horizontal bars | Coding activity overview | Video-derived |
| Monkeytype PB/WPM/accuracy statistics | Typing stats screen | Video-derived |
| GitHub contribution heatmap | Contribution analytics | Video-derived |
| Portofolio project grid/cards | Public project gallery | Video-derived |
| Project milestone board + weighted progress | Owner project manager | Added |
| Public/private privacy switches | Owner privacy settings | Added |
| AI runtime & SignalDeck telemetry | Optional P2 local systems | Added |
| Widget presets/export/date comparison | Analytics customization | Added |

Video frames di folder `/references/` adalah **visual reference** dari video yang diunggah pengguna, bukan final UI asset untuk dipublikasikan.

## 2. Design system

**Tema:** Dark Technical Minimalism, data-first.  
**Default palette (proposal):**

- Background `#090B0B`, elevated surface `#111615`, border `#202A26`.
- Main text `#F3F6F3`, muted text `#94A39A`.
- Accent green `#45D483`, accent-hover `#71E8A6`.
- Semantic warning `#F3C36A`, danger `#EF7D78`, info `#80A9E8`.
- Light theme is P1 optional; do not sacrifice dark-first fidelity.

**Typography:** modern sans (Inter/Geist-style); numeric stats in tabular numerals; UI body 14–16px; generous readable spacing; visual focus on metrics.

**Layout:** Desktop nav 240–260px; content max-width approx. 1400px, dashboard dense but legible; grid with 12 columns, 16–24px gaps, card radius 12–16px. Exact values are design tokens, not rigid fixed pixels.

**Motion:** short transitions 120–200ms; no heavy particle/3D animation; respect `prefers-reduced-motion`.

## 3. Public sitemap dan blocks

### Home `/`
1. Navbar logo + Home/About/Projects/Statistics/Journey/Contact.
2. Hero profile (nama/pseudonim diset owner), headline dan CTA `View Projects`, `Developer Stats`.
3. Featured work cards (pilih 3–6), gambar/preview, tech tags, status project.
4. Live-ish stats snapshot; explicitly show refresh time and provenance.
5. Latest milestones / activity timeline (only publish-approved).
6. Call to action, contact/footer.

### Projects `/projects`
- Featured and all; search, filters category/stage/tech, grid 1 mobile / 2 tablet / 3 desktop.
- Each card: image, name, one-line value statement, tags, status, `Details` link.
- Detail: problem → solution → stack → screenshots/demo → milestones approved → learnings → links.

### Stats `/stats`
- Stats dashboard publicly approved only.
- WakaTime weekly, Github heatmap, optional Monkeytype, site visitors if visible.
- Date selector, source badges, last updated, definition tooltips.

### Journey `/journey`
- Reverse chronological milestones, releases, learning progress; no fake claims.

## 4. Private sitemap dan shell

Sidebar groups:
- Workspace: Overview, Coding Analytics, GitHub, Projects, Timeline.
- Insights: Visitors, Typing, Reports.
- Systems: Local AI, Hardware (P2).
- Manage: Integrations, Privacy, Settings.

Top bar: section title/breadcrumb, global date range, sync health indicator, owner avatar menu.

Overview order:
1. Four key metric cards: Coding Time, Contributions, Active Projects, Last Update.
2. Coding activity chart (bar or area).
3. GitHub contribution heatmap.
4. WakaTime top languages/IDE/project cards.
5. Project progress cards / current milestones.
6. Optional Monkeytype and Umami cards.
7. Source integration health panel.

## 5. Desktop dashboard wireframe (concept)

```text
┌────────────────┬───────────────────────────────────────────────────────┐
│  DEV PULSE     │ Dashboard / Overview    [7D▼] [Sync status] [Owner]  │
│  Avatar        ├───────────────────────────────────────────────────────┤
│  Overview      │ Coding Time │ Contributions │ Active Projects │ Sync │
│  Coding        ├────────────────────────────────┬──────────────────────┤
│  GitHub        │ Coding Activity Chart          │ Top Languages        │
│  Projects      │ █▅▂█▃▇                        │ Python █████        │
│  Visitors      ├────────────────────────────────┴──────────────────────┤
│  Typing        │ GitHub Contributions Heatmap                          │
│  Timeline      ├────────────────────────────────┬──────────────────────┤
│  Local Systems │ Project Milestones             │ Integration Health  │
│  Settings      │                                │                      │
└────────────────┴────────────────────────────────┴──────────────────────┘
```

## 6. Responsive behavior

- ≥1280px: full sidebar, 4 metric cards row, 2-column charts.
- 768–1279px: collapsible sidebar, 2 metric cards row, reorder cards.
- <768px: nav drawer; one/two metric cards depending on width; charts can pan horizontally with accessible table alternative for heatmap.
- Wide tables horizontally scroll with clear affordance; tooltips usable without hover (keyboard/touch).

## 7. Interactive component behavior

- **Date picker:** Today / 7D / 30D / 90D / 6M / 1Y / Custom; dates outside data coverage visually indicated, not filled with invented observations.
- **Metric card:** current value, comparison only when comparable periods exist, source, last sync, loading/error/stale states.
- **Charts:** legend toggles, zoom/time range, hover/focus data, drilldown where supported, CSV export P1.
- **Project status:** planned / active / paused / completed / archived with clear mapping.
- **Milestone:** draft/in-progress/done/blocked; `done` only after owner or trusted verified workflow confirms acceptance.
- **Visibility toggle:** owner sees preview of public result, explicit confirm for sensitive categories.
- **Widgets customization P1:** presets (Developer Overview, Project Focus, Full Analytics) before drag-and-drop editor; persist per owner.

## 8. States wajib untuk setiap dashboard module

`loading`, `ready`, `empty`, `not-connected`, `syncing`, `stale`, `rate-limited`, `error`, `permission-denied`. Each state has clear explanation, no default random numbers, and appropriate retry action only for authorized user.

## 9. Accessibility requirements

- Text contrast WCAG AA; green on dark verified against target ratios.
- Keyboard operable navigation, dialogs, controls and charts with summary tables.
- Meaning not conveyed through color alone.
- Focus visible, ARIA where necessary, no hover-only critical info.
- Respect motion and reduced data preferences; image alt text.

## 10. UI acceptance criteria

- Visual review must explicitly compare overview, WakaTime, Monkeytype, Github, and Umami layouts with video frames.
- Metric components remain visually coherent at 390px, 768px, 1440px viewports.
- Owner-only content never appears in source of public pages.
- Screens populated by fixtures always marked as demo in development; production has no dummy numbers.
- Before implementation of subsequent modules, owner accepts the baseline design mockup.
