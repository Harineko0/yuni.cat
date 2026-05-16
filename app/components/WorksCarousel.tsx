import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import type { Work } from "../lib/sanity";

type Props = {
  works: Work[];
};

function centerInStrip(strip: HTMLDivElement, el: HTMLElement, smooth: boolean) {
  const stripRect = strip.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const target =
    strip.scrollLeft +
    (elRect.left - stripRect.left) -
    (stripRect.width - elRect.width) / 2;
  strip.scrollTo({ left: target, behavior: smooth ? "smooth" : "auto" });
}

export function WorksCarousel({ works }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardsStripRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const didMountRef = useRef(false);

  const safeIndex = Math.min(activeIndex, Math.max(works.length - 1, 0));

  useEffect(() => {
    const smooth = didMountRef.current;
    const cardStrip = cardsStripRef.current;
    const card = cardRefs.current[safeIndex];
    if (cardStrip && card) centerInStrip(cardStrip, card, smooth);
    const thumbStrip = thumbStripRef.current;
    const thumb = thumbRefs.current[safeIndex];
    if (thumbStrip && thumb) centerInStrip(thumbStrip, thumb, smooth);
    didMountRef.current = true;
  }, [safeIndex]);

  if (works.length === 0) {
    return <p className="font-jp" style={{ color: "#888" }}>準備中…</p>;
  }

  const goTo = (i: number) => {
    const next = ((i % works.length) + works.length) % works.length;
    setActiveIndex(next);
  };

  return (
    <div
      className="works-carousel"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          goTo(safeIndex + 1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          goTo(safeIndex - 1);
        }
      }}
    >
      <div className="works-cards-viewport">
        <div
          className="works-cards"
          ref={cardsStripRef}
          role="group"
          aria-label="Works"
        >
          {works.map((w, i) => {
            const isActive = i === safeIndex;
            return (
              <motion.div
                key={w._id}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={`works-card-item${isActive ? " is-active" : ""}`}
                whileHover={{ y: -10, rotate: -1.4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                onMouseEnter={() => setActiveIndex(i)}
                onFocus={() => setActiveIndex(i)}
              >
                <Link to={`/works/${w.slug}`} className="work-card">
                  <span className="work-item-title font-compressed">
                    {w.title}
                    {w.year ? ` (${w.year})` : ""}
                  </span>
                  {w.coverImageUrl ? (
                    <img
                      src={w.coverImageUrl}
                      alt={w.coverImage?.alt ?? w.title}
                      className="work-thumb"
                      loading="lazy"
                    />
                  ) : (
                    <div className="work-thumb work-carousel-hero--empty" />
                  )}
                  {w.summary ? (
                    <p className="work-summary font-jp">{w.summary}</p>
                  ) : null}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="works-thumbs-viewport">
        <div
          className="works-thumbs"
          ref={thumbStripRef}
          role="tablist"
          aria-label="Works thumbnails"
        >
          {works.map((w, i) => {
            const isActive = i === safeIndex;
            return (
              <button
                key={w._id}
                ref={(el) => {
                  thumbRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={w.title}
                className={`works-thumb${isActive ? " is-active" : ""}`}
                onClick={() => goTo(i)}
              >
                {w.coverImageUrl ? (
                  <img
                    src={w.coverImageUrl}
                    alt=""
                    loading="lazy"
                    className="works-thumb-img"
                  />
                ) : (
                  <span className="works-thumb-fallback font-compressed">
                    {w.title.slice(0, 2)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
