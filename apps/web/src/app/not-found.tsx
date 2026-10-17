import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <span className="eyebrow">DEV PULSE / 404</span>
      <h1>Nothing to see here. Yet.</h1>
      <p>This page is not available. Design previews are disabled in production by default.</p>
      <Link href="/" className="button">
        Back to portfolio
      </Link>
    </main>
  );
}
