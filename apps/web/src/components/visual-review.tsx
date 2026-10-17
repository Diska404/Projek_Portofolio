"use client";
import { useState } from "react";
import {
  calendarValues,
  calendarSummary,
  type DailyValue,
  type CompositionValue,
} from "../../../../packages/contracts/src/visual-metrics";
import { ActivityCalendar, CompositionBar } from "./evidence-charts";
import { ReviewBar } from "./shared";
import { Icon, type IconName } from "./icons";

const examples = {
  work: {
    label: "Proses proyek",
    unit: "menit",
    title: "Aktivitas proyek",
    composition: "Sumber durasi kerja",
    categories: ["Otomatis saja", "Jurnal saja", "Irisan keduanya"],
  },
  ai: {
    label: "Token AI",
    unit: "token",
    title: "Aktivitas token AI",
    composition: "Sumber token tercatat",
    categories: ["AI cloud", "AI lokal", "Sumber belum teridentifikasi"],
  },
  publishing: {
    label: "Publikasi komunitas",
    unit: "publikasi",
    title: "Aktivitas publikasi",
    composition: "Jenis publikasi",
    categories: ["Video non-live", "Live selesai", "Postingan terverifikasi"],
  },
  games: {
    label: "Waktu game",
    unit: "menit",
    title: "Riwayat bermain contoh",
    composition: "Pembagian waktu contoh",
    categories: ["Game contoh A", "Game contoh B", "Game contoh C"],
  },
};
type Example = keyof typeof examples;
// Synthetic fixtures belong only to the gated review component, never public DTOs.
function samplePoints(endDate: string, days: number, metric: Example, gaps: boolean): DailyValue[] {
  return calendarValues(endDate, days, []).map((point, index) => {
    const seed = (index * 17 + 13) % 23;
    const active = seed > 5 && index % 11 !== 0;
    const value = active
      ? metric === "ai"
        ? (seed + 1) * 1300
        : metric === "publishing"
          ? (seed % 4) + 1
          : seed * 7 + 15
      : 0;
    const missing = gaps && index > days / 2 && index % 29 === 0;
    return { ...point, value: missing ? null : value, coverage: missing ? "none" : "complete" };
  });
}
export function VisualReview() {
  const [metric, setMetric] = useState<Example>("work");
  const [days, setDays] = useState(365);
  const [sample, setSample] = useState(true);
  const [gaps, setGaps] = useState(false);
  const example = examples[metric];
  const points = samplePoints("2026-10-18", days, metric, gaps);
  const summary = calendarSummary(sample ? points : calendarValues("2026-10-18", days, []));
  const first = summary.total === null ? null : Math.floor(summary.total * 0.6);
  const second = summary.total === null ? null : Math.floor(summary.total * 0.25);
  const values = [first, second, summary.total === null ? null : summary.total - first! - second!];
  const composition: CompositionValue[] = example.categories.map((label, index) => ({
    key: String(index),
    label,
    value: values[index] ?? null,
  }));
  const sources: { label: string; icon: IconName }[] = [
    { label: "GitHub", icon: "github" },
    { label: "Sesi editor", icon: "code" },
    { label: "AI cloud", icon: "globe" },
    { label: "AI lokal", icon: "cpu" },
    { label: "YouTube", icon: "activity" },
    { label: "Steam", icon: "timer" },
  ];
  return (
    <>
      <ReviewBar active="workspace" />
      <main id="main" className="visual-review">
        <header className="visual-review-header">
          <span className="visual-monogram">
            <Icon name="activity" size={30} />
          </span>
          <span className="eyebrow">DEVPULSE · VISUAL LAB</span>
          <h1>Setiap langkah, terlihat.</h1>
          <p>Kalender aktivitas dan komposisi data, dengan sumber serta cakupan yang jelas.</p>
        </header>
        <div className="visual-disclosure" role="note">
          <Icon name="help" size={18} />
          <div>
            <strong>
              {sample ? "SIMULASI VISUAL · BUKAN RIWAYAT AKUN" : "PRATINJAU SUMBER BELUM TERHUBUNG"}
            </strong>
            <p>
              Angka, pola kalender, dan kategori contoh di halaman ini hanya untuk meninjau desain.
              Tidak dibaca dari akun Anda, tidak disimpan, dan tidak dipublikasikan sebagai
              statistik.
            </p>
          </div>
        </div>
        <div className="visual-review-controls">
          <label>
            Indikator
            <select
              aria-label="Indikator diagram"
              value={metric}
              onChange={(event) => setMetric(event.target.value as Example)}
            >
              {Object.entries(examples).map(([key, item]) => (
                <option value={key} key={key}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Rentang
            <select
              aria-label="Rentang diagram"
              value={days}
              onChange={(event) => setDays(Number(event.target.value))}
            >
              {[30, 90, 180, 365].map((range) => (
                <option key={range} value={range}>
                  {range} hari
                </option>
              ))}
            </select>
          </label>
          <div className="analytics-tabs" role="group" aria-label="Sumber pratinjau">
            <button aria-pressed={sample} onClick={() => setSample(true)}>
              Simulasi
            </button>
            <button aria-pressed={!sample} onClick={() => setSample(false)}>
              Belum terhubung
            </button>
          </div>
          <label className="visual-gap-control">
            <input
              type="checkbox"
              checked={gaps}
              disabled={!sample}
              onChange={(event) => setGaps(event.target.checked)}
            />{" "}
            Tampilkan celah data
          </label>
        </div>
        <div className="visual-summary-strip">
          <div>
            <b>{summary.total === null ? "—" : summary.total.toLocaleString("id-ID")}</b>
            <span>Total {example.unit} dalam rentang</span>
          </div>
          <div>
            <b>{summary.activeDays ?? "—"}</b>
            <span>Hari aktif tercatat</span>
          </div>
          <div>
            <b>{summary.longestStreak === null ? "—" : `${summary.longestStreak} hari`}</b>
            <span>Streak terpanjang dalam rentang</span>
          </div>
          <div>
            <b>{sample ? "Simulasi" : "Belum terhubung"}</b>
            <span>Sumber data</span>
          </div>
        </div>
        <ActivityCalendar
          key={metric}
          title={example.title}
          endDate="2026-10-18"
          days={days}
          observations={points}
          state={sample ? "sample" : "not_connected"}
          unit={example.unit}
          description="Kalender contoh untuk meninjau intensitas, hari aktif, dan celah cakupan."
        />
        <CompositionBar
          key={`composition-${metric}`}
          title={example.composition}
          items={composition}
          unit={example.unit}
          state={sample ? "sample" : "not_connected"}
          description="Kategori contoh membentuk satu total. Persentase hanya tersedia jika seluruh nilai diketahui."
        />
        <section className="visual-source-section" aria-label="Rancangan sumber data">
          <h2>Sumber yang akan dihubungkan</h2>
          <div className="visual-source-grid">
            {sources.map((source) => (
              <div key={source.label}>
                <span>
                  <Icon name={source.icon} size={21} />
                </span>
                <b>{source.label}</b>
                <small>Belum terhubung</small>
              </div>
            ))}
          </div>
        </section>
        <p className="chart-method">
          Nol terverifikasi berbeda dari hari yang belum diketahui. Durasi kerja, token AI,
          publikasi, dan waktu game memakai satuan masing-masing. Contoh waktu game bukan
          rekonstruksi dari total Steam sepanjang masa.
        </p>
        <a className="text-link accent" href="/#journey">
          Kembali ke portofolio <Icon name="arrowRight" size={15} />
        </a>
      </main>
    </>
  );
}
