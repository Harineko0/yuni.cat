import { Link } from "react-router";
import type { Route } from "./+types/blog";
import { fetchAllPosts } from "../lib/content.server";
import { Footer } from "../components/Footer";

export function meta() {
  return [
    { title: "Articles · yuni.cat" },
    { name: "description", content: "Articles by Harineko." },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const env = context.cloudflare.env as unknown as Record<string, string | undefined>;
  const posts = await fetchAllPosts(env);
  return { posts };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

export default function BlogIndex({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;

  return (
    <>
      <section style={{ background: "var(--color-magenta)", paddingBottom: "clamp(2rem, 5vw, 4rem)", minHeight: "100vh" }}>
        <div style={{ padding: "clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 4rem) 0" }}>
          <Link to="/" className="font-jp" style={{ color: "#000", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 4 }}>
            ← back
          </Link>
        </div>
        <h1 className="font-compressed" style={{ textAlign: "center", color: "#000", fontSize: "clamp(4rem, 9vw, 8rem)", margin: 0, padding: "clamp(2rem, 5vw, 4rem) 0 0", lineHeight: 1 }}>
          Articles
        </h1>
        <ul className="articles-list">
          {posts.length === 0 ? (
            <li className="article-row">
              <span className="font-jp">準備中…</span>
            </li>
          ) : (
            posts.map((p) => (
              <li key={p._id} className="article-row">
                <Link to={`/blog/${p.slug}`} className="article-link font-jp">
                  {p.title}
                </Link>
                <span className="article-date font-jp">{formatDate(p.publishedAt)}</span>
              </li>
            ))
          )}
        </ul>
      </section>
      <Footer />
    </>
  );
}
