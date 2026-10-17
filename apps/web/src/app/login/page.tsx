import Link from "next/link";
import { Wordmark, Badge } from "@/components/shared";
import { Icon } from "@/components/icons";
export default function Login() {
  return (
    <main id="main" className="login-page">
      <Wordmark />
      <div className="card login-card">
        <span className="login-icon">
          <Icon name="lock" size={30} />
        </span>
        <Badge>OWNER ACCESS</Badge>
        <h1>
          A private space.
          <br />A deliberate boundary.
        </h1>
        <p>
          Owner sign-in is not configured in this R0 prototype. No private dashboard or owner data
          is accessible.
        </p>
        <button className="button button-primary" disabled>
          Authentication setup pending <Icon name="lock" size={14} />
        </button>
        <p className="login-footnote">
          Supabase authentication is planned for T008 after the visual review and database
          foundation.
        </p>
        <Link className="text-link" href="/">
          Return to portfolio <Icon name="arrowRight" size={14} />
        </Link>
      </div>
    </main>
  );
}
