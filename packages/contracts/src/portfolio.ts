export type PortfolioAudience = "personal" | "creator";
export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  artwork: "atlas" | "notes" | "orbit" | "neural";
  href?: string;
}
export interface PortfolioProfile {
  audience: PortfolioAudience;
  displayName: string;
  label: string;
  intro: string;
  headline: [string, string];
  description: string;
  projectIntro: string;
  projects: PortfolioProject[];
  socials: { label: string; detail: string; href: string | null }[];
}
