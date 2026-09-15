import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useWordmarkFont,
  WORDMARK_FONT_CLASS,
} from "../../hooks/useWordmarkFont";

const EASE = [0.16, 1, 0.3, 1];

const LOADING_PHRASES = [
  "Dimming the house lights…",
  "Cueing the spotlight…",
  "Reading the room…",
  "Almost time to guess…",
];

// Fixed choreography (ms) — decorative only, not tied to real load state.
const GLITCH_AT = 900;
const REVEAL_AT = 1500;
const DEFAULT_DURATION = 2800;

/**
 * Full-screen "reveal" loader for DevTalks — Guess the Speaker.
 * A spotlight sweeps a dark stage, a glitching "?" stands in for the
 * mystery guest, then glitches apart into the DevTalks wordmark —
 * as cinematic as the Hero, at loader scale.
 *
 * Purely decorative and fixed-length: call `onComplete` (fired once,
 * after `duration`ms) to dismiss it from the parent rather than reading
 * any real asset-loading state.
 */
export default function Loader({ onComplete, duration = DEFAULT_DURATION }) {
  const [stage, setStage] = useState("scan"); // scan -> glitch -> reveal
  const [phraseIndex, setPhraseIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useWordmarkFont();

  useEffect(() => {
    if (prefersReducedMotion) {
      setStage("reveal");
      onComplete?.();
      return undefined;
    }

    const glitchTimer = setTimeout(() => setStage("glitch"), GLITCH_AT);
    const revealTimer = setTimeout(() => setStage("reveal"), REVEAL_AT);
    const completeTimer = setTimeout(() => onComplete?.(), duration);

    return () => {
      clearTimeout(glitchTimer);
      clearTimeout(revealTimer);
      clearTimeout(completeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;
    const id = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % LOADING_PHRASES.length);
    }, 1800);
    return () => clearInterval(id);
  }, [prefersReducedMotion]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[var(--color-bg)]"
    >
      <StageBackdrop reducedMotion={prefersReducedMotion} />

      {/* Centerpiece: glitching "?" that resolves into the wordmark */}
      <div className="relative z-10 flex h-40 items-center justify-center sm:h-48">
        <AnimatePresence mode="wait">
          {stage !== "reveal" ? (
            <GlitchMark
              key="mark"
              stage={stage}
              reducedMotion={prefersReducedMotion}
            />
          ) : (
            <motion.div
              key="wordmark"
              initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="relative flex flex-col items-center"
            >
              <span
                className={`select-none text-5xl font-semibold tracking-tight text-[var(--color-text-primary)] sm:text-6xl ${WORDMARK_FONT_CLASS}`}
              >
                Dev<span className="text-[var(--color-primary)]">Talks</span>
              </span>
              <div className="pointer-events-none absolute inset-0 -z-10 bg-[var(--color-primary)]/25 opacity-70 blur-3xl" />
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
                className="mt-3 font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)] sm:text-sm"
              >
                Guess the speaker
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Equalizer strip — ambient audio flavor beneath the reveal */}
      <div
        className="relative z-10 mt-8 flex h-10 items-end gap-2"
        aria-hidden="true"
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="w-2 rounded-full bg-[var(--color-primary)]"
            animate={
              prefersReducedMotion
                ? undefined
                : { height: ["30%", "100%", "45%", "80%", "30%"] }
            }
            transition={{
              duration: 1.1 + i * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.08,
            }}
            style={{ height: prefersReducedMotion ? "50%" : undefined }}
          />
        ))}
      </div>

      {/* Rotating status phrase */}
      <div className="relative z-10 mt-6 h-6">
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
  );
}

/**
 * The "mystery guest" placeholder: a large "?" built from three
 * stacked, color-offset layers that jitter apart during the glitch
 * stage, standing in for the unrevealed speaker.
 */
