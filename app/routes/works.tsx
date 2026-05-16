import { Link } from "react-router";
import type { Route } from "./+types/works";
import { fetchAllWorks } from "../lib/content.server";
import { Footer } from "../components/Footer";

export function meta() {
  return [
    { title: "Works · yuni.cat" },
    { name: "description", content: "Selected works by Harineko." },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const env = context.cloudflare.env as unknown as Record<string, string | undefined>;
  const works = await fetchAllWorks(env);
  return { works };
}

export default function WorksIndex({ loaderData }: Route.ComponentProps) {
  const { works } = loaderData;

  return (
    <>
      <main className="page-shell">
        <Link to="/" className="back-link font-jp">← back</Link>
        <div className="works-block" style={{ marginTop: "2rem" }}>
          <div className="works-banner">
            <span className="works-title font-compacta">Works</span>
          </div>
          <div className="works-list">
            {works.length === 0 ? (
              <p className="font-jp" style={{ color: "#888" }}>準備中…</p>
            ) : (
              works.map((w) => (
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
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
