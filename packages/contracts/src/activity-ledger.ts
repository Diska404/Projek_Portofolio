import type { PortfolioAudience } from "./portfolio";

export interface LedgerIdentity {
  connector: string;
  accountAlias: string;
  externalId: string;
  revision: number;
  deleted?: boolean;
}
export const WORK_KINDS = [
  "coding",
  "translation",
  "review",
  "research",
  "documentation",
  "community",
] as const;
export interface WorkSession extends LedgerIdentity {
  projectId: string;
  kind: (typeof WORK_KINDS)[number];
  provenance: "automatic" | "owner_journal";
  startedAt: string;
  endedAt: string;
  active: boolean;
  approvedFor: PortfolioAudience[];
  language: { domain: "programming" | "natural"; name: string } | null;
  privateNote?: string;
}
export interface ProjectPolicy {
  projectId: string;
  audiences: PortfolioAudience[];
  publicProgrammingLanguages: string[];
}
export interface LedgerWindow {
  start: string;
  end: string;
}
type Interval = [number, number];
export function timestamp(value: string): number | null {
  if (
    !/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(
      value,
    )
  )
    return null;
  const year = Number(value.slice(0, 4)),
    month = Number(value.slice(5, 7)),
    day = Number(value.slice(8, 10));
  if (
    year < 2000 ||
    new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10) !== value.slice(0, 10)
  )
    return null;
  const result = Date.parse(value);
  return Number.isFinite(result) ? result : null;
}
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonical(item)}`)
      .join(",")}}`;
  return JSON.stringify(value) ?? "undefined";
}
/** Latest revision wins; ambiguous same-revision records fail closed. */
export function currentRevisions<T extends LedgerIdentity>(records: readonly T[]): T[] {
  const groups = new Map<string, T[]>();
  for (const record of records) {
    if (
      !record.connector ||
      !record.accountAlias ||
      !record.externalId ||
      !Number.isSafeInteger(record.revision) ||
      record.revision < 1
    )
      continue;
    const key = JSON.stringify([record.connector, record.accountAlias, record.externalId]);
    groups.set(key, [...(groups.get(key) ?? []), record]);
  }
  return [...groups.values()].flatMap((group) => {
    const latest = Math.max(...group.map((item) => item.revision));
    const candidates = group.filter((item) => item.revision === latest);
    const first = candidates[0];
    if (!first || first.deleted || new Set(candidates.map(canonical)).size !== 1) return [];
    return [first];
  });
}
function union(intervals: Interval[]): Interval[] {
  const result: Interval[] = [];
  for (const [start, end] of [...intervals].sort((a, b) => a[0] - b[0])) {
    const last = result.at(-1);
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else result.push([start, end]);
  }
  return result;
}
const seconds = (intervals: Interval[]) =>
  union(intervals).reduce((total, [a, b]) => total + (b - a) / 1000, 0);
