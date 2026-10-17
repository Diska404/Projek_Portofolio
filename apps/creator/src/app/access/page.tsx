import Link from "next/link";
import { Icon } from "@/components/icons";
import { AccessForm } from "../../components/access-form";
export const metadata = { title: "Ruang undangan", robots: { index: false, follow: false } };
export default function AccessPage() {
  return (
    <main id="main" className="invitation-page creator-portfolio">
      <Link className="invitation-back text-link" href="/">
        <Icon name="arrowLeft" size={16} />
        Kembali ke Raizei
      </Link>
      <div className="invitation-card">
        <span className="invitation-symbol">
          <Icon name="lock" size={28} />
        </span>
        <span className="eyebrow">RUANG UNDANGAN</span>
        <h1>
          Ada cerita lain.
          <br />
          <span>Untuk yang punya akses.</span>
        </h1>
        <p className="invitation-intro">
          Beberapa ruang dibagikan lewat undangan. Masukkan kode akses untuk melanjutkan.
        </p>
        <AccessForm />
        <div className="invitation-footnote">
          <Icon name="shield" size={14} />
          <span>Tujuan baru dibuka setelah kode diverifikasi.</span>
        </div>
      </div>
      <span className="invitation-signature">
        raizei<span>.</span>
      </span>
    </main>
  );
}
