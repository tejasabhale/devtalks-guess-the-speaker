import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./guessHero.css";

gsap.registerPlugin(ScrollTrigger);

const EVENT_TARGET = new Date(Date.now() + 1000 * 60 * 60 * 26).getTime();

function useCountdown(target) {
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, target - Date.now()),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(Math.max(0, target - Date.now()));
    }, 1000);

    return () => clearInterval(id);
  }, [target]);

  const totalSeconds = Math.floor(timeLeft / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(value) {
  return String(value).padStart(2, "0");
}

const SPOTS = [
  { mod: "guess-hero__spot--left" },
  { mod: "guess-hero__spot--center" },
  { mod: "guess-hero__spot--right" },
];

function useGuessHeroScrollAnimation(sectionRef) {
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 1024px)",
          mobile: "(max-width: 1023px)",
        },
        (context) => {
          const { desktop } = context.conditions;

          const content = section.querySelector("[data-guess-content]");
          const badge = section.querySelector("[data-guess-badge]");
          const heading = section.querySelector("[data-guess-heading]");
          const description = section.querySelector("[data-guess-description]");
          const countdown = section.querySelector("[data-guess-countdown]");

          const classification = section.querySelector(
            "[data-guess-classification]",
          );

          const scrollHint = section.querySelector("[data-guess-scroll]");

          /*
           * data-guess-spot is attached to the FIGURE,
           * not the outer spotlight container.
           *
           * This keeps the light/beam fixed while the figure moves.
           */
          const spots = gsap.utils.toArray("[data-guess-spot]", section);

          const figureHeads = gsap.utils.toArray(
            "[data-guess-figure]",
            section,
          );

          const backgroundGlow = section.querySelector("[data-guess-glow]");
          const backgroundGrid = section.querySelector("[data-guess-grid]");

          if (!content) return;

          /*
           * =========================================================
           * INITIAL STATES
           * =========================================================
           */

          gsap.set(content, {
            y: desktop ? 35 : 28,
            scale: desktop ? 0.97 : 0.98,
          });

          if (badge) {
            gsap.set(badge, {
              y: 24,
              opacity: 0,
              filter: "blur(7px)",
            });
          }

          if (heading) {
            gsap.set(heading, {
              y: 42,
              opacity: 0,
              scale: 0.93,
              filter: "blur(12px)",
            });
          }

          if (description) {
            gsap.set(description, {
              y: 24,
              opacity: 0,
              filter: "blur(7px)",
            });
          }

          if (countdown) {
            gsap.set(countdown, {
              y: 35,
              opacity: 0,
              scale: 0.96,
            });
          }

          if (classification) {
            gsap.set(classification, {
              y: 18,
              opacity: 0,
            });
          }

          if (scrollHint) {
            gsap.set(scrollHint, {
              opacity: 0,
              y: 14,
            });
          }

          /*
           * Only the FIGURES are animated.
           * The spotlight beams remain untouched.
           */
          if (spots.length) {
            gsap.set(spots, {
              opacity: 0.72,
              scale: 0.97,
            });
          }

          if (figureHeads.length) {
            gsap.set(figureHeads, {
              y: desktop ? 10 : 5,
            });
          }

          /*
           * =========================================================
           * CONTINUOUS TIMELINE
           * =========================================================
           */

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 94%",
              end: "bottom 6%",
              scrub: 0.75,
              invalidateOnRefresh: true,
            },
          });

          /*
           * =========================================================
           * PHASE 1 — REVEAL
           * =========================================================
           */

          if (badge) {
            timeline.to(
              badge,
              {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                ease: "none",
                duration: 0.07,
              },
              0,
            );
          }

          if (heading) {
            timeline.to(
              heading,
              {
                y: 0,
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                ease: "none",
                duration: 0.2,
              },
              0.05,
            );
          }

          if (description) {
            timeline.to(
              description,
              {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                ease: "none",
                duration: 0.13,
              },
              0.16,
            );
          }

          if (countdown) {
            timeline.to(
              countdown,
              {
                y: 0,
                opacity: 1,
                scale: 1,
                ease: "none",
                duration: 0.17,
              },
              0.22,
            );
          }

          if (classification) {
            timeline.to(
              classification,
              {
                y: 0,
                opacity: 1,
                ease: "none",
                duration: 0.08,
              },
              0.34,
            );
          }

          if (scrollHint) {
            timeline.to(
              scrollHint,
              {
                y: 0,
                opacity: 1,
                ease: "none",
                duration: 0.07,
              },
              0.38,
            );
          }

          /*
           * =========================================================
           * PHASE 2 — UNIFIED HERO MOVEMENT
           * =========================================================
           */

          timeline.to(
            content,
            {
              y: desktop ? -16 : -10,
              ease: "none",
              duration: 0.13,
            },
            0.44,
          );

          /*
           * =========================================================
           * PHASE 3 — CONTINUOUS PARALLAX
           * =========================================================
           */

          timeline.to(
            content,
            {
              y: desktop ? -72 : -42,
              scale: desktop ? 0.975 : 0.985,
              ease: "none",
              duration: 0.28,
            },
            0.57,
          );

          if (heading) {
            timeline.to(
              heading,
              {
                y: desktop ? -32 : -20,
                scale: desktop ? 0.97 : 0.98,
                ease: "none",
                duration: 0.28,
              },
              0.57,
            );
          }

          /*
           * Mystery figures move independently.
           * The spotlight beams DO NOT move.
           */
          if (spots.length) {
            spots.forEach((spot, index) => {
              const direction = index === 0 ? -1 : index === 1 ? 0 : 1;

              timeline.to(
                spot,
                {
                  y: desktop ? -(28 + index * 10) : -(16 + index * 5),
                  x: desktop ? direction * 12 : direction * 6,
                  scale: desktop ? 1.02 + index * 0.01 : 1.01 + index * 0.005,
                  ease: "none",
                  duration: 0.43,
                },
                0.45,
              );
            });
          }

          if (figureHeads.length) {
            figureHeads.forEach((figure, index) => {
              timeline.to(
                figure,
                {
                  y: desktop ? (index === 1 ? -8 : -4) : index === 1 ? -4 : -2,
                  ease: "none",
                  duration: 0.43,
                },
                0.45,
              );
            });
          }

          /*
           * Background remains alive during the whole section.
           */

          if (backgroundGlow) {
            timeline.to(
              backgroundGlow,
              {
                x: desktop ? 65 : 30,
                y: desktop ? -45 : -24,
                scale: 1.18,
                opacity: 0.72,
                ease: "none",
                duration: 1,
              },
              0,
            );
          }

          if (backgroundGrid) {
            timeline.to(
              backgroundGrid,
              {
                x: desktop ? 35 : 18,
                y: desktop ? -35 : -18,
                scale: 1.06,
                ease: "none",
                duration: 1,
              },
              0,
            );
          }

          /*
           * =========================================================
           * PHASE 4 — EARLY ENDING
           * =========================================================
           */

          timeline.to(
            content,
            {
              y: desktop ? -125 : -82,
              scale: desktop ? 0.94 : 0.96,
              opacity: 0.58,
              filter: "blur(2px)",
              ease: "none",
              duration: 0.2,
            },
            0.79,
          );

          if (heading) {
            timeline.to(
              heading,
              {
                y: desktop ? -58 : -38,
                scale: desktop ? 0.93 : 0.95,
                opacity: 0.62,
                filter: "blur(3px)",
                ease: "none",
                duration: 0.2,
              },
              0.79,
            );
          }

          if (countdown) {
            timeline.to(
              countdown,
              {
                y: desktop ? -42 : -28,
                scale: 0.96,
                opacity: 0.55,
                ease: "none",
                duration: 0.18,
              },
              0.79,
            );
          }

          if (classification) {
            timeline.to(
              classification,
              {
                y: desktop ? -30 : -20,
                opacity: 0.35,
                ease: "none",
                duration: 0.16,
              },
              0.81,
            );
          }

          if (scrollHint) {
            timeline.to(
              scrollHint,
              {
                y: desktop ? -25 : -16,
                opacity: 0.2,
                ease: "none",
                duration: 0.14,
              },
              0.81,
            );
          }

          /*
           * Figures pull away slightly during the ending.
           * The beams remain fixed.
           */

          if (spots.length) {
            spots.forEach((spot, index) => {
              const direction = index === 0 ? -1 : index === 1 ? 0 : 1;

              timeline.to(
                spot,
                {
                  y: desktop ? -(75 + index * 10) : -(45 + index * 6),
                  x: desktop ? direction * 28 : direction * 12,
                  opacity: 0.35,
                  scale: 1.04,
                  ease: "none",
                  duration: 0.2,
                },
                0.79,
              );
            });
          }

          /*
           * Background ending.
           */

          if (backgroundGlow) {
            timeline.to(
              backgroundGlow,
              {
                y: desktop ? -90 : -48,
                x: desktop ? 90 : 45,
                scale: 1.3,
                opacity: 0.45,
                ease: "none",
                duration: 0.21,
              },
              0.79,
            );
          }

          if (backgroundGrid) {
            timeline.to(
              backgroundGrid,
              {
                y: desktop ? -65 : -34,
                x: desktop ? 45 : 22,
                scale: 1.1,
                opacity: 0.3,
                ease: "none",
                duration: 0.21,
              },
              0.79,
            );
          }

          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
          });
        },
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [sectionRef]);
}

