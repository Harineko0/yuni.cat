import { motion, type Variants } from "motion/react";
import { personal } from "../lib/personal";
import { useIntroReady } from "../lib/use-intro-ready";

const NAV_LINKS = [
  { label: "ARTICLES", href: "#articles", external: false },
  { label: "WORKS", href: "#works", external: false },
  { label: "GITHUB", id: "github" as const },
  { label: "TWITTER", id: "x" as const },
  { label: "INSTAGRAM", href: "https://instagram.com/", external: true },
  { label: "LINKEDIN", id: "linkedin" as const },
  { label: "ZENN", id: "zenn" as const },
  { label: "QIITA", id: "qiita" as const },
  { label: "NYAN", href: "/?nyan", external: false },
];

function resolve(item: (typeof NAV_LINKS)[number]) {
  if ("id" in item && item.id) {
    const s = personal.socials.find((s) => s.id === item.id);
    return { href: s?.url ?? "#", external: true };
  }
  return {
    href: (item as { href: string }).href,
    external: (item as { external?: boolean }).external ?? false,
  };
}

const navContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.45 },
  },
};

const navItem: Variants = {
  hidden: { opacity: 0, y: "100%" },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 26, mass: 0.7 },
  },
};

export function Nav() {
  const introReady = useIntroReady();
  return (
    <motion.nav
      className="nav-strip font-compressed"
      aria-label="primary"
      variants={navContainer}
      initial="hidden"
      animate={introReady ? "show" : "hidden"}
    >
      {NAV_LINKS.map((item) => {
        const { href, external } = resolve(item);
        return (
          <motion.a
            key={item.label}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer noopener" : undefined}
            className="nav-link"
            variants={navItem}
          >
            <span className="nav-link-label">{item.label}</span>
            <span className="nav-link-fill" aria-hidden="true">
              <span className="nav-link-fill-text">{item.label}</span>
            </span>
          </motion.a>
        );
      })}
    </motion.nav>
  );
}
