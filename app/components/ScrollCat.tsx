import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 7;
const FRAME_MS = 150;
const STEP_PX = 6;

export function ScrollCat() {
  const [frame, setFrame] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let raf = 0;
    let lastSteps = -1;
    let wrapWidth = typeof window !== "undefined" ? window.innerWidth : 1280;
    let catWidth = 80;

    const updateSizes = () => {
      const el = imgRef.current;
      if (!el || !el.parentElement) return;
      wrapWidth = el.parentElement.clientWidth;
      catWidth = el.offsetWidth || catWidth;
    };
    updateSizes();
    window.addEventListener("resize", updateSizes);

    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const totalSteps = Math.floor(elapsed / FRAME_MS);
      if (totalSteps !== lastSteps) {
        lastSteps = totalSteps;
        const frameIdx = (totalSteps % FRAME_COUNT) + 1;
        setFrame(frameIdx);
        if (imgRef.current) {
          const cycleDist = Math.max(wrapWidth + catWidth * 2, 200);
          const dist = (totalSteps * STEP_PX) % cycleDist;
          const tx = catWidth - dist;
          imgRef.current.style.transform = `translateX(${tx}px)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", updateSizes);
    };
  }, []);

  return (
    <img
      ref={imgRef}
      src={`/cat_walking_${frame}.svg`}
      alt=""
      className="cat"
      aria-hidden="true"
    />
  );
}