function GlitchMark({ stage, reducedMotion }) {
  const glitching = stage === "glitch" && !reducedMotion;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(6px)" }}
      transition={{ duration: 0.35, ease: EASE }}
      className="relative select-none text-8xl font-bold sm:text-9xl"
    >
      <span
        className={`relative z-10 text-[var(--color-text-primary)] ${WORDMARK_FONT_CLASS}`}
      >
        ?
      </span>

      {!reducedMotion && (
        <>
          <motion.span
            aria-hidden="true"
            className={`absolute inset-0 z-0 text-[var(--color-primary)] mix-blend-screen ${WORDMARK_FONT_CLASS}`}
            animate={
              glitching
                ? { x: [0, -6, 4, -3, 0], opacity: [0, 0.8, 0.5, 0.7, 0] }
                : { x: 0, opacity: 0 }
            }
            transition={{ duration: 0.45, ease: "easeInOut" }}
          >
            ?
          </motion.span>
          <motion.span
            aria-hidden="true"
            className={`absolute inset-0 z-0 text-[var(--color-primary-light)] mix-blend-screen ${WORDMARK_FONT_CLASS}`}
            animate={
              glitching
                ? { x: [0, 6, -4, 3, 0], opacity: [0, 0.7, 0.4, 0.6, 0] }
                : { x: 0, opacity: 0 }
            }
            transition={{ duration: 0.45, ease: "easeInOut", delay: 0.03 }}
          >
            ?
          </motion.span>
        </>
      )}

      {/* Ring pulse behind the mark, echoes the mic-ring language elsewhere on the site */}
      <span className="absolute left-1/2 top-1/2 -z-10 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-border-orange)] opacity-40" />
    </motion.div>
  );
}

/** Spotlight sweep + stage-floor grid + drifting embers, matching the Hero's language. */
function StageBackdrop({ reducedMotion }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Stage-floor grid, masked to a soft vignette */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border-light) 1px, transparent 1px), linear-gradient(90deg, var(--color-border-light) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 55%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 55%, black 0%, transparent 75%)",
        }}
      />

      {/* Sweeping spotlight beam */}
      {!reducedMotion && (
        <motion.div
          animate={{ x: ["-30%", "30%", "-30%"], rotate: [0, 6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-[-20%] h-[140%] w-[60%] -translate-x-1/2 opacity-70 blur-[50px]"
          style={{
            background:
              "conic-gradient(from 180deg at 50% 0%, transparent 40%, color-mix(in srgb, var(--color-primary) 22%, transparent) 50%, transparent 60%)",
          }}
        />
      )}

      {/* Breathing ambient glow */}
      <motion.div
        animate={
          reducedMotion
            ? undefined
            : { opacity: [0.15, 0.28, 0.15], scale: [1, 1.08, 1] }
        }
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[150px]"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-primary) 22%, transparent)",
        }}
      />

      {!reducedMotion && <DriftingEmbers />}

      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)] via-transparent to-[var(--color-bg)]" />
    </div>
  );
}

const EMBER_SEEDS = [
  { left: "18%", size: 3, duration: 6, delay: 0 },
  { left: "32%", size: 2, duration: 7.5, delay: 0.6 },
  { left: "48%", size: 4, duration: 5.5, delay: 1.1 },
  { left: "63%", size: 2, duration: 8, delay: 0.3 },
  { left: "77%", size: 3, duration: 6.8, delay: 1.4 },
  { left: "85%", size: 2, duration: 7, delay: 0.9 },
];

function DriftingEmbers() {
  return (
    <div className="absolute inset-0">
      {EMBER_SEEDS.map((ember, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-[var(--color-primary)]"
          style={{
            left: ember.left,
            width: ember.size,
            height: ember.size,
            bottom: "-5%",
            boxShadow: "0 0 8px var(--color-primary)",
          }}
          animate={{ y: ["0%", "-115vh"], opacity: [0, 0.7, 0] }}
          transition={{
            duration: ember.duration,
            repeat: Infinity,
            ease: "linear",
            delay: ember.delay,
          }}
        />
      ))}
    </div>
  );
}
