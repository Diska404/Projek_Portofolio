import { jakartaDate } from "../../../../packages/contracts/src/visual-metrics";
import { ledgerContent } from "@/lib/ledger-content";
import { analyticsContent } from "@/lib/analytics-content";
import { PublicPortfolio } from "@/components/public-portfolio";
import { publicProfile } from "@/lib/public-content";
export const dynamic = "force-dynamic";
export default function CreatorHome() {
  return (
    <PublicPortfolio
      calendarEnd={jakartaDate(new Date())}
      showReview={false}
      profile={publicProfile("creator")}
      analytics={analyticsContent("creator")}
      ledger={ledgerContent("creator")}
    />
  );
}
