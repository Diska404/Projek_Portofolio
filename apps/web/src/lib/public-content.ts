// Imported by Server Components only. Never serialize the full audience registry.
import type {
  PortfolioAudience,
  PortfolioProfile,
} from "../../../../packages/contracts/src/portfolio";

const communityProjects = [
  {
    id: "gfl2-localization",
    title: "GFL2 Bahasa Indonesia",
    category: "Komunitas",
    description:
      "Ruang untuk memperkenalkan proyek terjemahan GFL2 bagi komunitas Indonesia. Detail, materi, dan tautan rilis akan dilengkapi oleh pemilik.",
    tags: ["Terjemahan", "Komunitas"],
    artwork: "notes" as const,
  },
  {
    id: "translation-app",
    title: "Aplikasi penerjemah",
    category: "Aplikasi",
    description:
      "Tempat untuk mendokumentasikan aplikasi penerjemah dan proses pengembangannya. Nama aplikasi, fitur, dan tautan belum dipublikasikan.",
    tags: ["Aplikasi", "Lokalisasi"],
    artwork: "orbit" as const,
  },
];

export function publicProfile(audience: PortfolioAudience): PortfolioProfile {
  if (audience === "creator") {
    return {
      audience,
      displayName: "Raizei",
      label: "KREATOR & KOMUNITAS",
      intro: "Cerita, bahasa, dan hal-hal yang kita bangun bersama.",
      headline: ["Menerjemahkan cerita.", "Menghubungkan komunitas."],
      description:
        "Aktivitas video, live streaming, dan cerita komunitas di YouTube. Di baliknya: GFL2 Bahasa Indonesia, aplikasi penerjemah, dan pengembangan bersama komunitas.",
      projectIntro: "Karya untuk komunitas.",
      projects: communityProjects,
      socials: [
        { label: "YouTube", detail: "Tautan kanal menunggu pengaturan", href: null },
        { label: "GitHub", detail: "RaizeiID", href: "https://github.com/RaizeiID" },
      ],
    };
  }
  return {
    audience,
    displayName: "Profil pribadi",
    label: "BELAJAR · MEMBANGUN · BERBAGI",
    intro: "Satu tempat untuk setiap langkah yang berarti.",
    headline: ["Karya yang bertumbuh.", "Proses yang terlihat."],
    description:
      "Proses membangun, menerjemahkan, dan belajar—termasuk pekerjaan sebelum rilis. Dilengkapi jejak GitHub, penggunaan bahasa, dan pengalaman AI dengan sumber yang jelas.",
    projectIntro: "Setiap proyek, satu cerita.",
    projects: [
      {
        id: "leva-assistant",
        title: "Leva — Asisten AI pribadi",
        category: "AI & Sistem",
        description:
          "Pengembangan asisten Windows dengan suara lokal, agent, memori, dan akses dari HP. Jelajahi arsitektur serta hubungan modul dari snapshot 0.28.0, berikut batas pengujiannya.",
        tags: ["Python", "Agent", "ASR / TTS", "Web"],
        artwork: "neural",
        href: "/projects/leva",
      },
      {
        id: "college-work",
        title: "Proyek perkuliahan",
        category: "Kampus",
        description:
          "Ruang untuk proyek dan tugas kampus pilihan. Judul, dokumentasi, teknologi, dan hasilnya belum ditambahkan.",
        tags: ["Perkuliahan", "Dokumentasi"],
        artwork: "atlas",
      },
      ...communityProjects,
    ],
    socials: [
      { label: "GitHub", detail: "RaizeiID", href: "https://github.com/RaizeiID" },
      { label: "YouTube", detail: "Tautan kanal menunggu pengaturan", href: null },
      { label: "Profil lainnya", detail: "Tautan sosial belum ditambahkan", href: null },
    ],
  };
}
