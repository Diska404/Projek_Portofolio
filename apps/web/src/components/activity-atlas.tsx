"use client";
import { useState } from "react";
import type { LedgerPortfolio } from "../lib/ledger-content";
import { ActivityCalendar, CompositionBar, UnconnectedWorkCharts } from "./evidence-charts";
import { Icon } from "./icons";

const stages = [
  { name: "Dikenal", detail: "Model yang Anda kenali, berdasarkan pernyataan sendiri." },
  { name: "Dipelajari", detail: "Catatan belajar, eksperimen, dan hal yang Anda pahami." },
  { name: "Dicoba", detail: "Percobaan model dengan sumber bukti yang dijelaskan." },
  {
    name: "Diterapkan",
    detail: "Pengalaman pada proyek, peran model, hasil, dan tinjauan manusia.",
  },
];
function UnknownMetric({ title, context }: { title: string; context: string }) {
  return (
    <div className="atlas-metric">
      <span>{title}</span>
      <strong>—</strong>
      <small>{context}</small>
    </div>
  );
}
export function ActivityAtlas({
  content,
  showReview,
  calendarEnd,
}: {
  content: LedgerPortfolio;
  showReview: boolean;
  calendarEnd: string;
}) {
  const creator = content.audience === "creator";
  const [view, setView] = useState("work");
  const [project, setProject] = useState("all");
  const [period, setPeriod] = useState(30);
  const [stage, setStage] = useState("Dipelajari");
  const [aiSource, setAiSource] = useState("Semua sumber");
  const [gameBasis, setGameBasis] = useState("14 hari terakhir");
  const activeStage = stages.find((item) => item.name === stage);
  return (
    <section id="journey" className="activity-atlas" aria-labelledby="atlas-title">
      <div className="atlas-intro">
        <span className="eyebrow">{content.eyebrow}</span>
        <h2 id="atlas-title">{content.title}</h2>
        <p>{content.description}</p>
      </div>
      <div className="atlas-toolbar">
        <div className="analytics-tabs" role="group" aria-label="Ruang aktivitas">
          <button aria-pressed={view === "work"} onClick={() => setView("work")}>
            {creator ? "Kontribusi komunitas" : "Proses proyek"}
          </button>
          <button aria-pressed={view === "extra"} onClick={() => setView("extra")}>
            {creator ? "Game & Steam" : "Pengalaman AI"}
          </button>
        </div>
        <span>
          <Icon name="shield" size={13} /> Ringkasan harian · Asia/Jakarta
        </span>
      </div>
      {view === "work" ? (
        <div className="atlas-view" data-atlas-view="work">
          <div className="atlas-work-heading">
            <div>
              <h3>
                {creator
                  ? "Karya untuk orang-orang di sekitarnya."
                  : "Pekerjaan lebih luas dari riwayat push."}
              </h3>
              <p>Sesi otomatis + jurnal manual. Durasi yang tumpang tindih dihitung satu kali.</p>
            </div>
            <label>
              Periode
              <select
                aria-label="Periode proses"
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
              >
                {[7, 30, 90, 180, 365].map((days) => (
                  <option key={days} value={days}>
                    {days} hari
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="atlas-metrics">
            <UnknownMetric title="Hari berkarya" context="Menunggu sesi teratribusi" />
            <UnknownMetric title="Durasi kerja tercatat" context="Gabungan interval aktif" />
            <UnknownMetric title="Catatan sesi" context="Otomatis dan catatan pemilik" />
            <UnknownMetric title="Proyek aktif tercatat" context="Mengikuti cakupan sumber" />
          </div>
          <div className="atlas-project-controls">
            <label htmlFor="atlas-project">Fokus proyek</label>
            <select id="atlas-project" value={project} onChange={(e) => setProject(e.target.value)}>
              <option value="all">Semua proyek pilihan</option>
              {content.projects.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
            <span role="status">{period} hari · Cakupan belum tersedia</span>
          </div>
          <UnconnectedWorkCharts endDate={calendarEnd} days={period} />
          <div className="atlas-projects">
            {content.projects
              .filter((item) => project === "all" || item.id === project)
              .map((item) => (
                <article key={item.id} className="atlas-project" data-ledger-project={item.id}>
                  <div className="atlas-project-heading">
                    <span className="analytics-icon">
                      <Icon name="folder" size={18} />
                    </span>
                    <div>
                      <span>{item.category}</span>
                      <h4>{item.title}</h4>
                    </div>
                    <span className="atlas-pending">Belum ada sesi</span>
                  </div>
                  <div className="atlas-project-facts">
                    <span>
                      Durasi tercatat <b>—</b>
                    </span>
                    <span>
                      Hari aktif <b>—</b>
                    </span>
                    <span>
                      Hasil ditinjau <b>—</b>
                    </span>
                  </div>
                  <p>
                    Catatan proses akan muncul setelah sumber dihubungkan atau jurnal disetujui.
                  </p>
                  <div className="atlas-language-labels">
                    <span>Bahasa kode · belum tercatat</span>
                    <span>Bahasa terjemahan · belum tercatat</span>
                  </div>
                </article>
              ))}
          </div>
          <div className="atlas-method-strip">
            <Icon name="activity" size={18} />
            <p>
              <b>Terlihat juga sebelum rilis.</b> Menerjemahkan, meninjau hasil, dan mempelajari
              pendekatan dicatat sebagai proses. Commit, push, dan rilis tetap menjadi jejak
              publikasi.
            </p>
            {showReview && (
              <span className="atlas-review-links">
                <a href="/preview/activity">
                  Tinjau cara hitung <Icon name="arrowUpRight" size={14} />
                </a>
                <a href="/preview/visuals">
                  Tinjau diagram <Icon name="arrowUpRight" size={14} />
                </a>
              </span>
            )}
          </div>
          <div className="atlas-sources">
            {content.sources.map((source) => (
              <div key={source.name}>
                <span className="atlas-source-status">{source.status}</span>
                <h4>{source.name}</h4>
                <p>{source.purpose}</p>
              </div>
            ))}
          </div>
          <p className="atlas-footnote">
            Durasi menunjukkan aktivitas yang berhasil dicatat. Hari tanpa data belum tentu hari
            tanpa pekerjaan; waktu kerja tidak menentukan persentase penyelesaian proyek.
          </p>
        </div>
      ) : creator ? (
        <div className="atlas-view" data-atlas-view="games">
          <div className="atlas-work-heading">
            <div>
              <h3>Game yang menemani perjalanan.</h3>
              <p>Library dan waktu bermain yang Anda setujui dari Steam.</p>
            </div>
            <span className="atlas-pending">Steam belum terhubung</span>
          </div>
          <div className="atlas-metrics">
            <UnknownMetric title="Game dalam cakupan" context="Daftar yang diizinkan" />
            <UnknownMetric title="Waktu bermain" context={gameBasis} />
            <UnknownMetric title="Paling sering dimainkan" context="Peringkat menunggu data" />
          </div>
          <div className="atlas-ranking-header">
            <h4>Urutan berdasarkan waktu bermain</h4>
            <div className="analytics-tabs" role="group" aria-label="Dasar waktu Steam">
              {["14 hari terakhir", "Sepanjang masa"].map((basis) => (
                <button
                  key={basis}
                  aria-pressed={gameBasis === basis}
                  onClick={() => setGameBasis(basis)}
                >
                  {basis}
                </button>
              ))}
            </div>
          </div>
          <CompositionBar
            title="Komposisi waktu per game"
            unit="menit"
            items={[]}
            description={`${gameBasis} · Kategori menunggu library yang disetujui; tidak ada judul game perkiraan.`}
          />
          <div className="atlas-empty">
            <Icon name="globe" size={30} />
            <h4>Library belum tersedia.</h4>
            <p role="status">
              {gameBasis} · Hubungkan profil Steam dan pilih game yang boleh tampil. Tidak ada judul
              atau jam bermain perkiraan.
            </p>
          </div>
          <div className="atlas-method-strip">
            <Icon name="timer" size={18} />
            <p>
              Waktu Steam mengikuti laporan Steam, termasuk saat game berjalan. Riwayat harian mulai
              terbentuk dari snapshot yang tercatat; total sepanjang masa tidak dibagi menjadi
              hari-hari perkiraan.
            </p>
          </div>
          <p className="atlas-footnote">
            Game di luar Steam memakai sumber atau jurnal tersendiri. Status online, jadwal sesi,
            dan identitas akun lain tidak ditampilkan.
          </p>
        </div>
      ) : (
        <div className="atlas-view" data-atlas-view="ai">
          <div className="atlas-work-heading">
            <div>
              <h3>Pengalaman AI, dengan konteks.</h3>
              <p>Cloud maupun lokal: apa yang dipelajari, dicoba, dan diterapkan.</p>
            </div>
            <label>
              Sumber
              <select
                aria-label="Sumber pengalaman AI"
                value={aiSource}
                onChange={(e) => setAiSource(e.target.value)}
              >
                {["Semua sumber", "AI cloud", "AI lokal"].map((source) => (
                  <option key={source}>{source}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="atlas-metrics">
            <UnknownMetric
              title="Model dengan bukti penggunaan"
              context="Inferensi berhasil yang tercatat"
            />
            <UnknownMetric
              title="Model dalam jurnal belajar"
              context="Pernyataan pemilik + bukti"
            />
            <UnknownMetric title="Permintaan AI tercatat" context="Tidak sama dengan sesi kerja" />
          </div>
          <div className="atlas-stages" role="group" aria-label="Tahap pengalaman AI">
            {stages.map((item) => (
              <button
                key={item.name}
                aria-pressed={stage === item.name}
                onClick={() => setStage(item.name)}
              >
                <span>{item.name}</span>
                <b>—</b>
              </button>
            ))}
          </div>
          <div className="atlas-chart-period">
            <label>
              Periode grafik AI{" "}
              <select
                aria-label="Periode grafik AI"
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
              >
                {[7, 30, 90, 180, 365].map((days) => (
                  <option key={days} value={days}>
                    {days} hari
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="evidence-chart-stack">
            <ActivityCalendar
              title="Kalender penggunaan AI"
              endDate={calendarEnd}
              days={period}
              unit="permintaan"
              description={`${aiSource} · Inferensi tercatat, terpisah dari tahap katalog pengalaman.`}
            />
            <CompositionBar
              title="Komposisi sumber inferensi"
              unit="permintaan"
              description="Penggunaan cloud, lokal, dan sumber yang belum teridentifikasi."
              items={[
                { key: "cloud", label: "AI cloud", value: null },
                { key: "local", label: "AI lokal", value: null },
                { key: "unidentified", label: "Sumber belum teridentifikasi", value: null },
              ]}
            />
          </div>
          <div className="atlas-empty">
            <Icon name="cpu" size={30} />
            <h4>
              {stage} · {aiSource}
            </h4>
            <p role="status">
              {activeStage?.detail} Belum ada catatan pengalaman yang dipublikasikan.
            </p>
          </div>
          <div className="atlas-ai-fields">
            <span>Provider & aplikasi</span>
            <span>Model & versi</span>
            <span>Runtime & varian lokal</span>
            <span>Peran di proyek</span>
            <span>Sumber bukti</span>
            <span>Tinjauan manusia</span>
          </div>
          <div className="atlas-method-strip">
            <Icon name="shield" size={18} />
            <p>
              Model diunduh atau dimuat belum berarti sudah digunakan. Varian kuantisasi dicatat di
              bawah identitas model yang sama. Label pengalaman menyertakan sumber bukti dan
              pernyataan pemilik.
            </p>
          </div>
          <p className="atlas-footnote">
            Model yang tidak dilaporkan sumber tetap tidak diketahui. Prompt, isi percakapan, path
            lokal, dan kunci API tidak menjadi bagian profil publik.
          </p>
        </div>
      )}
    </section>
  );
}
