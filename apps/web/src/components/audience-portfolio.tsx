"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import type { PortfolioProfile } from "../../../../packages/contracts/src/portfolio";
import type { PublicAnalytics } from "../../../../packages/contracts/src/public-analytics";
import type { LedgerPortfolio } from "../lib/ledger-content";
import { ActivityAtlas } from "./activity-atlas";
import { PublicAnalyticsSection } from "./public-analytics";
import { Icon } from "./icons";
import { Badge, ReviewBar } from "./shared";

export function PublicPortfolio({
  profile,
  analytics,
  ledger,
  calendarEnd,
  showReview,
  creatorUrl,
}: {
  profile: PortfolioProfile;
  analytics: PublicAnalytics;
  ledger: LedgerPortfolio;
  calendarEnd: string;
  showReview: boolean;
  creatorUrl?: string;
}) {
  const [filter, setFilter] = useState("Semua");
  const [menu, setMenu] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const creator = profile.audience === "creator";
  const filters = ["Semua", ...new Set(profile.projects.map((project) => project.category))];
  return (
    <div
      className={`audience-page ${creator ? "creator-portfolio" : "personal-portfolio"}`}
      data-audience={profile.audience}
    >
      {showReview && <ReviewBar active="public" />}
      <div className="audience-shell">
        <aside className="identity-rail" aria-label="Profil dan navigasi">
          <Link className="rail-brand" href="/">
            <span className="brand-mark">
              <Icon name="activity" size={20} />
            </span>
            <span>
              {creator ? "raizei" : "devpulse"}
              <b>.</b>
            </span>
          </Link>
          <div
            className={`identity-avatar ${creator ? "creator-avatar" : "photo-placeholder"}`}
            aria-label={
              creator ? "Avatar sementara Raizei" : "Tempat foto pribadi, belum ditambahkan"
            }
          >
            {creator ? "R" : <Icon name="code" size={36} />}
            <span className="avatar-corner">
              <Icon name={creator ? "sparkles" : "plus"} size={12} />
            </span>
          </div>
          <h2 className="identity-name">{profile.displayName}</h2>
          <p className="identity-intro">{profile.intro}</p>
          <Badge tone="green">{creator ? "Kreator & komunitas" : "Portofolio pribadi"}</Badge>
          {!creator && <small className="photo-note">Foto & nama akan Anda lengkapi.</small>}
          <div
            onKeyDown={(event) => {
              if (event.key === "Escape" && menu) {
                setMenu(false);
                menuButton.current?.focus();
              }
            }}
          >
            <button
              className="button rail-menu-toggle"
              ref={menuButton}
              aria-label="Toggle navigation"
              aria-expanded={menu}
              aria-controls="audience-nav"
              onClick={() => setMenu(!menu)}
            >
              <Icon name={menu ? "x" : "menu"} /> Menu
            </button>
            <nav
              id="audience-nav"
              className={`rail-navigation ${menu ? "is-open" : ""}`}
              aria-label="Public navigation"
            >
              {(
                [
                  ["#about", "Tentang", "code"],
                  ...(creator
                    ? ([
                        ["#statistics", "Aktivitas kanal", "activity"],
                        ["#journey", "Komunitas & game", "globe"],
                      ] as const)
                    : ([
                        ["#journey", "Proses & AI", "activity"],
                        ["#statistics", "GitHub & coding", "branch"],
                      ] as const)),
                  ["#work", "Proyek", "folder"],
                  ["#social", "Temukan saya", "globe"],
                ] as const
              ).map(([href, title, icon]) => (
                <a href={href} onClick={() => setMenu(false)} key={href}>
                  <Icon name={icon} size={17} />
                  {title}
                  <Icon name="arrowUpRight" size={13} />
                </a>
              ))}
              {showReview && (
                <Link href="/preview/overview">
                  <Icon name="dashboard" size={17} /> Workspace preview
                </Link>
              )}
            </nav>
          </div>
          <div className="rail-bottom">
            {creator ? (
              <Link className="identity-shortcut" href="/access" prefetch={false}>
                <span className="shortcut-avatar invite-avatar">
                  <Icon name="lock" size={18} />
                </span>
                <span>
                  <b>Ruang undangan</b>
                  <small>Masuk dengan kode akses</small>
                </span>
                <Icon name="arrowRight" size={16} />
              </Link>
            ) : creatorUrl ? (
              <a
                className="identity-shortcut"
                href={creatorUrl}
                referrerPolicy="no-referrer"
                rel="noreferrer"
                aria-label="Buka portofolio YouTube Raizei"
              >
                <span className="shortcut-avatar creator-avatar">R</span>
                <span>
                  <b>Raizei</b>
                  <small>Portofolio YouTube</small>
                </span>
                <Icon name="arrowUpRight" size={16} />
              </a>
            ) : (
              <p className="identity-link-pending">Shortcut kreator menunggu alamat.</p>
            )}
            <p className="rail-footnote">
              Catatan karya & proses.
              <br />
              Dibangun selangkah demi selangkah.
            </p>
          </div>
        </aside>
        <main id="main" className="audience-main">
          <header className="audience-topline">
            <span>
              <span className="small-pulse" /> {profile.label}
            </span>
            <span className="draft-indicator">
              Konten sedang disiapkan <Icon name="arrowUpRight" size={13} />
            </span>
          </header>
          <section className="audience-hero" id="about">
            <div className="audience-hero-copy">
              <span className="eyebrow">
                {creator ? "DARI KREATOR, UNTUK KOMUNITAS" : "A PERSONAL COLLECTION OF WORK"}
              </span>
              <h1>
                {profile.headline[0]}
                <br />
                <span>{profile.headline[1]}</span>
              </h1>
              <p>{profile.description}</p>
              <div className="hero-ctas">
                <a href={creator ? "#statistics" : "#journey"} className="button button-primary">
                  {creator ? "Lihat aktivitas kanal" : "Lihat proses berkarya"}{" "}
                  <Icon name="arrowRight" size={16} />
                </a>
                <a href="#work" className="text-link">
                  Jelajahi karya <Icon name="arrowDown" size={14} />
                </a>
              </div>
            </div>
            <div
              className="craft-window"
              aria-label="Ilustrasi orisinal proses berkarya, bukan statistik akun"
            >
              <div className="craft-window-top">
                <span>
                  <i />
                  <i />
                  <i />
                </span>
                <span>{creator ? "localization / journal" : "workspace / journal"}</span>
                <Icon name="code" size={14} />
              </div>
              <div className="craft-window-body">
                <span className="craft-kicker">
                  {creator ? "A STORY, ACROSS LANGUAGES" : "SMALL STEPS. MEANINGFUL WORK."}
                </span>
                <p className="craft-display">
                  {creator ? (
                    <>
                      Cerita yang sama.
                      <br />
                      <em>Bahasa kita.</em>
                    </>
                  ) : (
                    <>
                      Belajar hari ini.
                      <br />
                      <em>Membangun esok.</em>
                    </>
                  )}
                </p>
                <div className="craft-line">
                  <span>01</span>
                  <p>
                    {creator ? "Baca · pahami · terjemahkan" : "Ide · eksperimen · dokumentasi"}
                  </p>
                  <Icon name="check" size={15} />
                </div>
                <div className="craft-line">
                  <span>02</span>
                  <p>{creator ? "Tinjau · perbaiki · bagikan" : "Bangun · uji · bagikan"}</p>
                  <Icon name="branch" size={15} />
                </div>
                <span className="craft-caption">ILUSTRASI PROSES · BUKAN DATA AKUN</span>
              </div>
            </div>
          </section>
          {!creator && (
            <ActivityAtlas content={ledger} showReview={showReview} calendarEnd={calendarEnd} />
          )}
          <PublicAnalyticsSection content={analytics} calendarEnd={calendarEnd} />
          {creator && (
            <ActivityAtlas content={ledger} showReview={false} calendarEnd={calendarEnd} />
          )}
          <section className="audience-work" id="work">
            <div className="audience-section-heading">
              <div>
                <span className="eyebrow">PILIHAN PROYEK</span>
                <h2>{profile.projectIntro}</h2>
              </div>
              <span className="section-caption">Dokumentasi akan terus dilengkapi.</span>
            </div>
            <div className="project-filter" role="group" aria-label="Filter proyek">
              {filters.map((item) => (
                <button key={item} aria-pressed={item === filter} onClick={() => setFilter(item)}>
                  {item}
                </button>
              ))}
            </div>
            <div className="audience-project-grid">
              {profile.projects
                .filter((item) => filter === "Semua" || filter === item.category)
                .map((project, index) => (
                  <article
                    className="public-project audience-project"
                    key={project.id}
                    data-project={project.id}
                  >
                    <div
                      className={`audience-project-art story-${project.artwork}`}
                      aria-hidden="true"
                    >
                      <span className="story-category">
                        {project.category.toUpperCase()} / {String(index + 1).padStart(2, "0")}
                      </span>
                      {project.artwork === "notes" ? (
                        <>
                          <span className="story-glyph">
                            文<span>あ</span>
                          </span>
                          <p>
                            Different words.
                            <br />
                            <b>Same story.</b>
                          </p>
                        </>
                      ) : project.artwork === "orbit" ? (
                        <>
                          <span className="story-terminal">
                            &gt; translate
                            <span className="cursor-block" />
                          </span>
                          <p>
                            Bahasa bertemu
                            <br />
                            <b>teknologi.</b>
                          </p>
                        </>
                      ) : (
                        <>
                          <span className="story-blocks">
                            <i />
                            <i />
                            <i />
                          </span>
                          <p>
                            Belajar melalui
                            <br />
                            <b>karya.</b>
                          </p>
                        </>
                      )}
                    </div>
                    <div className="project-card-copy">
                      <span className="project-type">{project.category}</span>
                      <h3>{project.title}</h3>
                      <p>{project.description}</p>
                      <div className="tech-tags">
                        {project.tags.map((tag) => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                      <span className="content-pending">
                        <Icon name="file" size={13} /> Detail belum dipublikasikan
                      </span>
                    </div>
                  </article>
                ))}
            </div>
          </section>
          <section id="social" className="audience-social">
            <div className="audience-section-heading">
              <div>
                <span className="eyebrow">TETAP TERHUBUNG</span>
                <h2>Temukan saya di sini.</h2>
              </div>
            </div>
            <div className="social-profile-grid">
              {profile.socials.map((social) =>
                social.href ? (
                  <a
                    key={social.label}
                    className="social-profile"
                    href={social.href}
                    referrerPolicy="no-referrer"
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span className="social-profile-symbol">
                      <Icon name={social.label === "GitHub" ? "github" : "globe"} size={20} />
                    </span>
                    <span>
                      <b>{social.label}</b>
                      <small>{social.detail}</small>
                    </span>
                    <Icon name="arrowUpRight" size={17} />
                  </a>
                ) : (
                  <div key={social.label} className="social-profile social-unconfigured">
                    <span className="social-profile-symbol">
                      <Icon name="globe" size={20} />
                    </span>
                    <span>
                      <b>{social.label}</b>
                      <small>{social.detail}</small>
                    </span>
                    <Badge>Belum diatur</Badge>
                  </div>
                ),
              )}
            </div>
          </section>
          <footer className="audience-footer">
            <span>{creator ? "Raizei · Cerita & komunitas" : "DevPulse · Karya & perjalanan"}</span>
            <a href="#about">Kembali ke atas ↑</a>
          </footer>
        </main>
      </div>
    </div>
  );
}
