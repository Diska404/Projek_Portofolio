"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DATA_STATES, metricDisplay, type DataState } from "@devpulse/contracts";
import {
  SAMPLE_MARKER,
  sampleProjects,
  sampleSummary,
  type DateRange,
} from "@devpulse/contracts/fixtures";
import { Icon, type IconName } from "./icons";
import { Badge, CardHeader, ReviewBar, Wordmark } from "./shared";
import {
  CodingChart,
  ContributionChart,
  LanguagesCard,
  MetricCard,
  StatePanel,
} from "./data-widgets";
import { ProjectArtwork } from "./public-portfolio";

export type PreviewScreen = "overview" | "projects" | "integrations" | "privacy" | "design-system";
const titles: Record<PreviewScreen, { title: string; description: string }> = {
  overview: {
    title: "Your craft, in focus.",
    description: "A small window into the work, the rhythm, and what comes next.",
  },
  projects: {
    title: "Good things take building.",
    description: "A visual study of projects and milestones. Editing begins in R1.",
  },
  integrations: {
    title: "Connect the dots.",
    description: "Your sources, one considered workspace. Connections are not enabled in R0.",
  },
  privacy: {
    title: "Your work. Your boundaries.",
    description: "A preview of the controls that will keep private work private.",
  },
  "design-system": {
    title: "The details make the system.",
    description: "Tokens, components and every state. One consistent visual language.",
  },
};
const groups: {
  label: string;
  items: { label: string; icon: IconName; screen?: PreviewScreen; future?: string }[];
}[] = [
  {
    label: "WORKSPACE",
    items: [
      { label: "Overview", icon: "dashboard", screen: "overview" },
      { label: "Coding analytics", icon: "chart", future: "R1" },
      { label: "GitHub", icon: "github", future: "R1" },
      { label: "Projects", icon: "folder", screen: "projects" },
      { label: "Timeline", icon: "activity", future: "R1" },
    ],
  },
  {
    label: "INSIGHTS",
    items: [
      { label: "Visitors", icon: "globe", future: "R2" },
      { label: "Typing", icon: "keyboard", future: "R2" },
      { label: "Reports", icon: "file", future: "R2" },
    ],
  },
  {
    label: "MANAGE",
    items: [
      { label: "Integrations", icon: "plug", screen: "integrations" },
      { label: "Privacy", icon: "shield", screen: "privacy" },
      { label: "Design system", icon: "palette", screen: "design-system" },
    ],
  },
];
export function Dashboard({ screen }: { screen: PreviewScreen }) {
  const [sample, setSample] = useState(true);
  const [range, setRange] = useState<DateRange>(7);
  const [drawer, setDrawer] = useState(false);
  const sidebar = useRef<HTMLElement>(null);
  const path = usePathname();
  const data = sampleSummary(range);
  useEffect(() => {
    if (!drawer) return;
    const prior = document.activeElement as HTMLElement | null;
    const element = sidebar.current;
    if (!element) return;
    const focusable = () =>
      Array.from(element.querySelectorAll<HTMLElement>("a[href],button:not([disabled])")).filter(
        (el) => el.offsetParent !== null,
      );
    focusable()[0]?.focus();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawer(false);
      if (event.key === "Tab") {
        const nodes = focusable(),
          first = nodes[0],
          last = nodes.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = oldOverflow;
      prior?.focus();
    };
  }, [drawer]);
  const nav = (label: string, target: PreviewScreen, icon: IconName) => (
    <Link
      key={label}
      className={`sidebar-link ${screen === target ? "active" : ""}`}
      href={`/preview/${target}`}
      aria-current={screen === target ? "page" : undefined}
      onClick={() => setDrawer(false)}
    >
      <Icon name={icon} size={17} />
      <span>{label}</span>
      {screen === target && <span className="nav-active-dot" />}
    </Link>
  );
  return (
    <div className="dashboard-page">
      <ReviewBar active={screen === "design-system" ? "system" : "workspace"} />
      {drawer && (
        <button
          className="drawer-scrim"
          aria-label="Close navigation"
          onClick={() => setDrawer(false)}
        />
      )}
      <aside
        className={`dashboard-sidebar ${drawer ? "drawer-open" : ""}`}
        ref={sidebar}
        id="workspace-nav"
        role={drawer ? "dialog" : undefined}
        aria-modal={drawer ? true : undefined}
        aria-label="Workspace navigation"
      >
        <div className="sidebar-brand">
          <Wordmark />
          <button
            className="icon-button drawer-close"
            aria-label="Close navigation"
            onClick={() => setDrawer(false)}
          >
            <Icon name="x" />
          </button>
        </div>
        <div className="workspace-label">
          <span className="workspace-avatar">
            <Icon name="command" size={15} />
          </span>
          <div>
            <strong>Personal workspace</strong>
            <span>Design preview</span>
          </div>
          <Icon name="chevron" size={14} />
        </div>
        <nav aria-label="Dashboard navigation">
          {groups.map((group) => (
            <div className="sidebar-group" key={group.label}>
              <span className="nav-group-label">{group.label}</span>
              {group.items.map((item) =>
                item.screen ? (
                  nav(item.label, item.screen, item.icon)
                ) : (
                  <button
                    className="sidebar-link future-link"
                    disabled
                    key={item.label}
                    title={`Planned for ${item.future}`}
                  >
                    <Icon name={item.icon} size={17} />
                    <span>{item.label}</span>
                    <small>{item.future}</small>
                  </button>
                ),
              )}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="local-teaser">
            <Icon name="cpu" size={19} />
            <div>
              <b>Local systems</b>
              <span>AI & hardware, later.</span>
            </div>
            <Badge>R3</Badge>
          </div>
          <Link href="/" className="sidebar-public">
            <Icon name="external" size={16} /> View public portfolio{" "}
            <Icon name="arrowUpRight" size={14} />
          </Link>
          <div className="sidebar-profile">
            <div className="profile-avatar">dp</div>
            <div>
              <b>Owner workspace</b>
              <span>Preview · not authenticated</span>
            </div>
            <Icon name="lock" size={14} />
          </div>
        </div>
      </aside>
      <div className="dashboard-workspace">
        <header className="workspace-topbar">
          <button
            className="icon-button mobile-nav-toggle"
            aria-controls="workspace-nav"
            aria-expanded={drawer}
            aria-label="Open navigation"
            onClick={() => setDrawer(true)}
          >
            <Icon name="menu" />
          </button>
          <div className="breadcrumb">
            Workspace <span>/</span>
            <b>
              {screen === "design-system"
                ? "Design system"
                : screen[0]?.toUpperCase() + screen.slice(1)}
            </b>
          </div>
          <div className="topbar-right">
            <span className="source-status">
              <i /> Sources not connected
            </span>
            <span className="topbar-divider" />
            <span className="timezone">Asia/Jakarta</span>
            <span className="topbar-avatar">dp</span>
          </div>
        </header>
        <main id="main" className="dashboard-content" key={path}>
          <div className="dashboard-intro">
            <div>
              <span className="eyebrow">YOUR PERSONAL COMMAND CENTER</span>
              <h1>{titles[screen].title}</h1>
              <p>{titles[screen].description}</p>
            </div>
            <Link href="/" className="button button-small">
              <Icon name="globe" size={14} /> Public portfolio{" "}
              <Icon name="arrowUpRight" size={14} />
            </Link>
          </div>
          {screen === "overview" ? (
            <>
              <div className="overview-toolbar">
                <div className="sample-switch" role="group" aria-label="Preview data mode">
                  <button aria-pressed={sample} onClick={() => setSample(true)}>
                    <Icon name="sparkles" size={13} /> Sample data
                  </button>
                  <button aria-pressed={!sample} onClick={() => setSample(false)}>
                    Not connected
                  </button>
                </div>
                <div className="date-controls">
                  <span className="review-date">
                    <Icon name="timer" size={14} /> Review period · Oct 17, 2026
                  </span>
                  <div className="date-presets" role="group" aria-label="Date range">
                    {([7, 30, 90] as const).map((v) => (
                      <button key={v} aria-pressed={range === v} onClick={() => setRange(v)}>
                        {v}D
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="sample-notice">
                <Icon name="sparkles" size={15} />
                <span>
                  {sample ? (
                    <>
                      <strong>{SAMPLE_MARKER}.</strong> Synthetic values for visual review. No
                      accounts are connected.
                    </>
                  ) : (
                    <>
                      No accounts connected. Missing observations are shown as <b>—</b>, never zero.
                    </>
                  )}
                </span>
                <Link href="/preview/integrations">
                  Sources <Icon name="arrowRight" size={13} />
                </Link>
              </div>
              <section className="metrics-grid" aria-label="Key metrics">
                <MetricCard
                  title="Coding time"
                  value={metricDisplay({ value: data.seconds, state: "ready", unit: "seconds" })}
                  source="WakaTime"
                  icon="timer"
                  detail={`${data.coverageDays}-day sample coverage`}
                  sample={sample}
                />
                <MetricCard
                  title="Contributions"
                  value={String(data.contributions)}
                  source="GitHub"
                  icon="branch"
                  detail={`In the selected ${range}-day sample period`}
                  sample={sample}
                />
                <MetricCard
                  title="Active projects"
                  value="1"
                  source="Project workspace"
                  icon="folder"
                  detail="1 in progress · 2 other sample projects"
                  sample={sample}
                />
                <MetricCard
                  title="Last update"
                  value="17 Oct"
                  source="Review fixtures"
                  icon="activity"
                  detail="Fixed sample date · not a sync event"
                  sample={sample}
                />
              </section>
              <div className="chart-layout">
                <CodingChart days={data.days} sample={sample} />
                <LanguagesCard sample={sample} />
              </div>
              {sample && range > data.coverageDays && (
                <p className="coverage-note">
                  <Icon name="help" size={13} /> Requested {range} days. Coding sample coverage is{" "}
                  {data.coverageDays} days; missing dates are not filled.
                </p>
              )}
              <ContributionChart sample={sample} range={range} />
              <div className="overview-bottom">
                <ProjectFocus sample={sample} />
                <IntegrationHealth />
              </div>
              <div className="future-grid">
                <FutureCard type="typing" />
                <FutureCard type="visitors" />
              </div>
            </>
          ) : screen === "projects" ? (
            <ProjectStudy />
          ) : screen === "integrations" ? (
            <IntegrationStudy />
          ) : screen === "privacy" ? (
            <PrivacyStudy />
          ) : (
            <DesignStudy />
          )}
          <footer className="dashboard-footer">
            <span>
              <span className="small-pulse" /> DEV PULSE <span className="footer-separator">/</span>{" "}
              A work in progress, thoughtfully.
            </span>
            <span>R0 DESIGN REVIEW · NO LIVE DATA</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
function ProjectFocus({ sample }: { sample: boolean }) {
  return (
    <article className="card project-focus">
      <CardHeader icon="folder" title="In the making" description="A look at what comes next.">
        <Link href="/preview/projects" className="quiet-link">
          All projects <Icon name="arrowRight" size={13} />
        </Link>
      </CardHeader>
      {sample ? (
        <>
          <div className="focus-project-head">
            <span className="project-mini-logo">a.</span>
            <div>
              <h3>Atlas Workspace</h3>
              <span>Sample project · not your project history</span>
            </div>
            <Badge tone="green">In progress</Badge>
          </div>
          <div className="progress-heading">
            <span>Illustrative milestone progress</span>
            <b>
              64<span>%</span>
            </b>
          </div>
          <div className="progress-track">
            <i style={{ width: "64%" }} />
          </div>
          <div className="project-milestone">
            <span className="milestone-dot" />
            <div>
              <b>Design the foundation</b>
              <span>Example milestone · not verified completion</span>
            </div>
            <Badge tone="amber">SAMPLE</Badge>
          </div>
        </>
      ) : (
        <StatePanel state="empty" compact />
      )}
    </article>
  );
}
function IntegrationHealth() {
  return (
    <article className="card integration-health">
      <CardHeader
        icon="plug"
        title="Source health"
        description="Good data starts with a connection."
      >
        <Link
          href="/preview/integrations"
          className="quiet-link"
          aria-label="Review integration sources"
        >
          <Icon name="arrowUpRight" size={16} />
        </Link>
      </CardHeader>
      <ul>
        {[
          { name: "GitHub", icon: "github" },
          { name: "WakaTime", icon: "timer" },
        ].map((s) => (
          <li key={s.name}>
            <span className="source-logo">
              <Icon name={s.icon as IconName} size={18} />
            </span>
            <div>
              <b>{s.name}</b>
              <span>No account configured</span>
            </div>
            <Badge>Not connected</Badge>
          </li>
        ))}
      </ul>
      <div className="card-footnote">
        <Icon name="shield" size={13} /> Credentials will stay on the server.
      </div>
    </article>
  );
}
function FutureCard({ type }: { type: "typing" | "visitors" }) {
  return (
    <article className="future-card">
      <span className="source-logo">
        <Icon name={type === "typing" ? "keyboard" : "globe"} size={20} />
      </span>
      <div>
        <h3>{type === "typing" ? "Monkeytype" : "Umami analytics"}</h3>
        <p>
          {type === "typing"
            ? "Personal bests, with mode and accuracy."
            : "Visitors and pageviews, kept distinct."}
        </p>
      </div>
      <Badge>R2 · Planned</Badge>
    </article>
  );
}
function IntegrationStudy() {
  return (
    <>
      <div className="sample-notice">
        <Icon name="lock" size={16} />
        <span>
          Connection forms are intentionally disabled. Provider authentication follows the R0 review
          gate.
        </span>
      </div>
      <div className="integration-grid">
        {[
          {
            name: "GitHub",
            icon: "github",
            release: "R1",
            description:
              "Contribution calendar and repository metadata. Private source content stays private.",
          },
          {
            name: "WakaTime",
            icon: "timer",
            release: "R1",
            description:
              "Coding duration, languages and editors. Period, units and coverage stay explicit.",
          },
          {
            name: "Monkeytype",
            icon: "keyboard",
            release: "R2",
            description: "Mode-specific personal bests, WPM and accuracy. No mixed-mode rankings.",
          },
          {
            name: "Umami",
            icon: "globe",
            release: "R2",
            description:
              "Visitors, pageviews and referrers, following the provider's own definitions.",
          },
        ].map((s) => (
          <article className="card integration-study" key={s.name}>
            <span className="integration-large-icon">
              <Icon name={s.icon as IconName} size={26} />
            </span>
            <Badge>{s.release}</Badge>
            <h2>{s.name}</h2>
            <p>{s.description}</p>
            <StatePanel state="not_connected" compact />
            <button className="button" disabled>
              Connect in {s.release} <Icon name="lock" size={13} />
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
function ProjectStudy() {
  return (
    <>
      <div className="sample-notice">
        <Icon name="folder" size={16} />
        <span>Three design samples. No project records have been created or published.</span>
        <Badge tone="amber">Read-only study</Badge>
      </div>
      <div className="project-study-grid">
        {sampleProjects.map((p) => (
          <article className="card project-study" key={p.slug}>
            <ProjectArtwork tone={p.tone} />
            <div>
              <span className="eyebrow">SAMPLE / {p.category}</span>
              <h2>{p.title}</h2>
              <p>{p.description}</p>
              <div className="project-study-status">
                <Badge tone="green">{p.status}</Badge>
                <span>
                  {p.progress === null ? "No milestones yet" : `${p.progress}% illustrative`}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="scope-footnote">
        Project CRUD, milestone weighting, publication and persistence start in T012–T014. No fake
        save actions are enabled.
      </p>
    </>
  );
}
function PrivacyStudy() {
  return (
    <div className="card privacy-study">
      <CardHeader
        icon="shield"
        title="Private is the starting point"
        description="A visual study of publication controls. Nothing can be published from this preview."
      />
      <div className="privacy-rule">
        <Icon name="lock" size={22} />
        <p>
          Public pages will read approved snapshots only. Integration records, credentials, raw
          source data and local telemetry stay outside that projection.
        </p>
      </div>
      {[
        "Profile and project content",
        "GitHub contribution summary",
        "WakaTime coding duration",
        "Local AI & hardware telemetry",
      ].map((label) => (
        <div className="privacy-row" key={label}>
          <div>
            <strong>{label}</strong>
            <span>Not published · no saved policy in R0</span>
          </div>
          <span className="locked-toggle">
            <Icon name="lock" size={13} /> Private
          </span>
        </div>
      ))}
      <p className="scope-footnote">
        Authentication is T008. Publication policies and revoke behavior are T025. Local telemetry
        is R3 and owner-only.
      </p>
    </div>
  );
}
function DesignStudy() {
  const [state, setState] = useState<DataState>("not_connected");
  return (
    <>
      <div className="design-grid">
        <article className="card token-card">
          <CardHeader
            icon="palette"
            title="A considered palette"
            description="Dark technical minimalism. Green as a signal, not decoration."
          />
          <div className="swatch-grid">
            {[
              { name: "Canvas", value: "#090B0B" },
              { name: "Surface", value: "#111615" },
              { name: "Accent", value: "#45D483" },
              { name: "Text", value: "#F3F6F3" },
              { name: "Muted", value: "#A0AFA5" },
              { name: "Warning", value: "#F3C36A" },
            ].map((c) => (
              <div key={c.name}>
                <i style={{ background: c.value }} />
                <b>{c.name}</b>
                <span>{c.value}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="card type-card">
          <CardHeader icon="code" title="Clarity, at every scale" />
          <h3>
            Make the work
            <br />
            <span>the focal point.</span>
          </h3>
          <p>System sans · readable 14–16px body</p>
          <div className="type-numerals">0123456789</div>
          <p>Tabular figures · consistent metric alignment</p>
        </article>
      </div>
      <article className="card state-gallery">
        <CardHeader
          icon="activity"
          title="Every state has a place"
          description="Nine explicit states. No unknown observation silently becomes zero."
        />
        <div className="state-controls" role="group" aria-label="Widget state">
          {DATA_STATES.map((s) => (
            <button key={s} aria-pressed={state === s} onClick={() => setState(s)}>
              {s.replaceAll("_", " ")}
            </button>
          ))}
        </div>
        <StatePanel state={state} />
        <div className="state-gallery-note">
          <Badge tone="amber">COMPONENT PREVIEW</Badge>
          <p>
            Ready/stale values require a sourced record in production. This gallery describes
            behavior without fetching or saving data.
          </p>
        </div>
      </article>
      <article className="card component-spec">
        <CardHeader icon="dashboard" title="One family of components" />
        <div className="component-row">
          <button className="button button-primary">
            Primary action <Icon name="arrowRight" size={14} />
          </button>
          <button className="button">Secondary action</button>
          <button className="button" disabled>
            Unavailable
          </button>
          <Badge tone="green">Ready</Badge>
          <Badge tone="amber">Sample</Badge>
          <Badge tone="blue">Information</Badge>
        </div>
        <p>12px card radius · 24px grid gap · visible keyboard focus · reduced motion supported</p>
      </article>
    </>
  );
}
