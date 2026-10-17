export const DATA_STATES = [
  "loading",
  "ready",
  "empty",
  "not_connected",
  "syncing",
  "stale",
  "rate_limited",
  "error",
  "permission_denied",
] as const;
export type DataState = (typeof DATA_STATES)[number];
export const STATE_COPY: Record<DataState, { label: string; description: string }> = {
  loading: {
    label: "Loading",
    description: "Preparing this view. No observations are available yet.",
  },
  ready: {
    label: "Ready",
    description: "Observations are available with source, period and update time.",
  },
  empty: {
    label: "No observations",
    description: "The source returned no observations for this period.",
  },
  not_connected: {
    label: "Not connected",
    description: "Connect an account in a later release. No account data has been fetched.",
  },
  syncing: {
    label: "Syncing",
    description: "A refresh is in progress. Keep last-known observations separate.",
  },
  stale: {
    label: "Stale",
    description: "Showing last-known observations. The latest refresh did not complete.",
  },
  rate_limited: {
    label: "Rate limited",
    description: "The source requested a pause. Wait before retrying.",
  },
  error: {
    label: "Source unavailable",
    description: "The refresh failed. Previously stored observations are not replaced with zero.",
  },
  permission_denied: {
    label: "Permission denied",
    description: "The account does not permit access. Review its permissions.",
  },
};
export type Provider = "wakatime" | "github" | "umami" | "monkeytype" | "internal";
export type Metric = {
  key: string;
  provider: Provider;
  value: number | null;
  unit: "seconds" | "contributions" | "projects" | "visitors" | "wpm";
  state: DataState;
  periodStart: string;
  periodEnd: string;
  timezone: "Asia/Jakarta";
  lastSyncedAt: string | null;
  visibility: "private";
  isFixture: boolean;
};
export function metricDisplay(metric: Pick<Metric, "value" | "state" | "unit">): string {
  if (
    metric.value === null ||
    !Number.isFinite(metric.value) ||
    !["ready", "stale"].includes(metric.state)
  )
    return "—";
  if (metric.unit === "seconds")
    return `${Math.floor(metric.value / 3600)}h ${Math.floor((metric.value % 3600) / 60)}m`;
  return metric.value.toLocaleString("en-US");
}
export function reviewEnabled(env: Record<string, string | undefined>): boolean {
  return env.NODE_ENV === "development" || env.DEVPULSE_REVIEW_MODE === "1";
}
export const OWNER_DENIAL = {
  error: "unauthenticated",
  message: "Owner access is disabled until provider authentication is configured.",
} as const;
