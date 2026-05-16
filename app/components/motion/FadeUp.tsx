import { motion, type HTMLMotionProps } from "motion/react";

type Props = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  once?: boolean;
};

export function FadeUp({ delay = 0, y = 32, once = true, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-10% 0px" }}
      transition={{ type: "spring", stiffness: 240, damping: 30, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
