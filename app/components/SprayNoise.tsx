import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  color?: string;
  pixelSize?: number;
  aspectRatio?: number;
};

function hash(x: number, y: number, seed: number): number {
  let h = Math.imul(x | 0, 374761393);
  h = (h + Math.imul(y | 0, 668265263)) | 0;
  h = (h + Math.imul(seed | 0, 1274126177)) | 0;
  h ^= h >>> 13;
  h = Math.imul(h, 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 0x100000000;
}

export function SprayNoise({
  className,
  color = "#000",
  pixelSize = 4,
  aspectRatio = 1024 / 342,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const seedRef = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let dirty = false;

    const draw = () => {
      raf = 0;
      dirty = false;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = color;
      const cols = Math.ceil(width / pixelSize);
      const rows = Math.ceil(height / pixelSize);
      if (cols <= 0 || rows <= 0) return;
      const seed = seedRef.current;
      // Probability curve: ~1 at top, ~0 at bottom, with the
      // "dither band" sitting in the middle third.
      for (let y = 0; y < rows; y++) {
        const t = y / Math.max(1, rows - 1);
        // remap so solid black ends ~5% from top, fully clear ~60% down
        const p = 1 - Math.max(0, Math.min(1, (t - 0.05) / 0.55));
        // tilt with a slight curve so density falls off more naturally
        const threshold = p * p * (3 - 2 * p);
        for (let x = 0; x < cols; x++) {
          if (hash(x, y, seed) < threshold) {
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
          }
        }
      }
    };

    const requestDraw = () => {
      if (dirty) return;
      dirty = true;
      raf = requestAnimationFrame(draw);
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      if (w === width && h === height) return;
      width = w;
      height = h;
      canvas.width = w;
      canvas.height = h;
      requestDraw();
    };

    const onScroll = () => {
      const next = Math.floor(window.scrollY / 60);
      if (next === seedRef.current) return;
      seedRef.current = next;
      requestDraw();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();
    seedRef.current = Math.floor(window.scrollY / 60);
    requestDraw();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [color, pixelSize]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ aspectRatio: `${aspectRatio}` }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
