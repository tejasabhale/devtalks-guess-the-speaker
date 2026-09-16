import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const RESPONSES = {
  correct: {
    title: "Case Solved",
    text: "You identified the speaker correctly.",
  },
  wrong: {
    title: "Wrong Lead",
    text: "The identity remains classified.",
  },
};

const SLOTS = [
  {
    id: 1,
    number: "01",
    title: "The Architect",
    category: "TECHNOLOGY",
    clues: [
      "First line of code was written as a teenager.",
      "Has designed systems used by thousands of developers.",
      "Known for turning complex engineering concepts into simple explanations.",
      "Frequently speaks about scalable architecture and developer experience.",
      "Believes great technology should feel invisible to the user.",
    ],
  },
  {
    id: 2,
    number: "02",
    title: "The Strategist",
    category: "STARTUP",
    clues: [
      "Started with a small idea and built it into a growing venture.",
      "Has worked with founders, early-stage teams, and young entrepreneurs.",
      "Focuses heavily on solving real-world customer problems.",
      "Often talks about leadership, execution, and building teams.",
      "Believes consistency beats short bursts of motivation.",
    ],
  },
  {
    id: 3,
    number: "03",
    title: "The Innovator",
    category: "AI & INNOVATION",
    clues: [
      "Works at the intersection of artificial intelligence and real-world problems.",
      "Has experimented with machine learning beyond simple demonstrations.",
      "Regularly explores emerging technologies before they become mainstream.",
      "Believes responsible experimentation is essential for innovation.",
      "Often discusses AI, automation, creativity, and the future of work.",
    ],
  },
];

const META_ITEMS = ["3 mystery speakers", "Multiple clues", "One final reveal"];

const RADAR_MARKS = [
  { top: "14%", left: "12%", rotate: -18 },
  { top: "22%", left: "84%", rotate: 14 },
  { top: "72%", left: "10%", rotate: 10 },
  { top: "79%", left: "88%", rotate: -12 },
  { top: "48%", left: "94%", rotate: 90 },
  { top: "86%", left: "42%", rotate: 180 },
];

const PARTICLES = [
  { top: "12%", left: "23%", delay: 0 },
  { top: "19%", left: "74%", delay: 0.8 },
  { top: "36%", left: "89%", delay: 1.6 },
  { top: "61%", left: "8%", delay: 2.4 },
  { top: "73%", left: "78%", delay: 3.1 },
  { top: "88%", left: "23%", delay: 4 },
  { top: "31%", left: "17%", delay: 1.2 },
  { top: "67%", left: "92%", delay: 2.8 },
];

