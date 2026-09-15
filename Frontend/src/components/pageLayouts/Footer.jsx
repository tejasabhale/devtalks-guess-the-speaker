import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Wordmark font: same geometric display face used in the navbar, loaded
// once at runtime so this component stays drop-in. If the navbar is
// already mounted on the page, this is a no-op (checked by ID below).
const WORDMARK_FONT_ID = "devtalks-wordmark-font";
const WORDMARK_FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap";
const WORDMARK_FONT_CLASS = "font-['Space_Grotesk']";

function useWordmarkFont() {
  useEffect(() => {
    if (document.getElementById(WORDMARK_FONT_ID)) return;
    const link = document.createElement("link");
    link.id = WORDMARK_FONT_ID;
    link.rel = "stylesheet";
    link.href = WORDMARK_FONT_HREF;
    document.head.appendChild(link);
  }, []);
}

/**
 * Site footer for DevTalks — Guess the Speaker.
 * Minimal: just the wordmark and a credit line.
 */
export default function Footer() {
  useWordmarkFont();

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
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-lg ${WORDMARK_FONT_CLASS}`}
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
