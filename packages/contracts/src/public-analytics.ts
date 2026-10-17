import type { DataState } from "./index";
import type { PortfolioAudience } from "./portfolio";

export interface PublicObservation {
  value: number | null;
  state: DataState;
  coverage: "none" | "partial" | "complete";
  observedAt: string | null;
}
export interface AnalyticsCard extends PublicObservation {
  key: string;
  title: string;
  source: string;
  definition: string;
  unit: "count" | "days" | "seconds";
  method: "provider" | "manual_verified";
}
export interface PublicAnalytics {
  audience: PortfolioAudience;
  eyebrow: string;
  title: string;
  description: string;
  githubAccounts: { login: string; href: string }[];
  primary: AnalyticsCard[];
  secondary: AnalyticsCard[];
  calendarTitle: string;
  calendarDescription: string;
  activityTypes: string[];
  githubScope: string;
}
export function publicObservationText(
  item: PublicObservation,
  unit: AnalyticsCard["unit"],
): string {
  if (
    item.value === null ||
    !Number.isFinite(item.value) ||
    item.value < 0 ||
    !["ready", "stale"].includes(item.state) ||
    item.coverage !== "complete"
  )
    return "—";
  if (unit === "seconds")
    return `${Math.floor(item.value / 3600)}j ${Math.floor((item.value % 3600) / 60)}m`;
  return item.value.toLocaleString("id-ID");
}

/** Same commit attributed to both accounts must be counted only once. */
export function uniqueCommitCount(records: { repositoryId: string; sha: string }[]) {
  return new Set(records.map((record) => JSON.stringify([record.repositoryId, record.sha]))).size;
}
export type Publication = {
  id: string;
  kind: "video" | "completed_live" | "post" | "scheduled_live" | "ongoing_live" | "unknown";
  occurredAt: string;
  verified: boolean;
};
export function publicationCounts(records: Publication[]) {
  const groups = new Map<string, Publication[]>();
  const result = { video: 0, completed_live: 0, post: 0, activeDays: 0 };
  const days = new Set<string>();
  for (const record of records) {
    if (
      !record.verified ||
      !record.id ||
      !/(Z|[+-]\d{2}:\d{2})$/.test(record.occurredAt) ||
      !Number.isFinite(Date.parse(record.occurredAt))
    )
      continue;
    const namespace = record.kind === "post" ? "post" : "video";
    const identity = JSON.stringify([namespace, record.id]);
    groups.set(identity, [...(groups.get(identity) ?? []), record]);
  }
  for (const observations of groups.values()) {
    // A verified completed broadcast takes precedence over its uploaded replay.
    // Incomplete or unknown broadcast metadata must not become a normal video.
    const completed = observations.filter((item) => item.kind === "completed_live");
    const candidates = completed.length
      ? completed
      : observations.every((item) => item.kind === "video" || item.kind === "post")
        ? observations
        : [];
    const record = candidates.sort(
      (a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt),
    )[0];
    if (!record) continue;
    result[record.kind as "video" | "completed_live" | "post"]++;
    days.add(
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Jakarta",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(record.occurredAt)),
    );
  }
  result.activeDays = days.size;
  return result;
}
