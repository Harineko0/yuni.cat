import { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import { motion, type Variants } from "motion/react";
import type { Route } from "./+types/home";
import { fetchLatestPosts, fetchLatestWorks } from "../lib/content.server";
import { buildMeta } from "../lib/meta";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { ScrollCat } from "../components/ScrollCat";

export function meta({ location }: Route.MetaArgs) {
  const nyan = new URLSearchParams(location.search).has("nyan");
  return buildMeta({
    title: nyan ? "nyan.cat" : "yuni.cat",
    description:
      "Portfolio of Harineko — student at the University of Osaka and software engineer.",
    path: nyan ? "/?nyan" : "/",
    image: nyan ? "https://yuni.cat/ogp_nyan.png" : undefined,
    imageWidth: nyan ? 2560 : undefined,
    imageHeight: nyan ? 1360 : undefined,
    imageAlt: nyan ? "nyan.cat" : undefined,
  });
}

export async function loader({ context }: Route.LoaderArgs) {
  const env = context.cloudflare.env as unknown as Record<
    string,
    string | undefined
  >;
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

const workListVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const workItemVariants: Variants = {
  hidden: { opacity: 0, y: 60, rotate: -2 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 240, damping: 24 },
  },
};

const articleListVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const articleRowVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 26 },
  },
};

export default function Home({ loaderData }: Route.ComponentProps) {
  const { posts, works } = loaderData;
  const [searchParams] = useSearchParams();
  const nyan = searchParams.has("nyan");
  const heroLabel = nyan ? "nyan.cat" : "yunineko/cat";
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!nyan) return;
    const audio = audioRef.current;
    if (!audio) return;
    const tryPlay = () => {
      void audio.play().catch(() => {});
    };
    tryPlay();
    const unlock = () => {
      tryPlay();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [nyan]);

  return (
    <main className={nyan ? "nyan-mode" : undefined}>
      {nyan ? (
        <>
          <audio
            ref={audioRef}
            src="/nyancat_original.mp3"
            autoPlay
            loop
            preload="auto"
          />
          <div className="nyan-strip" aria-hidden="true">
            <div className="nyan-strip-track">
              {Array.from({ length: 8 }).map((_, i) => (
                <img
                  key={i}
                  src="/nyancat_original.gif"
                  alt=""
                  className="nyan-strip-cat"
                />
              ))}
            </div>
          </div>
        </>
      ) : null}

      {/* ── HERO ── */}
      <section className="hero-block" aria-label={heroLabel}>
        <svg
          className="hero-svg"
          viewBox="0 0 1000 150"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label={heroLabel}
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
            {heroLabel}
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
            {heroLabel}
          </text>
        </svg>
      </section>

      {/* ── NAV ── */}
      <Nav />

      {/* ── ABOUT ── */}
      <section className="about-block">
        <motion.h2
          className="about-title font-compacta"
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ type: "spring", stiffness: 220, damping: 24 }}
        >
          About
        </motion.h2>
        <div className="about-body font-hand">
          <p>
            Student at University of Osaka, Faculty of Engineering Science,
            Department of Information Science
          </p>
          <p>Web, Mobile, Backend Software Engineer at startup companies</p>
          <p>Ex-Organizer, Google Developer Group on Campus University of Osaka</p>
          <p>anti-OOP</p>
        </div>
        <div className="mountain-wrap">
          <ScrollCat />
          {nyan ? (
            <img
              src="/nyancat_original.gif"
              alt=""
              className="nyan-mountain-cat"
              aria-hidden="true"
            />
          ) : null}
          <img
            src="/mountain.svg"
            alt=""
            className="mountain"
            aria-hidden="true"
          />
        </div>
      </section>

      {/* ── WORKS ── */}
      <section className="works-block">
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
          variants={workListVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
        >
          {works.map((w) => (
            <motion.div key={w._id} variants={workItemVariants}>
              <motion.div
                whileHover={{ y: -10, rotate: -1.4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
              >
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
                      whileHover={{ scale: 1.06 }}
                      transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 24,
                      }}
                    />
                  ) : null}
                  {w.summary ? (
                    <p className="work-summary font-jp">{w.summary}</p>
                  ) : null}
                </Link>
              </motion.div>
            </motion.div>
          ))}
          {works.length === 0 ? (
            <p className="font-jp" style={{ color: "#888" }}>
              準備中…
            </p>
          ) : null}
        </motion.div>
      </section>

      {/* ── ARTICLES (spray transition baked-in) ── */}
      <section id="articles" className="articles-block">
        <motion.h2
          className="articles-title font-compressed"
          initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        >
          Articles
        </motion.h2>
        <motion.ul
          className="articles-list"
          variants={articleListVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
        >
          {posts.map((p) => (
            <motion.li
              key={p._id}
              className="article-row"
              variants={articleRowVariants}
              whileHover={{ x: 16 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
            >
              <Link to={`/blog/${p.slug}`} className="article-link font-jp">
                {p.title}
              </Link>
              <span className="article-date font-jp">
                {formatDate(p.publishedAt)}
              </span>
            </motion.li>
          ))}
          {posts.length === 0 ? (
            <li className="article-row">
              <span className="font-jp">準備中…</span>
            </li>
          ) : null}
        </motion.ul>
      </section>

      <Footer />
    </main>
  );
}
