"use client";
import { useState, useRef, type KeyboardEvent } from "react";
import {
  calendarValues,
  visualBuckets,
  calendarSummary,
  compositionValues,
  type DailyValue,
  type CompositionValue,
} from "../../../../packages/contracts/src/visual-metrics";
import type { DataState } from "../../../../packages/contracts/src/index";

type ChartState = DataState | "sample";
type Mode = "daily" | "weekly" | "cumulative";
const modeNames = { daily: "Harian", weekly: "Mingguan", cumulative: "Kumulatif" };
const stateNames: Record<ChartState, string> = {
  sample: "SIMULASI · BUKAN DATA AKUN",
  not_connected: "Belum terhubung",
  loading: "Memuat",
  ready: "Data tersedia",
  empty: "Belum ada observasi",
  syncing: "Sinkronisasi",
  stale: "Data terakhir · belum diperbarui",
  rate_limited: "Batas sumber tercapai",
  error: "Sumber belum tersedia",
  permission_denied: "Izin belum tersedia",
};
const readable = (state: ChartState) => ["sample", "ready", "stale"].includes(state);
const number = (value: number | null, unit = "") =>
  value === null
    ? "—"
    : `${value.toLocaleString("id-ID", { maximumFractionDigits: 1 })}${unit ? ` ${unit}` : ""}`;
const labelDate = (date: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));

