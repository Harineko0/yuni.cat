import type { Route } from "./+types/og.$";
import { fetchPostBySlug, fetchWorkBySlug } from "../lib/content.server";
import { renderOgImage, type OgKind } from "../lib/og.server";

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

export async function loader({ context, params }: Route.LoaderArgs) {
  const env = context.cloudflare.env as unknown as Record<string, string | undefined>;
  const raw = (params["*"] ?? "").replace(/\.png$/i, "");
  const segments = raw.split("/").filter(Boolean);
  const [kindSeg, slug] = segments;

  if (kindSeg !== "blog" && kindSeg !== "works") {
    return new Response("Not found", { status: 404 });
  }
  const kind = kindSeg as OgKind;

  let title: string;
  let subtitle: string | undefined;
  let meta: string | undefined;

  if (!slug) {
    title = kind === "blog" ? "Articles" : "Works";
    subtitle = kind === "blog"
      ? "Notes and articles by Harineko."
      : "Selected works by Harineko.";
  } else if (kind === "blog") {
    const post = await fetchPostBySlug(env, slug);
    if (!post) return new Response("Not found", { status: 404 });
    title = post.title;
    subtitle = post.excerpt;
    meta = `${formatDate(post.publishedAt)}${post.readingTime ? ` · ${post.readingTime} min` : ""}`;
  } else {
    const work = await fetchWorkBySlug(env, slug);
    if (!work) return new Response("Not found", { status: 404 });
    title = work.title;
    subtitle = work.summary;
    meta = [work.year, work.role].filter(Boolean).join(" · ") || undefined;
  }

  try {
    const res = await renderOgImage({ kind, title, subtitle, meta });
    const headers = new Headers(res.headers);
    headers.set("Content-Type", "image/png");
    headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800");
    return new Response(res.body, { status: res.status, headers });
  } catch (err) {
    console.error("og render failed", err);
    return new Response("OG render failed", { status: 500 });
  }
}
