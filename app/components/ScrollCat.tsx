import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 12;
const PX_PER_FRAME = 40;
const STEP_PX = 12;

export function ScrollCat() {
  const [frame, setFrame] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const steps = Math.max(0, Math.floor(window.scrollY / PX_PER_FRAME));
      const next = (steps % FRAME_COUNT) + 1;
      setFrame(next);
      if (imgRef.current) {
        imgRef.current.style.transform = `translateX(${-steps * STEP_PX}px)`;
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
