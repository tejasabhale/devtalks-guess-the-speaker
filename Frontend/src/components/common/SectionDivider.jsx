import { useEffect, useRef, useState } from "react";

/**
 * DevTalks section divider — DevKraft club
 *
 * A themed <hr> replacement for a single-page site where each "page"
 * is a section you scroll past. Drop one between sections:
 *
 *   <HeroSection />
 *   <SectionDivider fromColor="var(--color-app-bg)" toColor="var(--color-app-bg-secondary)" />
 *   <AboutSection />
 *   <SectionDivider label="Guess the speaker" fromColor="var(--color-app-bg-secondary)" toColor="var(--color-app-bg)" />
 *   <GuessSection />
 *
 * Since the sections on either side have different backgrounds, this
 * doesn't paint its own flat color — it gradients from `fromColor`
 * (the section above) to `toColor` (the section below), so it reads
 * as a seam between them instead of a third block of color. Pass the
 * two section colors in; both default to your app-bg tokens.
 *
 * Uses the same @theme tokens as HeroSection (border-border-orange,
 * shadow-orange, --ease-out-expo, etc) — nothing hard-coded.
 *
 * The line draws itself in once, the moment it scrolls into view
 * (IntersectionObserver, no scroll listener running the rest of the time).
 * After that, the center ornament keeps a small audio-equalizer pulse
 * going and a faint beam travels outward from the center on both lines
 * at once — same "still listening" language as the mic in the hero and
 * the loader.
 *
 * Accessibility: the lines, ring, bars, and beam are pure decoration and
 * are aria-hidden individually. When `label` is passed, it's real content
 * (a mini section caption) and stays in the accessibility tree — only the
 * decorative chrome around it is hidden, not the label itself.
 */
export default function SectionDivider({
  label,
  fromColor = "var(--color-app-bg)",
  toColor = "var(--color-app-bg-secondary)",
}) {
  const rootRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      style={{
        background: `linear-gradient(to bottom, ${fromColor}, ${toColor})`,
      }}
      className="devtalks-divider relative flex w-full items-center justify-center py-4"
    >
      <div
        aria-hidden="true"
        className="relative flex w-full items-center gap-3 px-4 sm:gap-4 sm:px-6"
      >
        {/* left line, carries a beam mirrored from the right */}
        <span
          className={`devtalks-div-line devtalks-div-line-left relative h-px flex-1 origin-right overflow-visible bg-gradient-to-l from-border-orange to-transparent transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] ${
            isVisible ? "scale-x-100" : "scale-x-0"
          }`}
        >
          {isVisible && (
            <span className="devtalks-div-beam devtalks-div-beam-left absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary-light shadow-orange" />
          )}
        </span>

        {/* center ornament: a lit node inside a pulsing ring */}
        <div className="relative flex shrink-0 items-center justify-center">
          <span
            className={`devtalks-div-ring absolute h-8 w-8 rounded-full border border-border-orange transition-opacity duration-700 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          />
          <span
            className={`relative h-6 w-6 rounded-full border border-border-orange bg-primary/10 shadow-orange transition-all duration-500 ease-out ${
              isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
          />
        </div>

        {/* right line, carries the traveling beam */}
        <span
          className={`devtalks-div-line devtalks-div-line-right relative h-px flex-1 origin-left overflow-visible bg-gradient-to-r from-border-orange to-transparent transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] ${
            isVisible ? "scale-x-100" : "scale-x-0"
          }`}
        >
          {isVisible && (
            <span className="devtalks-div-beam devtalks-div-beam-right absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary-light shadow-orange" />
          )}
        </span>
      </div>

      {label && (
        <span
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted transition-all duration-700 delay-300 ${
            isVisible
              ? "-translate-y-[calc(50%+1.35rem)] opacity-100"
              : "-translate-y-[calc(50%+0.95rem)] opacity-0"
          }`}
        >
          {label}
        </span>
      )}

      <style>{`
        @keyframes devtalks-div-ring-pulse {
          0%   { transform: scale(0.85); opacity: 0.7; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        .devtalks-div-ring { animation: devtalks-div-ring-pulse 2.4s ease-out infinite; }

        @keyframes devtalks-div-beam {
          0%   { left: 0%;   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        .devtalks-div-beam-right { animation: devtalks-div-beam 3.2s ease-in-out infinite; animation-delay: 1.1s; }

        @keyframes devtalks-div-beam-left {
          0%   { left: 100%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { left: 0%;   opacity: 0; }
        }
        .devtalks-div-beam-left { animation: devtalks-div-beam-left 3.2s ease-in-out infinite; animation-delay: 1.1s; }

        @media (prefers-reduced-motion: reduce) {
          .devtalks-div-ring, .devtalks-div-beam-left, .devtalks-div-beam-right {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
