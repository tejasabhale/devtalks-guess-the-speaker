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
      className="relative overflow-hidden border-t border-[var(--color-border)] bg-[#080808]"
    >
      {/* Navbar-style background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            radial-gradient(
              circle at 1px 1px,
              rgba(244, 240, 232, 0.8) 0.8px,
              transparent 0.9px
            )
          `,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Subtle top accent */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[55%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-primary)]/35 to-transparent"
        animate={{
          opacity: [0.25, 0.5, 0.25],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Very subtle moving signal */}
      <motion.div
        className="pointer-events-none absolute left-[-15%] top-1/2 h-px w-40 bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent"
        animate={{
          x: ["0%", "850%"],
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatDelay: 4,
          ease: "linear",
        }}
      />

      <div className="relative flex w-full flex-nowrap items-center justify-between gap-2 px-4 py-4 sm:gap-3 sm:px-6 sm:py-6 lg:px-8">
        {/* Logo mark */}
        <Link
          to="/"
          className="group flex shrink-0 items-center"
          aria-label="DevKraft home"
        >
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
