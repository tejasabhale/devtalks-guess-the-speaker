import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ROLES = ["Developers", "Designers", "Builders", "Problem solvers"];

const SIGNALS = [
  { top: "14%", left: "8%", delay: 0 },
  { top: "26%", left: "82%", delay: 1.8 },
  { top: "68%", left: "14%", delay: 3.2 },
  { top: "78%", left: "88%", delay: 4.6 },
  { top: "42%", left: "92%", delay: 2.4 },
  { top: "84%", left: "42%", delay: 5.2 },
];

function useClubScrollAnimation(sectionRef, reduceMotion) {
  useEffect(() => {
    if (reduceMotion) return;

    const section = sectionRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 1024px)",
          tablet: "(min-width: 640px) and (max-width: 1023px)",
          mobile: "(max-width: 639px)",
        },
        (context) => {
          const { desktop, mobile } = context.conditions;

          const left = section.querySelector("[data-club-left]");
          const right = section.querySelector("[data-club-right]");
          const eyebrow = section.querySelector("[data-club-eyebrow]");
          const heading = section.querySelector("[data-club-heading]");
          const divider = section.querySelector("[data-club-divider]");
          const status = section.querySelector("[data-club-status]");
          const roles = gsap.utils.toArray("[data-club-role]", section);

          const background = section.querySelector("[data-club-background]");
          const ghost = section.querySelector("[data-club-ghost]");
          const ring = section.querySelector("[data-club-ring]");
          const core = section.querySelector("[data-club-core]");
          const grid = section.querySelector("[data-club-grid]");

          if (!left || !right) return;

          const sideOffset = desktop ? 90 : mobile ? 0 : 55;

          /*
           * =========================================================
           * INITIAL STATE
           * =========================================================
           */

          if (mobile) {
            gsap.set(left, {
              y: 55,
              opacity: 0,
              filter: "blur(12px)",
            });

            gsap.set(right, {
              y: 65,
              opacity: 0,
              filter: "blur(12px)",
            });
          } else {
            gsap.set(left, {
              x: -sideOffset,
              y: 38,
              opacity: 0,
              filter: "blur(12px)",
            });

            gsap.set(right, {
              x: sideOffset,
              y: 38,
              opacity: 0,
              filter: "blur(12px)",
            });
          }

          if (eyebrow) {
            gsap.set(eyebrow, {
              x: mobile ? 0 : -18,
              y: mobile ? 16 : 0,
              opacity: 0,
            });
          }

          if (heading) {
            gsap.set(heading, {
              y: 26,
              opacity: 0,
              scale: 0.975,
              filter: "blur(8px)",
            });
          }

          if (divider) {
            gsap.set(divider, {
              scaleX: 0,
              transformOrigin: "left center",
            });
          }

          if (roles.length) {
            gsap.set(roles, {
              y: 16,
              opacity: 0,
            });
          }

          if (status) {
            gsap.set(status, {
              y: 12,
              opacity: 0,
            });
          }

          /*
           * =========================================================
           * MAIN CONTINUOUS TIMELINE
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

          if (eyebrow) {
            timeline.to(
              eyebrow,
              {
                x: 0,
                y: 0,
                opacity: 1,
                ease: "none",
                duration: 0.06,
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
                duration: 0.2,
              },
              0,
            )
            .to(
              right,
              {
                x: 0,
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                ease: "none",
                duration: 0.2,
              },
              0.025,
            );

          if (heading) {
            timeline.to(
              heading,
              {
                y: 0,
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                ease: "none",
                duration: 0.14,
              },
              0.07,
            );
          }

          if (divider) {
            timeline.to(
              divider,
              {
                scaleX: 1,
                ease: "none",
                duration: 0.07,
              },
              0.16,
            );
          }

          if (roles.length) {
            timeline.to(
              roles,
              {
                y: 0,
                opacity: 1,
                ease: "none",
                stagger: 0.018,
                duration: 0.09,
              },
              0.19,
            );
          }

          if (status) {
            timeline.to(
              status,
              {
                y: 0,
                opacity: 1,
                ease: "none",
                duration: 0.07,
              },
              0.27,
            );
          }

          /*
           * =========================================================
           * PHASE 2 — UNIFIED MOMENT
           * =========================================================
           */

          timeline
            .to(
              left,
              {
                y: mobile ? -10 : -16,
                ease: "none",
                duration: 0.12,
              },
              0.31,
            )
            .to(
              right,
              {
                y: mobile ? -10 : -16,
                ease: "none",
                duration: 0.12,
              },
              0.31,
            );

          if (heading) {
            timeline.to(
              heading,
              {
                y: mobile ? -6 : -10,
                ease: "none",
                duration: 0.12,
              },
              0.31,
            );
          }

          /*
           * =========================================================
           * PHASE 3 — CONTINUOUS PARALLAX
           * =========================================================
           */

          timeline
            .to(
              left,
              {
                x: mobile ? 0 : -16,
                y: mobile ? -42 : -72,
                ease: "none",
                duration: 0.42,
              },
              0.43,
            )
            .to(
              right,
              {
                x: mobile ? 0 : 16,
                y: mobile ? -24 : -38,
                ease: "none",
                duration: 0.42,
              },
              0.43,
            );

          if (heading) {
            timeline.to(
              heading,
              {
                y: mobile ? -25 : -48,
                scale: mobile ? 0.985 : 0.97,
                ease: "none",
                duration: 0.42,
              },
              0.43,
            );
          }

          /*
           * =========================================================
           * PHASE 4 — ENDING ANIMATION
           * =========================================================
           *
           * The section begins visually leaving before it is
           * completely out of the viewport.
           */

          timeline
            .to(
              left,
              {
                x: mobile ? 0 : -28,
                y: mobile ? -105 : -125,
                opacity: 0.52,
                scale: mobile ? 0.97 : 0.94,
                filter: "blur(4px)",
                ease: "none",
                duration: 0.2,
              },
              0.78,
            )
            .to(
              right,
              {
                x: mobile ? 0 : 28,
                y: mobile ? -82 : -92,
                opacity: 0.52,
                scale: mobile ? 0.97 : 0.95,
                filter: "blur(4px)",
                ease: "none",
                duration: 0.2,
              },
              0.78,
            );

          if (heading) {
            timeline.to(
              heading,
              {
                y: mobile ? -55 : -75,
                scale: mobile ? 0.95 : 0.94,
                opacity: 0.58,
                filter: "blur(3px)",
                ease: "none",
                duration: 0.2,
              },
              0.78,
            );
          }

          if (eyebrow) {
            timeline.to(
              eyebrow,
              {
                y: mobile ? -40 : -48,
                opacity: 0.4,
                ease: "none",
                duration: 0.2,
              },
              0.78,
            );
          }

          if (divider) {
            timeline.to(
              divider,
              {
                scaleX: 0.55,
                opacity: 0.35,
                ease: "none",
                duration: 0.2,
              },
              0.78,
            );
          }

          if (roles.length) {
            timeline.to(
              roles,
              {
                y: mobile ? -30 : -36,
                opacity: 0.38,
                ease: "none",
                duration: 0.2,
              },
              0.78,
            );
          }

          if (status) {
            timeline.to(
              status,
              {
                y: mobile ? -26 : -30,
                opacity: 0.35,
                ease: "none",
                duration: 0.2,
              },
              0.78,
            );
          }

          /*
           * =========================================================
           * BACKGROUND ENDING
           * =========================================================
           */

          if (background) {
            timeline.to(
              background,
              {
                x: mobile ? 15 : 30,
                y: mobile ? -45 : -70,
                scale: 1.12,
                opacity: 0.5,
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
                x: mobile ? -12 : -30,
                y: mobile ? -35 : -55,
                scale: 1.06,
                opacity: 0.045,
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
                rotation: 28,
                scale: 1.08,
                xPercent: mobile ? 2 : 4,
                yPercent: -3,
                ease: "none",
                duration: 1,
              },
              0,
            );
          }

          if (core) {
            timeline.to(
              core,
              {
                scale: 1.14,
                opacity: 0.6,
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
                x: mobile ? 10 : 20,
                y: mobile ? -12 : -20,
                ease: "none",
                duration: 1,
              },
              0,
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
  }, [sectionRef, reduceMotion]);

  return null;
}

export default function AboutClub() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);

  useClubScrollAnimation(sectionRef, Boolean(reduceMotion));

  return (
    <section
      ref={sectionRef}
      id="devkraft"
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden border-y border-[var(--color-border)] bg-[#030303] px-5 py-16 sm:px-8 sm:py-20 lg:px-10"
    >
      {/* =========================================================
          MINIMAL BACKGROUND
      ========================================================== */}

      <div
        data-club-background
        className="pointer-events-none absolute inset-0 overflow-hidden will-change-transform"
        aria-hidden="true"
      >
        <div className="absolute left-[18%] top-[20%] h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(255,90,31,0.075),transparent_68%)] blur-3xl" />

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

        <div
          data-club-grid
          className="absolute -inset-[15%] opacity-[0.026] will-change-transform"
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
            backgroundSize: "105px 105px",
            transform: "perspective(900px) rotateX(64deg) scale(1.45)",
            transformOrigin: "center center",
          }}
        />

        {/* Ghost section number */}
        <div
          data-club-ghost
          className="absolute right-[-2%] top-[7%] select-none font-mono text-[18rem] font-bold leading-none tracking-[-0.12em] text-white/[0.025] will-change-transform sm:text-[24rem]"
        >
          01
        </div>

        {/* Main orbital ring */}
        <div
          data-club-ring
          className="absolute left-[60%] top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-primary)]/[0.055] will-change-transform sm:h-[47rem] sm:w-[47rem]"
        >
          <span className="absolute left-[7%] top-[17%] h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] shadow-[0_0_12px_var(--color-primary)]" />
        </div>

        {/* Inner ring */}
        <div className="absolute left-[60%] top-1/2 h-[13rem] w-[13rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.03] sm:h-[18rem] sm:w-[18rem]" />

        {/* Core */}
        <div
          data-club-core
          className="absolute left-[60%] top-1/2 h-[5rem] w-[5rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,90,31,0.10),transparent_72%)] opacity-40 blur-xl will-change-transform sm:h-[7rem] sm:w-[7rem]"
        />

        {/* Floating points */}
        {SIGNALS.map((signal, index) => (
          <motion.span
            key={index}
            className="absolute h-1 w-1 rounded-full bg-[var(--color-primary)]"
            style={{
              top: signal.top,
              left: signal.left,
            }}
            animate={
              reduceMotion
                ? {}
                : {
                    opacity: [0.08, 0.4, 0.08],
                    scale: [0.8, 1.25, 0.8],
                  }
            }
            transition={
              reduceMotion
                ? {}
                : {
                    duration: 4,
                    delay: signal.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          />
        ))}

        {/* Thin signal lines */}
        {!reduceMotion && (
          <>
            <motion.span
              initial={{
                x: "-120%",
                opacity: 0,
              }}
              animate={{
                x: "240%",
                opacity: [0, 0.12, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "linear",
              }}
              className="absolute left-0 top-[24%] h-px w-[24rem] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent"
            />

            <motion.span
              initial={{
                x: "120%",
                opacity: 0,
              }}
              animate={{
                x: "-240%",
                opacity: [0, 0.08, 0],
              }}
              transition={{
                duration: 14,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "linear",
              }}
              className="absolute right-0 top-[72%] h-px w-[22rem] bg-gradient-to-r from-transparent via-[var(--color-primary-light)] to-transparent"
            />
          </>
        )}

        {/* Corner brackets */}
        <div className="absolute left-6 top-7 h-8 w-8 border-l border-t border-[var(--color-primary)]/[0.1] sm:left-8" />

        <div className="absolute right-6 top-7 h-8 w-8 border-r border-t border-[var(--color-primary)]/[0.1] sm:right-8" />

        <div className="absolute bottom-7 left-6 h-8 w-8 border-b border-l border-[var(--color-primary)]/[0.08] sm:left-8" />

        <div className="absolute bottom-7 right-6 h-8 w-8 border-b border-r border-[var(--color-primary)]/[0.08] sm:right-8" />

        {/* Top accent */}
        <div className="absolute left-1/2 top-0 h-px w-[58%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-primary)]/[0.22] to-transparent" />
      </div>

      {/* =========================================================
          CONTENT
      ========================================================== */}

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-[1500px] items-center gap-12 sm:min-h-[calc(100svh-5rem)] sm:gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 xl:gap-28">
        {/* LEFT */}
        <div data-club-left className="will-change-transform">
          <div data-club-eyebrow className="flex items-center gap-3">
            <span className="h-px w-7 bg-[var(--color-primary)]" />

            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-primary-light)] sm:text-[10px]">
              01 / WHO WE ARE
            </span>
          </div>

          <h2
            data-club-heading
            className="mt-5 max-w-xl text-[2.9rem] font-semibold leading-[0.96] tracking-[-0.055em] text-[var(--color-text-primary)] sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.4rem]"
          >
            More than
            <br />a club.
            <span className="mt-3 block text-[var(--color-text-secondary)]">
              It's where
              <br />
              ideas get
              <span className="text-[var(--color-primary-light)]">
                {" "}
                shipped.
              </span>
            </span>
          </h2>

          <div
            data-club-divider
            className="mt-7 h-px w-[72px] origin-left bg-[var(--color-primary-light)] sm:mt-8"
          />

          <div className="mt-4 font-mono text-[8px] uppercase tracking-[0.22em] text-[var(--color-text-muted)] sm:text-[9px]">
            CURIOUS MINDS <span className="text-[var(--color-primary)]">→</span>{" "}
            REAL BUILDS
          </div>
        </div>

        {/* RIGHT */}
        <div data-club-right className="w-full will-change-transform">
          <div className="max-w-3xl">
            <p className="text-lg font-medium leading-relaxed text-[var(--color-text-primary)] sm:text-xl md:text-2xl">
              DevKraft Club brings together students who are curious about
              technology and passionate about creating with it.
            </p>

            <p className="mt-5 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg md:text-xl">
              We create a space where developers, designers, problem-solvers,
              and technology enthusiasts can learn from one another, collaborate
              on projects, explore emerging technologies, and turn ideas into
              real experiences.
            </p>

            <div className="mt-9 border-t border-[var(--color-border)] pt-7 sm:mt-10 sm:pt-8">
              <div className="mb-4 font-mono text-[8px] uppercase tracking-[0.22em] text-[var(--color-text-muted)] sm:text-[9px]">
                THE PEOPLE BEHIND THE BUILDS
              </div>

              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2.5 sm:gap-x-4">
                {ROLES.map((role, index) => (
                  <span
                    key={role}
                    className="flex items-baseline gap-3 sm:gap-4"
                  >
                    <motion.span
                      data-club-role
                      whileHover={
                        reduceMotion
                          ? {}
                          : {
                              y: -2,
                              color: "var(--color-primary-light)",
                            }
                      }
                      transition={{ duration: 0.2 }}
                      className="cursor-default text-sm font-medium text-[var(--color-text-secondary)] transition-colors sm:text-base md:text-lg"
                    >
                      {role}
                    </motion.span>

                    {index < ROLES.length - 1 && (
                      <span
                        className="font-mono text-[var(--color-primary-dark)]"
                        aria-hidden="true"
                      >
                        +
                      </span>
                    )}
                  </span>
                ))}

                <span
                  className="font-mono text-[var(--color-primary)]"
                  aria-hidden="true"
                >
                  =
                </span>

                <span className="text-sm font-semibold text-[var(--color-text-primary)] sm:text-base md:text-lg">
                  <span className="text-[var(--color-primary-light)]">Dev</span>
                  Kraft
                </span>
              </div>
            </div>

            <div
              data-club-status
              className="mt-8 flex items-center gap-3 sm:mt-9"
            >
              <span className="relative flex h-2 w-2">
                {!reduceMotion && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-primary)] opacity-40" />
                )}

                <span className="relative h-2 w-2 rounded-full bg-[var(--color-primary-light)]" />
              </span>

              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] sm:text-[9px]">
                Student-led developer community
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom label */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 font-mono text-[8px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
        <span className="h-px w-7 bg-[var(--color-border)]" />
        DEVKRAFT
        <span className="h-px w-7 bg-[var(--color-border)]" />
      </div>
    </section>
  );
}
