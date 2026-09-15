import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function AboutCTA() {
  return (
    <section className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,90,31,0.14),transparent_48%)]" />

      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.12, 0.2, 0.12],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-primary)]/20 blur-[120px] sm:h-[34rem] sm:w-[34rem]"
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 25, filter: "blur(8px)" }}
          whileInView={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
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
            06 / EXPLORE THE ECOSYSTEM
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
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
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group glass rounded-2xl px-5 py-6 text-left transition-all duration-300 hover:border-[var(--color-border-orange)] hover:bg-[var(--color-surface-hover)] sm:px-6"
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
          </motion.a>

          <motion.a
            href="https://your-devkraft-website.com"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group glass rounded-2xl px-5 py-6 text-left transition-all duration-300 hover:border-[var(--color-border-orange)] hover:bg-[var(--color-surface-hover)] sm:px-6"
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
          </motion.a>

          <motion.div
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group"
          >
            <Link
              to="/guess"
              className="glass block h-full rounded-2xl px-5 py-6 text-left transition-all duration-300 hover:border-[var(--color-border-orange)] hover:bg-[var(--color-surface-hover)] sm:px-6"
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
