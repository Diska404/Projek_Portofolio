import { STATE_COPY, type DataState } from "@devpulse/contracts";
import { contributionDays, sampleLanguages, type DateRange } from "@devpulse/contracts/fixtures";
import { Badge, CardHeader } from "./shared";
import { Icon, type IconName } from "./icons";

export function StatePanel({ state, compact = false }: { state: DataState; compact?: boolean }) {
  const copy = STATE_COPY[state];
  return (
    <div className={`data-state ${compact ? "compact" : ""}`} data-state={state} role="status">
      <span
        className={
          state === "loading" || state === "syncing" ? "state-icon is-loading" : "state-icon"
        }
      >
        <Icon
          name={
            state === "permission_denied"
              ? "lock"
              : state === "error"
                ? "help"
                : state === "not_connected"
                  ? "plug"
                  : state === "ready"
                    ? "check"
                    : "activity"
          }
        />
      </span>
      <strong>{copy.label}</strong>
      <p>{copy.description}</p>
      {["stale", "error", "rate_limited"].includes(state) && (
        <span className="state-action">
          Retry becomes available after authenticated connection.
        </span>
      )}
    </div>
  );
}
export function MetricCard({
  title,
  value,
  source,
  icon,
  detail,
  sample,
}: {
  title: string;
  value: string;
  source: string;
  icon: IconName;
  detail: string;
  sample: boolean;
}) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span>{title}</span>
        <Icon name={icon} size={17} />
      </div>
      <div className={`metric-value ${sample ? "" : "metric-unavailable"}`}>
        {sample ? value : "—"}
      </div>
      <div className="metric-description">{sample ? detail : "Not connected"}</div>
      <div className="metric-source">
        <span>{source}</span>
        <span>{sample ? "SAMPLE" : "NO ACCOUNT DATA"}</span>
      </div>
    </article>
  );
}
export function CodingChart({
  days,
  sample,
}: {
  days: { date: string; seconds: number }[];
  sample: boolean;
}) {
  const max = Math.max(...days.map((d) => d.seconds), 1);
  return (
    <article className="card coding-card">
      <CardHeader icon="chart" title="Coding activity" description="A little progress, every day.">
        <Badge tone={sample ? "green" : "neutral"}>
          {sample ? "WakaTime · SAMPLE" : "Not connected"}
        </Badge>
      </CardHeader>
      {sample ? (
        <>
          <div className="chart-summary">
            <span className="legend-dot" /> Coding duration{" "}
            <span className="chart-unit">HOURS / DAY · ASIA/JAKARTA</span>
          </div>
          <div
            className="bar-chart"
            role="img"
            aria-label={`Synthetic coding duration over ${days.length} days. See the data table below.`}
          >
            <div className="chart-ticks">
              <span>8h</span>
              <span>6h</span>
              <span>4h</span>
              <span>2h</span>
              <span>0h</span>
            </div>
            <div className="chart-grid">
              <div className="chart-grid-lines">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="chart-bars">
                {days.map((d, i) => (
                  <div key={d.date} className="bar-column">
                    <div
                      className={i === days.length - 1 ? "chart-bar latest" : "chart-bar"}
                      style={{
                        height: `${Math.max(2, (d.seconds / Math.max(8 * 3600, max)) * 100)}%`,
                      }}
                    >
                      <span className="bar-tooltip">
                        {d.date}: {(d.seconds / 3600).toFixed(1)}h · sample
                      </span>
                    </div>
                    <span className="bar-label">
                      {days.length <= 7
                        ? new Date(d.date + "T12:00:00Z").toLocaleDateString("en-US", {
                            weekday: "short",
                            timeZone: "Asia/Jakarta",
                          })
                        : i % 5 === 0 || i === days.length - 1
                          ? d.date.slice(8)
                          : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <details className="data-table-details">
            <summary>
              View sample observations <Icon name="chevron" size={12} />
            </summary>
            <div className="table-scroll">
              <table>
                <caption>
                  Illustrative WakaTime data · not provider observations · Asia/Jakarta
                </caption>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Duration (hours)</th>
                  </tr>
                </thead>
                <tbody>
                  {days.map((d) => (
                    <tr key={d.date}>
                      <td>{d.date}</td>
                      <td>{(d.seconds / 3600).toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      ) : (
        <StatePanel state="not_connected" />
      )}
    </article>
  );
}
export function LanguagesCard({ sample }: { sample: boolean }) {
  return (
    <article className="card languages-card">
      <CardHeader icon="code" title="Languages" description="The tools behind the work.">
        <Icon name="more" size={18} />
      </CardHeader>
      {sample ? (
        <>
          <div className="language-total">
            <span>YOUR CODING MIX</span>
            <Badge tone="amber">SAMPLE</Badge>
          </div>
          <div className="language-stack" aria-hidden="true">
            {sampleLanguages.map((l) => (
              <i key={l.name} style={{ width: `${l.percent}%`, background: l.color }} />
            ))}
          </div>
          <ul className="language-list">
            {sampleLanguages.map((l) => (
              <li key={l.name}>
                <span className="language-name">
                  <i style={{ background: l.color }} />
                  {l.name}
                </span>
                <span>
                  {l.percent}
                  <small>%</small>
                </span>
              </li>
            ))}
          </ul>
          <div className="card-footnote">
            <Icon name="timer" size={12} /> Synthetic breakdown · no account connected
          </div>
        </>
      ) : (
        <StatePanel state="not_connected" compact />
      )}
    </article>
  );
}
export function ContributionChart({ sample, range }: { sample: boolean; range: DateRange }) {
  return (
    <article className="card contributions-card" id="contributions">
      <CardHeader
        icon="github"
        title="GitHub contributions"
        description="Small steps. A bigger picture."
      >
        <span className="contribution-caption">
          {sample ? "182-day sample calendar" : "Not connected"}
        </span>
      </CardHeader>
      {sample ? (
        <>
          <div className="heatmap-header">
            <span>APR</span>
            <span>MAY</span>
            <span>JUN</span>
            <span>JUL</span>
            <span>AUG</span>
            <span>SEP</span>
            <span>OCT</span>
          </div>
          <div className="heatmap-scroll">
            <div className="heatmap-days" aria-hidden="true">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>
            <div
              className="heatmap"
              role="img"
              aria-label={`Synthetic contribution calendar. The last ${range} days are highlighted. Contributions are not the same as commits.`}
            >
              {contributionDays.map((d, i) => (
                <span
                  key={d.date}
                  className={`heat-cell heat-${Math.min(4, Math.ceil(d.count / 2))} ${i < 182 - range ? "outside-range" : ""}`}
                  title={`${d.date}: ${d.count} sample contributions`}
                />
              ))}
            </div>
          </div>
          <div className="heatmap-footer">
            <span>
              <Badge tone="amber">SAMPLE</Badge> Contributions ≠ commits · highlighted range:{" "}
              {range}D
            </span>
            <span className="heat-legend">
              Less{" "}
              {[0, 1, 2, 3, 4].map((n) => (
                <i className={`heat-cell heat-${n}`} key={n} />
              ))}{" "}
              More
            </span>
          </div>
          <details className="data-table-details">
            <summary>
              View contribution data <Icon name="chevron" size={12} />
            </summary>
            <div className="table-scroll">
              <table>
                <caption>
                  Sample GitHub contributions for the selected range, not commit counts
                </caption>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Contributions</th>
                  </tr>
                </thead>
                <tbody>
                  {contributionDays.slice(-range).map((d) => (
                    <tr key={d.date}>
                      <td>{d.date}</td>
                      <td>{d.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      ) : (
        <StatePanel state="not_connected" compact />
      )}
    </article>
  );
}
