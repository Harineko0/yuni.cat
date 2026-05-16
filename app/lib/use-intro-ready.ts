import { useEffect, useState } from "react";

declare global {
  interface Window {
    __introReady?: boolean;
  }
}

export const INTRO_READY_EVENT = "intro:ready";

export function markIntroReady() {
  if (typeof window === "undefined") return;
  window.__introReady = true;
  window.dispatchEvent(new Event(INTRO_READY_EVENT));
}

export function useIntroReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.__introReady === true) {
      setReady(true);
      return;
    }
    const onReady = () => setReady(true);
    window.addEventListener(INTRO_READY_EVENT, onReady);
    return () => window.removeEventListener(INTRO_READY_EVENT, onReady);
  }, []);

  return ready;
}
