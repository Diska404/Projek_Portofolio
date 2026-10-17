# DevPulse Portfolio — Product Requirements Document (PRD)

**Versi:** 1.0 — Draft siap implementasi bertahap  
**Tanggal:** 17 Oktober 2026  
**Jenis:** Personal product / portfolio / developer analytics  
**Status:** Planning; belum ada implementasi atau integrasi yang dianggap selesai  
**Nama produk:** DevPulse Portfolio (working title, dapat diganti)  
**Target:** Web publik + owner-only dashboard + optional Windows local agent

## 1. Latar belakang dan inspirasi

Pengguna meminta website personal developer portfolio yang meniru **pola visual dan kelompok statistik** pada video referensi yang dikirim: dark dashboard beraksen hijau, sidebar profil dan navigasi, ringkasan statistik Umami, statistik coding WakaTime, statistik Monkeytype, dan heatmap GitHub Contributions. Video juga memperlihatkan galeri proyek portofolio. Referensi video adalah *arah desain dan cakupan inti*, bukan aset atau kode untuk disalin identik.

Tambahan di luar video: public portfolio profesional, dashboard owner-only, project tracker dengan milestone, statistik historis multi-sumber, dashboard widget kustom, kontrol publikasi data, visitor analytics, dan integrasi opsional Local AI Control Center / Hermes / SignalDeck melalui agen lokal.

Pendekatan dokumentasi mengikuti kategori hasil yang dinyatakan secara publik pada fitur **Bikin Plan** di NgodingPakeAI: ide → PRD → feature specification → task untuk coding agent. Dokumen ini **bukan** salinan proses internal NgodingPakeAI.

## 2. Problem statement

- Portofolio statis hanya memperlihatkan hasil akhir tanpa bukti perkembangan proses.
- Statistik coding, kontribusi GitHub, latihan mengetik, dan kunjungan situs tersebar di banyak layanan.
- Pengembangan beberapa proyek secara paralel membutuhkan histori, milestone, dan bukti progres yang tidak dipalsukan oleh sekadar jumlah commit.
- Data pribadi, metrik komputasi, dan pekerjaan belum dipublikasikan tidak boleh terekspos di portofolio publik.

## 3. Visi dan nilai produk

**Visi:** Satu ekosistem untuk memperlihatkan karya dan progres developer secara transparan, sambil mengelola data produktivitas dan proyek secara privat.

**Prinsip:** visual setia referensi; keaslian data; opt-in publikasi; otomatis namun tahan gangguan; mobile-first dan aksesibel; modular; minim biaya awal; coding-agent-ready.

## 4. Pengguna dan hak akses

| Aktor | Akses | Kebutuhan |
|---|---|---|
| Guest visitor | Public-only | Melihat profil, karya, statistik yang diizinkan, link kontak |
| Portfolio owner | Login + MFA dianjurkan | CRUD konten, analytics penuh, integrasi, privasi, sinkronisasi |
| Background worker | Service credential minimum | Pengambilan data terjadwal, agregasi, status sync |
| Windows local agent | Credential perangkat terbatas | Mengirim telemetri yang dipilih; tidak mengontrol web publik |

MVP adalah **single-owner**. Multi-user, akses kolaborator, dan tim tidak termasuk fase awal.

## 5. Sasaran dan metrik keberhasilan

### Sasaran produk
- Guest memahami siapa pemilik, bidang kerja, dan contoh proyek maksimal 2 interaksi dari Home.
- Pemilik dapat membuat/memperbarui proyek dan milestone tanpa mengubah source code.
- GitHub dan WakaTime dapat sinkron berkala dan mempertahankan provenance sumber.
- Statistik publik hanya muncul setelah disetujui oleh pemilik.
- Provider failure tidak menyebabkan dashboard memperlihatkan angka palsu atau status seolah real-time.

### KPI teknis awal (target, bukan hasil)
- 0 kebocoran akses owner pada automated authorization tests.
- 100% endpoint non-publik menerapkan server-side authorization.
- Setiap metrik memiliki sumber, rentang waktu, satuan, dan `last_synced_at`.
- 95%+ automated test untuk business rules penting; target coverage menyeluruh akan ditentukan per modul.
- Target p75 Core Web Vitals: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 pada halaman publik pada kondisi uji yang disepakati.
- Error dan keterlambatan sync tercatat serta dapat ditinjau owner.

