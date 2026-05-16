import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const IDLE_SIZE = 28;
const ARM = 12;
const THICKNESS = 1.5;
const TARGET_PADDING = 8;
const DOT_SIZE = 6;

const FRAME_SPRING = { stiffness: 320, damping: 30, mass: 0.5 };
const DOT_SPRING = { stiffness: 900, damping: 42, mass: 0.18 };

const TARGET_SELECTOR =
  'a, button, [role="button"], [data-magnetic-target]:not([data-magnetic-ignore])';

export function MagneticCursor() {
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const w = useMotionValue(IDLE_SIZE);
  const h = useMotionValue(IDLE_SIZE);
  const dotX = useMotionValue(-200);
  const dotY = useMotionValue(-200);
  const opacity = useMotionValue(0);

  const sx = useSpring(x, FRAME_SPRING);
  const sy = useSpring(y, FRAME_SPRING);
  const sw = useSpring(w, FRAME_SPRING);
  const sh = useSpring(h, FRAME_SPRING);
  const sDotX = useSpring(dotX, DOT_SPRING);
  const sDotY = useSpring(dotY, DOT_SPRING);

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

    document.body.classList.add("magnetic-cursor-on");

    const handleMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;
      opacity.set(1);
      dotX.set(e.clientX - DOT_SIZE / 2);
      dotY.set(e.clientY - DOT_SIZE / 2);

      const el = e.target as Element | null;
      const target = el?.closest(TARGET_SELECTOR) as HTMLElement | null;

      if (target) {
        const r = target.getBoundingClientRect();
        x.set(r.left - TARGET_PADDING);
        y.set(r.top - TARGET_PADDING);
        w.set(r.width + TARGET_PADDING * 2);
        h.set(r.height + TARGET_PADDING * 2);
      } else {
        x.set(e.clientX - IDLE_SIZE / 2);
        y.set(e.clientY - IDLE_SIZE / 2);
        w.set(IDLE_SIZE);
        h.set(IDLE_SIZE);
      }
    };

    const handleLeave = () => opacity.set(0);
    const handleEnter = () => opacity.set(1);

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handleLeave);
    document.documentElement.addEventListener("pointerenter", handleEnter);

    return () => {
      document.body.classList.remove("magnetic-cursor-on");
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
      document.documentElement.removeEventListener("pointerenter", handleEnter);
    };
  }, [enabled, opacity, dotX, dotY, x, y, w, h]);

  if (!enabled) return null;

  const corner: React.CSSProperties = {
    position: "absolute",
    width: ARM,
    height: ARM,
  };
  const line = `${THICKNESS}px solid #fff`;

  return (
    <>
      <motion.div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: sx,
          y: sy,
          width: sw,
          height: sh,
          pointerEvents: "none",
          zIndex: 2147483646,
          opacity,
          mixBlendMode: "difference",
        }}
      >
        <span style={{ ...corner, top: 0, left: 0, borderTop: line, borderLeft: line }} />
        <span style={{ ...corner, top: 0, right: 0, borderTop: line, borderRight: line }} />
        <span style={{ ...corner, bottom: 0, left: 0, borderBottom: line, borderLeft: line }} />
        <span style={{ ...corner, bottom: 0, right: 0, borderBottom: line, borderRight: line }} />
      </motion.div>

      <motion.div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          x: sDotX,
          y: sDotY,
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: "50%",
          background: "#fff",
          pointerEvents: "none",
          zIndex: 2147483647,
          opacity,
          mixBlendMode: "difference",
        }}
      />
    </>
  );
}
