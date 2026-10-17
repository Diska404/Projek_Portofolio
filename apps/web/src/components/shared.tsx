import Link from "next/link";
import { Icon, type IconName } from "./icons";
export function Wordmark() {
  return (
    <Link href="/" className="wordmark" aria-label="DevPulse home">
      <span className="brand-mark">
        <Icon name="activity" size={21} />
      </span>
      <span>
        dev<span className="brand-light">pulse</span>
        <span className="brand-period">.</span>
      </span>
    </Link>
  );
}
export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "amber" | "blue";
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
export function ReviewBar({ active }: { active: "public" | "workspace" | "system" }) {
  return (
    <div className="review-bar">
      <span>
        <span className="review-pip" /> R0 / DESIGN REVIEW
      </span>
      <nav aria-label="Prototype views">
        <Link aria-current={active === "public" ? "page" : undefined} href="/">
          Portfolio
        </Link>
        <Link aria-current={active === "workspace" ? "page" : undefined} href="/preview/overview">
          Workspace
        </Link>
        <Link aria-current={active === "system" ? "page" : undefined} href="/preview/design-system">
          Design system
        </Link>
      </nav>
      <span className="review-local">
        <Icon name="lock" size={12} /> Local preview
      </span>
    </div>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}
export function CardHeader({
  icon,
  title,
  description,
  children,
}: {
  icon: IconName;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="card-heading">
      <div className="card-title-wrap">
        <span className="card-symbol">
          <Icon name={icon} size={17} />
        </span>
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
      </div>
      {children}
    </header>
  );
}
