import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { ReactLenis, useLenis } from "lenis/react";
import type { LenisOptions } from "lenis";

function ScrollToTopOnRoute() {
  const location = useLocation();
  const lenis = useLenis();
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, lenis]);
  return null;
}

export function SmoothScroll() {
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(".nav-strip");
    if (nav) setHeaderHeight(nav.getBoundingClientRect().height);
  }, []);

  const options = useMemo<LenisOptions>(
    () => ({
      lerp: 0.1,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      autoRaf: true,
      anchors: {
        offset: -headerHeight,
      },
    }),
    [headerHeight],
  );

  return (
    <ReactLenis root options={options}>
      <ScrollToTopOnRoute />
    </ReactLenis>
  );
}
