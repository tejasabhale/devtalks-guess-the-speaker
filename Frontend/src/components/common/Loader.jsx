import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

const LOADING_PHRASES = [
  "Tuning in…",
  "Reading the room…",
  "Cueing the mic…",
  "Almost time to guess…",
];

/**
 * Full-screen loader for DevTalks — Guess the Speaker.
 * A pulsing mic with expanding sound-wave rings and a small
 * audio-equalizer strip, on the site's orange/black identity.
 */
export default function Loader() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;
    const id = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % LOADING_PHRASES.length);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="bg-noir fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 overflow-hidden"
    >
      {/* Mic + sound-wave rings */}
      <div className="relative flex h-56 w-56 items-center justify-center">
        <SoundRing delay={0} />
        <SoundRing delay={0.6} />
        <SoundRing delay={1.2} />

        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full border border-[var(--color-border-orange)] bg-[var(--color-surface-orange)] shadow-[var(--shadow-orange)]"
        >
          <MicIcon className="h-12 w-12 text-[var(--color-primary-light)]" />
        </motion.div>
      </div>

      {/* Equalizer strip */}
      <div className="flex h-12 items-end gap-2" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="w-2.5 rounded-full bg-[var(--color-primary)]"
            animate={{ height: ["30%", "100%", "45%", "80%", "30%"] }}
            transition={{
              duration: 1.1 + i * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.08,
            }}
          />
        ))}
      </div>

      {/* Wordmark */}
      <div className="flex flex-col items-center gap-3">
        <span className="text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
          Dev<span className="text-[var(--color-primary)]">Talks</span>
        </span>

        <div className="h-6">
          <AnimatePresence mode="wait">
            <motion.p
              key={LOADING_PHRASES[phraseIndex]}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="font-mono text-sm tracking-widest uppercase text-[var(--color-text-muted)]"
            >
              {LOADING_PHRASES[phraseIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SoundRing({ delay }) {
  return (
    <motion.span
      className="absolute h-28 w-28 rounded-full border border-[var(--color-border-orange)]"
      initial={{ opacity: 0.6, scale: 1 }}
      animate={{ opacity: 0, scale: 2.1 }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay }}
    />
  );
}

function MicIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="9" y="2" width="6" height="12" rx="3" strokeWidth="1.6" />
      <path d="M5 11a7 7 0 0 0 14 0" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 18v4" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 22h8" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
