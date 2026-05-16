import { motion, type Variants } from "motion/react";

type Props = {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
};

const charVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0 } },
};

export function Typewriter({
  text,
  delay = 0,
  speed = 0.012,
  className,
}: Props) {
  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: speed, delayChildren: delay },
    },
  };
  return (
    <motion.span
      className={className}
      variants={container}
      aria-label={text}
    >
      {Array.from(text).map((ch, i) => (
        <motion.span key={i} variants={charVariants} aria-hidden="true">
          {ch}
        </motion.span>
      ))}
    </motion.span>
  );
}
