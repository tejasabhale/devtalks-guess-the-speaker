import { useLayoutEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SIGNALS = [
  { top: "16%", left: "12%", delay: 0 },
  { top: "24%", left: "84%", delay: 1.2 },
  { top: "72%", left: "10%", delay: 2.4 },
  { top: "78%", left: "88%", delay: 3.6 },
  { top: "42%", left: "92%", delay: 1.8 },
  { top: "82%", left: "46%", delay: 4.5 },
];

const CARDS = [
  {
    number: "01",
    title: "DevTalks",
    description:
      "Visit the official DevTalks website and explore the full event.",
    href: "#",
    external: true,
  },
  {
    number: "02",
    title: "DevKraft",
    description:
      "Explore the club, its work, and the community behind the events.",
    href: "https://devkraft-2026-27.vercel.app",
    external: true,
  },
  {
    number: "03",
    title: "Guess the Speaker",
    description:
      "Step into the mystery and see if you can identify the DevTalks speakers.",
    href: "#guess",
    external: false,
  },
];

function AboutCTA() {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const lenis = useLenis();

  useLayoutEffect(() => {
    if (reduceMotion) return;

    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 1024px)",
          mobile: "(max-width: 1023px)",
        },
        (context) => {
          const { desktop } = context.conditions;

          const content = section.querySelector("[data-cta-content]");
          const eyebrow = section.querySelector("[data-cta-eyebrow]");
          const heading = section.querySelector("[data-cta-heading]");
          const description = section.querySelector("[data-cta-description]");
          const cards = gsap.utils.toArray("[data-cta-card]", section);
          const footer = section.querySelector("[data-cta-footer]");
          const background = section.querySelector("[data-cta-background]");
          const orbit = section.querySelector("[data-cta-orbit]");
          const innerOrbit = section.querySelector("[data-cta-inner-orbit]");
          const ellipse = section.querySelector("[data-cta-ellipse]");
          const ghost = section.querySelector("[data-cta-ghost]");
          const signal = section.querySelector("[data-cta-signal]");

          if (!content) return;

          const cardOffset = desktop ? 55 : 35;

          /*
           * =========================================================
           * INITIAL STATE
           * =========================================================
           */

          if (eyebrow) {
            gsap.set(eyebrow, {
              y: 18,
              opacity: 0,
              filter: "blur(4px)",
            });
          }

          if (heading) {
            gsap.set(heading, {
              y: 34,
              opacity: 0,
              scale: 0.94,
              filter: "blur(6px)",
            });
          }

          if (description) {
            gsap.set(description, {
              y: 24,
              opacity: 0,
              filter: "blur(4px)",
            });
          }

          if (cards.length) {
            gsap.set(cards, {
              y: cardOffset,
              opacity: 0,
              scale: 0.94,
              filter: "blur(5px)",
            });
          }

          if (footer) {
            gsap.set(footer, {
              y: 18,
              opacity: 0,
            });
          }

          /*
           * =========================================================
           * SCROLL TIMELINE
           * =========================================================
           */

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 94%",
              end: "bottom 6%",
              scrub: 1.15,
              invalidateOnRefresh: true,
            },
          });

          /*
           * =========================================================
           * PHASE 1 — FAST REVEAL
           * =========================================================
           */

          if (eyebrow) {
            timeline.to(
              eyebrow,
              {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                ease: "none",
                duration: 0.05,
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
                duration: 0.1,
              },
              0.04,
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
                duration: 0.08,
              },
              0.16,
            );
          }

          if (cards.length) {
            timeline.to(
              cards,
              {
                y: 0,
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                ease: "none",
                stagger: 0.04,
                duration: 0.12,
              },
              0.21,
            );
          }

          if (footer) {
            timeline.to(
              footer,
              {
                y: 0,
                opacity: 1,
                ease: "none",
                duration: 0.06,
              },
              0.39,
            );
          }

          /*
           * =========================================================
           * PHASE 2 — UNIFIED MOVEMENT
           * =========================================================
           */

          timeline.to(
            content,
            {
              y: desktop ? -22 : -14,
              ease: "none",
              duration: 0.16,
            },
            0.44,
          );

          /*
           * =========================================================
           * PHASE 3 — CONTINUOUS DEPTH
           * =========================================================
           */

          timeline.to(
            content,
            {
              y: desktop ? -82 : -52,
              scale: desktop ? 0.975 : 0.985,
              ease: "none",
              duration: 0.34,
            },
            0.58,
          );

          if (heading) {
            timeline.to(
              heading,
              {
                y: desktop ? -28 : -18,
                scale: desktop ? 0.965 : 0.98,
                ease: "none",
                duration: 0.34,
              },
              0.58,
            );
          }

          if (cards.length) {
            cards.forEach((card, index) => {
              timeline.to(
                card,
                {
                  y: -(8 + index * 6),
                  rotateZ: index % 2 === 0 ? -0.5 : 0.5,
                  ease: "none",
                  duration: 0.34,
                },
                0.58,
              );
            });
          }

          /*
           * =========================================================
           * BACKGROUND MOTION
           * =========================================================
           */

          if (background) {
            timeline.to(
              background,
              {
                y: desktop ? -55 : -28,
                x: desktop ? 28 : 12,
                scale: 1.1,
                ease: "none",
                duration: 1,
              },
              0,
            );
          }

          if (orbit) {
            timeline.to(
              orbit,
              {
                rotation: 28,
                scale: 1.06,
                xPercent: desktop ? 4 : 2,
                yPercent: -2,
                ease: "none",
                duration: 1,
              },
              0,
            );
          }

          if (innerOrbit) {
            timeline.to(
              innerOrbit,
              {
                rotation: -34,
                scale: 0.96,
                xPercent: desktop ? -3 : -1,
                yPercent: 2,
                ease: "none",
                duration: 1,
              },
              0,
            );
          }

          if (ellipse) {
            timeline.to(
              ellipse,
              {
                rotation: desktop ? 7 : 4,
                scale: desktop ? 1.06 : 1.03,
                y: desktop ? -24 : -12,
                ease: "none",
                duration: 1,
              },
              0,
            );
          }

          if (ghost) {
            timeline.to(
              ghost,
              {
                x: desktop ? -35 : -15,
                y: desktop ? -45 : -25,
                scale: 1.05,
                opacity: 0.055,
                ease: "none",
                duration: 1,
              },
              0,
            );
          }

          if (signal) {
            timeline.to(
              signal,
              {
                x: desktop ? 140 : 70,
                y: desktop ? -85 : -45,
                scaleX: desktop ? 1.35 : 1.18,
                opacity: 0.7,
                ease: "none",
                duration: 1,
              },
              0,
            );
          }

          /*
           * =========================================================
           * PHASE 4 — LAST SECTION STABILITY
           *
           * Keep all foreground content sharp because this is
           * the final section of the page.
           * =========================================================
           */

          timeline.to(
            content,
            {
              y: desktop ? -90 : -58,
              scale: desktop ? 0.975 : 0.985,
              opacity: 1,
              filter: "blur(0px)",
              ease: "none",
              duration: 0.22,
            },
            0.79,
          );

          if (heading) {
            timeline.to(
              heading,
              {
                y: desktop ? -32 : -20,
                scale: desktop ? 0.97 : 0.985,
                opacity: 1,
                filter: "blur(0px)",
                ease: "none",
                duration: 0.22,
              },
              0.79,
            );
          }

          if (cards.length) {
            timeline.to(
              cards,
              {
                y: 0,
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                rotateZ: 0,
                ease: "none",
                stagger: 0.025,
                duration: 0.18,
              },
              0.79,
            );
          }

          if (footer) {
            timeline.to(
              footer,
              {
                y: 0,
                opacity: 1,
                ease: "none",
                duration: 0.18,
              },
              0.81,
            );
          }

          /*
           * Background ending.
           */

          if (ghost) {
            timeline.to(
              ghost,
              {
                x: desktop ? -55 : -25,
                y: desktop ? -75 : -40,
                scale: 1.08,
                opacity: 0.035,
                ease: "none",
                duration: 0.22,
              },
              0.79,
            );
          }

          if (orbit) {
            timeline.to(
              orbit,
              {
                rotation: 44,
                scale: 1.1,
                ease: "none",
                duration: 0.22,
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
  }, [reduceMotion]);

  const handleScrollToGuess = (event) => {
    event.preventDefault();

    const target = document.querySelector("#guess");

    if (!target) return;

    if (lenis) {
      lenis.scrollTo(target, {
        duration: reduceMotion ? 0 : 1.45,
        offset: 0,
        immediate: Boolean(reduceMotion),
        lock: false,
        onComplete: () => {
          window.history.replaceState(null, "", "#guess");
        },
      });

      return;
    }

    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", "#guess");
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden border-t border-[var(--color-border)] bg-[#030303] px-5 py-16 sm:px-8 sm:py-20 lg:px-10"
    >
      {/* =========================================================
          BACKGROUND
      ========================================================== */}

      <div
        data-cta-background
        className="pointer-events-none absolute inset-0 overflow-hidden will-change-transform"
        aria-hidden="true"
      >
        {/* Central glow */}
        <div className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,90,31,0.055),transparent_68%)] blur-3xl sm:h-[40rem] sm:w-[40rem]" />

        {/* Micro particles */}
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: `
              radial-gradient(
                circle at 1px 1px,
                rgba(244,240,232,0.85) 0.7px,
                transparent 0.8px
              )
            `,
            backgroundSize: "30px 30px",
          }}
        />

        {/* Large orbit */}
        <div
          data-cta-orbit
          className="absolute left-1/2 top-1/2 h-[29rem] w-[29rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-primary)]/[0.055] will-change-transform sm:h-[42rem] sm:w-[42rem] lg:h-[52rem] lg:w-[52rem]"
        >
          <span className="absolute left-[7%] top-[22%] h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]" />
        </div>

        {/* Inner orbit */}
        <div
          data-cta-inner-orbit
          className="absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035] will-change-transform sm:h-[27rem] sm:w-[27rem] lg:h-[34rem] lg:w-[34rem]"
        >
          <span className="absolute right-[10%] top-[35%] h-1 w-1 rounded-full bg-[var(--color-primary-light)]" />
        </div>

        {/* Ellipse */}
        <div
          data-cta-ellipse
          className="absolute left-1/2 top-1/2 h-[14rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-[var(--color-primary)]/[0.035] will-change-transform sm:h-[20rem] sm:w-[52rem] lg:h-[23rem] lg:w-[60rem]"
        />

        {/* Ghost number */}
        <div
          data-cta-ghost
          className="absolute right-[-3%] top-[8%] select-none font-mono text-[15rem] font-bold leading-none tracking-[-0.12em] text-white/[0.025] will-change-transform sm:text-[22rem] lg:text-[27rem]"
        >
          03
        </div>

        {/* Scan texture */}
        <motion.div
          className="absolute -inset-[20%] opacity-[0.012]"
          animate={
            reduceMotion
              ? {}
              : {
                  backgroundPosition: ["0px 0px", "100px 70px", "0px 0px"],
                }
          }
          transition={
            reduceMotion
              ? {}
              : {
                  duration: 32,
                  repeat: Infinity,
                  ease: "linear",
                }
          }
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                135deg,
                transparent 0px,
                transparent 58px,
                rgba(255,90,31,0.5) 59px,
                transparent 60px
              )
            `,
            backgroundSize: "155px 155px",
          }}
        />

        {/* Scroll-controlled signal */}
        <div
          data-cta-signal
          className="absolute left-[-15%] top-[34%] h-px w-[130%] bg-gradient-to-r from-transparent via-[var(--color-primary)]/[0.18] to-transparent will-change-transform"
        />

        {/* Floating nodes */}
        {SIGNALS.map((signal, index) => (
          <motion.span
            key={index}
            className="absolute"
            style={{
              top: signal.top,
              left: signal.left,
            }}
            animate={
              reduceMotion
                ? {}
                : {
                    opacity: [0.08, 0.38, 0.08],
                    scale: [0.8, 1.25, 0.8],
                  }
            }
            transition={
              reduceMotion
                ? {}
                : {
                    duration: 4.2,
                    delay: signal.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          >
            <span className="block h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />

            <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-primary)]/10" />
          </motion.span>
        ))}

        {/* Corner details */}
        <div className="absolute left-6 top-7 h-8 w-8 border-l border-t border-[var(--color-primary)]/[0.09] sm:left-8" />

        <div className="absolute right-6 top-7 h-8 w-8 border-r border-t border-[var(--color-primary)]/[0.09] sm:right-8" />

        <div className="absolute bottom-7 left-6 h-8 w-8 border-b border-l border-[var(--color-primary)]/[0.08] sm:left-8" />

        <div className="absolute bottom-7 right-6 h-8 w-8 border-b border-r border-[var(--color-primary)]/[0.08] sm:right-8" />

        {/* Top accent */}
        <div className="absolute left-1/2 top-0 h-px w-[65%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-primary)]/[0.2] to-transparent" />
      </div>

      {/* =========================================================
          CONTENT
      ========================================================== */}

      <div
        data-cta-content
        className="relative z-10 mx-auto w-full max-w-6xl text-center will-change-transform"
      >
        {/* Eyebrow */}
        <div
          data-cta-eyebrow
          className="flex items-center justify-center gap-3 will-change-transform"
        >
          <span className="h-px w-7 bg-[var(--color-primary)]" />

          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-primary-light)] sm:text-[10px]">
            03 / EXPLORE THE ECOSYSTEM
          </span>

          <span className="h-px w-7 bg-[var(--color-primary)]" />
        </div>

        {/* Heading */}
        <h2
          data-cta-heading
          className="mx-auto mt-5 max-w-4xl text-[2.9rem] font-semibold leading-[0.98] tracking-[-0.055em] text-[var(--color-text-primary)] will-change-transform sm:text-5xl md:text-6xl lg:text-[5rem]"
        >
          There’s more
          <span className="block text-[var(--color-primary-light)]">
            to discover.
          </span>
        </h2>

        {/* Description */}
        <p
          data-cta-description
          className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)] will-change-transform sm:text-base md:text-lg"
        >
          Explore the events, stories, and community behind DevKraft. Discover
          DevTalks, experience the speaker journey, and see what the club is
          building next.
        </p>

        {/* Cards */}
        <div className="mt-9 grid gap-3 sm:mt-11 sm:grid-cols-3 sm:gap-4">
          {CARDS.map((card) => {
            const cardContent = (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[9px] text-[var(--color-primary)]">
                    {card.number}
                  </span>

                  <span className="text-sm text-[var(--color-text-muted)] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-primary-light)]">
                    {card.external ? "↗" : "→"}
                  </span>
                </div>

                <h3 className="mt-8 text-xl font-semibold text-[var(--color-text-primary)] sm:text-2xl">
                  {card.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                  {card.description}
                </p>

                <div className="mt-5 h-px w-8 bg-[var(--color-primary)] transition-all duration-300 group-hover:w-14" />
              </>
            );

            return (
              <motion.div
                key={card.number}
                data-cta-card
                whileHover={
                  reduceMotion
                    ? {}
                    : {
                        y: -5,
                        scale: 1.015,
                      }
                }
                whileTap={
                  reduceMotion
                    ? {}
                    : {
                        scale: 0.985,
                      }
                }
                transition={{
                  duration: 0.25,
                }}
                className="group relative will-change-transform"
              >
                {card.external ? (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full rounded-2xl border border-[var(--color-border)] bg-[#090909]/95 px-5 py-6 text-left backdrop-blur-md transition-all duration-300 hover:border-[var(--color-border-orange)] hover:bg-[#0c0c0c] sm:px-6"
                  >
                    {cardContent}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={handleScrollToGuess}
                    className="block h-full w-full rounded-2xl border border-[var(--color-border)] bg-[#090909]/95 px-5 py-6 text-left backdrop-blur-md transition-all duration-300 hover:border-[var(--color-border-orange)] hover:bg-[#0c0c0c] sm:px-6"
                  >
                    {cardContent}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          data-cta-footer
          className="mt-9 flex items-center justify-center gap-3 font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] sm:mt-11 sm:text-[9px]"
        >
          <span className="h-px w-8 bg-[var(--color-border)]" />
          Built by DevKraft Club
          <span className="h-px w-8 bg-[var(--color-border)]" />
        </div>
      </div>

      {/* Bottom label */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-3 font-mono text-[8px] uppercase tracking-[0.22em] text-[var(--color-text-muted)] sm:flex">
        <span className="h-px w-7 bg-[var(--color-border)]" />
        ECOSYSTEM
        <span className="h-px w-7 bg-[var(--color-border)]" />
      </div>
    </section>
  );
}

export default AboutCTA;
