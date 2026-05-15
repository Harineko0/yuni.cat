import { Link } from "react-router";
import type { Route } from "./+types/blog.$slug";
import { fetchPostBySlug } from "../lib/content.server";
import { PortableTextRenderer } from "../components/PortableTextRenderer";
import { Footer } from "../components/Footer";
import { data } from "react-router";

export function meta({ data: d }: Route.MetaArgs) {
  if (!d?.post) return [{ title: "Not found · yuni.cat" }];
  return [
    { title: `${d.post.title} · yuni.cat` },
    { name: "description", content: d.post.excerpt ?? "" },
  ];
}

export async function loader({ context, params }: Route.LoaderArgs) {
  const env = context.cloudflare.env as unknown as Record<string, string | undefined>;
  const post = await fetchPostBySlug(env, params.slug);
  if (!post) throw data("Post not found", { status: 404 });
  return { post };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

export default function BlogDetail({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;

  return (
    <>
      <main className="page-shell">
        <Link to="/blog" className="back-link font-jp">← all articles</Link>

        <header style={{ maxWidth: 860, margin: "2.5rem auto 2rem" }}>
          <p className="font-jp" style={{ color: "var(--color-yellow)", fontWeight: 700, letterSpacing: "0.02em", marginBottom: "0.6rem" }}>
            {formatDate(post.publishedAt)}
            {post.readingTime ? ` · ${post.readingTime} min` : ""}
          </p>
          <h1 className="font-compressed page-title" style={{ marginTop: 0, color: "var(--color-magenta)" }}>
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="font-jp" style={{ color: "#ccc", fontSize: "1.1rem", marginTop: "1rem", lineHeight: 1.6 }}>
              {post.excerpt}
            </p>
          ) : null}
          {post.tags?.length ? (
            <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {post.tags.map((t) => (
                <li key={t} className="font-jp" style={{ background: "#1a1a1a", color: "var(--color-lime)", padding: "0.25rem 0.7rem", borderRadius: 3, fontSize: "0.8rem", fontWeight: 600 }}>
                  {t}
                </li>
              ))}
            </ul>
          ) : null}
        </header>

        <div className="page-prose font-jp">
          {post.body ? (
            <PortableTextRenderer value={post.body} />
          ) : (
            <p style={{ color: "#888" }}>準備中…</p>
          )}
        </div>

        <div style={{ maxWidth: 760, margin: "4rem auto 0" }}>
          <Link to="/blog" className="back-link font-jp">← all articles</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
