import { motion, type HTMLMotionProps, type Variants } from "motion/react";

const parentVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 28 },
  },
};

type StaggerListProps = HTMLMotionProps<"div"> & {
  as?: "div" | "ul" | "nav" | "section";
  once?: boolean;
};

export function StaggerList({
  as = "div",
  once = true,
  children,
  ...rest
}: StaggerListProps) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      variants={parentVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-10% 0px" }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

type StaggerItemProps = HTMLMotionProps<"div"> & {
  as?: "div" | "li" | "a" | "article" | "span";
};

export function StaggerItem({ as = "div", children, ...rest }: StaggerItemProps) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag variants={itemVariants} {...rest}>
      {children}
    </MotionTag>
  );
}
