"use client";
import { useState } from "react";
import {
  summarizeWork,
  type WorkSession,
} from "../../../../packages/contracts/src/activity-ledger";
import { ReviewBar } from "./shared";

export function ActivityMethodReview() {
  const [automatic, setAutomatic] = useState(45);
  const [manual, setManual] = useState(30);
  const [offset, setOffset] = useState(15);
  const base = Date.parse("2026-10-17T09:00:00+07:00");
  const session = (
    id: string,
    start: number,
    duration: number,
    provenance: WorkSession["provenance"],
  ): WorkSession => ({
    connector: "simulation",
    accountAlias: "example",
    externalId: id,
    revision: 1,
    projectId: "example",
    kind: "translation",
    provenance,
    startedAt: new Date(base + start * 60000).toISOString(),
    endedAt: new Date(base + (start + duration) * 60000).toISOString(),
    active: true,
    approvedFor: ["personal"],
    language: { domain: "natural", name: "Bahasa contoh" },
  });
  const result = summarizeWork(
    [
      session("auto", 0, automatic, "automatic"),
      session("manual", offset, manual, "owner_journal"),
    ],
    [{ projectId: "example", audiences: ["personal"], publicProgrammingLanguages: [] }],
    "personal",
    { start: "2026-10-17T00:00:00+07:00", end: "2026-10-18T00:00:00+07:00" },
  );
  return (
    <>
      <ReviewBar active="workspace" />
      <main id="main" className="method-review">
        <span className="eyebrow">SIMULASI METODE · BUKAN RIWAYAT AKUN</span>
        <h1>Satu proses, satu durasi.</h1>
        <p>
          Geser dua sesi contoh untuk meninjau cara sesi otomatis dan jurnal digabungkan. Tidak ada
          data yang disimpan atau dipublikasikan. Ini bukan formulir jurnal operasional.
        </p>
        <div className="atlas-view">
          <div className="method-controls">
            <label>
              Sesi otomatis: {automatic} menit
              <input
                aria-label="Durasi sesi otomatis contoh"
                type="range"
                min="15"
                max="120"
                step="15"
                value={automatic}
                onChange={(e) => setAutomatic(Number(e.target.value))}
              />
            </label>
            <label>
              Jurnal manual: {manual} menit
              <input
                aria-label="Durasi jurnal manual contoh"
                type="range"
                min="15"
                max="120"
                step="15"
                value={manual}
                onChange={(e) => setManual(Number(e.target.value))}
              />
            </label>
            <label>
              Jarak mulai jurnal: {offset} menit
              <input
                aria-label="Jarak mulai jurnal contoh"
                type="range"
                min="0"
                max="120"
                step="15"
                value={offset}
                onChange={(e) => setOffset(Number(e.target.value))}
              />
            </label>
          </div>
          <p className="method-result" role="status">
            {result.automaticSeconds / 60} + {result.declaredSeconds / 60} −{" "}
            {result.overlapSeconds / 60} menit tumpang tindih = {result.observedSeconds / 60} menit
            tercatat
          </p>
          <p className="atlas-footnote">
            Gabungan interval aktif, bukan penjumlahan mentah. Bahasa terjemahan pada sesi contoh
            tidak masuk daftar bahasa pemrograman. Push, token AI, dan lama runtime menyala tidak
            menambah durasi kerja manusia.
          </p>
        </div>
        <p>
          Jurnal sebenarnya, pengaturan sumber, dan publikasi akan mengikuti autentikasi, database,
          serta kontrol persetujuan pemilik. Ringkasan publik harian tidak menyertakan waktu sesi,
          catatan privat, atau percakapan.
        </p>
        <a className="button" href="/#journey">
          Kembali ke proses proyek
        </a>
      </main>
    </>
  );
}
