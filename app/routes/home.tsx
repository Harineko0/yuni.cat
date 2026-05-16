import { Link } from "react-router";
import type { Route } from "./+types/home";
import { fetchLatestPosts, fetchLatestWorks } from "../lib/content.server";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { ScrollCat } from "../components/ScrollCat";

export function meta() {
  return [
    { title: "yuni.cat" },
    { name: "description", content: "Portfolio of Harineko." },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const env = context.cloudflare.env as unknown as Record<string, string | undefined>;
  const [posts, works] = await Promise.all([
    fetchLatestPosts(env, 8),
    fetchLatestWorks(env, 6),
  ]);
  return { posts, works };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { posts, works } = loaderData;

  return (
    <main>
      {/* ── HERO ── */}
      <section className="hero-block" aria-label="yunineko/cat">
        <svg
          className="hero-svg"
          viewBox="0 0 1000 150"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label="yunineko/cat"
        >
          <text
            x="500"
            y="146"
            textAnchor="middle"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            className="font-compressed"
            fontSize="200"
            fontWeight="900"
            fill="#b6ff3a"
            transform="translate(7 -5)"
          >
            yunineko/cat
          </text>
          <text
            x="500"
            y="146"
            textAnchor="middle"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            className="font-compressed"
            fontSize="200"
            fontWeight="900"
            fill="#000"
          >
            yunineko/cat
          </text>
        </svg>
      </section>

      {/* ── NAV ── */}
      <Nav />

      {/* ── ABOUT ── */}
      <section className="about-block">
        <h2 className="about-title font-compacta">About</h2>
        <div className="about-body font-hand">
          <p>Student at University of Osaka, Faculty of Engineering Science, Department of Information Science</p>
          <p>Newbie Mobile / Backend Software Engineer at Ocarry Inc., Gather Inc.</p>
          <p>Organizer of Google Developer Group on Campus: University of Osaka</p>
          <p>anti-OOP</p>
        </div>
        <div className="mountain-wrap">
          <ScrollCat />
          <img src="/mountain.svg" alt="" className="mountain" aria-hidden="true" />
        </div>
      </section>

      {/* ── WORKS ── */}
      <section className="works-block">
        <div className="works-banner">
          <span className="works-title font-compacta">Works</span>
        </div>
        <div className="works-list">
          {works.map((w) => (
            <Link key={w._id} to={`/works/${w.slug}`} className="work-card">
              <span className="work-item-title font-compressed">
                {w.title}
                {w.year ? ` (${w.year})` : ""}
              </span>
              {w.coverImageUrl ? (
                <img
                  src={w.coverImageUrl}
                  alt={w.coverImage?.alt ?? w.title}
                  className="work-thumb"
                  loading="lazy"
                />
              ) : null}
              {w.summary ? <p className="work-summary font-jp">{w.summary}</p> : null}
            </Link>
          ))}
          {works.length === 0 ? (
            <p className="font-jp" style={{ color: "#888" }}>準備中…</p>
          ) : null}
        </div>
      </section>

      {/* ── ARTICLES (spray transition baked-in) ── */}
      <section id="articles" className="articles-block">
        <h2 className="articles-title font-compressed">Articles</h2>
        <ul className="articles-list">
          {posts.map((p) => (
            <li key={p._id} className="article-row">
              <Link to={`/blog/${p.slug}`} className="article-link font-jp">
                {p.title}
              </Link>
              <span className="article-date font-jp">{formatDate(p.publishedAt)}</span>
            </li>
          ))}
          {posts.length === 0 ? (
            <li className="article-row">
              <span className="font-jp">準備中…</span>
            </li>
          ) : null}
        </ul>
      </section>

      <Footer />
    </main>
  );
}
