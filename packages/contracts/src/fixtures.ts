/** Deterministic, synthetic R0 review fixtures. Never provider observations. */
export const SAMPLE_MARKER = "SAMPLE DATA · DESIGN PREVIEW";
export const REVIEW_DATE = "2026-10-17";
export type DateRange = 7 | 30 | 90;
const HOURS = [
  2.2, 4.5, 3.6, 5.1, 1.9, 0.8, 3.2, 4.6, 3.1, 2.4, 5.6, 4.4, 1.1, 0.4, 3.7, 5.2, 4.8, 3.5, 5.8,
  2.1, 0.7, 3.1, 4.8, 5.3, 3.9, 6.2, 4.1, 1.6, 2.8, 5.4,
];
export const codingDays = HOURS.map((hours, index) => ({
  date: new Date(Date.UTC(2026, 8, 18 + index)).toISOString().slice(0, 10),
  seconds: Math.round(hours * 3600),
}));
export const contributionDays = Array.from({ length: 182 }, (_, i) => ({
  date: new Date(Date.UTC(2026, 3, 19 + i)).toISOString().slice(0, 10),
  count: (i * 7 + (i % 5) * 3) % 13 === 0 ? 0 : (i * 3 + (i % 7)) % 9,
}));
export const sampleLanguages = [
  { name: "TypeScript", percent: 48, color: "#45d483" },
  { name: "Python", percent: 27, color: "#89b89e" },
  { name: "CSS", percent: 17, color: "#71897b" },
  { name: "Other", percent: 8, color: "#44564b" },
];
export const sampleProjects = [
  {
    slug: "atlas-workspace",
    title: "Atlas Workspace",
    category: "Web application",
    description: "A quieter place to organize ambitious work.",
    tags: ["Next.js", "TypeScript"],
    status: "In progress",
    progress: 64,
    tone: "atlas",
  },
  {
    slug: "fieldnotes",
    title: "Fieldnotes",
    category: "Developer tool",
    description: "Small ideas, connected into something useful.",
    tags: ["React", "MDX"],
    status: "Exploring",
    progress: null,
    tone: "notes",
  },
  {
    slug: "orbit-cli",
    title: "Orbit CLI",
    category: "Open source",
    description: "A little less repetition in your terminal.",
    tags: ["Python", "CLI"],
    status: "Completed",
    progress: 100,
    tone: "orbit",
  },
] as const;
export function sampleSummary(range: DateRange) {
  const days = codingDays.slice(-range);
  const contributions = contributionDays.slice(-range);
  return {
    days,
    seconds: days.reduce((total, d) => total + d.seconds, 0),
    contributions: contributions.reduce((total, d) => total + d.count, 0),
    coverageDays: days.length,
    range,
  };
}
