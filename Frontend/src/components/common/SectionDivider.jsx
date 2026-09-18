import { useEffect, useRef, useState } from "react";

/**
 * DevTalks — Premium Section Divider
 *
 * Visual language:
 * - Thin asymmetric glow lines
 * - Animated center node
 * - Subtle travelling light beam
 * - Optional section label
 * - Smooth reveal when entering viewport
 * - Respects prefers-reduced-motion
 *
 * Usage:
 *
 * <SectionDivider />
 *
 * <SectionDivider
 *   label="Guess the speaker"
 *   fromColor="var(--color-app-bg)"
 *   toColor="var(--color-app-bg-secondary)"
 * />
 */

export default function SectionDivider({
  label,
  fromColor = "var(--color-app-bg)",
  toColor = "var(--color-app-bg-secondary)",
}) {
  const rootRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    const reduceMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    if (reduceMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setIsVisible(true);
        observer.disconnect();
      },
      {
        threshold: 0.35,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-hidden py-6 sm:py-7 lg:py-8"
      style={{
        background: `linear-gradient(180deg, ${fromColor} 0%, ${toColor} 100%)`,
      }}
    >
      {/* Ambient center glow */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-1/2 h-24 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="relative mx-auto flex w-full max-w-[1400px] items-center px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* LEFT LINE */}
        <div
          aria-hidden="true"
          className={`relative h-px flex-1 origin-right bg-gradient-to-l from-primary/50 via-border-orange/40 to-transparent transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] ${
            isVisible ? "scale-x-100" : "scale-x-0"
          }`}
        >
          {/* Secondary hairline */}
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-l from-border/30 to-transparent" />

          {/* Travelling beam */}
          {isVisible && (
            <span
              aria-hidden="true"
              className="devtalks-divider-beam-left absolute top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-primary-light shadow-[0_0_14px_rgba(255,122,69,0.9)]"
            />
          )}
        </div>

        {/* CENTER MARK */}
        <div className="relative mx-4 flex shrink-0 items-center justify-center sm:mx-6 lg:mx-8">
          {/* Outer pulse ring */}
          <span
            aria-hidden="true"
            className={`absolute h-10 w-10 rounded-full border border-primary/20 transition-all duration-700 ${
              isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          />

          {/* Secondary ring */}
          <span
            aria-hidden="true"
            className={`absolute h-7 w-7 rounded-full border border-border-orange/50 transition-all duration-500 ${
              isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          />

          {/* Core */}
          <span
            aria-hidden="true"
            className={`relative flex h-4 w-4 rotate-45 items-center justify-center border border-primary/70 bg-primary/20 shadow-[0_0_20px_rgba(255,90,31,0.35)] transition-all duration-500 ${
              isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <span className="h-1.5 w-1.5 bg-primary-light" />
          </span>

          {/* Tiny vertical accent */}
          <span
            aria-hidden="true"
            className={`absolute top-1/2 h-12 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-primary/40 to-transparent transition-opacity duration-700 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* RIGHT LINE */}
        <div
          aria-hidden="true"
          className={`relative h-px flex-1 origin-left bg-gradient-to-r from-primary/50 via-border-orange/40 to-transparent transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] ${
            isVisible ? "scale-x-100" : "scale-x-0"
          }`}
        >
          {/* Secondary hairline */}
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-border/30 to-transparent" />

          {/* Travelling beam */}
          {isVisible && (
            <span
              aria-hidden="true"
              className="devtalks-divider-beam-right absolute top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-primary-light shadow-[0_0_14px_rgba(255,122,69,0.9)]"
            />
          )}
        </div>
      </div>

      {/* Optional label */}
      {label && (
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-5 transition-all delay-200 duration-700 sm:translate-y-6 ${
            isVisible ? "opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border-orange/40 bg-app-bg/70 px-3 py-1 backdrop-blur-md">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-primary-light shadow-[0_0_8px_rgba(255,122,69,0.8)]"
            />

            <span className="font-label text-[9px] font-medium uppercase tracking-[0.22em] text-text-muted sm:text-[10px]">
              {label}
            </span>
          </span>
        </div>
      )}

      <style>{`
        /* Right-side beam */
        @keyframes devtalks-divider-beam-right {
          0% {
            left: 0%;
            opacity: 0;
            transform: translateY(-50%) scale(0.7);
          }

          10% {
            opacity: 1;
          }

          50% {
            transform: translateY(-50%) scale(1);
          }

          90% {
            opacity: 1;
          }

          100% {
            left: 100%;
            opacity: 0;
            transform: translateY(-50%) scale(0.7);
          }
        }

        /* Left-side beam */
        @keyframes devtalks-divider-beam-left {
          0% {
            right: 0%;
            opacity: 0;
            transform: translateY(-50%) scale(0.7);
          }

          10% {
            opacity: 1;
          }

          50% {
            transform: translateY(-50%) scale(1);
          }

          90% {
            opacity: 1;
          }

          100% {
            right: 100%;
            opacity: 0;
            transform: translateY(-50%) scale(0.7);
          }
        }

        .devtalks-divider-beam-right {
          animation: devtalks-divider-beam-right 3.8s
            cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: 0.8s;
        }

        .devtalks-divider-beam-left {
          animation: devtalks-divider-beam-left 3.8s
            cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: 0.8s;
        }

        @media (max-width: 640px) {
          .devtalks-divider-beam-right,
          .devtalks-divider-beam-left {
            animation-duration: 4.5s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .devtalks-divider-beam-right,
          .devtalks-divider-beam-left {
            animation: none !important;
            opacity: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
