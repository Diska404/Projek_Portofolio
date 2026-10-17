"use client";
import { useState } from "react";
import {
  publicObservationText,
  type AnalyticsCard,
  type PublicAnalytics,
} from "../../../../packages/contracts/src/public-analytics";
import { Icon } from "./icons";

function Metric({ item }: { item: AnalyticsCard }) {
  return (
    <article className="analytics-metric" data-metric={item.key}>
      <span className="metric-source">{item.source}</span>
      <h3>{item.title}</h3>
      <strong className="metric-value">{publicObservationText(item, item.unit)}</strong>
      <span className="metric-status">
        <i />
        {item.method === "manual_verified" ? "Menunggu catatan" : "Belum terhubung"}
      </span>
      <details>
        <summary>
          Definisi <Icon name="help" size={13} />
        </summary>
        <p>{item.definition}</p>
      </details>
    </article>
  );
}

export function PublicAnalyticsSection({ content }: { content: PublicAnalytics }) {
  const [period, setPeriod] = useState(30);
  const [account, setAccount] = useState("all");
  const [languageBasis, setLanguageBasis] = useState("time");
  const [activity, setActivity] = useState("Semua");
  const creator = content.audience === "creator";
  const selectedAccount = content.githubAccounts.find((item) => item.login === account);
  const accountLabel =
    selectedAccount?.login ??
    (creator ? (content.githubAccounts[0]?.login ?? "Belum diatur") : "Kedua akun");
  return (
    <section id="statistics" className="public-analytics" aria-labelledby="analytics-title">
      <div className="analytics-heading">
        <div>
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 id="analytics-title">{content.title}</h2>
          <p>{content.description}</p>
        </div>
        <div className="analytics-period" role="group" aria-label="Periode statistik">
          {[7, 30, 90].map((days) => (
            <button key={days} aria-pressed={days === period} onClick={() => setPeriod(days)}>
              {days} hari
            </button>
          ))}
        </div>
      </div>
      <div className="analytics-context">
        <span>
          <Icon name={creator ? "globe" : "branch"} size={14} />{" "}
          {creator ? "YouTube + komunitas" : "Engineering dashboard"}
        </span>
        <span>Asia/Jakarta</span>
        <span>Belum disinkronkan</span>
      </div>
      <p className="analytics-range" role="status">
        {period} hari terakhir · {accountLabel} (GitHub) · Cakupan data belum tersedia
      </p>
      <div className="analytics-kpis">
        {content.primary.map((item) => (
          <Metric key={item.key} item={item} />
        ))}
      </div>
      <div className="analytics-panels">
        <article className="analytics-panel cadence-panel">
          <div className="analytics-panel-heading">
            <span className="analytics-icon">
              <Icon name="activity" size={18} />
            </span>
            <div>
              <h3>{content.calendarTitle}</h3>
              <span>{period} hari terakhir</span>
            </div>
            <span className="analytics-tag">Belum ada observasi</span>
          </div>
          <p>{content.calendarDescription}</p>
          <div className="observation-empty">
            <Icon name="chart" size={28} />
            <strong>
              {creator ? "Setiap publikasi, satu jejak." : "Setiap langkah, tercatat."}
            </strong>
            <span>
              Grafik akan muncul setelah sumber terhubung dan cakupan periode terverifikasi.
            </span>
          </div>
          <div className="analytics-legend">
            <span className="unknown-marker" /> Belum diketahui <span>≠ tidak ada aktivitas</span>
          </div>
        </article>
        <article
          className="analytics-panel"
          aria-label={creator ? "Jenis publikasi" : "Penggunaan bahasa"}
        >
          <div className="analytics-panel-heading">
            <span className="analytics-icon">
              <Icon name={creator ? "globe" : "code"} size={18} />
            </span>
            <div>
              <h3>{creator ? "Ritme konten" : "Bahasa yang digunakan"}</h3>
              <span>{creator ? "Video · Live · Komunitas" : "Dua sudut pandang, dua sumber"}</span>
            </div>
          </div>
          {creator ? (
            <>
              <div className="publication-kinds">
                {content.primary.slice(0, 3).map((item) => (
                  <div key={item.key}>
                    <span>{item.title}</span>
                    <b>—</b>
                  </div>
                ))}
              </div>
              <p>
                Rekaman live dihitung sebagai live selesai. Jadwal dan siaran berjalan dipisahkan
                dari publikasi selesai.
              </p>
              <span className="analytics-note">
                <Icon name="file" size={14} /> Postingan menunggu catatan pemilik yang diverifikasi.
              </span>
            </>
          ) : (
            <>
              <div className="analytics-tabs" role="group" aria-label="Dasar penggunaan bahasa">
                <button
                  aria-pressed={languageBasis === "time"}
                  onClick={() => setLanguageBasis("time")}
                >
                  Durasi coding
                </button>
                <button
                  aria-pressed={languageBasis === "bytes"}
                  onClick={() => setLanguageBasis("bytes")}
                >
                  Komposisi kode
                </button>
              </div>
              <div className="language-empty">
                <Icon name={languageBasis === "time" ? "timer" : "code"} size={26} />
                <strong>
                  {languageBasis === "time"
                    ? "WakaTime belum terhubung"
                    : "GitHub Languages belum terhubung"}
                </strong>
                <span>
                  {languageBasis === "time"
                    ? "Durasi pemakaian bahasa saat coding, sesuai cakupan editor yang direkam."
                    : "Jumlah byte kode per bahasa pada repository yang dipilih. Bukan waktu penggunaan atau tingkat kemahiran."}
                </span>
              </div>
              <span className="analytics-note">
                Filter akun berlaku untuk GitHub. WakaTime memakai sumber coding tersendiri.
                Peringkat menunggu data nyata.
              </span>
            </>
          )}
        </article>
      </div>
      <article className="analytics-panel github-scope">
        <div className="analytics-panel-heading">
          <span className="analytics-icon">
            <Icon name="github" size={18} />
          </span>
          <div>
            <h3>{creator ? "Pengembangan untuk komunitas" : "Sumber aktivitas GitHub"}</h3>
            <span>{content.githubScope}</span>
          </div>
        </div>
        {!creator && (
          <div className="analytics-tabs" role="group" aria-label="Akun statistik GitHub">
            <button aria-pressed={account === "all"} onClick={() => setAccount("all")}>
              Kedua akun
            </button>
            {content.githubAccounts.map((item) => (
              <button
                key={item.login}
                aria-pressed={account === item.login}
                onClick={() => setAccount(item.login)}
              >
                {item.login}
              </button>
            ))}
          </div>
        )}
        <div className="analytics-account-grid">
          {content.githubAccounts
            .filter((item) => account === "all" || item.login === account)
            .map((item) => (
              <div className="analytics-account" key={item.login}>
                <Icon name="branch" size={18} />
                <div>
                  <strong>{item.login}</strong>
                  <span>GitHub belum terhubung</span>
                </div>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  referrerPolicy="no-referrer"
                  aria-label={`Profil GitHub ${item.login}`}
                >
                  Profil publik <Icon name="arrowUpRight" size={14} />
                </a>
              </div>
            ))}
        </div>
        <p>
          {creator
            ? "Aktivitas proyek komunitas akan muncul setelah daftar repository ditinjau dan disetujui."
            : "Commit yang sama pada repository yang sama hanya dihitung sekali dalam gabungan kedua akun. Commit dan push adalah aktivitas yang berbeda."}
        </p>
      </article>
      <div className="analytics-subheading">
        <h3>{creator ? "Dampak & keterlibatan" : "Bukti di balik pengembangan"}</h3>
        <span>{creator ? "Metrik periode, sesuai sumber" : "Kualitas kerja disertai konteks"}</span>
      </div>
      <div className={`analytics-kpis secondary-metrics ${creator ? "" : "engineering-evidence"}`}>
        {content.secondary.map((item) => (
          <Metric key={item.key} item={item} />
        ))}
      </div>
      <article className="analytics-panel activity-journal">
        <div className="analytics-subheading">
          <h3>{creator ? "Jurnal publikasi" : "Jejak pengembangan"}</h3>
          <span>
            {period} hari · {accountLabel}
          </span>
        </div>
        <div className="analytics-tabs" role="group" aria-label="Jenis aktivitas">
          {content.activityTypes.map((item) => (
            <button key={item} aria-pressed={activity === item} onClick={() => setActivity(item)}>
              {item}
            </button>
          ))}
        </div>
        <p role="status">
          {activity === "Semua" ? "Semua aktivitas" : activity} · Belum ada sumber terhubung untuk
          periode ini.
        </p>
      </article>
      <p className="analytics-footnote">
        <Icon name="shield" size={14} /> Sumber, cakupan, dan waktu pembaruan menyertai data. Angka
        nol hanya muncul jika sumber mengonfirmasinya.
      </p>
    </section>
  );
}
