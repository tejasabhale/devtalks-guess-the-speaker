import { useEffect, useLayoutEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * DevTalks hero section — DevKraft club
 *
 * - Global Lenis handles smooth page scrolling.
 * - GSAP ScrollTrigger adds subtle scroll-based parallax.
 * - The scroll animation reverses naturally when scrolling upward.
 * - Pointer parallax remains enabled for desktop.
 * - Reduced-motion is respected.
 */

const SIGNALS = [
  { top: "16%", left: "12%", delay: 0 },
  { top: "24%", left: "84%", delay: 1.2 },
  { top: "72%", left: "10%", delay: 2.4 },
  { top: "78%", left: "88%", delay: 3.6 },
  { top: "42%", left: "92%", delay: 1.8 },
  { top: "82%", left: "46%", delay: 4.5 },
];

/* =========================================================
   HERO SCROLL ANIMATION
========================================================= */

function useHeroScrollAnimation(
  heroRef,
  contentRef,
  iconsRef,
  gridRef,
  glowRef,
  indicatorRef,
  reduceMotion,
) {
  useLayoutEffect(() => {
    if (reduceMotion) return;

    const hero = heroRef.current;

    if (!hero) return;

    const content = contentRef.current;
    const icons = iconsRef.current;
    const grid = gridRef.current;
    const glow = glowRef.current;
    const indicator = indicatorRef.current;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
        },
        (context) => {
          const { desktop } = context.conditions;

          /*
           * The entire animation is tied to scroll position.
           *
           * Scroll down -> moves toward the end state.
           * Scroll up   -> moves back toward the start state.
           */
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 1.25,
              invalidateOnRefresh: true,
            },
          });

          /*
           * Main hero content.
           */
          if (content) {
            timeline.fromTo(
              content,
              {
                y: 0,
                scale: 1,
                opacity: 1,
              },
              {
                y: desktop ? -90 : -55,
                scale: desktop ? 0.96 : 0.98,
                opacity: desktop ? 0.55 : 0.68,
                ease: "none",
              },
              0,
            );
          }

          /*
           * Floating icons move slower than content.
           */
          if (icons) {
            timeline.fromTo(
              icons,
              {
                y: 0,
                x: 0,
                scale: 1,
              },
              {
                y: desktop ? 55 : 28,
                x: desktop ? 18 : 8,
                scale: desktop ? 1.05 : 1.025,
                ease: "none",
              },
              0,
            );
          }

          /*
           * Background grid shifts at a different rate.
           */
          if (grid) {
            timeline.fromTo(
              grid,
              {
                y: 0,
                scale: 1,
              },
              {
                y: desktop ? -35 : -18,
                scale: desktop ? 1.05 : 1.025,
                ease: "none",
              },
              0,
            );
          }

          /*
           * Orange atmosphere expands slightly while leaving.
           */
          if (glow) {
            timeline.fromTo(
              glow,
              {
                scale: 1,
                opacity: 1,
              },
              {
                scale: desktop ? 1.12 : 1.06,
                opacity: desktop ? 0.72 : 0.82,
                ease: "none",
              },
              0,
            );
          }

          /*
           * Scroll indicator fades away near the top.
           */
          if (indicator) {
            timeline.fromTo(
              indicator,
              {
                scaleX: 1,
                opacity: 1,
              },
              {
                scaleX: 0,
                opacity: 0,
                ease: "none",
              },
              0,
            );
          }

          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
          });
        },
      );
    }, heroRef);

    return () => {
      ctx.revert();
    };
  }, [
    heroRef,
    contentRef,
    iconsRef,
    gridRef,
    glowRef,
    indicatorRef,
    reduceMotion,
  ]);
}

/* =========================================================
   HERO SECTION
========================================================= */