## 6. Ruang lingkup dan prioritas

**P0 / MVP**: desain inti mengikuti video; halaman publik; dashboard owner-only; login; CRUD proyek; milestone berbobot; overview statistik; GitHub Contributions/Repos; WakaTime time/languages; date filtering; public privacy controls; sync status; responsive, SEO dasar, testing.

**P1 / Extension**: Monkeytype, Umami, visitor analytics, activity timeline, advanced charts, custom widget layout dan preset, report export CSV, pengaturan tema/aksen, perbandingan periode, accessibility refinements.

**P2 / Local ecosystem**: telemetry Local AI/Hermes dan SignalDeck, local agent Windows, agregasi biaya/token jika runtime menyediakan data yang andal, multi-device optional, notifikasi kegagalan sync, advanced project import.

**Non-goals awal:** kloning source/branding website dalam video; mengambil seluruh telemetry mentah beresolusi tinggi; remote overclock/undervolt hardware via situs publik; scraping atau bypass API; marketplace; blog multi-author; social network; AI agent autonomous publishing tanpa approval; merekam isi prompt/percakapan terjemahan atau kode privat secara default.

## 7. Modul dan functional requirements

| ID | Modul | Priority | Requirement inti |
|---|---|---|---|
| F01 | Design System & Navigation | P0 | Dark dashboard + accent green; sidebar; card; chart; layout responsif |
| F02 | Public Home & Profile | P0 | Hero, bidang, profil, CTA, metadata/SEO, link sosial |
| F03 | Public Project Gallery | P0 | Cards, filter kategori, proyek unggulan, detail/media yang diizinkan |
| F04 | Owner Authentication | P0 | Login, logout, session, owner authorization, protected API |
| F05 | Private Overview | P0 | Summary cards, date range, activity, sync badge, empty/error states |
| F06 | Project Manager | P0 | CRUD proyek, milestones, tasks, progress berbobot, publish switch |
| F07 | GitHub Connector | P0 | Commit/contribution calendar, repo metadata, backfill/sync/attribution |
| F08 | WakaTime Connector | P0 | Time coded, top languages, editors, per-day trends, source timestamps |
| F09 | Privacy & Publish Layer | P0 | Field-level selection, public snapshots, publish audit, safe default |
| F10 | Monkeytype + Umami | P1 | Typing bests, WPM/accuracy; visitors/pageviews referrer |
| F11 | Dashboard Customization | P1 | Grafik beberapa tipe, drag/config atau preset, time filters, export |
| F12 | Local Ecosystem Agent | P2 | Aggregated local metrics; offline buffer; owner-only; no remote OC/UV |

### User stories prioritas
- US-01: Sebagai pengunjung saya dapat melihat galeri proyek dan demo agar memahami hasil pekerjaan.
- US-02: Sebagai pengunjung saya dapat melihat chart coding dan contributions dengan sumber serta waktu update yang jelas.
- US-03: Sebagai pemilik saya dapat login dan mengubah proyek, milestone, dan visibility tanpa menyunting kode.
- US-04: Sebagai pemilik saya dapat melihat analitik per 1/7/30/90/180/365 hari serta rentang tanggal kustom bila data tersedia.
- US-05: Sebagai pemilik saya dapat meninjau error sync, menjalankan retry, dan tidak kehilangan data yang sudah tersimpan.
- US-06: Sebagai pemilik saya dapat mengatur publikasi setiap metric/project dan segera mencabutnya dari endpoint publik.
- US-07: Sebagai pemilik saya dapat mengintegrasikan statistik AI/hardware lokal tanpa mengekspos credential atau konten privat.

### Functional rules lintas modul
- Never fabricate stats. Saat belum tersambung tampilkan **Not connected**, bukan angka `0`.
- Saat sinkronisasi gagal tampilkan data terakhir beserta status **Stale / Last synced**, bukan `Live`.
- Perubahan visibility harus divalidasi server; public snapshot tidak boleh berisi record terlarang.
- Satu proyek bisa dipublikasikan sebagian: status proyek, screenshot terpilih, dan milestone terpilih.
- Publikasi tidak otomatis hanya karena commit/repo sudah dapat dibaca API.
- Tanggal agregasi default zona **Asia/Jakarta** di UI; simpan timestamp UTC dan offset/timezone sumber.
- Semua filter statistik memperjelas definisi metrik dan data coverage.

