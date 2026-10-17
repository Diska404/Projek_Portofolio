import type { Metadata } from "next";
import "@devpulse/ui/tokens.css";
import "./globals.css";
import "./audience.css";
export const metadata: Metadata = {
  title: { default: "DevPulse — Karya & perjalanan.", template: "%s · DevPulse" },
  description:
    "Portofolio pribadi untuk perjalanan kuliah, pengembangan aplikasi, terjemahan, dan aktivitas kreator. Konten sedang disiapkan.",
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
