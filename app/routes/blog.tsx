import { Link } from "react-router";
import { motion, type Variants } from "motion/react";
import type { Route } from "./+types/blog";
import { fetchAllPosts } from "../lib/content.server";
import { Footer } from "../components/Footer";

export function meta() {
  const title = "Articles · yuni.cat";
  const description = "Articles and notes by Harineko.";
  const url = "https://yuni.cat/blog";
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { tagName: "link", rel: "canonical", href: url },
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

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -48 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 280, damping: 26 },
  },
};

export default function BlogIndex({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;

  return (
    <>
      <section style={{ background: "var(--color-magenta)", paddingBottom: "clamp(2rem, 5vw, 4rem)", minHeight: "100vh" }}>
        <div style={{ padding: "clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 4rem) 0" }}>
          <motion.span
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            style={{ display: "inline-block" }}
          >
            <Link to="/" className="font-jp" style={{ color: "#000", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 4 }}>
              ← back
            </Link>
          </motion.span>
        </div>
        <motion.h1
          className="font-compressed"
          style={{ textAlign: "center", color: "#000", fontSize: "clamp(4rem, 9vw, 8rem)", margin: 0, padding: "clamp(2rem, 5vw, 4rem) 0 0", lineHeight: 1 }}
          initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
          animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1], delay: 0.1 }}
        >
          Articles
        </motion.h1>
        <motion.ul
          className="articles-list"
          variants={listVariants}
          initial="hidden"
          animate="show"
        >
          {posts.length === 0 ? (
            <li className="article-row">
              <span className="font-jp">準備中…</span>
            </li>
          ) : (
            posts.map((p) => (
              <motion.li
                key={p._id}
                className="article-row"
                variants={rowVariants}
                whileHover={{ x: 18 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
              >
                <Link to={`/blog/${p.slug}`} className="article-link font-jp">
                  {p.title}
                </Link>
                <span className="article-date font-jp">{formatDate(p.publishedAt)}</span>
              </motion.li>
            ))
          )}
        </motion.ul>
      </section>
      <Footer />
    </>
  );
}
