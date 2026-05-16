import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  animate,
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import type { Route } from "./+types/home";
import { fetchLatestPosts, fetchLatestWorks } from "../lib/content.server";
import { buildMeta } from "../lib/meta";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { useIntroReady } from "../lib/use-intro-ready";
import { ScrollCat } from "../components/ScrollCat";
import { ScrollMountain } from "../components/ScrollMountain";
import { BackgroundLogoMarquee } from "../components/BackgroundLogoMarquee";
import { GlitchTitle } from "../components/GlitchTitle";
import { SprayNoise } from "../components/SprayNoise";
import { Typewriter } from "../components/Typewriter";
import { WorksCarousel } from "../components/WorksCarousel";

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

const articleListVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const ABOUT_LINES = [
  "Student at University of Osaka, Faculty of Engineering Science, Department of Information Science",
  "Web, Mobile, Backend Software Engineer at startup companies",
  "Ex-Organizer, Google Developer Group on Campus University of Osaka",
  "anti-OOP",
];
const TYPE_SPEED = 0.01;
const LINE_GAP = 0.08;
const ABOUT_DELAYS = ABOUT_LINES.reduce<number[]>((acc, line, i) => {
  const prev = i === 0 ? 0 : acc[i - 1]! + ABOUT_LINES[i - 1]!.length * TYPE_SPEED + LINE_GAP;
  acc.push(prev);
  return acc;
}, []);

const heroSectionVariants: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  show: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

const heroSvgVariants: Variants = {
  hidden: { scaleY: 1.18, y: -12 },
  show: {
    scaleY: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 180,
      damping: 18,
      mass: 0.9,
      delay: 0.15,
    },
  },
};

