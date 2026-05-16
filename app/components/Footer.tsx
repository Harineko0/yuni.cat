import { motion } from "motion/react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <motion.footer
      className="site-footer font-jp"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{ type: "spring", stiffness: 240, damping: 30 }}
    >
      harineko @ {year}
    </motion.footer>
  );
}
