import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Lock,
  Sparkles,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const MYSTERY_SPEAKERS = [
  {
    id: "mystery-1",
    codename: "SPEAKER 01",
    track: "AI & systems engineering",
    revealStatus: "2 of 4 clues unlocked",
    teaser:
      "Has spent a decade making systems fail gracefully at a scale most of us will never touch.",
    clues: [
      {
        text: "Led an open-source infrastructure team for several years.",
        unlocked: true,
      },
      {
        text: "Maintains a distributed-systems library used well beyond their own company.",
        unlocked: true,
      },
      {
        text: "Has never given a talk shorter than the time slot allowed.",
        unlocked: false,
      },
      {
        text: "Their team's on-call rotation has a name you'd recognize.",
        unlocked: false,
      },
    ],
    keywords: [
      {
        text: "distributed",
        size: "text-lg sm:text-xl lg:text-2xl",
        weight: "font-bold",
        tone: "text-primary-light",
      },
      {
        text: "systems",
        size: "text-sm sm:text-base lg:text-lg",
        weight: "font-normal",
        tone: "text-text-muted",
      },
      {
        text: "scale",
        size: "text-base sm:text-lg",
        weight: "font-medium",
        tone: "text-text-primary",
      },
      {
        text: "reliability",
        size: "text-sm sm:text-base",
        weight: "font-normal",
        tone: "text-text-muted",
      },
      {
        text: "open source",
        size: "text-lg sm:text-xl",
        weight: "font-bold",
        tone: "text-text-primary",
      },
    ],
    image: "https://i.pravatar.cc/400?img=12",
    cardIcon: Sparkles,
  },
  {
    id: "mystery-2",
    codename: "SPEAKER 02",
    track: "Security & privacy",
    revealStatus: "1 of 4 clues unlocked",
    teaser:
      "Believes most breaches aren't clever — they're just the gap nobody thought to check.",
    clues: [
      {
        text: "Credited in disclosure programs at companies you use every day.",
        unlocked: true,
      },
      {
        text: "Used to do product security at a fintech unicorn.",
        unlocked: false,
      },
      {
        text: "Runs workshops for teams shipping their very first production API.",
        unlocked: false,
      },
      {
        text: "Writes with zero fear-mongering — root causes only.",
        unlocked: false,
      },
    ],
    keywords: [
      {
        text: "security",
        size: "text-xl sm:text-2xl",
        weight: "font-bold",
        tone: "text-primary-light",
      },
      {
        text: "research",
        size: "text-sm sm:text-base",
        weight: "font-normal",
        tone: "text-text-muted",
      },
      {
        text: "disclosure",
        size: "text-base sm:text-lg",
        weight: "font-medium",
        tone: "text-text-primary",
      },
      {
        text: "trust",
        size: "text-lg sm:text-xl",
        weight: "font-bold",
        tone: "text-text-primary",
      },
    ],
    image: "https://i.pravatar.cc/400?img=33",
    cardIcon: Lock,
  },
  {
    id: "mystery-3",
    codename: "SPEAKER 03",
    track: "Developer experience · Keynote",
    revealStatus: "3 of 4 clues unlocked",
    teaser:
      "Thinks every minute you spend fighting your tools is a minute stolen from the real problem.",
    clues: [
      {
        text: "Wrote a book that's now onboarding reading at several engineering orgs.",
        unlocked: true,
      },
      {
        text: "Grew a devtools function from one person to twelve.",
        unlocked: true,
      },
      {
        text: "Is giving this year's closing keynote.",
        unlocked: true,
      },
      {
        text: 'Their book title has the word "quiet" in it.',
        unlocked: false,
      },
    ],
    keywords: [
      {
        text: "developer experience",
        size: "text-lg sm:text-xl",
        weight: "font-bold",
        tone: "text-primary-light",
      },
      {
        text: "tooling",
        size: "text-sm sm:text-base",
        weight: "font-normal",
        tone: "text-text-muted",
      },
      {
        text: "velocity",
        size: "text-base sm:text-lg",
        weight: "font-medium",
        tone: "text-text-primary",
      },
      {
        text: "craft",
        size: "text-lg sm:text-xl",
        weight: "font-bold",
        tone: "text-text-primary",
      },
    ],
    image: "https://i.pravatar.cc/400?img=47",
    cardIcon: Sparkles,
  },
];

