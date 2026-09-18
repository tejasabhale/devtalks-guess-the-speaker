import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  ["01", "TALKS"],
  ["02", "WORKSHOPS"],
  ["03", "NETWORKING"],
  ["04", "EXPERIENCES"],
];

const NODES = [
  { top: "16%", left: "8%", delay: 0 },
  { top: "28%", left: "90%", delay: 1.2 },
  { top: "68%", left: "8%", delay: 2.4 },
  { top: "80%", left: "88%", delay: 3.4 },
  { top: "12%", left: "64%", delay: 2 },
];

function useDevTalksScrollAnimation(sectionRef, reduceMotion) {
  useEffect(() => {
    if (reduceMotion) return;

    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const left = section.querySelector("[data-devtalks-left]");
      const right = section.querySelector("[data-devtalks-right]");
      const eyebrow = section.querySelector("[data-devtalks-eyebrow]");
      const heading = section.querySelector("[data-devtalks-heading]");
      const copy = gsap.utils.toArray("[data-devtalks-copy]", section);
      const cards = gsap.utils.toArray("[data-devtalk-card]", section);

      const glow = section.querySelector("[data-devtalks-glow]");
      const ghost = section.querySelector("[data-devtalks-ghost]");
      const ring = section.querySelector("[data-devtalks-ring]");
      const grid = section.querySelector("[data-devtalks-grid]");

      if (!left || !right) return;

      /*
       * Initial state
       */
      gsap.set(left, {
        x: -70,
        y: 35,
        opacity: 0,
        filter: "blur(10px)",
      });

      gsap.set(right, {
        x: 70,
        y: 35,
        opacity: 0,
        filter: "blur(10px)",
      });

      gsap.set(cards, {
        y: 35,
        opacity: 0,
        scale: 0.96,
      });

      if (eyebrow) {
        gsap.set(eyebrow, {
          opacity: 0,
          x: -20,
        });
      }

      if (heading) {
        gsap.set(heading, {
          opacity: 0,
          y: 28,
          scale: 0.97,
          filter: "blur(8px)",
        });
      }

      if (copy.length) {
        gsap.set(copy, {
          opacity: 0,
          y: 18,
        });
      }

      /*
       * One continuous scroll timeline.
       */
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 92%",
          end: "bottom 8%",
          scrub: 0.75,
          invalidateOnRefresh: true,
        },
      });

      /*
       * ---------------------------------------------------------
       * 1. REVEAL
       * ---------------------------------------------------------
       */

      if (eyebrow) {
        timeline.to(
          eyebrow,
          {
            opacity: 1,
            x: 0,
            ease: "none",
            duration: 0.08,
          },
          0,
        );
      }

      timeline
        .to(
          left,
          {
            x: 0,
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            ease: "none",
            duration: 0.24,
          },
          0.02,
        )
        .to(
          right,
          {
            x: 0,
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            ease: "none",
            duration: 0.24,
          },
          0.05,
        );

      if (heading) {
        timeline.to(
          heading,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            ease: "none",
            duration: 0.16,
          },
          0.12,
        );
      }

      if (copy.length) {
        timeline.to(
          copy,
          {
            opacity: 1,
            y: 0,
            ease: "none",
            stagger: 0.035,
            duration: 0.1,
          },
          0.18,
        );
      }

      if (cards.length) {
        timeline.to(
          cards,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "none",
            stagger: 0.035,
            duration: 0.16,
          },
          0.16,
        );
      }

      /*
       * ---------------------------------------------------------
       * 2. UNIFIED MOMENT
       * ---------------------------------------------------------
       *
       * Both columns move together for a moment.
       */
      timeline
        .to(
          left,
          {
            y: -18,
            ease: "none",
            duration: 0.14,
          },
          0.34,
        )
        .to(
          right,
          {
            y: -18,
            ease: "none",
            duration: 0.14,
          },
          0.34,
        );

      /*
       * ---------------------------------------------------------
       * 3. CONTINUOUS DEPTH
       * ---------------------------------------------------------
       */

      timeline
        .to(
          left,
          {
            x: -18,
            y: -75,
            ease: "none",
            duration: 0.54,
          },
          0.48,
        )
        .to(
          right,
          {
            x: 18,
            y: -45,
            ease: "none",
            duration: 0.54,
          },
          0.48,
        );

      if (heading) {
        timeline.to(
          heading,
          {
            y: -35,
            scale: 0.975,
            ease: "none",
            duration: 0.54,
          },
          0.48,
        );
      }

      if (cards.length) {
        cards.forEach((card, index) => {
          timeline.to(
            card,
            {
              y: -(10 + index * 7),
              rotateZ: index % 2 === 0 ? -0.5 : 0.5,
              ease: "none",
              duration: 0.54,
            },
            0.48,
          );
        });
      }

      /*
       * ---------------------------------------------------------
       * 4. SUBTLE BACKGROUND MOTION
       * ---------------------------------------------------------
       */

      if (glow) {
        timeline.to(
          glow,
          {
            x: 45,
            y: -50,
            scale: 1.18,
            opacity: 0.72,
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
            x: -35,
            y: -55,
            opacity: 0.055,
            scale: 1.04,
            ease: "none",
            duration: 1,
          },
          0,
        );
      }

      if (ring) {
        timeline.to(
          ring,
          {
            rotation: 24,
            scale: 1.08,
            xPercent: 4,
            yPercent: -3,
            ease: "none",
            duration: 1,
          },
          0,
        );
      }

      if (grid) {
        timeline.to(
          grid,
          {
            y: -25,
            x: 20,
            ease: "none",
            duration: 1,
          },
          0,
        );
      }

      /*
       * ---------------------------------------------------------
       * 5. EXIT
       * ---------------------------------------------------------
       */

      timeline
        .to(
          left,
          {
            y: -105,
            x: -28,
            opacity: 0.82,
            ease: "none",
            duration: 0.18,
          },
          0.86,
        )
        .to(
          right,
          {
            y: -72,
            x: 28,
            opacity: 0.82,
            ease: "none",
            duration: 0.18,
          },
          0.86,
        );

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [sectionRef, reduceMotion]);
}

