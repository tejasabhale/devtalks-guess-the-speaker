import { motion } from "framer-motion";

export default function AboutDevTalks() {
  return (
    <section className="relative overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(244,240,232,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(244,240,232,0.035) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 85% 90% at 50% 50%, black 20%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 90% at 50% 50%, black 20%, transparent 100%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 78% 50%, rgba(255,90,31,0.12), transparent 28%)",
        }}
      />

      <div
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-border-orange)] to-transparent opacity-50"
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute right-[-10%] top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[var(--color-primary)]/10 blur-[120px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-primary)] sm:text-xs">
            03 / DEVTALKS
          </span>

          <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
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

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-2 gap-3"
        >
          {[
            ["01", "TALKS"],
            ["02", "WORKSHOPS"],
            ["03", "NETWORKING"],
            ["04", "EXPERIENCES"],
          ].map(([number, title]) => (
            <div
              key={number}
              className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-border-orange)] hover:bg-[var(--color-surface-hover)] sm:p-7"
            >
              <span className="font-mono text-[10px] text-[var(--color-primary)]">
                {number}
              </span>

              <h3 className="mt-10 text-lg font-semibold sm:text-xl">
                {title}
              </h3>

              <div className="mt-4 h-px w-8 bg-[var(--color-primary)] transition-all duration-300 group-hover:w-14" />
            </div>
          ))}
        </motion.div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[55%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
