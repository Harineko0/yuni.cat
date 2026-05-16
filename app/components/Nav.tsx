import { motion, type Variants } from "motion/react";
import { personal } from "../lib/personal";

const NAV_LINKS = [
  { label: "ARTICLES", href: "#articles", external: false },
  { label: "GITHUB", id: "github" as const },
  { label: "TWITTER", id: "x" as const },
  { label: "INSTAGRAM", href: "https://instagram.com/", external: true },
  { label: "ZENN", id: "zenn" as const },
  { label: "QIITA", id: "qiita" as const },
];

function resolve(item: typeof NAV_LINKS[number]) {
  if ("id" in item && item.id) {
    const s = personal.socials.find((s) => s.id === item.id);
    return { href: s?.url ?? "#", external: true };
  }
  return { href: (item as { href: string }).href, external: (item as { external?: boolean }).external ?? false };
}

const stripVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const linkVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 26 },
  },
};

export function Nav() {
  return (
    <motion.nav
      className="nav-strip font-compressed"
      aria-label="primary"
      variants={stripVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-15% 0px" }}
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
            variants={linkVariants}
            whileHover={{ y: -4, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
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