export default function AboutDevTalks() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);

  useDevTalksScrollAnimation(sectionRef, Boolean(reduceMotion));

  return (
    <section
      ref={sectionRef}
      id="devtalks"
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden border-y border-[var(--color-border)] bg-[#030303] px-5 py-16 sm:px-8 sm:py-20 lg:px-10"
    >
      {/* =========================================================
          MINIMAL BACKGROUND
      ========================================================== */}

      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Very subtle central glow */}
        <div
          data-devtalks-glow
          className="absolute left-[22%] top-[28%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(255,90,31,0.085),transparent_68%)] opacity-55 blur-3xl will-change-transform"
        />

        {/* Tiny dot field */}
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage: `
              radial-gradient(
                circle at 1px 1px,
                rgba(244,240,232,0.9) 0.7px,
                transparent 0.8px
              )
            `,
            backgroundSize: "30px 30px",
          }}
        />

        {/* Minimal grid */}
        <div
          data-devtalks-grid
          className="absolute -inset-[20%] opacity-[0.028] will-change-transform"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,90,31,0.18) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,90,31,0.18) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "110px 110px",
            transform: "perspective(900px) rotateX(65deg) scale(1.5)",
            transformOrigin: "center center",
          }}
        />

        {/* Ghost section number */}
        <div
          data-devtalks-ghost
          className="absolute right-[-2%] top-[12%] select-none font-mono text-[18rem] font-bold leading-none tracking-[-0.12em] text-white/[0.025] will-change-transform sm:text-[24rem]"
        >
          02
        </div>

        {/* One soft orbital line */}
        <div
          data-devtalks-ring
          className="absolute left-[62%] top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-primary)]/[0.055] will-change-transform sm:h-[46rem] sm:w-[46rem]"
        >
          <span className="absolute left-[8%] top-[16%] h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] opacity-70 shadow-[0_0_12px_var(--color-primary)]" />
        </div>

        {/* Small floating nodes */}
        {NODES.map((node, index) => (
          <motion.span
            key={index}
            className="absolute h-1 w-1 rounded-full bg-[var(--color-primary)]"
            style={{
              top: node.top,
              left: node.left,
            }}
            animate={
              reduceMotion
                ? {}
                : {
                    opacity: [0.1, 0.38, 0.1],
                    scale: [0.8, 1.3, 0.8],
                  }
            }
            transition={
              reduceMotion
                ? {}
                : {
                    duration: 4,
                    delay: node.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          />
        ))}

        {/* Edge accents */}
        <div className="absolute left-6 top-7 h-8 w-8 border-l border-t border-[var(--color-primary)]/[0.10] sm:left-8" />

        <div className="absolute right-6 top-7 h-8 w-8 border-r border-t border-[var(--color-primary)]/[0.10] sm:right-8" />

        <div className="absolute bottom-7 left-6 h-8 w-8 border-b border-l border-[var(--color-primary)]/[0.08] sm:left-8" />

        <div className="absolute bottom-7 right-6 h-8 w-8 border-b border-r border-[var(--color-primary)]/[0.08] sm:right-8" />

        <div className="absolute left-1/2 top-0 h-px w-[58%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-primary)]/[0.25] to-transparent" />
      </div>

      {/* =========================================================
          CONTENT
      ========================================================== */}

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-7xl items-center gap-12 sm:min-h-[calc(100svh-5rem)] sm:gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-24">
        {/* LEFT */}
        <div data-devtalks-left className="will-change-transform">
          <div data-devtalks-eyebrow className="flex items-center gap-3">
            <span className="h-px w-8 bg-[var(--color-primary)]" />

            <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-[var(--color-primary)] sm:text-[10px]">
              02 / DEVTALKS
            </span>
          </div>

          <h2
            data-devtalks-heading
            className="mt-5 max-w-3xl text-[2.8rem] font-semibold leading-[0.98] tracking-[-0.045em] text-[var(--color-text-primary)] sm:text-5xl md:text-6xl lg:text-[4.2rem]"
          >
            Where ideas
            <span className="block text-[var(--color-primary)]">
              meet people.
            </span>
          </h2>

          <div className="mt-6 h-px w-16 bg-[var(--color-primary)]/[0.65] sm:mt-7" />

          <div className="max-w-2xl">
            <p
              data-devtalks-copy
              className="mt-6 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg"
            >
              DevTalks is an experience created by DevKraft Club to bring
              developers, creators, professionals, and students together around
              technology.
            </p>

            <p
              data-devtalks-copy
              className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base"
            >
              It is a space to listen to people building in the real world,
              discover new perspectives, ask better questions, and leave with
              ideas worth building.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div data-devtalks-right className="w-full will-change-transform">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {FEATURES.map(([number, title], index) => (
              <motion.div
                key={number}
                data-devtalk-card
                whileHover={
                  reduceMotion
                    ? {}
                    : {
                        y: -6,
                        scale: 1.02,
                      }
                }
                transition={{
                  duration: 0.25,
                }}
                className="group relative min-h-[145px] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[#090909] p-5 transition-colors duration-300 hover:border-[var(--color-border-orange)] sm:min-h-[175px] sm:p-6"
              >
                {/* Top line */}
                <span className="pointer-events-none absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-0 transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100" />

                {/* Corner */}
                <span className="absolute right-4 top-4 h-3 w-3 border-r border-t border-[var(--color-border)] transition-colors duration-300 group-hover:border-[var(--color-border-orange)]" />

                <span className="font-mono text-[10px] text-[var(--color-primary)]">
                  {number}
                </span>

                <h3 className="mt-9 text-sm font-semibold tracking-[0.05em] text-[var(--color-text-primary)] sm:text-lg">
                  {title}
                </h3>

                <div className="mt-4 h-px w-7 bg-[var(--color-primary)] transition-all duration-300 group-hover:w-12" />

                <span className="absolute bottom-4 right-4 font-mono text-[8px] text-[var(--color-text-muted)]">
                  0{index + 1}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom label */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 font-mono text-[8px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
        <span className="h-px w-7 bg-[var(--color-border)]" />
        DEVTALKS
        <span className="h-px w-7 bg-[var(--color-border)]" />
      </div>
    </section>
  );
}