const GLITCH_DELAY_MS = 1300;
const GLITCH_DURATION = 0.32;
const GLITCH_RED = {
  x: [0, -38, 26, -42, 18, -8, 14, 0],
  y: [0, 4, -3, 2, -4, 1, 0, 0],
  opacity: [0, 1, 1, 0.95, 1, 0.7, 0.4, 0],
  times: [0, 0.04, 0.14, 0.28, 0.46, 0.66, 0.86, 1],
};
const GLITCH_GREEN = {
  x: [0, 32, -28, 36, -14, 6, -10, 0],
  y: [0, -3, 4, -2, 3, -1, 0, 0],
  opacity: [0, 1, 1, 1, 0.9, 0.6, 0.3, 0],
  times: [0, 0.06, 0.18, 0.32, 0.5, 0.7, 0.88, 1],
};
const GLITCH_BLUE = {
  x: [0, -16, 44, -30, 24, -4, 8, 0],
  y: [0, 3, -4, 1, -2, 1, 0, 0],
  opacity: [0, 1, 1, 0.95, 1, 0.65, 0.35, 0],
  times: [0, 0.05, 0.16, 0.3, 0.48, 0.68, 0.87, 1],
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
  const introReady = useIntroReady();
  const [glitchDone, setGlitchDone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const redX = useMotionValue(0);
  const redY = useMotionValue(0);
  const redOpacity = useMotionValue(0);
  const greenX = useMotionValue(0);
  const greenY = useMotionValue(0);
  const greenOpacity = useMotionValue(0);
  const blueX = useMotionValue(0);
  const blueY = useMotionValue(0);
  const blueOpacity = useMotionValue(0);

  useEffect(() => {
    if (!introReady) return;
    const t = setTimeout(() => {
      const opts = { duration: GLITCH_DURATION, ease: "linear" as const };
      animate(redX, GLITCH_RED.x, { ...opts, times: GLITCH_RED.times });
      animate(redY, GLITCH_RED.y, { ...opts, times: GLITCH_RED.times });
      animate(redOpacity, GLITCH_RED.opacity, {
        ...opts,
        times: GLITCH_RED.times,
      });
      animate(greenX, GLITCH_GREEN.x, { ...opts, times: GLITCH_GREEN.times });
      animate(greenY, GLITCH_GREEN.y, { ...opts, times: GLITCH_GREEN.times });
      animate(greenOpacity, GLITCH_GREEN.opacity, {
        ...opts,
        times: GLITCH_GREEN.times,
      });
      animate(blueX, GLITCH_BLUE.x, { ...opts, times: GLITCH_BLUE.times });
      animate(blueY, GLITCH_BLUE.y, { ...opts, times: GLITCH_BLUE.times });
      animate(blueOpacity, GLITCH_BLUE.opacity, {
        ...opts,
        times: GLITCH_BLUE.times,
      });
    }, GLITCH_DELAY_MS);
    const tDone = setTimeout(
      () => setGlitchDone(true),
      GLITCH_DELAY_MS + GLITCH_DURATION * 1000,
    );
    return () => {
      clearTimeout(t);
      clearTimeout(tDone);
    };
  }, [
    introReady,
    redX,
    redY,
    redOpacity,
    greenX,
    greenY,
    greenOpacity,
    blueX,
    blueY,
    blueOpacity,
  ]);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const worksBannerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: worksBannerProgress } = useScroll({
    target: worksBannerRef,
    offset: ["start end", "end center"],
  });
  const worksBannerX = useTransform(
    worksBannerProgress,
    [0, 1],
    ["-110%", "0%"],
  );
  const worksBannerRotate = useTransform(
    worksBannerProgress,
    [0, 1],
    [-6, -1.2],
  );

  useEffect(() => {
    if (!nyan) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = true;
    void audio.play().catch(() => {});
    const unlock = () => {
      audio.muted = false;
      void audio.play().catch(() => {});
      setAudioUnlocked(true);
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    window.addEventListener("touchstart", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
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
            muted
            playsInline
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
      <motion.section
        className="hero-block"
        aria-label={heroLabel}
        variants={heroSectionVariants}
        initial="hidden"
        animate={introReady ? "show" : "hidden"}
      >
        <motion.svg
          className="hero-svg"
          viewBox="0 0 1000 150"
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label={heroLabel}
          variants={heroSvgVariants}
          initial="hidden"
          animate={introReady ? "show" : "hidden"}
          style={{ originY: 1, transformOrigin: "center bottom" }}
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
          <g aria-hidden="true">
            <motion.text
              x="500"
              y="146"
              textAnchor="middle"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
              className="font-compressed"
              fontSize="200"
              fontWeight="900"
              fill="#ff0000"
              style={{ x: redX, y: redY, opacity: redOpacity }}
            >
              {heroLabel}
            </motion.text>
            <motion.text
              x="500"
              y="146"
              textAnchor="middle"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
              className="font-compressed"
              fontSize="200"
              fontWeight="900"
              fill="#00ff00"
              style={{ x: greenX, y: greenY, opacity: greenOpacity }}
            >
              {heroLabel}
            </motion.text>
            <motion.text
              x="500"
              y="146"
              textAnchor="middle"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
              className="font-compressed"
              fontSize="200"
              fontWeight="900"
              fill="#0000ff"
              style={{ x: blueX, y: blueY, opacity: blueOpacity }}
            >
              {heroLabel}
            </motion.text>
          </g>
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
        </motion.svg>
      </motion.section>

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
        <motion.div
          className="about-body font-hand"
          initial="hidden"
          animate={glitchDone ? "show" : "hidden"}
        >
          {ABOUT_LINES.map((line, i) => (
            <p key={i}>
              <Typewriter
                text={line}
                delay={ABOUT_DELAYS[i]}
                speed={TYPE_SPEED}
              />
            </p>
          ))}
        </motion.div>
        <div className="mountain-wrap">
          <ScrollCat />
          {nyan ? (
            <button
              type="button"
              className="nyan-mountain-cat"
              aria-label="Play nyan music"
            >
              {!audioUnlocked ? (
                <span className="nyan-tap-me" aria-hidden="true">
                  {String.raw`\TAP ME!/`}
                </span>
              ) : null}
              <img src="/nyancat_original.gif" alt="" aria-hidden="true" />
            </button>
          ) : null}
          <ScrollMountain />
        </div>
      </section>

      {/* ── WORKS ── */}
      <section id="works" className="works-block">
        <BackgroundLogoMarquee label={heroLabel} />
        <div ref={worksBannerRef} className="works-banner-track">
          <motion.div
            className="works-banner"
            style={{ x: worksBannerX, rotate: worksBannerRotate }}
          >
            <motion.span
              className="works-title font-compacta"
              style={{ display: "inline-block" }}
              animate={{ rotate: [-1.2, -2.6, -1.2] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              Works
            </motion.span>
          </motion.div>
        </div>
        <div className="works-carousel-wrap">
          <WorksCarousel works={works} />
        </div>
      </section>

      {/* ── ARTICLES (spray transition baked-in) ── */}
      <section id="articles" className="articles-block">
        <SprayNoise className="articles-spray" />
        <motion.h2
          className="articles-title font-compressed"
          initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
          whileInView={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        >
          <GlitchTitle text="Articles" />
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
