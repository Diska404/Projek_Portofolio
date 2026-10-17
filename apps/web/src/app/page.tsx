import { jakartaDate } from "../../../../packages/contracts/src/visual-metrics";
import { ledgerContent } from "@/lib/ledger-content";
import { analyticsContent } from "@/lib/analytics-content";
import { PublicPortfolio } from "@/components/public-portfolio";
import { reviewEnabled } from "@devpulse/contracts";
import { publicProfile } from "@/lib/public-content";
import { creatorUrl } from "@/lib/site-config";
export const dynamic = "force-dynamic";
export default function Home() {
  return (
    <PublicPortfolio
      calendarEnd={jakartaDate(new Date())}
      showReview={reviewEnabled(process.env)}
      profile={publicProfile("personal")}
      analytics={analyticsContent("personal")}
      ledger={ledgerContent("personal")}
      creatorUrl={creatorUrl()}
    />
  );
}
