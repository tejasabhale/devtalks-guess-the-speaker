import { motion, useReducedMotion } from "framer-motion";

const ROLES = ["Developers", "Designers", "Builders", "Problem solvers"];

const SIGNALS = [
  { top: "14%", left: "8%", delay: 0 },
  { top: "26%", left: "82%", delay: 1.8 },
  { top: "68%", left: "14%", delay: 3.2 },
  { top: "78%", left: "88%", delay: 4.6 },
  { top: "42%", left: "92%", delay: 2.4 },
  { top: "84%", left: "42%", delay: 5.2 },
];

export default function AboutClub() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="about-club"
      className="relative flex min-h-screen w-full items-center overflow-hidden border-y border-[var(--color-border)] bg-[#050505] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-16"
    >
      {/* Premium signal-field background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Fine particles */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              radial-gradient(
                circle,
                rgba(255, 255, 255, 0.9) 0.7px,
                transparent 0.9px
              )
            `,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Large orbital rings */}
        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                  rotate: 360,
                }
          }
          transition={
            reduceMotion
              ? {}
              : {
                  duration: 70,
                  repeat: Infinity,
                  ease: "linear",
                }
          }
          className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035]"
        >
          <span className="absolute left-[8%] top-[18%] h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] opacity-70" />
        </motion.div>

        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                  rotate: -360,
                }
          }
          transition={
            reduceMotion
              ? {}
              : {
                  duration: 95,
                  repeat: Infinity,
                  ease: "linear",
                }
          }
          className="absolute left-1/2 top-1/2 h-[58rem] w-[58rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-primary)]/[0.045]"
        >
          <span className="absolute right-[13%] top-[30%] h-1 w-1 rounded-full bg-[var(--color-primary-light)] opacity-60" />
        </motion.div>

        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                  rotate: 360,
                }
          }
          transition={
            reduceMotion
              ? {}
              : {
                  duration: 120,
                  repeat: Infinity,
                  ease: "linear",
                }
          }
          className="absolute left-1/2 top-1/2 h-[72rem] w-[72rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.02]"
        />

        {/* Moving signal lines */}
        {!reduceMotion && (
          <>
            <motion.span
              initial={{ x: "-120%", opacity: 0 }}
              animate={{ x: "220%", opacity: [0, 0.18, 0] }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "linear",
              }}
              className="absolute left-0 top-[24%] h-px w-[28rem] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent"
            />

            <motion.span
              initial={{ x: "120%", opacity: 0 }}
              animate={{ x: "-220%", opacity: [0, 0.12, 0] }}
              transition={{
                duration: 13,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "linear",
              }}
              className="absolute right-0 top-[74%] h-px w-[24rem] bg-gradient-to-r from-transparent via-[var(--color-primary-light)] to-transparent"
            />
          </>
        )}

        {/* Floating signal points */}
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
                    opacity: [0.08, 0.55, 0.08],
                    scale: [0.8, 1.5, 0.8],
                  }
            }
            transition={
              reduceMotion
                ? {}
                : {
                    duration: 3.5,
                    delay: signal.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          />
        ))}

        {/* Technical corner markers */}
        <motion.div
          className="absolute left-[5%] top-[12%] h-10 w-10 border-l border-t border-[var(--color-primary)]/[0.12]"
          animate={
            reduceMotion
              ? {}
              : {
                  opacity: [0.2, 0.55, 0.2],
                }
          }
          transition={
            reduceMotion
              ? {}
              : {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        />

        <motion.div
          className="absolute bottom-[12%] right-[5%] h-10 w-10 border-b border-r border-[var(--color-primary)]/[0.12]"
          animate={
            reduceMotion
              ? {}
              : {
                  opacity: [0.2, 0.5, 0.2],
                }
          }
          transition={
            reduceMotion
              ? {}
              : {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        />

        {/* Very subtle center pulse */}
        {!reduceMotion && (
          <motion.div
            initial={{ opacity: 0.02, scale: 0.9 }}
            animate={{
              opacity: [0.02, 0.06, 0.02],
              scale: [0.9, 1.05, 0.9],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute left-1/2 top-1/2 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-primary)]/[0.04]"
          />
        )}
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-[1600px] items-center gap-12 sm:gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 xl:gap-24">
        {/* Left */}
        <motion.div
          initial={{
            opacity: 0,
            x: reduceMotion ? 0 : -30,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.75,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="max-w-xl"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-7 bg-[var(--color-primary)]" />

            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-primary-light)] sm:text-[10px]">
              01 / WHO WE ARE
            </span>
          </div>

          <h2 className="mt-5 text-4xl font-bold leading-[0.96] tracking-[-0.05em] text-[var(--color-text-primary)] sm:text-5xl md:text-6xl lg:text-[3.8rem] xl:text-[4.25rem]">
            More than
            <br />a club.
            <span className="mt-2 block text-[var(--color-text-secondary)]">
              It's where
              <br />
              ideas get
              <span className="text-[var(--color-primary-light)]">
                {" "}
                shipped.
              </span>
            </span>
          </h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 72 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-7 h-px bg-[var(--color-primary-light)] sm:mt-8"
          />

          <div className="mt-4 font-mono text-[8px] uppercase tracking-[0.22em] text-[var(--color-text-muted)] sm:text-[9px]">
            CURIOUS MINDS <span className="text-[var(--color-primary)]">→</span>{" "}
            REAL BUILDS
          </div>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{
            opacity: 0,
            y: reduceMotion ? 0 : 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.75,
            delay: 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="w-full"
        >
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

            <motion.div
              initial={{
                opacity: 0,
                y: reduceMotion ? 0 : 10,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                delay: 0.35,
                duration: 0.5,
              }}
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
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-3 font-mono text-[8px] uppercase tracking-[0.22em] text-[var(--color-text-muted)] sm:flex">
        <span className="h-px w-7 bg-[var(--color-border)]" />
        COMMUNITY
        <span className="h-px w-7 bg-[var(--color-border)]" />
      </div>
    </section>
  );
}
