import { motion, useReducedMotion } from "framer-motion";

const FEATURES = [
  ["01", "TALKS"],
  ["02", "WORKSHOPS"],
  ["03", "NETWORKING"],
  ["04", "EXPERIENCES"],
];

const NODES = [
  { top: "18%", left: "9%", delay: 0 },
  { top: "31%", left: "86%", delay: 1.4 },
  { top: "56%", left: "94%", delay: 2.6 },
  { top: "76%", left: "12%", delay: 3.8 },
  { top: "82%", left: "72%", delay: 4.8 },
  { top: "14%", left: "62%", delay: 2.1 },
];

export default function AboutDevTalks() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="devtalks"
      className="relative overflow-hidden border-y border-[var(--color-border)] bg-[#050505] px-5 py-20 sm:px-8 sm:py-28 lg:px-10"
    >
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Fine noise-like dots */}
        <div
          className="absolute inset-0 opacity-[0.028]"
          style={{
            backgroundImage: `
              radial-gradient(
                circle at 1px 1px,
                rgba(244, 240, 232, 0.8) 0.8px,
                transparent 0.9px
              )
            `,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Technical diagonal texture */}
        <motion.div
          className="absolute -inset-[20%] opacity-[0.025]"
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
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                }
          }
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                135deg,
                transparent 0px,
                transparent 46px,
                rgba(255, 90, 31, 0.5) 47px,
                transparent 48px
              )
            `,
            backgroundSize: "140px 140px",
          }}
        />

        {/* Connected network lines */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.12]"
          viewBox="0 0 1200 700"
          preserveAspectRatio="none"
        >
          <path
            d="M0 160 C180 120 240 240 390 190 S650 110 790 190 S1030 280 1200 170"
            fill="none"
            stroke="rgba(255,90,31,0.16)"
            strokeWidth="1"
            strokeDasharray="4 10"
          />

          <path
            d="M0 520 C170 460 290 540 430 470 S690 390 850 480 S1050 540 1200 430"
            fill="none"
            stroke="rgba(244,240,232,0.08)"
            strokeWidth="1"
            strokeDasharray="3 12"
          />

          <path
            d="M120 0 C190 130 150 240 220 350 S300 560 360 700"
            fill="none"
            stroke="rgba(255,90,31,0.08)"
            strokeWidth="1"
          />

          <path
            d="M940 0 C880 130 960 230 900 350 S850 560 790 700"
            fill="none"
            stroke="rgba(255,90,31,0.07)"
            strokeWidth="1"
          />
        </svg>

        {/* Accent nodes */}
        {NODES.map((node, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              top: node.top,
              left: node.left,
            }}
            animate={
              reduceMotion
                ? {}
                : {
                    opacity: [0.2, 0.65, 0.2],
                  }
            }
            transition={
              reduceMotion
                ? {}
                : {
                    duration: 3.5,
                    delay: node.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          >
            <span className="block h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
            <span className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-primary)]/20" />
          </motion.div>
        ))}

        {/* Traveling signal */}
        {!reduceMotion && (
          <>
            <motion.div
              className="absolute left-[-15%] top-[27%] h-px w-[260px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/50 to-transparent"
              animate={{
                x: ["0%", "520%"],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 11,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "linear",
              }}
            />

            <motion.div
              className="absolute right-[-15%] top-[68%] h-px w-[220px] bg-gradient-to-r from-transparent via-[var(--color-primary-light)]/35 to-transparent"
              animate={{
                x: ["0%", "-580%"],
                opacity: [0, 0.35, 0],
              }}
              transition={{
                duration: 13,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "linear",
              }}
            />
          </>
        )}

        {/* Top and bottom accent cuts */}
        <div className="absolute left-1/2 top-0 h-px w-[65%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-border-orange)] to-transparent opacity-60" />

        <div className="absolute bottom-0 left-1/2 h-px w-[55%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

        {/* Corner brackets */}
        <div className="absolute left-5 top-8 h-8 w-8 border-l border-t border-[var(--color-primary)]/10 sm:left-8" />
        <div className="absolute right-5 top-8 h-8 w-8 border-r border-t border-[var(--color-primary)]/10 sm:right-8" />
        <div className="absolute bottom-8 left-5 h-8 w-8 border-b border-l border-[var(--color-primary)]/10 sm:left-8" />
        <div className="absolute bottom-8 right-5 h-8 w-8 border-b border-r border-[var(--color-primary)]/10 sm:right-8" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
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
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-primary)] sm:text-xs">
            02 / DEVTALKS
          </span>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-5xl lg:text-6xl">
            Where ideas
            <span className="block text-[var(--color-primary)]">
              meet people.
            </span>
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
            DevTalks is an experience created by DevKraft Club to bring
            developers, creators, professionals, and students together around
            technology.
          </p>

          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
            It is a space to listen to people building in the real world,
            discover new perspectives, ask better questions, and leave with
            ideas worth building.
          </p>
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
            duration: 0.7,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="grid grid-cols-2 gap-3"
        >
          {FEATURES.map(([number, title], index) => (
            <motion.div
              key={number}
              whileHover={
                reduceMotion
                  ? {}
                  : {
                      y: -4,
                    }
              }
              transition={{ duration: 0.25 }}
              className="group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[#0a0a0a] p-5 transition-colors duration-300 hover:border-[var(--color-border-orange)] sm:p-7"
            >
              {/* Card scan line */}
              <motion.div
                className="pointer-events-none absolute left-0 top-0 h-px w-full origin-left bg-[var(--color-primary)] opacity-0"
                initial={{ scaleX: 0 }}
                whileHover={
                  reduceMotion
                    ? {}
                    : {
                        scaleX: 1,
                        opacity: 0.7,
                      }
                }
                transition={{ duration: 0.35 }}
              />

              {/* Corner detail */}
              <div className="absolute right-4 top-4 h-3 w-3 border-r border-t border-[var(--color-border)] transition-colors duration-300 group-hover:border-[var(--color-border-orange)]" />

              <span className="font-mono text-[10px] text-[var(--color-primary)]">
                {number}
              </span>

              <h3 className="mt-10 text-lg font-semibold text-[var(--color-text-primary)] sm:text-xl">
                {title}
              </h3>

              <div className="mt-4 h-px w-8 bg-[var(--color-primary)] transition-all duration-300 group-hover:w-14" />

              <span className="absolute bottom-4 right-4 font-mono text-[8px] text-[var(--color-text-muted)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                0{index + 1}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
