import type { Metadata } from "next";
import "@devpulse/ui/tokens.css";
import "../../../web/src/app/globals.css";
import "../../../web/src/app/audience.css";
import "../../../web/src/app/analytics.css";
import "../../../web/src/app/activity-atlas.css";
export const metadata: Metadata = {
  title: { default: "Raizei — Komunitas & karya · DevPulse", template: "%s · Raizei" },
  description:
    "GFL2 Bahasa Indonesia, aplikasi penerjemah, dan catatan kreator. Konten sedang disiapkan.",
  robots: { index: false, follow: false },
};
export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <a className="skip-link" href="#main">
          Lewati ke konten
        </a>
        {children}
      </body>
    </html>
  );
}
