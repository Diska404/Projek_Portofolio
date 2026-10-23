import type { Metadata } from "next";
import Link from "next/link";
import { LevaModuleGraph } from "@/components/leva-module-graph";
import { levaSnapshot as snapshot } from "@/lib/leva-architecture";
import "./leva.css";

export const metadata: Metadata = {
  title: "Leva — Suara, konteks, dan tindakan",
  description:
    "Catatan pengembangan asisten AI pribadi Leva: arsitektur desktop, agent, suara lokal, dan akses HP, beserta graf hubungan modul dan batas buktinya.",
};

export default function LevaProject() {
  return (
    <main id="main" className="leva-project">
      <nav className="leva-project-nav" aria-label="Navigasi proyek">
        <Link href="/#work">← Portofolio pribadi</Link>
        <span>
          PROJECT NOTES <b>/ 01</b>
        </span>
        <a
          href={`${snapshot.repository}/tree/main/docs/architecture`}
          target="_blank"
          rel="noreferrer"
        >
          Dokumentasi GitHub ↗
        </a>
      </nav>
      <header className="leva-hero">
        <div>
          <div className="leva-project-kicker">
            <span /> AI PRIBADI · DALAM PENGEMBANGAN
          </div>
          <h1>
            LEVA<span>.</span>
          </h1>
          <p className="leva-hero-line">
            Suara yang memahami.
            <br />
            <em>Sistem yang membantu.</em>
          </p>
          <p className="leva-hero-copy">
            Membangun asisten di laptop yang menghubungkan percakapan, konteks, dan pekerjaan. Satu
            mesin, beberapa ruang: Asisten untuk bertindak, Chat untuk berpikir, dan Secret untuk
            percakapan personal.
          </p>
          <div className="leva-project-actions">
            <a className="button primary" href="#architecture">
              Jelajahi arsitektur ↓
            </a>
            <a className="button" href="/leva/graph.html" target="_blank" rel="noreferrer">
              Buka graf lengkap ↗
            </a>
          </div>
        </div>
        <div className="leva-hero-mark" aria-hidden="true">
          <div className="leva-orbit leva-orbit-one" />
          <div className="leva-orbit leva-orbit-two" />
          <div className="leva-orbit leva-orbit-three" />
          <span>L</span>
          <small>VOICE / CONTEXT / ACTION</small>
          <i className="leva-star star-one" />
          <i className="leva-star star-two" />
          <i className="leva-star star-three" />
        </div>
      </header>
      <div className="leva-snapshot-line">
        <span>SNAPSHOT PENGEMBANGAN {snapshot.version}</span>
        <span>{snapshot.date} · analisis statis</span>
      </div>
      <dl className="leva-metrics">
        {[
          [snapshot.files, "berkas dipetakan"],
          [snapshot.nodes.toLocaleString("id-ID"), "node"],
          [snapshot.edges.toLocaleString("id-ID"), "hubungan"],
          [snapshot.communities, "kelompok modul"],
        ].map(([value, label]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <section id="architecture" className="leva-architecture">
        <div className="leva-section-heading">
          <div>
            <span className="eyebrow">DI BALIK PERCAKAPAN</span>
            <h2>Bagaimana semuanya terhubung.</h2>
          </div>
          <p>
            Pilih modul untuk melihat perannya. Ringkasan ini menyoroti jalur produksi agar alur
            utama mudah dibaca.
          </p>
        </div>
        <LevaModuleGraph />
      </section>
      <section className="leva-capabilities" aria-label="Fokus pengembangan">
        <article>
          <span>01 / PERCAKAPAN</span>
          <h3>Ruang dengan peran berbeda.</h3>
          <p>
            Riwayat per ruang dan pilihan model. Chat Auto membedakan arah personal dan informasi;
            perpindahan dari Secret meminta persetujuan untuk menyalin konteks.
          </p>
        </article>
        <article>
          <span>02 / PEKERJAAN</span>
          <h3>Agent yang membaca hasil.</h3>
          <p>
            Alat host, progres, dan jurnal tugas menghubungkan tujuan dengan tindakan. Terminal,
            berkas, browser, dan workflow gambar memiliki batas serta pemeriksaan masing-masing.
          </p>
        </article>
        <article>
          <span>03 / SUARA & HP</span>
          <h3>Antarmuka, satu mesin.</h3>
          <p>
            Transkrip, teks, terjemahan, dan sintesis memiliki tahap sendiri. Web/HP memakai
            pelaksana laptop yang sama, dengan mikrofon HP berbasis tombol rekam.
          </p>
        </article>
      </section>
      <section className="leva-evidence" aria-labelledby="evidence-title">
        <div>
          <span className="eyebrow">BUKTI & BATAS</span>
          <h2 id="evidence-title">Peta yang bisa diperiksa.</h2>
          <p>
            Angka di halaman ini berasal dari graf kode, bukan statistik pemakaian atau jaminan
            semua fitur stabil. Pengembangan tetap membutuhkan pengujian pekerjaan nyata.
          </p>
          <a href="/leva/GRAPH_REPORT.md" download>
            Unduh laporan analisis ↓
          </a>
        </div>
        <ul>
          <li>
            <strong>Snapshot berbeda.</strong> Graf berasal dari pengembangan 0.28.0; source repo
            Leva yang dipublikasikan masih import historis 0.3.0.
          </li>
          <li>
            <strong>Graf memiliki batas.</strong> Ada 1.056 referensi endpoint belum terselesaikan
            pada ekstraksi mentah, 13 self-loop dan 189 penggabungan hubungan. Graf akhir memiliki
            nol endpoint tidak valid.
          </li>
          <li>
            <strong>Belum seluruh berkas.</strong> Satu JSON, dua CSS dan satu web manifest belum
            terwakili. Hubungan INFERRED/AMBIGUOUS perlu verifikasi.
          </li>
          <li>
            <strong>Uji langsung tetap diperlukan.</strong> Duplex, alokasi GPU, ketepatan routing,
            dan keberhasilan tugas kompleks tidak dibuktikan oleh graf ini.
          </li>
        </ul>
      </section>
      <footer className="leva-project-footer">
        <span>LEVA / ENGINEERING NOTES</span>
        <div>
          <a href="/leva/graph.json" download>
            Data graf JSON
          </a>
          <a href="/leva/SNAPSHOT.json">Provenance</a>
          <a
            href={`${snapshot.repository}/tree/main/docs/architecture`}
            target="_blank"
            rel="noreferrer"
          >
            Repository ↗
          </a>
        </div>
      </footer>
    </main>
  );
}
