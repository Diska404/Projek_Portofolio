"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "./icons";
import { Badge, ReviewBar, SectionHeading, Wordmark } from "./shared";

const works = [
  {
    title: "Atlas Workspace",
    type: "Web application",
    description: "A quieter place to organize ambitious work.",
    tags: ["Next.js", "TypeScript"],
    tone: "atlas",
  },
  {
    title: "Fieldnotes",
    type: "Developer tool",
    description: "Small ideas, connected into something useful.",
    tags: ["React", "MDX"],
    tone: "notes",
  },
  {
    title: "Orbit CLI",
    type: "Open source",
    description: "A little less repetition in your terminal.",
    tags: ["Python", "CLI"],
    tone: "orbit",
  },
];
export function ProjectArtwork({ tone }: { tone: string }) {
  return (
    <div className={`project-art art-${tone}`} aria-hidden="true">
      {tone === "atlas" ? (
        <div className="mini-app">
          <div className="mini-sidebar">
            <span className="mini-logo">a.</span>
            <i />
            <i />
            <i />
          </div>
          <div className="mini-main">
            <span>Good work starts here.</span>
            <div className="mini-kpis">
              <i />
              <i />
              <i />
            </div>
            <div className="mini-board">
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      ) : tone === "notes" ? (
        <div className="notes-art">
          <span className="notes-number">01 / FIELDNOTES</span>
          <strong>
            Make room
            <br />
            for the idea.
          </strong>
          <span className="notes-line" />
          <small>Think. Connect. Create.</small>
        </div>
      ) : (
        <div className="terminal-art">
          <div>
            <i />
            <i />
            <i />
            <span>orbit — terminal</span>
          </div>
          <p>
            <b>~</b> orbit init
          </p>
          <p className="terminal-success">✓ Less setup. More building.</p>
          <p className="terminal-dim">
            Ready when you are
            <span className="cursor-block" />
          </p>
        </div>
      )}
    </div>
  );
}
export function PublicPortfolio({ showReview }: { showReview: boolean }) {
  const [filter, setFilter] = useState("All work");
  const [menu, setMenu] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [detail, setDetail] = useState<string | null>(null);
  return (
    <div className="portfolio-page">
      {showReview && <ReviewBar active="public" />}
      <div className="public-container">
        <header
          className="public-header"
          onKeyDown={(event) => {
            if (event.key === "Escape" && menu) {
              setMenu(false);
              menuButton.current?.focus();
            }
          }}
        >
          <Wordmark />
          <button
            className="icon-button public-menu"
            ref={menuButton}
            aria-expanded={menu}
            aria-controls="public-nav"
            aria-label="Toggle navigation"
            onClick={() => setMenu(!menu)}
          >
            <Icon name={menu ? "x" : "menu"} />
          </button>
          <nav id="public-nav" className={menu ? "is-open" : ""} aria-label="Public navigation">
            <a href="#about" onClick={() => setMenu(false)}>
              About
            </a>
            <a href="#work" onClick={() => setMenu(false)}>
              Projects
            </a>
            <a href="#statistics" onClick={() => setMenu(false)}>
              Statistics
            </a>
            <a href="#contact" onClick={() => setMenu(false)}>
              Contact <Icon name="arrowUpRight" size={14} />
            </a>
          </nav>
          {showReview && (
            <Link className="button button-small public-workspace" href="/preview/overview">
              <Icon name="dashboard" size={14} /> Workspace preview
            </Link>
          )}
        </header>
        <main id="main">
          <section className="public-hero" id="about">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="small-pulse" /> THE DEVELOPER PORTFOLIO, REIMAGINED
              </div>
              <h1>
                Thoughtful work.
                <br />
                <span>Visible progress.</span>
              </h1>
              <p>
                A space for the things you build, the ideas you explore,
                <br className="desktop-break" /> and the small steps that connect them.
              </p>
              <div className="hero-ctas">
                <a className="button button-primary" href="#work">
                  Explore the work <Icon name="arrowRight" size={16} />
                </a>
                <a className="text-link" href="#statistics">
                  Behind the work <Icon name="arrowDown" size={14} />
                </a>
              </div>
              <div className="hero-note">
                <span className="line-avatar">
                  <Icon name="code" size={17} />
                </span>
                <span>
                  <b>Your identity goes here.</b>
                  <br />
                  Profile content awaits your approval.
                </span>
              </div>
            </div>
            <div
              className="hero-console"
              aria-label="Original illustration of a developer workspace"
            >
              <div className="console-top">
                <span>
                  <span className="console-dot" /> THE WORKSPACE
                </span>
                <Icon name="more" size={18} />
              </div>
              <div className="console-greeting">
                <span>ONE PLACE. EVERY CHAPTER.</span>
                <h2>
                  Keep building<span>.</span>
                </h2>
                <p>Your craft, connected.</p>
              </div>
              <div className="console-tabs">
                <span>
                  <Icon name="folder" size={14} /> Projects
                </span>
                <span>
                  <Icon name="activity" size={14} /> Activity
                </span>
                <span>
                  <Icon name="code" size={14} /> Craft
                </span>
              </div>
              <div className="console-graph" aria-hidden="true">
                {[21, 38, 30, 48, 39, 58, 47, 67, 57, 77, 69, 90, 81, 104, 95, 121].map((v, i) => (
                  <i key={i} style={{ height: v }} />
                ))}
              </div>
              <div className="console-caption">
                <span>ILLUSTRATIVE COMPOSITION</span>
                <span>NOT ACCOUNT DATA</span>
              </div>
            </div>
          </section>
          <div className="public-proof">
            <span>Built around your process</span>
            <span>
              <Icon name="github" size={17} /> GitHub
            </span>
            <span>
              <Icon name="timer" size={17} /> WakaTime
            </span>
            <span>
              <Icon name="keyboard" size={17} /> Monkeytype <small>R2</small>
            </span>
            <span>
              <Icon name="chart" size={17} /> Umami <small>R2</small>
            </span>
          </div>
          <section id="work" className="work-section">
            <SectionHeading eyebrow="A SELECTION OF POSSIBILITIES" title="Things worth building.">
              <Badge tone="amber">Sample projects</Badge>
            </SectionHeading>
            <div className="project-filter" role="group" aria-label="Filter sample projects">
              {["All work", "Web application", "Developer tool", "Open source"].map((t) => (
                <button key={t} aria-pressed={filter === t} onClick={() => setFilter(t)}>
                  {t}
                  {t === "All work" && <span>03</span>}
                </button>
              ))}
              <span className="filter-note">R0 composition · not published work</span>
            </div>
            <div className="public-project-grid">
              {works
                .filter((w) => filter === "All work" || w.type === filter)
                .map((w) => (
                  <article className="public-project" key={w.title}>
                    <button
                      className="project-art-button"
                      aria-label={`Review ${w.title} sample`}
                      onClick={() => setDetail(w.title)}
                    >
                      <ProjectArtwork tone={w.tone} />
                      <span className="art-open">
                        <Icon name="arrowUpRight" />
                      </span>
                    </button>
                    <div className="project-card-copy">
                      <div>
                        <span className="project-type">{w.type} / SAMPLE</span>
                        <h3>
                          <button
                            className="project-title-button"
                            onClick={() => setDetail(w.title)}
                          >
                            {w.title}
                          </button>
                          <Icon name="arrowUpRight" size={18} />
                        </h3>
                        <p>{w.description}</p>
                      </div>
                      <div className="tech-tags">
                        {w.tags.map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
            </div>
            {detail && (
              <div className="inline-review" role="status">
                <Icon name="file" />
                <p>
                  <b>{detail} is a design sample.</b> Actual project details, screenshots and links
                  will be added after owner content approval in R1.
                </p>
                <button
                  className="icon-button"
                  aria-label="Close sample detail"
                  onClick={() => setDetail(null)}
                >
                  <Icon name="x" />
                </button>
              </div>
            )}
          </section>
          <section id="statistics" className="public-stat-section">
            <div>
              <span className="eyebrow">A LITTLE CONTEXT</span>
              <h2>
                The work behind
                <br />
                the finished work.
              </h2>
              <p>
                Coding time, contributions and progress, shared
                <br className="desktop-break" /> thoughtfully. Only what you choose to make public.
              </p>
              {showReview && (
                <Link className="text-link accent" href="/preview/overview">
                  Explore the dashboard design <Icon name="arrowRight" size={16} />
                </Link>
              )}
            </div>
            <div className="public-stats-empty">
              <div className="privacy-orbit">
                <Icon name="shield" size={26} />
              </div>
              <h3>Nothing published yet.</h3>
              <p>
                Statistics remain private until the owner
                <br />
                connects a source and approves a snapshot.
              </p>
              <Badge>
                <Icon name="lock" size={12} /> Private by default
              </Badge>
            </div>
          </section>
          <section className="public-contact" id="contact">
            <div>
              <span className="eyebrow">THE NEXT CHAPTER</span>
              <h2>
                Let the work
                <br />
                start a conversation<span>.</span>
              </h2>
            </div>
            <div>
              <span className="contact-placeholder">
                <Icon name="arrowUpRight" size={28} />
              </span>
              <p>
                Contact details will appear here
                <br />
                after the owner approves them.
              </p>
              <Badge>Content pending</Badge>
            </div>
          </section>
        </main>
        <footer className="public-footer">
          <Wordmark />
          <span>Crafted with intention. R0 design preview.</span>
          <a href="#about">Back to top ↑</a>
        </footer>
      </div>
    </div>
  );
}
