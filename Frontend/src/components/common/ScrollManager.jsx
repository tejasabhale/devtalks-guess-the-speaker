import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "lenis/react";

const ScrollManager = () => {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    /*
     * Prevent the browser from restoring a previous scroll
     * position when changing routes.
     */
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const scrollToTarget = () => {
      /*
       * =========================================================
       * HASH SCROLL
       * =========================================================
       *
       * Example:
       * /#guess
       *
       * Lenis handles the movement instead of native anchor
       * scrolling.
       */
      if (hash) {
        const targetId = decodeURIComponent(hash.substring(1));

        const element = document.getElementById(targetId);

        if (!element) return;

        lenis.scrollTo(element, {
          duration: reduceMotion ? 0 : 1.45,
          offset: 0,
          immediate: reduceMotion,
          lock: false,
          force: true,
          easing: (t) => 1 - Math.pow(1 - t, 4),
        });

        return;
      }

      /*
       * =========================================================
       * NORMAL ROUTE CHANGE
       * =========================================================
       *
       * No hash means the page should return to the top.
       */
      lenis.scrollTo(0, {
        duration: reduceMotion ? 0 : 1,
        immediate: reduceMotion,
        lock: false,
        force: true,
        easing: (t) => 1 - Math.pow(1 - t, 4),
      });
    };

    /*
     * Wait one frame so the new route/section has already
     * been mounted before calculating its position.
     */
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(scrollToTarget);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [pathname, hash, lenis]);

  return null;
};

export default ScrollManager;