export default function GuessHero() {
  const sectionRef = useRef(null);

  const { days, hours, minutes, seconds } = useCountdown(EVENT_TARGET);

  useGuessHeroScrollAnimation(sectionRef);

  const units = [
    {
      label: "days",
      value: days,
    },
    {
      label: "hrs",
      value: hours,
    },
    {
      label: "min",
      value: minutes,
    },
    {
      label: "sec",
      value: seconds,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="guess"
      className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-app-bg px-6"
    >
      {/* =========================================================
          BACKGROUND
      ========================================================== */}

      <div
        className="pointer-events-none absolute inset-0 -z-30"
        aria-hidden="true"
      >
        <div
          data-guess-glow
          className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,90,31,0.10),transparent_70%)] opacity-60 blur-3xl will-change-transform sm:h-[40rem] sm:w-[40rem]"
        />

        <div className="absolute inset-0 bg-radial-orange" />

        <div
          data-guess-grid
          className="absolute -inset-[15%] opacity-35 will-change-transform"
          style={{
            backgroundImage:
              "linear-gradient(to right, color-mix(in srgb, var(--color-text-primary) 4.5%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-text-primary) 4.5%, transparent) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="guess-hero__vignette absolute inset-0" />
      </div>

      {/* =========================================================
          MYSTERY STAGE
      ========================================================== */}

      <div
        className="guess-hero__stage pointer-events-none absolute inset-0 -z-20"
        aria-hidden="true"
      >
        {SPOTS.map((spot, index) => (
          <div key={spot.mod} className={`guess-hero__spot ${spot.mod}`}>
            {/* FIXED LIGHT / BEAM */}
            <div className="guess-hero__beam" />

            {/* ONLY THIS FIGURE MOVES */}
            <div
              data-guess-spot
              className="guess-hero__figure will-change-transform"
            >
              <div data-guess-figure className="guess-hero__figure-head">
                <span className="guess-hero__ear guess-hero__ear--left" />
                <span className="guess-hero__ear guess-hero__ear--right" />

                <span className="guess-hero__face">
                  <span className="guess-hero__figure-question">?</span>
                </span>
              </div>

              <div className="guess-hero__neck" />

              <div className="guess-hero__shoulders">
                <span className="guess-hero__shoulder-highlight guess-hero__shoulder-highlight--left" />
                <span className="guess-hero__shoulder-highlight guess-hero__shoulder-highlight--right" />
              </div>

              <div className="guess-hero__figure-body">
                <span className="guess-hero__chest" />
                <span className="guess-hero__torso-center" />
              </div>

              <span className="guess-hero__arm guess-hero__arm--left" />
              <span className="guess-hero__arm guess-hero__arm--right" />

              <span className="guess-hero__file-number">0{index + 1}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Fine grain */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in srgb, var(--color-text-primary) 90%, transparent) 0.6px, transparent 0.6px)",
          backgroundSize: "5px 5px",
        }}
        aria-hidden="true"
      />

      {/* =========================================================
          CONTENT
      ========================================================== */}

      <div
        data-guess-content
        className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center will-change-transform"
      >
        <div
          data-guess-badge
          className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-border-light bg-surface-light px-4 py-1.5 text-sm font-medium text-text-secondary backdrop-blur-md"
        >
          <span
            className="h-1.5 w-1.5 rounded-full bg-primary"
            style={{
              boxShadow:
                "0 0 10px color-mix(in srgb, var(--color-primary) 70%, transparent)",
            }}
          />

          <span>DevKraft presents DevTalks</span>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-1/2 h-40 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />

          <h1
            data-guess-heading
            className="relative max-w-3xl text-balance text-5xl font-bold leading-[1.05] tracking-tight text-gradient sm:text-6xl md:text-7xl"
          >
            Guess the speaker
          </h1>
        </div>

        <p
          data-guess-description
          className="mt-6 max-w-lg text-base font-medium leading-relaxed text-text-secondary sm:text-lg"
        >
          Three names are locked behind the countdown. Study the clues, place
          your guess for each one, and see how close you get before the reveal.
        </p>

        <div
          data-guess-countdown
          className="mt-12 flex items-center gap-2 font-mono sm:gap-4"
        >
          {units.map((unit, index) => (
            <div key={unit.label} className="flex items-center gap-2 sm:gap-4">
              <div className="glass flex w-[4.25rem] flex-col items-center rounded-lg px-2 py-3 shadow-card sm:w-20 sm:rounded-xl sm:px-3 sm:py-3.5">
                <span className="text-2xl font-bold tabular-nums text-text-primary sm:text-3xl">
                  {pad(unit.value)}
                </span>

                <span className="mt-1 text-[9px] font-medium uppercase tracking-widest text-text-muted sm:text-[11px]">
                  {unit.label}
                </span>
              </div>

              {index < units.length - 1 && (
                <span className="text-xl font-bold text-border-orange sm:text-2xl">
                  :
                </span>
              )}
            </div>
          ))}
        </div>

        <div
          data-guess-classification
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-border-light bg-surface-light px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-text-muted backdrop-blur-sm"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary/80" />
          identities remain classified
        </div>
      </div>

      {/* Scroll hint */}
      <div
        data-guess-scroll
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-text-muted"
      >
        <span className="font-mono text-[9px] font-medium uppercase tracking-[0.18em]">
          Scroll to investigate
        </span>

        <svg
          className="h-4 w-4 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M19 9l-7 7-7-7"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </div>
    </section>
  );
}