## 8. Pengalaman pengguna dan sitemap

### Public
`/`, `/about`, `/projects`, `/projects/[slug]`, `/stats`, `/journey`, `/contact`, `/privacy`.

### Private
`/login`, `/dashboard`, `/dashboard/analytics`, `/dashboard/projects`, `/dashboard/projects/[id]`, `/dashboard/integrations`, `/dashboard/activity`, `/dashboard/visitors`, `/dashboard/local`, `/dashboard/settings`, `/dashboard/settings/privacy`.

### Layout fidelity terhadap video
- Latar belakang near-black, garis pemisah tipis, teks putih/abu, angka utama hijau cerah.
- Sidebar profil dan menu di desktop; mobile menjadi drawer/bottom navigation seperlunya.
- Top-level Overview berisi kartu angka dan grafik bar; WakaTime ringkasan waktu dan top languages; Github contribution heatmap; Monkeytype PB cards; Umami visitor cards.
- Cards radius kecil-sedang, tidak terlalu glossy; animasi halus bukan efek yang mengganggu.
- Statistik dalam video merupakan **contoh konten**, bukan nilai yang boleh ditanamkan sebagai data akun pemilik.

Spesifikasi UI detail ada pada `02_UI_DESIGN_SPEC.md`.

## 9. Arsitektur dan kontrak data

Rekomendasi: **Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + ECharts + PostgreSQL + Drizzle ORM + provider auth + background sync worker**. Deployment web managed; scheduler dipilih sesuai frekuensi dan limit host. Optional Python Windows collector untuk tahap P2.

1. Browser public mengakses public projection; tidak membaca tables privat.
2. Owner memanggil protected API yang memeriksa server-side session/authorization.
3. Worker menarik data API pihak ketiga secara terjadwal, menyimpan raw summaries minimal, melakukan normalisasi/upsert dan agregasi.
4. Public publisher membangun snapshot dari approved fields, bukan copy semua dashboard.
5. Local agent P2 mengirim agregasi ke ingest endpoint dengan device auth; tidak membuka port inbound ke laptop.

Semua raw source mempunyai `source`, `source_record_id`, `collected_at`, `period_start`, `period_end`, `timezone`, `unit`, `visibility`, dan keterlacakan sync. Idempotency mencegah duplicate on retry. Model lebih lengkap: `03_ARCHITECTURE_AND_DATA.md`.

## 10. Security, privacy, compliance

- Dashboard owner-only, API server-authorized, MFA direkomendasikan, session/cookie aman.
- RLS/DB access policies sesuai deployment; least privilege dan secret server-only.
- Rate limiting di login, ingest, dan sync trigger; CSRF/XSS protection, input validation, output escaping.
- Secret di environment secure storage; token log harus di-redact; token rotasi dan revoke.
- Public content hanya berasal dari content/metrics yang telah di-approve.
- Tidak menampilkan nama file lokal, prompt/chat contents, informasi sensitif akademik, konten berlisensi yang tak boleh dibagikan.
- Backup dan restore drill; retention dapat dikonfigurasi untuk telemetry.
- Web hanya melihat telemetry owner-approved; **tidak** ada remote control hardware/OC/UV.

## 11. Integrasi (realistis sesuai batasan API)

- GitHub: GraphQL `contributionsCollection` untuk contribution calendar; repo metadata dari API. Perhatikan aturan private contributions dan token scopes. Dokumentasi: https://docs.github.com/en/graphql/reference/users
- WakaTime: API `stats`, `summaries`, `insights` sesuai akses; secret tidak boleh dibawa frontend. Dokumentasi: https://wakatime.com/developers/
- Monkeytype (P1): ApeKey dan endpoint personal bests/results sesuai izin & rate limit. Dokumentasi: https://api.monkeytype.com/docs
- Umami (P1): website traffic statistics, authenticated server-side. Dokumentasi: https://docs.umami.is/docs/api-reference/get-website-event-stats
- Local AI dan SignalDeck (P2): implementasi **adapter** setelah skema metrik runtime/aplikasi benar-benar dikonfirmasi; jangan menebak API lokal.

## 12. Analytics dan definisi metrik