const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Jakarta",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const dayKey = (ms: number) => dayFormatter.format(new Date(ms));
function splitDays(intervals: Interval[]) {
  const days = new Map<string, Interval[]>();
  for (const [start, end] of intervals) {
    let cursor = start;
    while (cursor < end) {
      const date = dayKey(cursor);
      // Jakarta UTC+07, no DST. Only explicit modern ISO timestamps enter this contract.
      const nextMidnight = Date.parse(`${date}T00:00:00+07:00`) + 86400000;
      const boundary = Math.min(end, nextMidnight);
      days.set(date, [...(days.get(date) ?? []), [cursor, boundary]]);
      cursor = boundary;
    }
  }
  return days;
}
export function summarizeWork(
  records: readonly WorkSession[],
  policies: readonly ProjectPolicy[],
  audience: PortfolioAudience,
  window: LedgerWindow,
) {
  const start = timestamp(window.start),
    end = timestamp(window.end);
  if (start === null || end === null || end <= start || end - start > 366 * 86400000)
    throw new Error("Invalid ledger window");
  const allowed = new Map(
    policies
      .filter((item) => item.audiences.includes(audience))
      .map((item) => [item.projectId, item]),
  );
  const automatic: Interval[] = [],
    declared: Interval[] = [];
  const languages = new Set<string>();
  const projects = new Set<string>();
  let sessionCount = 0;
  for (const record of currentRevisions(records)) {
    const policy = allowed.get(record.projectId);
    if (
      !policy ||
      !record.approvedFor.includes(audience) ||
      record.active !== true ||
      !WORK_KINDS.includes(record.kind)
    )
      continue;
    if (record.provenance !== "automatic" && record.provenance !== "owner_journal") continue;
    const a = timestamp(record.startedAt),
      b = timestamp(record.endedAt);
    if (a === null || b === null || b <= a || b - a > 86400000) continue;
    const clipped: Interval = [Math.max(a, start), Math.min(b, end)];
    if (clipped[1] <= clipped[0]) continue;
    (record.provenance === "automatic" ? automatic : declared).push(clipped);
    sessionCount++;
    projects.add(record.projectId);
    if (
      record.language?.domain === "programming" &&
      policy.publicProgrammingLanguages.includes(record.language.name)
    )
      languages.add(record.language.name);
  }
  const all = union([...automatic, ...declared]);
  const automaticSeconds = seconds(automatic),
    declaredSeconds = seconds(declared),
    observedSeconds = seconds(all);
  const autoDays = splitDays(automatic),
    declaredDays = splitDays(declared);
  const daily = [...splitDays(all)]
    .map(([date, intervals]) => {
      const observed = seconds(intervals),
        auto = seconds(autoDays.get(date) ?? []),
        manual = seconds(declaredDays.get(date) ?? []);
      return {
        date,
        observedSeconds: observed,
        automaticSeconds: auto,
        declaredSeconds: manual,
        overlapSeconds: Math.max(0, auto + manual - observed),
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
  // New allowlisted DTO: no spread of private source records, notes, IDs or timestamps.
  return {
    observedSeconds,
    automaticSeconds,
    declaredSeconds,
    overlapSeconds: Math.max(0, automaticSeconds + declaredSeconds - observedSeconds),
    sessionCount,
    activeDays: daily.length,
    activeProjects: projects.size,
    programmingLanguages: [...languages].sort(),
    daily,
    coverage: "observed_only" as const,
  };
}

export interface AIObservation extends LedgerIdentity {
  kind: "inference" | "runtime_loaded";
  successful: boolean;
  occurredAt: string;
  provider: string;
  canonicalModelId: string | null;
  variant: string | null;
  inputTokens: number | null;
  outputTokens: number | null;
  approvedFor: PortfolioAudience[];
}
export function summarizeAI(
  records: readonly AIObservation[],
  audience: PortfolioAudience,
  window: LedgerWindow,
) {
  const start = timestamp(window.start),
    end = timestamp(window.end);
  if (start === null || end === null || end <= start) throw new Error("Invalid AI window");
  const items = currentRevisions(records).filter((item) => {
    const at = timestamp(item.occurredAt);
    return (
      item.kind === "inference" &&
      item.successful === true &&
      item.approvedFor.includes(audience) &&
      at !== null &&
      at >= start &&
      at < end
    );
  });
  const countTokens = (field: "inputTokens" | "outputTokens") =>
    items.every(
      (item) => item[field] !== null && Number.isSafeInteger(item[field]) && item[field]! >= 0,
    )
      ? items.reduce((sum, item) => sum + item[field]!, 0)
      : null;
  return {
    observedRequests: items.length,
    identifiedModels: new Set(
      items
        .filter((item) => item.canonicalModelId && item.provider)
        .map((item) => item.canonicalModelId),
    ).size,
    unidentifiedRequests: items.filter((item) => !item.canonicalModelId || !item.provider).length,
    inputTokens: countTokens("inputTokens"),
    outputTokens: countTokens("outputTokens"),
    coverage: "observed_only" as const,
  };
}
export interface SteamSnapshot {
  appId: number;
  collectedAt: string;
  lifetimeMinutes: number | null;
  visible: boolean;
}
export function steamDeltaMinutes(previous: SteamSnapshot, current: SteamSnapshot): number | null {
  const a = timestamp(previous.collectedAt),
    b = timestamp(current.collectedAt);
  if (
    !previous.visible ||
    !current.visible ||
    previous.appId !== current.appId ||
    !Number.isSafeInteger(current.appId) ||
    current.appId <= 0 ||
    a === null ||
    b === null ||
    b <= a
  )
    return null;
  const before = previous.lifetimeMinutes,
    after = current.lifetimeMinutes;
  if (
    before === null ||
    after === null ||
    !Number.isSafeInteger(before) ||
    !Number.isSafeInteger(after) ||
    before < 0 ||
    after < before
  )
    return null;
  return after - before;
}
