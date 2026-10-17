// Server-side projection: never pass both audiences' registries to the browser.
import type {
  PublicAnalytics,
  AnalyticsCard,
} from "../../../../packages/contracts/src/public-analytics";
import type { PortfolioAudience } from "../../../../packages/contracts/src/portfolio";
function card(
  key: string,
  title: string,
  source: string,
  definition: string,
  unit: AnalyticsCard["unit"] = "count",
  method: AnalyticsCard["method"] = "provider",
): AnalyticsCard {
  return {
    key,
    title,
    source,
    definition,
    unit,
    method,
    value: null,
    state: "not_connected",
    coverage: "none",
    observedAt: null,
  };
}
export function analyticsContent(audience: PortfolioAudience): PublicAnalytics {
  if (audience === "creator")
    return {
      audience,
      eyebrow: "CREATOR ACTIVITY",
      title: "Konsistensi di balik kanal.",
      description:
        "Video, siaran langsung, dan percakapan dengan komunitas. Aktivitas kreator menjadi cerita utamanya.",
      githubAccounts: [{ login: "RaizeiID", href: "https://github.com/RaizeiID" }],
      primary: [
        card(
          "videos",
          "Video dipublikasikan",
          "YouTube Data",
          "Video publik non-live pada periode terpilih. Rekaman live dihitung terpisah; Shorts termasuk sampai ada klasifikasi terverifikasi.",
        ),
        card(
          "live",
          "Live selesai",
          "YouTube Live",
          "Siaran dengan waktu mulai dan selesai aktual. Jadwal atau live yang masih berlangsung tidak dihitung sebagai live selesai.",
        ),
        card(
          "posts",
          "Postingan komunitas",
          "Catatan terverifikasi",
          "Postingan yang dicatat dan diverifikasi pemilik dengan tanggal dan tautan. Belum ada catatan bukan berarti tidak pernah posting.",
          "count",
          "manual_verified",
        ),
        card(
          "publication-days",
          "Hari publikasi aktif",
          "Publikasi terverifikasi",
          "Hari unik di Asia/Jakarta dengan video, live selesai, atau postingan terverifikasi. Satu hari tetap satu hari walau ada beberapa publikasi.",
          "days",
        ),
      ],
      secondary: [
        card(
          "views",
          "Penayangan periode",
          "YouTube Analytics",
          "Penayangan dalam periode terpilih dari data kanal yang diizinkan; bukan total penayangan sepanjang masa.",
        ),
        card(
          "watch-time",
          "Waktu tonton",
          "YouTube Analytics",
          "Waktu tonton pada periode terpilih. Memerlukan akses pemilik kanal dan persetujuan publikasi.",
          "seconds",
        ),
        card(
          "live-time",
          "Durasi siaran",
          "YouTube Live",
          "Durasi live selesai dari waktu aktual, bukan durasi jadwal.",
          "seconds",
        ),
        card(
          "engagement",
          "Interaksi konten",
          "YouTube Analytics",
          "Interaksi sesuai definisi sumber pada periode yang tercakup; bukan skor popularitas atau estimasi.",
        ),
      ],
      calendarTitle: "Ritme publikasi",
      calendarDescription: "Kalender video, live, dan postingan yang benar-benar terverifikasi.",
      activityTypes: ["Semua", "Video", "Live", "Postingan"],
      githubScope:
        "Hanya RaizeiID · repository komunitas yang disetujui. Pilihan repository belum diatur.",
    };
  return {
    audience,
    eyebrow: "GITHUB & CODING",
    title: "Jejak kode dan publikasi.",
    description:
      "Dua akun GitHub dan sumber coding tersendiri. Kontribusi dan publikasi melengkapi catatan proses kerja, dengan cakupan yang tetap terlihat.",
    githubAccounts: ["Diska404", "RaizeiID"].map((login) => ({
      login,
      href: `https://github.com/${login}`,
    })),
    primary: [
      card(
        "contributions",
        "Kontribusi GitHub",
        "GitHub contributions",
        "Kontribusi mengikuti kategori dan atribusi GitHub. Bukan jumlah push atau jumlah perubahan file.",
      ),
      card(
        "commits",
        "Commit tercatat",
        "GitHub commit history",
        "Commit teratribusi di repository yang disetujui. Gabungan dua akun harus dideduplikasi berdasarkan repository dan SHA.",
      ),
      card(
        "coding-time",
        "Waktu coding",
        "WakaTime",
        "Durasi coding aktif yang terekam oleh editor/plugin, bukan seluruh waktu komputer menyala.",
        "seconds",
      ),
      card(
        "active-days",
        "Hari aktif GitHub",
        "GitHub contributions",
        "Hari dengan kontribusi yang terverifikasi pada cakupan terpilih. Data yang belum tercakup tidak dianggap nol.",
        "days",
      ),
    ],
    secondary: [
      card(
        "pushes",
        "Push teramati",
        "GitHub activity",
        "Event push dalam cakupan feed yang berhasil direkam. Satu push dapat berisi beberapa commit; feed bukan arsip sepanjang masa. Cakupan tidak lengkap tetap belum tersedia.",
      ),
      card(
        "pull-requests",
        "Pull requests",
        "GitHub",
        "PR yang dibuat pada periode dan repository yang disetujui. Status dibuat, digabung, dan ditutup tetap dibedakan.",
      ),
      card(
        "reviews",
        "Code reviews",
        "GitHub",
        "Review yang teratribusi kepada akun terpilih; bukan sekadar komentar atau pembukaan halaman.",
      ),
      card(
        "issues",
        "Issues dibuat",
        "GitHub",
        "Issue yang dibuat akun pada periode dan repository yang disetujui. Status dan penyelesaian perlu konteks terpisah.",
      ),
      card(
        "releases",
        "Rilis dipublikasikan",
        "GitHub releases",
        "Rilis yang dipublikasikan pada repository terpilih dengan atribusi yang dapat diverifikasi.",
      ),
      card(
        "ci-checks",
        "Hasil pengujian CI",
        "GitHub Actions",
        "Hasil workflow pada repository yang disetujui. Keberhasilan build tidak dipakai sebagai skor keahlian.",
      ),
    ],
    calendarTitle: "Konsistensi kontribusi",
    calendarDescription:
      "Kalender kontribusi dengan cakupan dan sumber per akun yang dapat diperiksa.",
    activityTypes: ["Semua", "Commit", "Pull request", "Review", "Rilis"],
    githubScope:
      "Diska404 + RaizeiID · tampil terpisah. Gabungan memerlukan deduplikasi, bukan menjumlahkan hitungan mentah.",
  };
}
