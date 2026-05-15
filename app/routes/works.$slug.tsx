import { Link, data } from "react-router";
import type { Route } from "./+types/works.$slug";
import { fetchWorkBySlug } from "../lib/content.server";
import { PortableTextRenderer } from "../components/PortableTextRenderer";
import { Footer } from "../components/Footer";

export function meta({ data: d }: Route.MetaArgs) {
  if (!d?.work) return [{ title: "Not found · yuni.cat" }];
  return [
    { title: `${d.work.title} · works · yuni.cat` },
    { name: "description", content: d.work.summary ?? "" },
  ];
}

export async function loader({ context, params }: Route.LoaderArgs) {
  const env = context.cloudflare.env as unknown as Record<string, string | undefined>;
  const work = await fetchWorkBySlug(env, params.slug);
  if (!work) throw data("Work not found", { status: 404 });
  return { work };
}

export default function WorkDetail({ loaderData }: Route.ComponentProps) {
  const { work } = loaderData;
  return (
    <>
      <main className="page-shell">
        <Link to="/works" className="back-link font-jp">← all works</Link>

        <header style={{ maxWidth: 960, margin: "2.5rem auto 2rem" }}>
          <p className="font-jp" style={{ color: "var(--color-yellow)", fontWeight: 700, letterSpacing: "0.02em", marginBottom: "0.6rem" }}>
            {work.year ?? ""}
            {work.role ? ` · ${work.role}` : ""}
          </p>
          <h1 className="font-compressed work-item-title" style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", marginTop: 0 }}>
            {work.title}
          </h1>
          {work.summary ? (
            <p className="font-jp" style={{ color: "#ccc", fontSize: "1.1rem", marginTop: "1rem", lineHeight: 1.6 }}>
              {work.summary}
            </p>
          ) : null}
          <div style={{ marginTop: "1.4rem", display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
            {work.tech?.map((t) => (
              <span key={t} className="font-jp" style={{ background: "#1a1a1a", color: "var(--color-lime)", padding: "0.25rem 0.7rem", borderRadius: 3, fontSize: "0.8rem", fontWeight: 600 }}>
                {t}
              </span>
            ))}
          </div>
          <div style={{ marginTop: "1.4rem", display: "flex", flexWrap: "wrap", gap: "1.2rem" }}>
            {work.url ? (
              <a className="font-jp" href={work.url} target="_blank" rel="noreferrer noopener" style={{ color: "var(--color-lime)", textDecoration: "underline", fontWeight: 600 }}>
                visit ↗ {work.url.replace(/^https?:\/\//, "")}
              </a>
            ) : null}
            {work.repo ? (
              <a className="font-jp" href={work.repo} target="_blank" rel="noreferrer noopener" style={{ color: "var(--color-lime)", textDecoration: "underline", fontWeight: 600 }}>
                source ↗ {work.repo.replace(/^https?:\/\//, "")}
              </a>
            ) : null}
          </div>
        </header>

        <div className="page-prose font-jp">
          {work.body ? (
            <PortableTextRenderer value={work.body} />
          ) : (
            <p style={{ color: "#888" }}>準備中…</p>
          )}
        </div>

        <div style={{ maxWidth: 760, margin: "4rem auto 0" }}>
          <Link to="/works" className="back-link font-jp">← all works</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
