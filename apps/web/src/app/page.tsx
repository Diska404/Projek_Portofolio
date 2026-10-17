import { PublicPortfolio } from "@/components/public-portfolio";
import { reviewEnabled } from "@devpulse/contracts";
export const dynamic = "force-dynamic";
export default function Home() {
  return <PublicPortfolio showReview={reviewEnabled(process.env)} />;
}
