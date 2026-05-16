import { useEffect } from "react";
import { motion, useMotionValue } from "motion/react";

type Props = {
  text: string;
  className?: string;
};

export function GlitchTitle({ text, className }: Props) {
  const redX = useMotionValue(0);
  const redY = useMotionValue(0);
  const greenX = useMotionValue(0);
  const greenY = useMotionValue(0);
  const blueX = useMotionValue(0);
  const blueY = useMotionValue(0);
  const skew = useMotionValue(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const BURST_CYCLE_MS = 4800;
    const BURST_DURATION_MS = 700;
    const AMBIENT = 0.18;
    const PEAK_OFFSET = 18;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = elapsed / 1000;
      const burstPhase = elapsed % BURST_CYCLE_MS;
      const burst =
        burstPhase < BURST_DURATION_MS
          ? Math.sin((burstPhase / BURST_DURATION_MS) * Math.PI)
          : 0;
      const intensity = Math.max(burst, AMBIENT);

      redX.set(Math.sin(t * 11) * intensity * PEAK_OFFSET);
      redY.set(Math.cos(t * 9.3) * intensity * (PEAK_OFFSET * 0.25));
      greenX.set(-Math.cos(t * 9) * intensity * PEAK_OFFSET);
      greenY.set(Math.sin(t * 10.2) * intensity * (PEAK_OFFSET * 0.25));
      blueX.set(Math.sin(t * 13 + 1.2) * intensity * (PEAK_OFFSET * 0.85));
      blueY.set(-Math.cos(t * 11.7) * intensity * (PEAK_OFFSET * 0.3));
      skew.set(Math.sin(t * 5.4) * intensity * 2.2);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [blueX, blueY, greenX, greenY, redX, redY, skew]);

  return (
    <span className={`glitch-wrap ${className ?? ""}`}>
      <motion.span
        className="glitch-layer glitch-red"
        style={{ x: redX, y: redY }}
        aria-hidden="true"
      >
        {text}
      </motion.span>
      <motion.span
        className="glitch-layer glitch-green"
        style={{ x: greenX, y: greenY }}
        aria-hidden="true"
      >
        {text}
      </motion.span>
      <motion.span
        className="glitch-layer glitch-blue"
        style={{ x: blueX, y: blueY }}
        aria-hidden="true"
      >
        {text}
      </motion.span>
      <motion.span className="glitch-main" style={{ skewX: skew }}>
        {text}
      </motion.span>
    </span>
  );
}
