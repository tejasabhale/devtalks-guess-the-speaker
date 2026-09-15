import { motion, useReducedMotion } from "framer-motion";

const ROLES = ["Developers", "Designers", "Builders", "Problem solvers"];

export default function AboutClub() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="about-club"
      className="relative flex min-h-screen w-full items-center overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-16"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(244, 240, 232, 0.45) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(244, 240, 232, 0.45) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "64px 64px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 1,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-primary)]/10 blur-[120px] sm:h-[32rem] sm:w-[32rem] lg:h-[38rem] lg:w-[38rem]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1600px] items-center gap-12 sm:gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 xl:gap-24">
        <motion.div
          initial={{
            opacity: 0,
            x: -30,
            filter: "blur(6px)",
          }}
          whileInView={{
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
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
            <br />
            a club.
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
            className="mt-7 h-px bg-[var(--color-primary-light)] shadow-[0_0_10px_rgba(255,122,69,0.3)] sm:mt-8"
          />

          <div className="mt-4 font-mono text-[8px] uppercase tracking-[0.22em] text-[var(--color-text-muted)] sm:text-[9px]">
            CURIOUS MINDS → REAL BUILDS
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
            filter: "blur(6px)",
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
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
              and technology enthusiasts can learn from one another,
              collaborate on projects, explore emerging technologies, and turn
              ideas into real experiences.
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
                        className="font-mono text-[var(--color-primary)]"
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
                  DevKraft
                </span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.35,
                duration: 0.5,
              }}
              className="mt-8 flex items-center gap-3 sm:mt-9"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-primary)] opacity-50" />
                <span className="relative h-2 w-2 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)]" />
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