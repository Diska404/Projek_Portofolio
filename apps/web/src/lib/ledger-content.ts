import type { PortfolioAudience } from "../../../../packages/contracts/src/portfolio";
import { publicProfile } from "./public-content";

export interface LedgerPortfolio {
  audience: PortfolioAudience;
  eyebrow: string;
  title: string;
  description: string;
  projects: { id: string; title: string; category: string }[];
  sources: { name: string; purpose: string; status: string }[];
}
// Selected on the server. Do not serialize the other audience's project registry.
export function ledgerContent(audience: PortfolioAudience): LedgerPortfolio {
  const creator = audience === "creator";
  return {
    audience,
    eyebrow: creator ? "COMMUNITY & PLAY" : "BEYOND THE COMMIT",
    title: creator ? "Berkarya. Berbagi. Bermain." : "Proses yang terus berjalan.",
    description: creator
      ? "Kontribusi komunitas dan cerita di balik game yang dimainkan. Publikasi, kerja proyek, dan waktu bermain punya catatannya sendiri."
      : "Terjemahan, pengembangan, riset, dan belajar. Aktivitas proyek tetap punya tempat, termasuk saat belum dipublikasikan ke GitHub.",
    projects: publicProfile(audience).projects.map(({ id, title, category }) => ({
      id,
      title,
      category,
    })),
    sources: creator
      ? [
          {
            name: "Jurnal komunitas",
            purpose: "Dukungan, review, acara, dan karya yang Anda catat.",
            status: "Menunggu jurnal",
          },
          {
            name: "Discord",
            purpose: "Ringkasan kontribusi di ruang yang memberi izin aplikasi.",
            status: "Belum terhubung",
          },
          {
            name: "Facebook",
            purpose: "Tautan dan aktivitas yang disetujui; kemampuan akun/Page perlu ditinjau.",
            status: "Menunggu peninjauan",
          },
        ]
      : [
          {
            name: "Sesi aplikasi",
            purpose: "Aktivitas dari editor dan alat kerja yang didukung, termasuk sebelum push.",
            status: "Belum terhubung",
          },
          {
            name: "Jurnal manual",
            purpose: "Terjemahan, riset, belajar, serta koreksi sesi dengan label catatan pemilik.",
            status: "Menunggu jurnal",
          },
          {
            name: "GitHub",
            purpose:
              "Pembuatan repository, commit, push, dan rilis sebagai jejak publikasi terpisah.",
            status: "Belum terhubung",
          },
        ],
  };
}