export function ActivityCalendar({
  title,
  endDate,
  days,
  observations = [],
  state = "not_connected",
  unit,
  description,
}: {
  title: string;
  endDate: string;
  days: number;
  observations?: DailyValue[];
  state?: ChartState;
  unit: string;
  description: string;
}) {
  const cells = useRef<Array<HTMLButtonElement | null>>([]);
  const [focusIndex, setFocusIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("daily");
  const [selected, setSelected] = useState<string | null>(null);
  const points = calendarValues(endDate, days, readable(state) ? observations : []);
  const buckets = visualBuckets(points, mode);
  const summary = calendarSummary(points);
  const navigation = (index: number) => ({
    ref: (element: HTMLButtonElement | null) => {
      cells.current[index] = element;
    },
    tabIndex: index === Math.min(focusIndex, buckets.length - 1) ? 0 : -1,
    onFocus: () => {
      setFocusIndex(index);
      setSelected(buckets[index]!.date);
    },
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
      const shifts: Record<string, number> = {
        ArrowRight: mode === "weekly" ? 1 : 7,
        ArrowLeft: mode === "weekly" ? -1 : -7,
        ArrowDown: 1,
        ArrowUp: -1,
      };
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? buckets.length - 1
            : event.key in shifts
              ? Math.max(0, Math.min(buckets.length - 1, index + shifts[event.key]!))
              : null;
      if (next !== null) {
        event.preventDefault();
        cells.current[next]?.focus();
      }
    },
  });
  const maximum = Math.max(0, ...buckets.map((item) => item.value ?? 0));
  const active = buckets.find((item) => item.date === selected);
  const offset = (new Date(`${points[0]!.date}T00:00:00Z`).getUTCDay() + 6) % 7;
  const columns = Math.ceil((offset + points.length) / 7);
  const months = points.flatMap((point, index) =>
    index === 0 || point.date.slice(0, 7) !== points[index - 1]!.date.slice(0, 7)
      ? [
          {
            label: new Intl.DateTimeFormat("id-ID", { month: "short", timeZone: "UTC" }).format(
              new Date(`${point.date}T00:00:00Z`),
            ),
            column: Math.floor((offset + index) / 7) + 1,
          },
        ]
      : [],
  );
  return (
    <article className="evidence-chart" data-chart="calendar" data-state={state}>
      <div className="evidence-heading">
        <div>
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
        <span className={`evidence-state ${state === "sample" ? "is-sample" : ""}`}>
          {stateNames[state]}
        </span>
      </div>
      <div className="calendar-toolbar">
        <span>
          {labelDate(points[0]!.date)} — {labelDate(endDate)}
        </span>
        <div className="analytics-tabs" role="group" aria-label={`Tampilan ${title}`}>
          {(Object.keys(modeNames) as Mode[]).map((item) => (
            <button
              key={item}
              aria-pressed={mode === item}
              onClick={() => {
                setMode(item);
                setSelected(null);
                setFocusIndex(0);
              }}
            >
              {modeNames[item]}
            </button>
          ))}
        </div>
      </div>
      <div className="calendar-summary">
        <span>
          Total <b>{number(summary.total, unit)}</b>
        </span>
        <span>
          Hari aktif <b>{number(summary.activeDays)}</b>
        </span>
        <span>
          Streak dalam rentang <b>{number(summary.longestStreak, "hari")}</b>
        </span>
      </div>
      <div
        className="calendar-scroll"
        tabIndex={0}
        role="region"
        aria-label={`Grafik ${title}, dapat digulir`}
      >
        {mode === "weekly" ? (
          <div className="calendar-weekly" style={{ minWidth: Math.max(260, buckets.length * 15) }}>
            {buckets.map((item, index) => (
              <button
                key={item.date}
                {...navigation(index)}
                className={`weekly-column ${item.value === null ? "is-unknown" : ""}`}
                aria-label={`${labelDate(item.date)} sampai ${labelDate(item.endDate)}: ${item.value === null ? "belum diketahui" : number(item.value, unit)}`}
                aria-pressed={selected === item.date}
                onClick={() => setSelected(item.date)}
                title={`${item.date} – ${item.endDate}`}
              >
                <span
                  style={{
                    height:
                      item.value === null
                        ? "100%"
                        : `${maximum ? (item.value / maximum) * 100 : 0}%`,
                  }}
                />
                <i />
              </button>
            ))}
          </div>
        ) : (
          <div className="calendar-canvas" style={{ minWidth: Math.max(260, columns * 14 + 33) }}>
            <div
              className="calendar-months"
              style={{ gridTemplateColumns: `repeat(${columns}, 11px)` }}
            >
              {months.map((month, index) => (
                <span key={index} style={{ gridColumn: month.column }}>
                  {month.label}
                </span>
              ))}
            </div>
            <div className="calendar-body">
              <div className="calendar-weekdays" aria-hidden="true">
                <span>Sen</span>
                <span>Rab</span>
                <span>Jum</span>
              </div>
              <div
                className="calendar-grid"
                style={{ gridTemplateColumns: `repeat(${columns}, 11px)` }}
              >
                {Array.from({ length: offset }, (_, i) => (
                  <span className="calendar-padding" key={`pad-${i}`} />
                ))}
                {buckets.map((item, index) => {
                  const level =
                    item.value === null
                      ? "unknown"
                      : item.value === 0
                        ? "0"
                        : String(Math.max(1, Math.ceil((item.value / maximum) * 4)));
                  return (
                    <button
                      key={item.date}
                      {...navigation(index)}
                      className={`calendar-cell level-${level}`}
                      data-value={item.value ?? "unknown"}
                      aria-label={`${labelDate(item.date)}: ${item.value === null ? "belum diketahui" : number(item.value, unit)}${mode === "cumulative" ? ", akumulasi sejak awal rentang" : ""}`}
                      aria-pressed={selected === item.date}
                      onClick={() => setSelected(item.date)}
                      title={`${item.date}: ${item.value === null ? "belum diketahui" : number(item.value, unit)}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="calendar-legend">
        <span>
          <i className="level-unknown" /> Belum diketahui
        </span>
        <span>
          <i className="level-0" /> Nol terverifikasi
        </span>
        <span className="calendar-scale">
          Rendah{" "}
          {[1, 2, 3, 4].map((level) => (
            <i key={level} className={`level-${level}`} />
          ))}{" "}
          Tinggi
        </span>
      </div>
      <p className="calendar-detail" role="status">
        {active
          ? `${labelDate(active.date)}${active.endDate !== active.date ? ` – ${labelDate(active.endDate)}` : ""} · ${active.value === null ? "Data belum tersedia; tidak dianggap nol." : number(active.value, unit)}`
          : "Pilih sel dengan klik atau keyboard untuk melihat rinciannya."}
      </p>
      {mode === "cumulative" && (
        <p className="chart-method">
          Akumulasi sejak awal rentang. Celah data membuat akumulasi berikutnya belum diketahui.
        </p>
      )}
      {mode === "weekly" && (
        <p className="chart-method">
          Senin–Minggu, hanya hari dalam rentang ini. Minggu dengan celah data tetap belum
          diketahui.
        </p>
      )}
      <details className="chart-table">
        <summary>Lihat tabel data ({modeNames[mode].toLowerCase()})</summary>
        <div>
          <table>
            <caption>
              {title} · {unit} · {stateNames[state]}
            </caption>
            <thead>
              <tr>
                <th>Periode</th>
                <th>Nilai</th>
                <th>Cakupan</th>
              </tr>
            </thead>
            <tbody>
              {buckets.map((item) => (
                <tr key={item.date}>
                  <td>
                    {item.date}
                    {item.endDate !== item.date ? ` – ${item.endDate}` : ""}
                  </td>
                  <td>{number(item.value, unit)}</td>
                  <td>{item.value === null ? "Belum diketahui" : "Lengkap pada bucket ini"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </article>
  );
}

export function CompositionBar({
  title,
  items,
  state = "not_connected",
  unit,
  description,
}: {
  title: string;
  items: CompositionValue[];
  state?: ChartState;
  unit: string;
  description: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const composition = compositionValues(
    items.map((item) => ({ ...item, value: readable(state) ? item.value : null })),
  );
  const active = composition.segments.find((item) => item.key === selected);
  return (
    <article
      className="evidence-chart composition-chart"
      data-chart="composition"
      data-state={state}
    >
      <div className="evidence-heading">
        <div>
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
        <span className={`evidence-state ${state === "sample" ? "is-sample" : ""}`}>
          {stateNames[state]}
        </span>
      </div>
      <div className="composition-total">
        {number(composition.total, unit)}{" "}
        <span>
          {composition.total === null ? "Cakupan belum tersedia" : "Total kategori dalam cakupan"}
        </span>
      </div>
      <div
        className={`composition-track ${composition.total === null ? "is-unknown" : ""}`}
        role="group"
        aria-label={`Komposisi ${title}`}
      >
        {composition.total === null ? (
          <span className="composition-unavailable">Data belum tersedia</span>
        ) : composition.total === 0 ? (
          <span className="composition-unavailable">Total terverifikasi: 0 {unit}</span>
        ) : (
          composition.segments.map(
            (item, index) =>
              item.percent! > 0 && (
                <button
                  key={item.key}
                  className={`composition-segment color-${index % 6}`}
                  style={{ width: `${item.percent}%` }}
                  aria-label={`${item.label}: ${number(item.value, unit)}, ${number(item.percent, "%")}`}
                  aria-pressed={selected === item.key}
                  onClick={() => setSelected(item.key)}
                  title={`${item.label}: ${number(item.value, unit)}`}
                />
              ),
          )
        )}
      </div>
      <div className="composition-legend">
        {composition.segments.map((item, index) => (
          <button
            key={item.key}
            aria-pressed={selected === item.key}
            onClick={() => setSelected(item.key)}
          >
            <i className={`color-${index % 6}`} />
            <span>
              <b>{item.label}</b>
              <small>
                {number(item.value, unit)} · {number(item.percent, "%")}
              </small>
            </span>
          </button>
        ))}
      </div>
      <p className="calendar-detail" role="status">
        {active
          ? `${active.label} · ${number(active.value, unit)} · ${active.percent === null ? "Persentase belum tersedia" : number(active.percent, "%")}`
          : "Pilih kategori untuk melihat nilai dan proporsinya."}
      </p>
    </article>
  );
}

export function UnconnectedWorkCharts({ endDate, days }: { endDate: string; days: number }) {
  return (
    <div className="evidence-chart-stack">
      <ActivityCalendar
        title="Kalender proses proyek"
        endDate={endDate}
        days={days}
        unit="menit"
        description="Sesi aktif yang tercatat, termasuk terjemahan dan pekerjaan sebelum push."
      />
      <CompositionBar
        title="Komposisi sumber pencatatan"
        unit="menit"
        description="Otomatis saja, jurnal saja, dan irisan keduanya; setiap menit masuk satu kategori."
        items={[
          { key: "automatic", label: "Otomatis saja", value: null },
          { key: "manual", label: "Jurnal saja", value: null },
          { key: "overlap", label: "Irisan keduanya", value: null },
        ]}
      />
    </div>
  );
}
