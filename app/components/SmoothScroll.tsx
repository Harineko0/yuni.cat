import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import type LocomotiveScroll from "locomotive-scroll";
import { INTRO_READY_EVENT } from "../lib/use-intro-ready";

export function SmoothScroll() {
  const location = useLocation();
  const scrollRef = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;

    const init = async () => {
      try {
        const { default: LocomotiveScrollCtor } = await import("locomotive-scroll");
        if (cancelled || scrollRef.current) return;
        scrollRef.current = new LocomotiveScrollCtor({
          autoStart: true,
          lenisOptions: {
            lerp: 0.08,
            smoothWheel: true,
            syncTouch: true,
            syncTouchLerp: 0.075,
            touchInertiaExponent: 1.7,
            wheelMultiplier: 1,
            touchMultiplier: 1.5,
          },
        });
      } catch (err) {
        console.error("[SmoothScroll] init failed", err);
      }
    };

    if (window.__introReady) {
      init();
    } else {
      const onReady = () => {
        window.removeEventListener(INTRO_READY_EVENT, onReady);
        init();
      };
      window.addEventListener(INTRO_READY_EVENT, onReady);
      return () => {
        cancelled = true;
        window.removeEventListener(INTRO_READY_EVENT, onReady);
        scrollRef.current?.destroy();
        scrollRef.current = null;
      };
    }

    return () => {
      cancelled = true;
      scrollRef.current?.destroy();
      scrollRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return null;
}
