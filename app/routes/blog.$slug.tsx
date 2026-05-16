import { Link } from "react-router";
import { motion, type Variants } from "motion/react";
import type { Route } from "./+types/blog.$slug";
import { fetchPostBySlug } from "../lib/content.server";
import { PortableTextRenderer } from "../components/PortableTextRenderer";
import { Footer } from "../components/Footer";
import { FadeUp } from "../components/motion/FadeUp";
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

const tagListVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.4 } },
};

const tagVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 320, damping: 24 },
  },
};

export default function BlogDetail({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;

  return (
    <>
      <main className="page-shell">
        <Link to="/blog" className="back-link font-jp">← all articles</Link>

        <header style={{ maxWidth: 860, margin: "2.5rem auto 2rem" }}>
          <motion.p
            className="font-jp"
            style={{ color: "var(--color-yellow)", fontWeight: 700, letterSpacing: "0.02em", marginBottom: "0.6rem" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            {formatDate(post.publishedAt)}
            {post.readingTime ? ` · ${post.readingTime} min` : ""}
          </motion.p>
          <motion.h1
            className="font-compressed page-title"
            style={{ marginTop: 0, color: "var(--color-magenta)", position: "relative", display: "inline-block" }}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.12 }}
          >
            {post.title}
            <motion.span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: "-0.1em",
                height: "0.12em",
                background: "var(--color-yellow)",
                transformOrigin: "left",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1], delay: 0.45 }}
            />
          </motion.h1>
          {post.excerpt ? (
            <motion.p
              className="font-jp"
              style={{ color: "#ccc", fontSize: "1.1rem", marginTop: "1rem", lineHeight: 1.6 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {post.excerpt}
            </motion.p>
          ) : null}
          {post.tags?.length ? (
            <motion.ul
              style={{ listStyle: "none", padding: 0, marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
              variants={tagListVariants}
              initial="hidden"
              animate="show"
            >
              {post.tags.map((t) => (
                <motion.li
                  key={t}
                  className="font-jp"
                  style={{ background: "#1a1a1a", color: "var(--color-lime)", padding: "0.25rem 0.7rem", borderRadius: 3, fontSize: "0.8rem", fontWeight: 600 }}
                  variants={tagVariants}
                  whileHover={{ y: -3, scale: 1.05 }}
                >
                  {t}
                </motion.li>
              ))}
            </motion.ul>
          ) : null}
        </header>

        <FadeUp className="page-prose font-jp" delay={0.2}>
          {post.body ? (
            <PortableTextRenderer value={post.body} />
          ) : (
            <p style={{ color: "#888" }}>準備中…</p>
          )}
        </FadeUp>

        <div style={{ maxWidth: 760, margin: "4rem auto 0" }}>
          <Link to="/blog" className="back-link font-jp">← all articles</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