const springSoft = {
  type: "spring",
  stiffness: 170,
  damping: 22,
  mass: 1,
};

const springSnappy = {
  type: "spring",
  stiffness: 340,
  damping: 28,
  mass: 0.8,
};

function FontStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

      .font-display {
        font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
      }

      .font-body {
        font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
      }

      .font-label {
        font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;
      }
    `}</style>
  );
}

function SplitReveal({
  text,
  as: Tag = "span",
  className = "",
  stagger = 0.045,
  delay = 0,
  trigger = "mount",
}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;

    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const words = text.split(" ");

    el.innerHTML = words
      .map(
        (word) =>
          `<span class="inline-block overflow-hidden align-bottom pb-[0.08em]"><span class="split-word inline-block will-change-transform">${word}\u00A0</span></span>`,
      )
      .join("");

    const targets = el.querySelectorAll(".split-word");

    if (reduceMotion) {
      gsap.set(targets, {
        y: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
      });

      return;
    }

    let trig;

    const ctx = gsap.context(() => {
      const play = () =>
        gsap.fromTo(
          targets,
          {
            y: 16,
            scale: 0.82,
            opacity: 0,
            filter: "blur(4px)",
            transformOrigin: "50% 100%",
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.34,
            delay,
            stagger,
            ease: "power3.out",
          },
        );

      if (trigger === "scroll") {
        trig = ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: play,
        });
      } else {
        play();
      }
    }, el);

    return () => {
      trig?.kill();
      ctx.revert();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, trigger, stagger, delay]);

  return <Tag ref={ref} className={className} />;
}

export default function MysterySpeakerReveal({
  autoplayMs = 7000,
  eventDateLabel = "March 14",
  daysUntilEvent = 21,
}) {
  const [index, setIndex] = useState(0);
  const [revealKey, setRevealKey] = useState(0);

  const speaker = MYSTERY_SPEAKERS[index];

  const segmentRefs = useRef([]);
  const segmentTweenRef = useRef(null);

  function goTo(nextIndex) {
    const wrapped =
      (nextIndex + MYSTERY_SPEAKERS.length) % MYSTERY_SPEAKERS.length;

    setIndex(wrapped);
    setRevealKey((key) => key + 1);
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      goTo(index + 1);
    }, autoplayMs);

    return () => clearTimeout(timeout);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, autoplayMs]);

  useLayoutEffect(() => {
    const segments = segmentRefs.current;

    if (!segments.length) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    segments.forEach((segment, i) => {
      if (!segment) return;

      if (i < index) {
        gsap.set(segment, {
          scaleX: 1,
        });
      } else {
        gsap.set(segment, {
          scaleX: 0,
        });
      }
    });

    segmentTweenRef.current?.kill();

    const current = segments[index];

    if (!current) return;

    if (reduceMotion) {
      gsap.set(current, {
        scaleX: 1,
      });

      return;
    }

    segmentTweenRef.current = gsap.to(current, {
      scaleX: 1,
      duration: autoplayMs / 1000,
      ease: "none",
    });

    return () => segmentTweenRef.current?.kill();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, autoplayMs]);

  return (
    <section className="font-body relative min-h-[100dvh] w-full overflow-hidden bg-black text-text-primary">
      <FontStyles />
      <SectionBackdrop />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1600px] flex-col px-5 py-6 sm:px-8 sm:py-7 lg:px-12 xl:px-16">
        {/* =========================================================
            TOP BAR
        ========================================================== */}

        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-light opacity-50" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-light" />
            </span>

            <div>
              <p className="font-label text-[9px] uppercase tracking-[0.28em] text-primary-light">
                DevTalks / Mystery Room
              </p>

              <p className="font-display mt-0.5 text-sm font-semibold tracking-tight text-text-primary sm:text-base">
                Guess the Speaker
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[10px] text-text-secondary backdrop-blur-md sm:flex">
              <Calendar size={12} />

              <span>
                {eventDateLabel} · {daysUntilEvent}d left
              </span>
            </div>

            <motion.button
              type="button"
              aria-label="Previous mystery speaker"
              onClick={() => goTo(index - 1)}
              whileHover={{
                scale: 1.06,
                x: -2,
              }}
              whileTap={{
                scale: 0.92,
              }}
              transition={springSnappy}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-text-secondary backdrop-blur-md transition-colors duration-200 hover:border-border-orange hover:text-primary-light"
            >
              <ChevronLeft size={16} />
            </motion.button>

            <motion.button
              type="button"
              aria-label="Next mystery speaker"
              onClick={() => goTo(index + 1)}
              whileHover={{
                scale: 1.06,
                x: 2,
              }}
              whileTap={{
                scale: 0.92,
              }}
              transition={springSnappy}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border-orange bg-surface-orange text-primary-light transition-colors duration-200 hover:bg-primary hover:text-black"
            >
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </header>

        {/* =========================================================
            PROGRESS RAIL
        ========================================================== */}

        <div className="mt-5 flex items-center gap-3">
          <span className="font-label text-[8px] tracking-[0.2em] text-text-muted">
            0{index + 1}
          </span>

          <div
            className="flex flex-1 gap-1.5"
            role="tablist"
            aria-label="Mystery speakers"
          >
            {MYSTERY_SPEAKERS.map((speakerItem, i) => (
              <button
                key={speakerItem.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to ${speakerItem.codename}`}
                onClick={() => goTo(i)}
                className="relative h-px flex-1 overflow-hidden rounded-full bg-white/10"
              >
                <span
                  ref={(el) => {
                    segmentRefs.current[i] = el;
                  }}
                  className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-primary shadow-[0_0_10px_rgba(255,90,31,0.5)]"
                />
              </button>
            ))}
          </div>

          <span className="font-label text-[8px] tracking-[0.2em] text-text-muted">
            0{MYSTERY_SPEAKERS.length}
          </span>
        </div>

        {/* =========================================================
            MAIN REVEAL STAGE
        ========================================================== */}

        <main className="flex flex-1 items-center py-8 sm:py-10 lg:py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={speaker.id}
              initial={{
                opacity: 0,
                y: 14,
                filter: "blur(4px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: -10,
                filter: "blur(3px)",
              }}
              transition={{
                duration: 0.32,
                ease: "easeOut",
              }}
              className="grid w-full items-center gap-10 lg:grid-cols-[0.9fr_1.25fr_0.9fr] lg:gap-8 xl:gap-14"
            >
              {/* =====================================================
                  LEFT PANEL
              ====================================================== */}

              <div className="order-2 flex flex-col lg:order-1">
                <div className="flex items-center gap-2">
                  <span className="h-px w-8 bg-primary" />

                  <span className="font-label text-[9px] uppercase tracking-[0.25em] text-primary-light">
                    Current subject
                  </span>
                </div>

                <div className="mt-5">
                  <span className="inline-flex rounded-full border border-primary/20 bg-primary/[0.05] px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-primary-light backdrop-blur-sm">
                    {speaker.track}
                  </span>

                  <div className="mt-4 overflow-hidden">
                    <h1 className="font-display text-4xl font-semibold uppercase leading-[0.88] tracking-[-0.05em] text-text-primary sm:text-5xl xl:text-6xl">
                      {speaker.codename.split(" ").map((word, i) => (
                        <span
                          key={`${word}-${i}`}
                          className="block overflow-hidden pb-[0.07em]"
                        >
                          <motion.span
                            className="block"
                            initial={{
                              y: "100%",
                              scale: 0.88,
                            }}
                            animate={{
                              y: "0%",
                              scale: 1,
                            }}
                            transition={{
                              ...springSoft,
                              delay: 0.08 + i * 0.07,
                            }}
                          >
                            {word}
                          </motion.span>
                        </span>
                      ))}
                    </h1>
                  </div>

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 8,
                      scale: 0.9,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    transition={{
                      ...springSnappy,
                      delay: 0.24,
                    }}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-black"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-black/70" />
                    {speaker.revealStatus}
                  </motion.div>
                </div>

                {/* Main clue list */}
                <div className="mt-7 border-l border-white/10 pl-4">
                  <p className="font-label text-[8px] uppercase tracking-[0.22em] text-text-muted">
                    Intelligence feed
                  </p>

                  <div className="mt-3 space-y-2.5">
                    {speaker.clues.map((clue, i) => (
                      <div
                        key={clue.text}
                        className={`flex items-start gap-2 ${
                          clue.unlocked
                            ? "text-text-secondary"
                            : "text-text-muted/40"
                        }`}
                      >
                        <span className="font-label shrink-0 pt-0.5 text-[8px] text-primary-light/60">
                          0{i + 1}
                        </span>

                        <span className="text-xs leading-relaxed">
                          {clue.unlocked ? (
                            <SplitReveal
                              text={clue.text}
                              delay={0.24 + i * 0.04}
                              stagger={0.012}
                            />
                          ) : (
                            "•••••• •••• ••••• ••• ••••••••."
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* =====================================================
                  CENTER PORTRAIT
              ====================================================== */}

              <div className="order-1 flex flex-col items-center lg:order-2">
                <div className="relative">
                  <div className="absolute inset-[-22px] rounded-full border border-primary/[0.08]" />

                  <div className="absolute inset-[-44px] rounded-full border border-white/[0.035]" />

                  <motion.div
                    aria-hidden
                    className="absolute left-1/2 top-1/2 h-px w-[150%] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/25 to-transparent"
                    animate={{
                      opacity: [0.25, 0.7, 0.25],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  <motion.div
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 5.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <PuzzlePortrait
                      key={revealKey}
                      src={speaker.image}
                      name={speaker.codename}
                      size={320}
                    />
                  </motion.div>
                </div>

                <div className="mt-7 flex items-center gap-3">
                  <span className="h-px w-8 bg-border" />

                  <span className="font-label text-[8px] uppercase tracking-[0.28em] text-text-muted">
                    Identity classified
                  </span>

                  <span className="h-px w-8 bg-border" />
                </div>

                <div className="mt-3 flex items-center gap-2 text-text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />

                  <span className="font-label text-[8px] uppercase tracking-[0.2em]">
                    Decode the clues
                  </span>
                </div>
              </div>

              {/* =====================================================
                  RIGHT PANEL
              ====================================================== */}

              <div className="order-3 flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-label text-[8px] uppercase tracking-[0.25em] text-primary-light">
                    Signal intercepted
                  </span>

                  <span className="h-px flex-1 bg-white/10" />
                </div>

                <div className="mt-5">
                  <p className="max-w-lg font-display text-xl font-semibold leading-tight tracking-tight text-text-primary sm:text-2xl xl:text-[1.75rem]">
                    <SplitReveal
                      text={speaker.teaser}
                      delay={0.12}
                      stagger={0.025}
                    />
                  </p>

                  <p className="mt-5 flex items-center gap-2 text-xs text-text-muted">
                    <HelpCircle size={13} />

                    <SplitReveal
                      text="Think you know who it is?"
                      delay={0.36}
                      stagger={0.015}
                    />
                  </p>

                  <motion.div
                    initial={{
                      scaleX: 0,
                    }}
                    animate={{
                      scaleX: 1,
                    }}
                    transition={{
                      ...springSoft,
                      delay: 0.48,
                    }}
                    style={{
                      transformOrigin: "left",
                    }}
                    className="mt-4 h-0.5 w-10 bg-primary shadow-[0_0_12px_rgba(255,90,31,0.45)]"
                  />
                </div>

                {/* Keywords */}
                <div className="mt-8">
                  <p className="font-label text-[8px] uppercase tracking-[0.22em] text-text-muted">
                    Signals
                  </p>

                  <div className="font-display mt-4 flex max-w-sm flex-wrap items-baseline gap-x-3 gap-y-2">
                    {speaker.keywords.map((keyword, i) => (
                      <motion.span
                        key={keyword.text}
                        initial={{
                          opacity: 0,
                          y: 8,
                          scale: 0.86,
                          filter: "blur(3px)",
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)",
                        }}
                        transition={{
                          ...springSnappy,
                          delay: 0.5 + i * 0.04,
                        }}
                        className={`${keyword.size} ${keyword.weight} ${keyword.tone} leading-none`}
                      >
                        {keyword.text}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Metadata */}
                <div className="mt-8 grid max-w-sm grid-cols-2 gap-2">
                  <RevealMeta label="Status" value="CLASSIFIED" delay={0.58} />

                  <RevealMeta
                    label="Confidence"
                    value={`${speaker.revealStatus.split(" ")[0]}/4`}
                    delay={0.64}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </section>
  );
}

function RevealMeta({ label, value, delay = 0 }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        ...springSoft,
        delay,
      }}
      className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5"
    >
      <p className="font-label text-[7px] uppercase tracking-[0.2em] text-text-muted">
        {label}
      </p>

      <p className="font-label mt-1 text-[10px] font-medium tracking-wide text-primary-light">
        {value}
      </p>
    </motion.div>
  );
}

function PuzzlePortrait({ src, name, size = 320, cols = 6 }) {
  const fallbackTones = [
    "var(--color-primary)",
    "var(--color-primary-light)",
    "var(--color-primary-dark)",
    "var(--color-accent)",
  ];

  const containerRef = useRef(null);
  const markRef = useRef(null);

  const tiles = useMemo(() => {
    const rand = mulberry32(hashString(src || name));
    const list = [];

    for (let row = 0; row < cols; row++) {
      for (let col = 0; col < cols; col++) {
        list.push({
          key: `${row}-${col}`,
          left: (col / cols) * 100,
          top: (row / cols) * 100,
          bgPosX: cols === 1 ? 0 : (col / (cols - 1)) * 100,
          bgPosY: cols === 1 ? 0 : (row / (cols - 1)) * 100,
          startX: (rand() - 0.5) * size * 1.1,
          startY: (rand() - 0.5) * size * 1.1,
          startRotate: (rand() - 0.5) * 150,
          startScale: 0.45 + rand() * 0.25,
          delay: rand() * 0.18,
          fallback: fallbackTones[Math.floor(rand() * fallbackTones.length)],
        });
      }
    }

    return list;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, name, size, cols]);

  useLayoutEffect(() => {
    const el = containerRef.current;

    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const pieces = el.querySelectorAll(".puzzle-tile");

    if (reduceMotion) {
      gsap.set(pieces, {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
      });

      gsap.set(markRef.current, {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
      });

      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        pieces,
        {
          x: (i) => tiles[i].startX,
          y: (i) => tiles[i].startY,
          rotate: (i) => tiles[i].startRotate,
          scale: (i) => tiles[i].startScale,
          opacity: 0,
          filter: "blur(5px)",
        },
        {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.58,
          delay: (i) => tiles[i].delay,
          ease: "power3.out",
        },
      );

      tl.fromTo(
        markRef.current,
        {
          opacity: 0,
          scale: 0.6,
          rotate: -10,
          filter: "blur(4px)",
        },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          filter: "blur(0px)",
          duration: 0.28,
          ease: "back.out(1.8)",
        },
        "-=0.18",
      );
    }, el);

    return () => ctx.revert();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, tiles]);

  return (
    <div
      ref={containerRef}
      className="relative h-[190px] w-[190px] shrink-0 overflow-hidden rounded-full border border-primary/30 bg-black sm:h-[250px] sm:w-[250px] lg:h-[320px] lg:w-[320px] xl:h-[350px] xl:w-[350px]"
      style={{
        boxShadow:
          "0 0 90px color-mix(in srgb, var(--color-primary) 14%, transparent)",
      }}
    >
      {tiles.map((tile) => (
        <div
          key={tile.key}
          className="puzzle-tile absolute will-change-transform"
          style={{
            left: `${tile.left}%`,
            top: `${tile.top}%`,
            width: `${100 / cols}%`,
            height: `${100 / cols}%`,
            backgroundColor: `color-mix(in srgb, ${tile.fallback} 55%, #050505)`,
            backgroundImage: `url(${src})`,
            backgroundSize: `${cols * 100}% ${cols * 100}%`,
            backgroundPosition: `${tile.bgPosX}% ${tile.bgPosY}%`,
            filter: "grayscale(1) brightness(0.5) contrast(1.05)",
          }}
        />
      ))}

      <div className="pointer-events-none absolute inset-0 rounded-full bg-black/25" />

      <div
        ref={markRef}
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0"
        aria-hidden
      >
        <span
          className="font-display select-none text-[76px] font-bold leading-none text-primary-light sm:text-[104px] lg:text-[136px] xl:text-[148px]"
          style={{
            textShadow:
              "0 4px 24px color-mix(in srgb, var(--color-app-bg) 60%, transparent)",
          }}
        >
          ?
        </span>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-primary/30" />

      <motion.div
        aria-hidden
        className="absolute left-1/2 top-0 h-full w-px origin-top -translate-x-1/2 bg-gradient-to-b from-transparent via-primary/35 to-transparent"
        animate={{
          opacity: [0.15, 0.5, 0.15],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

function hashString(str) {
  let hash = 0;

  for (let i = 0; i < (str || "").length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }

  return hash || 1;
}

function mulberry32(seed) {
  let a = seed;

  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;

    let t = Math.imul(a ^ (a >>> 15), 1 | a);

    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function SectionBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-black">
      {/* Left atmospheric orb */}
      <motion.div
        aria-hidden="true"
        className="absolute -left-40 top-[-12%] h-[420px] w-[420px] rounded-full bg-primary/[0.06] blur-[115px] sm:h-[520px] sm:w-[520px]"
        animate={{
          x: [0, 40, 10, 0],
          y: [0, 20, 50, 0],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Right atmospheric orb */}
      <motion.div
        aria-hidden="true"
        className="absolute -right-44 top-[4%] h-[520px] w-[520px] rounded-full bg-primary-light/[0.04] blur-[125px] sm:h-[620px] sm:w-[620px]"
        animate={{
          x: [0, -35, -10, 0],
          y: [0, 45, 14, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Center glow */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.035] blur-[130px] sm:h-[700px] sm:w-[700px]"
      />

      {/* Ambient circles */}
      <motion.span
        aria-hidden="true"
        className="absolute left-[10%] top-[24%] h-14 w-14 rounded-full border border-primary/10 bg-primary/[0.02]"
        animate={{
          x: [0, 16, -8, 0],
          y: [0, -18, 10, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.span
        aria-hidden="true"
        className="absolute right-[12%] top-[22%] h-24 w-24 rounded-full border border-primary-light/[0.08] bg-primary-light/[0.018]"
        animate={{
          x: [0, -18, 8, 0],
          y: [0, 15, -12, 0],
          scale: [1, 0.94, 1.05, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.span
        aria-hidden="true"
        className="absolute bottom-[18%] left-[7%] h-8 w-8 rounded-full bg-primary/[0.08]"
        animate={{
          x: [0, 22, -10, 0],
          y: [0, -15, 8, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.span
        aria-hidden="true"
        className="absolute bottom-[22%] right-[8%] h-12 w-12 rounded-full border border-primary/10 bg-primary/[0.025]"
        animate={{
          x: [0, -18, 7, 0],
          y: [0, 12, -9, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Tiny nodes */}
      <span className="absolute left-[24%] top-[16%] h-1.5 w-1.5 rounded-full bg-primary-light/40 shadow-[0_0_10px_rgba(255,122,69,0.5)]" />

      <span className="absolute right-[29%] top-[14%] h-1 w-1 rounded-full bg-primary/40 shadow-[0_0_8px_rgba(255,90,31,0.45)]" />

      <span className="absolute bottom-[28%] left-[20%] h-1 w-1 rounded-full bg-primary-light/30" />

      <span className="absolute bottom-[19%] right-[27%] h-1.5 w-1.5 rounded-full bg-primary/35 shadow-[0_0_9px_rgba(255,90,31,0.4)]" />

      {/* Fine grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(255,255,255,0.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,0.08) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Central focus */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(255,90,31,0.05), transparent 35%)",
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/40 to-transparent"
      />
    </div>
  );
}
