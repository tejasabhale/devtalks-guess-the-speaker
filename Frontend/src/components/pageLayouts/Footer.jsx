import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * Site footer for DevTalks — Guess the Speaker.
 * Minimal: just the wordmark and a credit line.
 */
export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]"
    >
      <div className="relative flex w-full flex-nowrap items-center justify-between gap-2 px-4 py-4 sm:gap-3 sm:px-6 sm:py-6 lg:px-8">
        <Link to="/" className="group flex shrink-0 items-center">
          <img
            src="/logo/devkraft.png"
            alt="DevTalks"
            className="h-6 w-auto object-contain sm:h-7"
          />
        </Link>

        <Link
          to="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-lg"
        >
          Dev
          <span className="text-[var(--color-primary)]">Talks</span>
        </Link>

        <p className="shrink-0 truncate text-xs text-[var(--color-text-muted)] sm:text-sm">
          Built by Team DevKraft
        </p>
      </div>
    </motion.footer>
  );
}
