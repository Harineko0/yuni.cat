import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import type { Work } from "../lib/sanity";

type Props = {
  work: Work | null;
};

const CARD_WIDTH = 320;
const CARD_HEIGHT_ESTIMATE = 320;
const OFFSET_X = 28;
const OFFSET_Y = 24;
const EDGE_PAD = 16;

const SPRING = { stiffness: 380, damping: 32, mass: 0.5 };

function markdownToPlain(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .join("\n");
}

export function WorkHoverCard({ work }: Props) {
  const [enabled, setEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const x = useMotionValue(-CARD_WIDTH);
  const y = useMotionValue(-CARD_HEIGHT_ESTIMATE);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: fine)");
    setEnabled(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const handle = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let nx = e.clientX + OFFSET_X;
      let ny = e.clientY + OFFSET_Y;
      if (nx + CARD_WIDTH + EDGE_PAD > vw) {
        nx = e.clientX - OFFSET_X - CARD_WIDTH;
      }
      if (ny + CARD_HEIGHT_ESTIMATE + EDGE_PAD > vh) {
        ny = Math.max(EDGE_PAD, e.clientY - OFFSET_Y - CARD_HEIGHT_ESTIMATE);
      }
      x.set(nx);
      y.set(ny);
    };
    window.addEventListener("pointermove", handle, { passive: true });
    return () => window.removeEventListener("pointermove", handle);
  }, [enabled, x, y]);

  if (!enabled || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      {work ? (
        <motion.div
          key={work._id}
          aria-hidden="true"
          className="work-hover-card"
          style={{ x: sx, y: sy, width: CARD_WIDTH }}
          initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: -1.2 }}
          exit={{ opacity: 0, scale: 0.92, rotate: -3 }}
          transition={{ type: "spring", stiffness: 360, damping: 26 }}
        >
          <div className="work-hover-card__meta font-jp">
            {work.year ?? ""}
            {work.role ? ` · ${work.role}` : ""}
          </div>
          <div className="work-hover-card__title font-compressed">
            {work.title}
          </div>
          {work.summary ? (
            <p className="work-hover-card__summary font-jp">{work.summary}</p>
          ) : null}
          {(() => {
            const bodyText = markdownToPlain(work.body);
            return bodyText ? (
              <p className="work-hover-card__body font-jp">{bodyText}</p>
            ) : null;
          })()}
          {work.tech?.length ? (
            <div className="work-hover-card__tech">
              {work.tech.slice(0, 5).map((t) => (
                <span key={t} className="work-hover-card__chip font-jp">
                  {t}
                </span>
              ))}
            </div>
          ) : null}
          <div className="work-hover-card__cta font-jp">view detail ↗</div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
