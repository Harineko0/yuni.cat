import { Outlet, useLocation } from "react-router";
import { AnimatePresence, motion } from "motion/react";

export function RouteTransition() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
        style={{ willChange: "transform, opacity" }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