| Metrik | Definisi | Sumber |
|---|---|---|
| Coding duration | Durasi aktivitas coding menurut pelacakan penyedia, bukan jam PC menyala | WakaTime |
| Contribution count | Jumlah kontribusi menurut kontribusi kalender GitHub (bukan selalu total commit) | GitHub |
| Commit count | Jumlah commit yang terhitung dalam cakupan sinkronisasi yang dijelaskan | GitHub |
| Visitors/pageviews | Menurut definisi versi Umami yang dipakai | Umami |
| WPM/accuracy | Hasil tes menurut mode, bahasa, dan panjang tes | Monkeytype |
| Project progress | Σ bobot milestone selesai / Σ seluruh bobot milestone | Internal |
| AI tokens/s | Pengukuran runtimes yang dilaporkan collector; jika unavailable, N/A | Local agent |

Tidak menghitung angka universal "productivity score" tanpa metode terdefinisi dan diverifikasi.

## 13. Non-functional requirements (NFR)

- TypeScript strict; modular, maintainable, typed provider adapters; tests.
- Responsive 360px–desktop widescreen, keyboard navigation, WCAG 2.2 AA ditargetkan untuk komponen inti.
- Reduced motion; skeleton/loading/empty/error/stale states untuk setiap integration widget.
- Timezone-aware date filters; timezone UTC at rest; pagination untuk record banyak.
- Idempotent retries, backoff/rate limit, no failure cascades, graceful degradation.
- Public pages SEO-friendly; dynamic owner-only data noindex.
- Log terstruktur tanpa secrets, monitoring error, audit, database migration, backups.
- Scalability: awal single owner, trafik ringan–menengah; optimasi berdasarkan pengukuran.

## 14. Release plan dan dependencies

- R0: design tokens + UI prototype; validasi kesesuaian video.
- R1 (MVP): public site + login + project CRUD + GitHub/WakaTime + public privacy snapshot + deployment.
- R2: Umami/Monkeytype + advanced widgets + timeline/export.
- R3: local agent + AI/SignalDeck adapter + private telemetry dashboard.

**Release gates:** unit/integration tests pass, secret scan pass, access tests pass, smoke test responsive, sync/error/retry pass, no fabricated numbers, privacy toggle tested public API.

Roadmap rinci ada pada `05_TASK_BOARD.md`, test cases pada `07_QA_RELEASE_GATES.md`.

## 15. Risks dan mitigasi

| Risiko | Mitigasi |
|---|---|
| API provider memiliki limit/perubahan skema | Adapter per provider, caching, retry/backoff, contract tests |
| Data privat bocor | Public projection terpisah, RLS, authorization tests, private-by-default |
| Statistik tidak selaras | Standardize unit/timezone/source, tooltips definisi, provenance |
| Biaya terjadwal melebihi budget | Frekuensi configurable, manual sync, batching, pilih scheduler berdasar plan |
| Sinkronisasi offline | Stored last-known data + stale badge, backfill setelah online |
| Scope creep | Prioritas P0/P1/P2, change request, feature flags |
| Menyalin desain orang terlalu literal | Ambil inspirasi komposisi, buat brand/assets sendiri, tidak mengambil branding/kode |

## 16. Keputusan terbuka (tidak memblokir scaffold)

- Nama final dan domain: **TBD** (gunakan working title sampai disetujui).
- Akun GitHub/WakaTime/Monkeytype/Umami: **belum diberikan**, jangan buat data seolah terhubung.
- Accent color final: hijau video sebagai default; opsi variasi nanti.
- Budget deployment: belum diputuskan, prioritaskan free/low-cost tanpa menganggap schedulers selalu gratis.
- Apakah profil publik memakai nama asli/pseudonim: ditentukan owner saat content entry.
- Data spesifik AI lokal/SignalDeck: menunggu audit struktur aplikasi dan telemetry provider.

## 17. Definition of Done (produk)

Produk tidak dinyatakan selesai hanya karena build berhasil. Minimum: fitur sesuai acceptance tests, visual design disetujui terhadap frame referensi, API provider diuji dengan data nyata atau fixture dinyatakan eksplisit, akses privat tertutup, error states jelas, dokumentasi deploy/rollback tersedia, dan owner dapat mengoperasikan website tanpa edit source rutin.

---

**Rujukan utama:** video yang diberikan pengguna dan deskripsi publik `Bikin Plan` dari https://www.ngodingpakeai.com/. PRD ini adalah perancangan orisinal berdasarkan kebutuhan proyek pengguna.
