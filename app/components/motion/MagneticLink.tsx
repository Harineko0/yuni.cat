import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { Link, type LinkProps } from "react-router";

type Props = Omit<LinkProps, "ref"> & {
  strength?: number;
  children: ReactNode;
};

const springConfig = { stiffness: 220, damping: 18, mass: 0.4 };

export function MagneticLink({ strength = 18, children, ...linkProps }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);

  const handleMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(relX * strength * 2);
    y.set(relY * strength * 2);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      style={{ x: sx, y: sy, display: "inline-block" }}
      onMouseMove={handleMove as unknown as (e: MouseEvent<HTMLSpanElement>) => void}
      onMouseLeave={handleLeave}
    >
      <Link {...linkProps} ref={ref}>
        {children}
      </Link>
    </motion.span>
  );
}

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  strength?: number;
  children: ReactNode;
};

export function MagneticAnchor({ strength = 18, children, ...rest }: AnchorProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);

  const handleMove = (e: MouseEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(relX * strength * 2);
    y.set(relY * strength * 2);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      style={{ x: sx, y: sy, display: "inline-block" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <a ref={ref} {...rest}>
        {children}
      </a>
    </motion.span>
  );
}
