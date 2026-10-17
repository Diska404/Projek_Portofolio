import { notFound } from "next/navigation";
import { reviewEnabled } from "@devpulse/contracts";
import { Dashboard, type PreviewScreen } from "@/components/dashboard";
export const dynamic = "force-dynamic";
export default async function Preview({ params }: { params: Promise<{ screen: string }> }) {
  if (!reviewEnabled(process.env)) notFound();
  const { screen } = await params;
  if (!["overview", "projects", "integrations", "privacy", "design-system"].includes(screen))
    notFound();
  return <Dashboard screen={screen as PreviewScreen} />;
}
