import { Link, data } from "react-router";
import { motion, type Variants } from "motion/react";
import type { Route } from "./+types/works.$slug";
import { fetchWorkBySlug } from "../lib/content.server";
import { renderMarkdown } from "../lib/markdown.server";
import { buildMeta, ogImageUrl } from "../lib/meta";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { Footer } from "../components/Footer";
import { FadeUp } from "../components/motion/FadeUp";

export function meta({ data: d, params }: Route.MetaArgs) {
  if (!d?.work) return [{ title: "Not found · yuni.cat" }];
  return buildMeta({
    title: `${d.work.title} · works · yuni.cat`,
    description: d.work.summary ?? `${d.work.title} — a work on yuni.cat.`,
    path: `/works/${params.slug}`,
    type: "article",
    image: ogImageUrl("works", params.slug),
    imageAlt: d.work.title,
  });
}

export async function loader({ context, params }: Route.LoaderArgs) {
  const env = context.cloudflare.env as unknown as Record<string, string | undefined>;
  const work = await fetchWorkBySlug(env, params.slug);
  if (!work) throw data("Work not found", { status: 404 });
  const bodyHtml = work.body ? await renderMarkdown(work.body) : null;
  return { work, bodyHtml };
}

const chipListVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.35 } },
};

const chipVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.85 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 22 },
  },
};

export default function WorkDetail({ loaderData }: Route.ComponentProps) {
  const { work, bodyHtml } = loaderData;
  return (
    <>
      <main className="page-shell">
        <Link to="/works" className="back-link font-jp">← all works</Link>

        <header style={{ maxWidth: 960, margin: "2.5rem auto 2rem" }}>
          <motion.p
            className="font-jp"
            style={{ color: "var(--color-yellow)", fontWeight: 700, letterSpacing: "0.02em", marginBottom: "0.6rem" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            {work.year ?? ""}
            {work.role ? ` · ${work.role}` : ""}
          </motion.p>
          <motion.h1
            className="font-compressed work-item-title"
            style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)", marginTop: 0, position: "relative", display: "inline-block" }}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.12 }}
          >
            {work.title}
            <motion.span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: "-0.08em",
                height: "0.1em",
                background: "var(--color-lime)",
                transformOrigin: "left",
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1], delay: 0.45 }}
            />
          </motion.h1>
          {work.summary ? (
            <motion.p
              className="font-jp"
              style={{ color: "#ccc", fontSize: "1.1rem", marginTop: "1rem", lineHeight: 1.6 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {work.summary}
            </motion.p>
          ) : null}
          {work.tech?.length ? (
            <motion.div
              style={{ marginTop: "1.4rem", display: "flex", flexWrap: "wrap", gap: "0.6rem" }}
              variants={chipListVariants}
              initial="hidden"
              animate="show"
            >
              {work.tech.map((t) => (
                <motion.span
                  key={t}
                  className="font-jp"
                  style={{ background: "#1a1a1a", color: "var(--color-lime)", padding: "0.25rem 0.7rem", borderRadius: 3, fontSize: "0.8rem", fontWeight: 600 }}
                  variants={chipVariants}
                  whileHover={{ y: -3, scale: 1.06 }}
                >
                  {t}
                </motion.span>
              ))}
            </motion.div>
          ) : null}
          <motion.div
            style={{ marginTop: "1.4rem", display: "flex", flexWrap: "wrap", gap: "1.2rem" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            {work.url ? (
              <motion.a
                className="font-jp"
                href={work.url}
                target="_blank"
                rel="noreferrer noopener"
                style={{ color: "var(--color-lime)", textDecoration: "underline", fontWeight: 600 }}
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                visit ↗ {work.url.replace(/^https?:\/\//, "")}
              </motion.a>
            ) : null}
            {work.repo ? (
              <motion.a
                className="font-jp"
                href={work.repo}
                target="_blank"
                rel="noreferrer noopener"
                style={{ color: "var(--color-lime)", textDecoration: "underline", fontWeight: 600 }}
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
                source ↗ {work.repo.replace(/^https?:\/\//, "")}
              </motion.a>
            ) : null}
          </motion.div>
        </header>

        <FadeUp className="page-prose font-jp" delay={0.2}>
          {bodyHtml ? (
            <MarkdownRenderer html={bodyHtml} />
          ) : (
            <p style={{ color: "#888" }}>準備中…</p>
          )}
        </FadeUp>

        <div style={{ maxWidth: 760, margin: "4rem auto 0" }}>
          <Link to="/works" className="back-link font-jp">← all works</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
