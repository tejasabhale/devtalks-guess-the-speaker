import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/*
 * DevTalks brand font
 * Same Sora font used in the Navbar.
 */
const WORDMARK_FONT_ID = "devtalks-wordmark-font";

const WORDMARK_FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&display=swap";

const WORDMARK_FONT_CLASS = "font-['Sora']";

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
 * Minimal: wordmark + team credit.
 */
export default function Footer() {
  useWordmarkFont();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]"
    >
      <div className="relative flex w-full flex-nowrap items-center justify-between gap-2 px-4 py-4 sm:gap-3 sm:px-6 sm:py-6 lg:px-8">
        {/* Logo mark */}
        <Link to="/" className="group flex shrink-0 items-center">
          <img
            src="/logo/devkraft.png"
            alt="DevTalks"
            className="h-6 w-auto object-contain transition-opacity duration-200 group-hover:opacity-90 sm:h-7"
          />
        </Link>

        {/* DevTalks wordmark */}
        <Link
          to="/"
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[17px] font-extrabold tracking-[-0.04em] text-[var(--color-text-primary)] transition-opacity duration-200 hover:opacity-90 sm:text-xl ${WORDMARK_FONT_CLASS}`}
        >
          Dev
          <span className="text-[var(--color-primary)]">Talks</span>
        </Link>

        {/* Credit */}
        <p className="shrink-0 truncate text-xs text-[var(--color-text-muted)] sm:text-sm">
          Built by Team DevKraft
        </p>
      </div>
    </motion.footer>
  );
}