export default function HeroSection() {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const iconsRef = useRef(null);
  const gridRef = useRef(null);
  const glowRef = useRef(null);
  const indicatorRef = useRef(null);

  const idleRef = useRef({
    idle: true,
    t: 0,
    raf: null,
  });

  const reducedMotionRef = useRef(false);

  const lenis = useLenis();

  /*
   * =========================================================
   * POINTER PARALLAX
   * =========================================================
   */

  const mx = useMotionValue(50);
  const my = useMotionValue(40);

  const parallaxX = useTransform(mx, [0, 100], [-34, 34]);

  const parallaxY = useTransform(my, [0, 100], [-24, 24]);

  const parallaxXSlow = useTransform(mx, [0, 100], [-18, 18]);

  const parallaxYSlow = useTransform(my, [0, 100], [-12, 12]);

  const springParallaxX = useSpring(parallaxX, {
    stiffness: 55,
    damping: 16,
  });

  const springParallaxY = useSpring(parallaxY, {
    stiffness: 55,
    damping: 16,
  });

  const springParallaxXSlow = useSpring(parallaxXSlow, {
    stiffness: 40,
    damping: 16,
  });

  const springParallaxYSlow = useSpring(parallaxYSlow, {
    stiffness: 40,
    damping: 16,
  });

  useEffect(() => {
    const hero = heroRef.current;

    if (!hero) return;

    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const setPointer = (x, y) => {
      const rect = hero.getBoundingClientRect();

      if (!rect.width || !rect.height) {
        return;
      }

      mx.set(((x - rect.left) / rect.width) * 100);

      my.set(((y - rect.top) / rect.height) * 100);
    };

    const handleMouseMove = (e) => {
      idleRef.current.idle = false;

      setPointer(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (!e.touches[0]) return;

      idleRef.current.idle = false;

      setPointer(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleMouseLeave = () => {
      idleRef.current.idle = true;
    };

    const idleLoop = () => {
      const state = idleRef.current;

      if (state.idle && !reducedMotionRef.current) {
        state.t += 0.006;

        mx.set(50 + Math.sin(state.t) * 18);

        my.set(40 + Math.cos(state.t * 0.8) * 10);
      }

      state.raf = requestAnimationFrame(idleLoop);
    };

    hero.addEventListener("mousemove", handleMouseMove);

    hero.addEventListener("touchmove", handleTouchMove, {
      passive: true,
    });

    hero.addEventListener("mouseleave", handleMouseLeave);

    idleLoop();

    return () => {
      hero.removeEventListener("mousemove", handleMouseMove);

      hero.removeEventListener("touchmove", handleTouchMove);

      hero.removeEventListener("mouseleave", handleMouseLeave);

      cancelAnimationFrame(idleRef.current.raf);
    };
  }, [mx, my]);

  useHeroScrollAnimation(
    heroRef,
    contentRef,
    iconsRef,
    gridRef,
    glowRef,
    indicatorRef,
    false,
  );

  /*
   * =========================================================
   * LENIS CTA SCROLL
   * =========================================================
   */

  const handleGuessClick = (event) => {
    event.preventDefault();

    const target = document.getElementById("guess");

    if (!target) return;

    /*
     * Use the existing global Lenis instance.
     * No second Lenis instance is created here.
     */
    if (lenis) {
      lenis.scrollTo(target, {
        duration: 1.45,
        offset: 0,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        lock: false,
        onComplete: () => {
          window.history.replaceState(null, "", "#guess");
        },
      });

      return;
    }

    /*
     * Fallback if Lenis isn't available.
     */
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", "#guess");
  };

  return (
    <section
      ref={heroRef}
      className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-app-bg"
      style={{
        backgroundImage: [
          "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 38%)",
          "linear-gradient(180deg, var(--color-app-bg) 0%, var(--color-app-bg-primary) 55%, color-mix(in srgb, var(--color-app-bg) 45%, black) 100%)",
        ].join(", "),
      }}
    >
      {/* =====================================================
          STAGE GRID
      ====================================================== */}

      <div
        ref={gridRef}
        className="pointer-events-none absolute inset-0 z-0 opacity-50 will-change-transform"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border-light) 1px, transparent 1px), linear-gradient(90deg, var(--color-border-light) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 60%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 60%, black 0%, transparent 75%)",
        }}
      />

      {/* =====================================================
          ORANGE ATMOSPHERIC GLOW
      ====================================================== */}

      <div
        ref={glowRef}
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-primary)_10%,transparent),transparent_70%)] blur-3xl will-change-transform sm:h-[40rem] sm:w-[40rem]"
        aria-hidden="true"
      />

      {/* =====================================================
          FLOATING ICONS
      ====================================================== */}

      <div
        ref={iconsRef}
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden will-change-transform"
      >
        <FloatingIcons
          fastX={springParallaxX}
          fastY={springParallaxY}
          slowX={springParallaxXSlow}
          slowY={springParallaxYSlow}
        />
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        ref={contentRef}
        className="relative z-20 mx-auto max-w-[860px] px-6 text-center will-change-transform"
      >
        <p className="mb-7 inline-flex items-center gap-2 text-sm text-text-secondary">
          <span className="devtalks-pulse-dot h-[7px] w-[7px] rounded-full bg-primary" />
          DevKraft presents
        </p>

        <div className="mb-5 flex items-center justify-center gap-4">
          <div className="devtalks-sway relative flex flex-shrink-0 origin-top items-center justify-center">
            <span className="devtalks-ring-pulse absolute -inset-3.5 rounded-full border border-border-orange" />

            <MicIcon
              className="h-10 w-10 sm:h-14 sm:w-14"
              style={{
                filter:
                  "drop-shadow(0 0 14px color-mix(in srgb, var(--color-primary) 45%, transparent))",
              }}
            />
          </div>

          <h1
            className="m-0 font-sans text-[clamp(3.2rem,10vw,7.5rem)] font-extrabold leading-[0.95] tracking-tight text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-text-primary) 55%, var(--color-primary-light) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            DevTalks
          </h1>
        </div>

        <p className="mx-auto mb-10 max-w-[520px] text-base leading-relaxed text-text-secondary sm:text-lg">
          Every year, <span className="text-text-muted">DevKraft</span> brings a
          speaker to our stage. This year, we&apos;re not telling you who —
          you&apos;re guessing.
        </p>

        <GuessButton lenis={lenis} onGuessClick={handleGuessClick} />
      </div>

      {/* =====================================================
          SCROLL INDICATOR
      ====================================================== */}

      <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2">
        <div
          ref={indicatorRef}
          className="h-px w-20 origin-center bg-primary will-change-transform sm:w-24"
        />

        <div className="hidden items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-text-muted sm:flex">
          <span className="h-px w-8 bg-border" />
          Scroll to explore
          <span className="h-px w-8 bg-border" />
        </div>
      </div>

      <style>{`
        @keyframes devtalks-pulse-dot {
          0% {
            box-shadow:
              0 0 0 0
              color-mix(
                in srgb,
                var(--color-primary) 55%,
                transparent
              );
          }

          70% {
            box-shadow:
              0 0 0 10px transparent;
          }

          100% {
            box-shadow:
              0 0 0 0 transparent;
          }
        }

        .devtalks-pulse-dot {
          animation:
            devtalks-pulse-dot
            1.8s
            ease-out
            infinite;
        }

        @keyframes devtalks-sway {
          0%,
          100% {
            transform: rotate(-4deg);
          }

          50% {
            transform: rotate(4deg);
          }
        }

        .devtalks-sway {
          animation:
            devtalks-sway
            4.2s
            ease-in-out
            infinite;
        }

        @keyframes devtalks-ring-pulse {
          0% {
            transform: scale(0.7);
            opacity: 0.9;
          }

          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .devtalks-ring-pulse {
          animation:
            devtalks-ring-pulse
            2.6s
            ease-out
            infinite;
        }

        @keyframes devtalks-drift {
          0%,
          100% {
            transform:
              translate(0, 0)
              rotate(0deg);
          }

          50% {
            transform:
              translate(18px, -26px)
              rotate(8deg);
          }
        }

        @keyframes devtalks-drift-slow {
          0%,
          100% {
            transform:
              translate(0, 0)
              rotate(0deg);
          }

          50% {
            transform:
              translate(-22px, 20px)
              rotate(-6deg);
          }
        }

        .devtalks-f1 {
          animation:
            devtalks-drift
            9s
            cubic-bezier(0.16, 1, 0.3, 1)
            infinite;
        }

        .devtalks-f2 {
          animation:
            devtalks-drift-slow
            11s
            cubic-bezier(0.16, 1, 0.3, 1)
            infinite;
        }

        .devtalks-f3 {
          animation:
            devtalks-drift-slow
            8s
            cubic-bezier(0.16, 1, 0.3, 1)
            infinite;
        }

        .devtalks-f4 {
          animation:
            devtalks-drift
            10s
            cubic-bezier(0.16, 1, 0.3, 1)
            infinite;
        }

        .devtalks-f5 {
          animation:
            devtalks-drift
            13s
            cubic-bezier(0.16, 1, 0.3, 1)
            infinite;
        }

        .devtalks-f6 {
          animation:
            devtalks-drift-slow
            12s
            cubic-bezier(0.16, 1, 0.3, 1)
            infinite;
        }

        @keyframes devtalks-btn-sheen {
          0% {
            transform:
              translateX(-130%)
              skewX(-18deg);
          }

          100% {
            transform:
              translateX(230%)
              skewX(-18deg);
          }
        }

        .devtalks-btn-sheen {
          animation:
            devtalks-btn-sheen
            3.2s
            ease-in-out
            infinite;
        }

        @keyframes devtalks-btn-ring {
          0% {
            transform: scale(0.92);
            opacity: 0.55;
          }

          100% {
            transform: scale(1.35);
            opacity: 0;
          }
        }

        .devtalks-btn-ring {
          animation:
            devtalks-btn-ring
            2.2s
            cubic-bezier(0.16, 1, 0.3, 1)
            infinite;
        }

        .devtalks-guess-btn:hover {
          box-shadow:
            0 0 64px
            color-mix(
              in srgb,
              var(--color-primary) 45%,
              transparent
            );
        }

        @media (prefers-reduced-motion: reduce) {
          .devtalks-pulse-dot,
          .devtalks-sway,
          .devtalks-ring-pulse,
          .devtalks-f1,
          .devtalks-f2,
          .devtalks-f3,
          .devtalks-f4,
          .devtalks-f5,
          .devtalks-f6,
          .devtalks-btn-sheen,
          .devtalks-btn-ring {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </section>
  );
}

/* =========================================================
   GUESS BUTTON
========================================================= */

function GuessButton({ onGuessClick }) {
  const btnRef = useRef(null);

  const magX = useMotionValue(0);
  const magY = useMotionValue(0);

  const springX = useSpring(magX, {
    stiffness: 200,
    damping: 18,
    mass: 0.4,
  });

  const springY = useSpring(magY, {
    stiffness: 200,
    damping: 18,
    mass: 0.4,
  });

  const handleMouseMove = (e) => {
    const el = btnRef.current;

    if (!el) return;

    const rect = el.getBoundingClientRect();

    const relX = e.clientX - (rect.left + rect.width / 2);

    const relY = e.clientY - (rect.top + rect.height / 2);

    magX.set(Math.max(-10, Math.min(10, relX * 0.25)));

    magY.set(Math.max(-8, Math.min(8, relY * 0.25)));
  };

  const handleMouseLeave = () => {
    magX.set(0);
    magY.set(0);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.a
        ref={btnRef}
        href="#guess"
        onClick={onGuessClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileTap={{
          scale: 0.97,
        }}
        className="devtalks-guess-btn group relative inline-flex items-center gap-2.5 overflow-hidden rounded-lg px-9 py-4 font-semibold text-text-dark shadow-orange outline-none transition-shadow duration-300 ease-out focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg"
        style={{
          backgroundImage:
            "linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 60%, var(--color-primary) 100%)",
          x: springX,
          y: springY,
        }}
      >
        <span className="devtalks-btn-ring pointer-events-none absolute inset-0 rounded-lg border border-primary-light" />

        <span
          className="devtalks-btn-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3 opacity-60"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
          }}
        />

        <span className="relative">Guess the speaker</span>

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1"
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
      </motion.a>

      <p className="inline-flex items-center gap-1.5 text-xs text-text-muted">
        <span className="devtalks-pulse-dot h-1.5 w-1.5 rounded-full bg-primary" />
        Live leaderboard open — no sign-up to play
      </p>
    </div>
  );
}

/* =========================================================
   MICROPHONE ICON
========================================================= */

function MicIcon({ className, style }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="url(#devtalks-mic-gradient)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id="devtalks-mic-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-accent-light)" />

          <stop offset="100%" stopColor="var(--color-primary)" />
        </linearGradient>
      </defs>

      <path d="M12 15a3.5 3.5 0 0 0 3.5-3.5v-5a3.5 3.5 0 0 0-7 0v5A3.5 3.5 0 0 0 12 15Z" />

      <path d="M19 11.5a7 7 0 0 1-14 0" />

      <path d="M12 18.5V22" />

      <path d="M8.5 22h7" />
    </svg>
  );
}

/* =========================================================
   FLOATING ICONS
========================================================= */

function FloatingIcons({ fastX, fastY, slowX, slowY }) {
  const strokeClass = "stroke-accent-light fill-none opacity-[0.16]";

  return (
    <>
      <motion.div
        className="absolute left-[10%] top-[14%]"
        style={{
          x: fastX,
          y: fastY,
        }}
      >
        <svg
          className={`devtalks-f1 w-[46px] ${strokeClass}`}
          viewBox="0 0 24 24"
          strokeWidth="1.4"
        >
          <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" />

          <path d="M19 11a7 7 0 0 1-14 0" />

          <path d="M12 18v3" />

          <path d="M9 21h6" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute left-[16%] top-[68%]"
        style={{
          x: slowX,
          y: slowY,
        }}
      >
        <svg
          className={`devtalks-f2 w-[34px] ${strokeClass}`}
          viewBox="0 0 24 24"
          strokeWidth="1.4"
        >
          <path d="M21 12a8 8 0 1 1-3.6-6.67L21 4l-1.2 3.9A7.96 7.96 0 0 1 21 12Z" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute right-[12%] top-[22%]"
        style={{
          x: slowX,
          y: slowY,
        }}
      >
        <svg
          className={`devtalks-f3 w-[40px] ${strokeClass}`}
          viewBox="0 0 24 24"
          strokeWidth="1.4"
        >
          <rect x="3" y="5" width="18" height="15" rx="2" />

          <path d="M3 10h18" />

          <path d="M8 3v4" />

          <path d="M16 3v4" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute right-[18%] top-[72%]"
        style={{
          x: fastX,
          y: fastY,
        }}
      >
        <svg
          className={`devtalks-f4 w-[30px] ${strokeClass}`}
          viewBox="0 0 24 24"
          strokeWidth="1.4"
        >
          <path d="M4 15v-3a8 8 0 0 1 16 0v3" />

          <rect x="2" y="14" width="5" height="7" rx="1.5" />

          <rect x="17" y="14" width="5" height="7" rx="1.5" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute left-[5%] top-[46%]"
        style={{
          x: fastX,
          y: fastY,
        }}
      >
        <svg
          className={`devtalks-f5 w-[26px] ${strokeClass}`}
          viewBox="0 0 24 24"
          strokeWidth="1.4"
        >
          <path d="M12 3v3" />

          <path d="M12 18v3" />

          <path d="M3 12h3" />

          <path d="M18 12h3" />

          <circle cx="12" cy="12" r="4" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute right-[6%] top-[40%]"
        style={{
          x: slowX,
          y: slowY,
        }}
      >
        <svg
          className={`devtalks-f6 w-[24px] ${strokeClass}`}
          viewBox="0 0 24 24"
          strokeWidth="1.4"
        >
          <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
        </svg>
      </motion.div>

      {/* Decorative signal nodes */}
      {SIGNALS.map((signal, index) => (
        <span
          key={`signal-${index}`}
          className="absolute"
          style={{
            top: signal.top,
            left: signal.left,
          }}
        >
          <span className="block h-1 w-1 rounded-full bg-primary/20" />
        </span>
      ))}
    </>
  );
}
