import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { markIntroReady } from "../lib/use-intro-ready";

const STEP_COUNT = 9;
const STEP_INTERVAL = 0.072;
const HOLD_AFTER_LAST = 0.21;

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const total = (STEP_COUNT * STEP_INTERVAL + HOLD_AFTER_LAST) * 1000;
    const t = setTimeout(() => {
      setVisible(false);
      markIntroReady();
    }, total);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.27, ease: [0.32, 0.72, 0, 1] }}
          aria-hidden="true"
        >
          <div className="loading-footsteps">
            {Array.from({ length: STEP_COUNT }).map((_, i) => {
              const left = `${(i / (STEP_COUNT - 1)) * 100}%`;
              const top = i % 2 === 0 ? "calc(50% - 22px)" : "calc(50% + 6px)";
              const rotate = -25 + (i / (STEP_COUNT - 1)) * 50;
              return (
                <motion.span
                  key={i}
                  className="loading-footstep"
                  style={{ left, top, rotate }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: i * STEP_INTERVAL,
                    duration: 0.12,
                    ease: "easeOut",
                  }}
                />
              );
            })}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
