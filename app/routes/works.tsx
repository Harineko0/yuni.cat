import { Link } from "react-router";
import { motion, type Variants } from "motion/react";
import type { Route } from "./+types/works";
import { fetchAllWorks } from "../lib/content.server";
import { buildMeta, ogImageUrl } from "../lib/meta";
import { Footer } from "../components/Footer";
import { TiltCard } from "../components/motion/TiltCard";

export function meta() {
  return buildMeta({
    title: "Works · yuni.cat",
    description: "Selected works by Harineko.",
    path: "/works",
    image: ogImageUrl("works"),
    imageAlt: "Works · yuni.cat",
  });
}

export async function loader({ context }: Route.LoaderArgs) {
  const env = context.cloudflare.env as unknown as Record<string, string | undefined>;
  const works = await fetchAllWorks(env);
  return { works };
}

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 60, rotate: -2 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 240, damping: 24 },
  },
};

export default function WorksIndex({ loaderData }: Route.ComponentProps) {
  const { works } = loaderData;

  return (
    <>
      <main className="page-shell">
        <Link to="/" className="back-link font-jp">← back</Link>
        <div className="works-block" style={{ marginTop: "2rem" }}>
          <div className="works-banner">
            <motion.span
              className="works-title font-compacta"
              style={{ display: "inline-block" }}
              animate={{ rotate: [-1.2, -2.6, -1.2] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              Works
            </motion.span>
          </div>
          <motion.div
            className="works-list"
            variants={listVariants}
            initial="hidden"
            animate="show"
          >
            {works.length === 0 ? (
              <p className="font-jp" style={{ color: "#888" }}>準備中…</p>
            ) : (
              works.map((w) => (
                <motion.div key={w._id} variants={cardVariants}>
                  <TiltCard intensity={8}>
                    <Link to={`/works/${w.slug}`} className="work-card">
                      <span className="work-item-title font-compressed">
                        {w.title}
                        {w.year ? ` (${w.year})` : ""}
                      </span>
                      {w.coverImageUrl ? (
                        <motion.img
                          src={w.coverImageUrl}
                          alt={w.coverImage?.alt ?? w.title}
                          className="work-thumb"
                          loading="lazy"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 280, damping: 24 }}
                        />
                      ) : null}
                      {w.summary ? <p className="work-summary font-jp">{w.summary}</p> : null}
                    </Link>
                  </TiltCard>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
