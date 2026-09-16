import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";

const SIGNALS = [
  { top: "16%", left: "12%", delay: 0 },
  { top: "24%", left: "84%", delay: 1.2 },
  { top: "72%", left: "10%", delay: 2.4 },
  { top: "78%", left: "88%", delay: 3.6 },
  { top: "42%", left: "92%", delay: 1.8 },
  { top: "82%", left: "46%", delay: 4.5 },
];

export default function AboutCTA() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden border-t border-[var(--color-border)] bg-[#040404] px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
      {/* Cinematic background */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Micro particles */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              radial-gradient(
                circle at 1px 1px,
                rgba(244,240,232,0.75) 0.8px,
                transparent 0.9px
              )
            `,
            backgroundSize: "26px 26px",
          }}
        />

        {/* Large orbit */}
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
                  duration: 80,
                  repeat: Infinity,
                  ease: "linear",
                }
          }
          className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-primary)]/[0.07] sm:h-[40rem] sm:w-[40rem] lg:h-[52rem] lg:w-[52rem]"
        >
          <span className="absolute left-[7%] top-[22%] h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
        </motion.div>

        {/* Inner orbit */}
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
                  duration: 55,
                  repeat: Infinity,
                  ease: "linear",
                }
          }
          className="absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.045] sm:h-[26rem] sm:w-[26rem] lg:h-[34rem] lg:w-[34rem]"
        >
          <span className="absolute right-[10%] top-[35%] h-1 w-1 rounded-full bg-[var(--color-primary-light)]" />
        </motion.div>

        {/* Elliptical cut */}
        <motion.div
          animate={
            reduceMotion
              ? {}
              : {
                  rotate: [0, 5, 0, -5, 0],
                }
          }
          transition={
            reduceMotion
              ? {}
              : {
                  duration: 16,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          className="absolute left-1/2 top-1/2 h-[16rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-[var(--color-primary)]/[0.05] sm:h-[22rem] sm:w-[58rem]"
        />

        {/* Fine diagonal scan texture */}
        <motion.div
          className="absolute -inset-[20%] opacity-[0.018]"
          animate={
            reduceMotion
              ? {}
              : {
                  backgroundPosition: ["0px 0px", "120px 80px", "0px 0px"],
                }
          }
          transition={
            reduceMotion
              ? {}
              : {
                  duration: 28,
                  repeat: Infinity,
                  ease: "linear",
                }
          }
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                135deg,
                transparent 0px,
                transparent 54px,
                rgba(255,90,31,0.7) 55px,
                transparent 56px
              )
            `,
            backgroundSize: "150px 150px",
          }}
        />

        {/* Slow moving signal pulse */}
        {!reduceMotion && (
          <>
            <motion.div
              className="absolute left-[-20%] top-[32%] h-px w-[320px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/45 to-transparent"
              animate={{
                x: ["0%", "500%"],
                opacity: [0, 0.35, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "linear",
              }}
            />

            <motion.div
              className="absolute right-[-20%] top-[66%] h-px w-[280px] bg-gradient-to-r from-transparent via-[var(--color-primary-light)]/30 to-transparent"
              animate={{
                x: ["0%", "-520%"],
                opacity: [0, 0.28, 0],
              }}
              transition={{
                duration: 14,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "linear",
              }}
            />
          </>
        )}

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
                    opacity: [0.1, 0.6, 0.1],
                    scale: [0.8, 1.35, 0.8],
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
          >
            <span className="block h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
            <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-primary)]/15" />
          </motion.span>
        ))}

        {/* Minimal corner details */}
        <div className="absolute left-5 top-7 h-8 w-8 border-l border-t border-[var(--color-primary)]/10 sm:left-8" />
        <div className="absolute right-5 top-7 h-8 w-8 border-r border-t border-[var(--color-primary)]/10 sm:right-8" />
        <div className="absolute bottom-7 left-5 h-8 w-8 border-b border-l border-[var(--color-primary)]/10 sm:left-8" />
        <div className="absolute bottom-7 right-5 h-8 w-8 border-b border-r border-[var(--color-primary)]/10 sm:right-8" />

        {/* Top accent */}
        <div className="absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-border-orange)] to-transparent opacity-60" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
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
            amount: 0.3,
          }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-primary-light)] sm:text-[10px]">
            03 / EXPLORE THE ECOSYSTEM
          </span>

          <h2 className="mt-5 text-4xl font-semibold leading-[1] tracking-[-0.05em] text-[var(--color-text-primary)] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            There’s more
            <span className="block text-[var(--color-primary-light)]">
              to discover.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg md:text-xl">
            Explore the events, stories, and community behind DevKraft. Discover
            DevTalks, experience the speaker journey, and see what the club is
            building next.
          </p>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: reduceMotion ? 0 : 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.7,
            delay: 0.15,
          }}
          className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-3"
        >
          <motion.a
            href="https://your-devtalks-website.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={reduceMotion ? {} : { y: -4 }}
            whileTap={reduceMotion ? {} : { scale: 0.98 }}
            className="group rounded-2xl border border-[var(--color-border)] bg-[#090909] px-5 py-6 text-left transition-all duration-300 hover:border-[var(--color-border-orange)] hover:bg-[#0d0d0d] sm:px-6"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-[var(--color-primary)]">
                01
              </span>

              <span className="text-sm text-[var(--color-text-muted)] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-primary-light)]">
                ↗
              </span>
            </div>

            <h3 className="mt-8 text-xl font-semibold text-[var(--color-text-primary)] sm:text-2xl">
              DevTalks
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
              Visit the official DevTalks website and explore the full event.
            </p>

            <div className="mt-5 h-px w-8 bg-[var(--color-primary)] transition-all duration-300 group-hover:w-14" />
          </motion.a>

          <motion.a
            href="https://your-devkraft-website.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={reduceMotion ? {} : { y: -4 }}
            whileTap={reduceMotion ? {} : { scale: 0.98 }}
            className="group rounded-2xl border border-[var(--color-border)] bg-[#090909] px-5 py-6 text-left transition-all duration-300 hover:border-[var(--color-border-orange)] hover:bg-[#0d0d0d] sm:px-6"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-[var(--color-primary)]">
                02
              </span>

              <span className="text-sm text-[var(--color-text-muted)] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-primary-light)]">
                ↗
              </span>
            </div>

            <h3 className="mt-8 text-xl font-semibold text-[var(--color-text-primary)] sm:text-2xl">
              DevKraft
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
              Explore the club, its work, and the community behind the events.
            </p>

            <div className="mt-5 h-px w-8 bg-[var(--color-primary)] transition-all duration-300 group-hover:w-14" />
          </motion.a>

          <motion.div
            whileHover={reduceMotion ? {} : { y: -4 }}
            whileTap={reduceMotion ? {} : { scale: 0.98 }}
            className="group"
          >
            <Link
              to="/guess"
              className="block h-full rounded-2xl border border-[var(--color-border)] bg-[#090909] px-5 py-6 text-left transition-all duration-300 hover:border-[var(--color-border-orange)] hover:bg-[#0d0d0d] sm:px-6"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-[var(--color-primary)]">
                  03
                </span>

                <span className="text-sm text-[var(--color-text-muted)] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-primary-light)]">
                  →
                </span>
              </div>

              <h3 className="mt-8 text-xl font-semibold text-[var(--color-text-primary)] sm:text-2xl">
                Guess the Speaker
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                Step into the mystery and see if you can identify the DevTalks
                speakers.
              </p>

              <div className="mt-5 h-px w-8 bg-[var(--color-primary)] transition-all duration-300 group-hover:w-14" />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.6,
            delay: 0.35,
          }}
          className="mt-10 flex items-center justify-center gap-3 font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] sm:mt-12 sm:text-[9px]"
        >
          <span className="h-px w-8 bg-[var(--color-border)]" />
          Built by DevKraft Club
          <span className="h-px w-8 bg-[var(--color-border)]" />
        </motion.div>
      </div>
    </section>
  );
}