function Silhouette() {
  return (
    <svg
      viewBox="0 0 220 300"
      className="h-full w-full"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="110" cy="67" r="43" fill="currentColor" opacity="0.9" />

      <path
        d="M54 164C54 131.967 79.967 106 112 106C144.033 106 170 131.967 170 164V278H54V164Z"
        fill="currentColor"
        opacity="0.92"
      />

      <path
        d="M48 163C48 128.758 75.758 101 110 101C144.242 101 172 128.758 172 163"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}

function SectionBackdrop() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Deep base */}
      <div className="absolute inset-0 bg-[#030303]" />

      {/* Very subtle micro texture */}
      <div
        className="absolute inset-0 opacity-[0.028]"
        style={{
          backgroundImage: `
            radial-gradient(
              circle at 1px 1px,
              rgba(244,240,232,0.85) 0.7px,
              transparent 0.9px
            )
          `,
          backgroundSize: "26px 26px",
        }}
      />

      {/* Main radar rings */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.035] sm:h-[38rem] sm:w-[38rem] lg:h-[52rem] lg:w-[52rem]"
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
                duration: 90,
                repeat: Infinity,
                ease: "linear",
              }
        }
      >
        <span className="absolute left-[13%] top-[9%] h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-1/2 h-[17rem] w-[17rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--color-primary)]/[0.055] sm:h-[25rem] sm:w-[25rem] lg:h-[34rem] lg:w-[34rem]"
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
                duration: 68,
                repeat: Infinity,
                ease: "linear",
              }
        }
      >
        <span className="absolute right-[8%] top-[31%] h-1 w-1 rounded-full bg-[var(--color-primary-light)]" />
      </motion.div>

      {/* Elliptical orbital cut */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[13rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/[0.025] sm:h-[18rem] sm:w-[54rem]"
        animate={
          reduceMotion
            ? {}
            : {
                rotate: [0, 4, 0, -4, 0],
              }
        }
        transition={
          reduceMotion
            ? {}
            : {
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      />

      {/* Radar sweep */}
      {!reduceMotion && (
        <motion.div
          className="absolute left-1/2 top-1/2 h-[31rem] w-[1px] origin-bottom bg-gradient-to-t from-[var(--color-primary)]/30 via-[var(--color-primary)]/8 to-transparent sm:h-[44rem]"
          style={{
            transformOrigin: "50% 100%",
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}

      {/* Moving scan beam */}
      {!reduceMotion && (
        <>
          <motion.div
            className="absolute left-[-25%] top-[28%] h-px w-[26rem] bg-gradient-to-r from-transparent via-[var(--color-primary)]/45 to-transparent"
            animate={{
              x: ["0%", "520%"],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "linear",
            }}
          />

          <motion.div
            className="absolute right-[-25%] top-[69%] h-px w-[22rem] bg-gradient-to-r from-transparent via-[var(--color-primary-light)]/30 to-transparent"
            animate={{
              x: ["0%", "-560%"],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 13,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "linear",
            }}
          />
        </>
      )}

      {/* Radar marks */}
      {RADAR_MARKS.map((mark, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            top: mark.top,
            left: mark.left,
            rotate: `${mark.rotate}deg`,
          }}
          animate={
            reduceMotion
              ? {}
              : {
                  opacity: [0.2, 0.55, 0.2],
                }
          }
          transition={
            reduceMotion
              ? {}
              : {
                  duration: 4,
                  delay: index * 0.35,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        >
          <div className="relative h-5 w-5">
            <span className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-[var(--color-primary)]/50" />
            <span className="absolute bottom-0 left-1/2 h-2 w-px -translate-x-1/2 bg-[var(--color-primary)]/50" />
            <span className="absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 bg-[var(--color-primary)]/50" />
            <span className="absolute right-0 top-1/2 h-px w-2 -translate-y-1/2 bg-[var(--color-primary)]/50" />
          </div>
        </motion.div>
      ))}

      {/* Small floating particles */}
      {PARTICLES.map((particle, index) => (
        <motion.span
          key={index}
          className="absolute h-1 w-1 rounded-full bg-[var(--color-primary)]"
          style={{
            top: particle.top,
            left: particle.left,
          }}
          animate={
            reduceMotion
              ? {}
              : {
                  opacity: [0.08, 0.55, 0.08],
                  scale: [0.7, 1.4, 0.7],
                }
          }
          transition={
            reduceMotion
              ? {}
              : {
                  duration: 3.8,
                  delay: particle.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        />
      ))}

      {/* Technical corner brackets */}
      <div className="absolute left-5 top-6 h-9 w-9 border-l border-t border-[var(--color-primary)]/[0.1] sm:left-8 sm:top-8" />
      <div className="absolute right-5 top-6 h-9 w-9 border-r border-t border-[var(--color-primary)]/[0.1] sm:right-8 sm:top-8" />
      <div className="absolute bottom-6 left-5 h-9 w-9 border-b border-l border-[var(--color-primary)]/[0.1] sm:bottom-8 sm:left-8" />
      <div className="absolute bottom-6 right-5 h-9 w-9 border-b border-r border-[var(--color-primary)]/[0.1] sm:bottom-8 sm:right-8" />

      {/* Tiny status labels */}
      <div className="absolute left-8 top-24 hidden font-mono text-[7px] uppercase tracking-[0.22em] text-text-muted/35 sm:block">
        SIGNAL / ACTIVE
      </div>

      <div className="absolute bottom-24 right-8 hidden font-mono text-[7px] uppercase tracking-[0.22em] text-text-muted/35 sm:block">
        CLASSIFIED / 03
      </div>

      {/* Section edges */}
      <div className="absolute inset-x-0 top-0 h-px bg-border-light" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-border-light" />
    </div>
  );
}

function SpeakerCard({ speaker, index }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [response, setResponse] = useState(null);

  const reduceMotion = useReducedMotion();

  const handlePointerEnter = (event) => {
    if (event.pointerType === "mouse") {
      setIsFlipped(true);
    }
  };

  const handlePointerLeave = (event) => {
    if (event.pointerType === "mouse") {
      setIsFlipped(false);
    }
  };

  const toggleMobileFlip = (event) => {
    if (event.target.closest("form")) {
      return;
    }

    if (event.target.closest("button")) {
      return;
    }

    if (event.pointerType !== "touch") {
      return;
    }

    setIsFlipped((previous) => !previous);
  };

  const handleKeyDown = (event) => {
    if (event.target.closest("form")) {
      return;
    }

    if (event.target.closest("button")) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsFlipped((previous) => !previous);
    }
  };

  const handleClose = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsFlipped(false);
  };

  const handleGuess = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const answer = selectedAnswer.trim();

    if (!answer) {
      return;
    }

    setResponse(
      answer.toLowerCase() === speaker.title.toLowerCase()
        ? "correct"
        : "wrong",
    );
  };

  const handleResponseClose = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setResponse(null);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: reduceMotion ? 0 : 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative"
    >
      <div
        className="flip-scene relative h-[560px] w-full"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerUp={toggleMobileFlip}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isFlipped}
        aria-label={
          isFlipped
            ? `Hide clues for ${speaker.title}`
            : `Show clues for ${speaker.title}`
        }
      >
        <div
          className={`flip-inner relative h-full w-full ${
            isFlipped ? "is-flipped" : ""
          }`}
        >
          {/* FRONT */}
          <div className="flip-face flip-face-front absolute inset-0 overflow-hidden rounded-2xl border border-border-light bg-[#080808] shadow-card">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

            {/* Card scan detail */}
            <div className="pointer-events-none absolute inset-x-0 top-16 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/10 to-transparent" />

            <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-full border border-border-light bg-black/55 px-3 py-1.5">
              <span className="font-mono text-[10px] tracking-[0.18em] text-text-muted">
                FILE {speaker.number}
              </span>

              <span className="h-1 w-1 rounded-full bg-primary" />

              <span className="font-mono text-[10px] tracking-[0.18em] text-primary">
                CLASSIFIED
              </span>
            </div>

            <div className="absolute inset-x-0 top-20 flex justify-center">
              <div className="relative h-72 w-52 text-text-primary opacity-30">
                <Silhouette />

                <div className="absolute left-1/2 top-16 -translate-x-1/2 text-6xl font-black text-primary/70">
                  ?
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                {speaker.category}
              </div>

              <h3 className="text-2xl font-bold text-text-primary">
                {speaker.title}
              </h3>

              <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-secondary">
                Identity hidden. Tap to investigate the available clues.
              </p>

              <div className="mt-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Tap to reveal clues
              </div>
            </div>
          </div>

          {/* BACK */}
          <div className="flip-face flip-face-back absolute inset-0 overflow-hidden rounded-2xl border border-border-orange bg-[#080808] shadow-card">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.035] via-transparent to-black/20" />

            <div className="relative z-10 flex h-full flex-col p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                    Evidence unlocked
                  </div>

                  <h3 className="mt-2 text-2xl font-bold text-text-primary">
                    Case {speaker.number}
                  </h3>
                </div>

                <button
                  type="button"
                  onPointerDown={(event) => event.stopPropagation()}
                  onPointerUp={(event) => event.stopPropagation()}
                  onClick={handleClose}
                  className="shrink-0 rounded-full border border-border-light bg-black/30 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-text-muted transition hover:border-border-orange hover:text-text-primary"
                >
                  Close
                </button>
              </div>

              <div className="mt-7 flex-1 space-y-3 overflow-y-auto pr-1">
                {speaker.clues.map((clue, clueIndex) => (
                  <div
                    key={clue}
                    className="flex gap-3 rounded-xl border border-border-light bg-black/20 p-4"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border-orange/40 bg-primary/10">
                      <span className="font-mono text-[10px] text-primary">
                        {String(clueIndex + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <p className="text-sm leading-relaxed text-text-secondary">
                      {clue}
                    </p>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleGuess}
                onClick={(event) => event.stopPropagation()}
                onPointerDown={(event) => event.stopPropagation()}
                onPointerUp={(event) => event.stopPropagation()}
                className="pt-5"
              >
                <label
                  htmlFor={`guess-${speaker.id}`}
                  className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted"
                >
                  Submit your guess
                </label>

                <div className="flex gap-2">
                  <input
                    id={`guess-${speaker.id}`}
                    type="text"
                    value={selectedAnswer}
                    onChange={(event) => setSelectedAnswer(event.target.value)}
                    placeholder="Speaker name..."
                    className="min-w-0 flex-1 rounded-xl border border-border-light bg-black/25 px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-border-orange"
                  />

                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:brightness-110"
                  >
                    Guess
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {response && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-black/75 p-6"
          onClick={handleResponseClose}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border-light bg-[#0a0a0a] p-6 text-center shadow-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl text-primary">
              {response === "correct" ? "✓" : "×"}
            </div>

            <h4 className="mt-4 text-xl font-bold text-text-primary">
              {RESPONSES[response].title}
            </h4>

            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              {RESPONSES[response].text}
            </p>

            <button
              type="button"
              onClick={handleResponseClose}
              className="mt-5 rounded-xl border border-border-light px-5 py-2.5 text-sm font-medium text-text-primary transition hover:border-border-orange"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </motion.article>
  );
}

export default function GuessSpeakers() {
  return (
    <section
      id="speakers"
      className="relative isolate overflow-hidden bg-[#030303] px-5 py-20 sm:px-8 lg:px-12"
    >
      <SectionBackdrop />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-light bg-black/35 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Investigate the files
          </div>

          <h2 className="mt-5 text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            Three speakers.
            <span className="block text-gradient">One mystery.</span>
          </h2>

          <p className="mt-5 text-sm leading-relaxed text-text-secondary sm:text-base">
            Study the clues, inspect each classified file, and submit your guess
            before the final identities are revealed.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {META_ITEMS.map((item) => (
              <span
                key={item}
                className="rounded-full border border-border-light bg-black/35 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-text-muted"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {SLOTS.map((speaker, index) => (
            <SpeakerCard key={speaker.id} speaker={speaker} index={index} />
          ))}
        </div>
      </div>

      <style>{`
        .flip-scene {
          perspective: 1000px;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        .flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }

        .flip-inner.is-flipped {
          transform: rotateY(180deg);
        }

        .flip-face {
          position: absolute;
          inset: 0;
          overflow: hidden;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform-style: preserve-3d;
        }

        .flip-face-front {
          transform: rotateY(0deg);
        }

        .flip-face-back {
          transform: rotateY(180deg);
        }

        @media (min-width: 768px) {
          .flip-scene {
            perspective: 1200px;
          }
        }

        @media (max-width: 767px) {
          .flip-scene {
            perspective: 900px;
          }

          .flip-inner {
            transition-duration: 0.55s;
          }

          .flip-face {
            transform-style: flat;
          }

          .flip-face-front {
            transform: rotateY(0deg) translateZ(0);
          }

          .flip-face-back {
            transform: rotateY(180deg) translateZ(0);
          }
        }
      `}</style>
    </section>
  );
}
