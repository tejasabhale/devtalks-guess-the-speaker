import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Mic2,
  PenLine,
  ShieldCheck,
  Users,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * DevTalks — Speaker Reveal
 *
 * React + Tailwind + Framer Motion + GSAP + lucide-react
 *
 * Visual direction:
 * - True black background
 * - Large floating ambient particles/orbs
 * - Subtle orange atmospheric lighting
 * - Puzzle portrait reveal
 * - GSAP word-pop split text
 * - Segmented autoplay rail
 * - Tilt highlight cards
 *
 * Lenis is handled globally in App.jsx.
 */

const SPEAKERS = [
  {
    id: "speaker-1",
    category: "AI & systems engineering",
    subBadge: null,
    name: "ANIKA RAO",
    roleLines: [
      "Principal engineer, distributed systems",
      "Former lead, open-source infra team",
    ],
    quote:
      "A decade spent making systems that fail gracefully, at a scale most of us will never touch.",
    taglineLabel: "Scale. Reliability. Open source.",
    keywords: [
      {
        text: "DISTRIBUTED",
        size: "text-lg sm:text-xl",
        weight: "font-bold",
        tone: "text-primary-light",
      },
      {
        text: "systems",
        size: "text-sm sm:text-base",
        weight: "font-normal",
        tone: "text-text-muted",
      },
      {
        text: "Anika Rao",
        size: "text-xl sm:text-2xl",
        weight: "font-bold",
        tone: "text-text-primary",
      },
      {
        text: "maintainer",
        size: "text-xs sm:text-sm",
        weight: "font-medium",
        tone: "text-accent",
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
        text: "OPEN SOURCE",
        size: "text-lg sm:text-xl",
        weight: "font-bold",
        tone: "text-text-primary",
      },
    ],
    image: "https://i.pravatar.cc/400?img=12",
    cards: [
      {
        label: "Systems builder",
        text: "Six years hardening infrastructure that now runs under several major open-source projects.",
        icon: Cpu,
      },
      {
        label: "Community maintainer",
        text: "Maintains a widely used distributed-consensus library with contributors across 20+ countries.",
        icon: Users,
      },
      {
        label: "Conference regular",
        text: "Speaks on failure modes most infra talks don't cover.",
        icon: Mic2,
      },
    ],
  },
  {
    id: "speaker-2",
    category: "Security & privacy",
    subBadge: null,
    name: "DEV KULKARNI",
    roleLines: [
      "Independent security researcher",
      "Formerly, product security at a fintech unicorn",
    ],
    quote:
      "Most breaches aren't clever. They're just the gap nobody thought to check.",
    taglineLabel: "Security. Trust. Disclosure.",
    keywords: [
      {
        text: "SECURITY",
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
        text: "Dev Kulkarni",
        size: "text-lg sm:text-xl",
        weight: "font-bold",
        tone: "text-text-primary",
      },
      {
        text: "responsible disclosure",
        size: "text-xs sm:text-sm",
        weight: "font-medium",
        tone: "text-accent",
      },
      {
        text: "trust",
        size: "text-base sm:text-lg",
        weight: "font-medium",
        tone: "text-text-primary",
      },
      {
        text: "PRIVACY",
        size: "text-lg sm:text-xl",
        weight: "font-bold",
        tone: "text-text-primary",
      },
    ],
    image: "https://i.pravatar.cc/400?img=33",
    cards: [
      {
        label: "Bug bounty veteran",
        text: "Credited in disclosure programs at several companies most developers use daily.",
        icon: ShieldCheck,
      },
      {
        label: "Workshop lead",
        text: "Runs hands-on threat-modeling sessions for teams shipping their first production API.",
        icon: Users,
      },
      {
        label: "Writer",
        text: "Practical breakdowns of real incidents — no fear-mongering, just root causes.",
        icon: PenLine,
      },
    ],
  },
  {
    id: "speaker-3",
    category: "Developer experience",
    subBadge: "Keynote",
    name: "PRIYA MENON",
    roleLines: [
      "Head of developer experience, a devtools startup",
      'Author, "The Quiet Cost of Bad Tooling"',
    ],
    quote:
      "Every minute a developer spends fighting their tools is a minute stolen from the actual problem.",
    taglineLabel: "Tooling. Velocity. Craft.",
    keywords: [
      {
        text: "DEVELOPER",
        size: "text-lg sm:text-xl",
        weight: "font-bold",
        tone: "text-primary-light",
      },
      {
        text: "experience",
        size: "text-sm sm:text-base",
        weight: "font-normal",
        tone: "text-text-muted",
      },
      {
        text: "Priya Menon",
        size: "text-xl sm:text-2xl",
        weight: "font-bold",
        tone: "text-text-primary",
      },
      {
        text: "keynote",
        size: "text-xs sm:text-sm",
        weight: "font-medium",
        tone: "text-accent",
      },
      {
        text: "velocity",
        size: "text-base sm:text-lg",
        weight: "font-medium",
        tone: "text-text-primary",
      },
      {
        text: "CRAFT",
        size: "text-lg sm:text-xl",
        weight: "font-bold",
        tone: "text-text-primary",
      },
    ],
    image: "https://i.pravatar.cc/400?img=47",
    cards: [
      {
        label: "Team leader",
        text: "Built and scaled a developer-experience function from one person to a twelve-person team.",
        icon: Users,
      },
      {
        label: "Author",
        text: "Her book on tooling debt is onboarding reading at several engineering orgs.",
        icon: BookOpen,
      },
      {
        label: "Closing keynote",
        text: 'Closes this year\'s DevTalks on what "developer productivity" actually means.',
        icon: Mic2,
      },
    ],
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
      });

      return;
    }

    let trig;

    const ctx = gsap.context(() => {
      const play = () =>
        gsap.fromTo(
          targets,
          {
            y: 22,
            scale: 0.7,
            opacity: 0,
            transformOrigin: "50% 100%",
          },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.6,
            delay,
            stagger,
            ease: "back.out(2.4)",
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

export default function SpeakerReveal({ autoplayMs = 7000 }) {
  const [index, setIndex] = useState(0);
  const [revealKey, setRevealKey] = useState(0);

  const speaker = SPEAKERS[index];

  const cardsRef = useRef(null);

  const cardsInView = useInView(cardsRef, {
    once: false,
    amount: 0.3,
  });

  const segmentRefs = useRef([]);
  const segmentTweenRef = useRef(null);

  function goTo(nextIndex) {
    const wrapped = (nextIndex + SPEAKERS.length) % SPEAKERS.length;

    setIndex(wrapped);
    setRevealKey((k) => k + 1);
  }

  useEffect(() => {
    const timeout = setTimeout(() => goTo(index + 1), autoplayMs);

    return () => clearTimeout(timeout);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, autoplayMs]);

  useLayoutEffect(() => {
    const segments = segmentRefs.current;

    if (!segments.length) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    segments.forEach((seg, i) => {
      if (!seg) return;

      if (i < index) {
        gsap.set(seg, { scaleX: 1 });
      } else if (i > index) {
        gsap.set(seg, { scaleX: 0 });
      }
    });

    segmentTweenRef.current?.kill();

    const current = segments[index];

    if (!current) return;

    gsap.set(current, { scaleX: 0 });

    if (reduceMotion) {
      gsap.set(current, { scaleX: 1 });
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
    <section className="font-body relative flex min-h-[100dvh] w-full flex-col overflow-y-auto bg-black px-5 py-8 sm:px-10 sm:py-6 lg:h-[100dvh] lg:overflow-hidden lg:px-16 lg:py-6 xl:px-24 2xl:px-32">
      <FontStyles />

      <SectionBackdrop />

      <div className="relative z-10 mx-auto flex h-full w-full flex-col justify-between">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-light opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-light" />
            </span>

            <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
              <SplitReveal text="Speaker Reveal" trigger="scroll" />
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <motion.button
              type="button"
              aria-label="Previous speaker"
              onClick={() => goTo(index - 1)}
              whileHover={{ scale: 1.08, rotate: -4 }}
              whileTap={{ scale: 0.9 }}
              transition={springSnappy}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-black/40 text-text-secondary backdrop-blur-sm transition-colors duration-200 hover:border-border-orange hover:text-primary-light"
            >
              <ChevronLeft size={17} strokeWidth={2.5} />
            </motion.button>

            <motion.button
              type="button"
              aria-label="Next speaker"
              onClick={() => goTo(index + 1)}
              whileHover={{ scale: 1.08, rotate: 4 }}
              whileTap={{ scale: 0.9 }}
              transition={springSnappy}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border-orange bg-surface-orange text-primary-light backdrop-blur-sm transition-colors duration-200 hover:bg-primary hover:text-text-dark"
            >
              <ChevronRight size={17} strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>

        {/* Timeline */}
        <div
          className="mb-4 flex w-full gap-1.5 sm:mb-6"
          role="tablist"
          aria-label="Speakers"
        >
          {SPEAKERS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to ${s.name}`}
              onClick={() => goTo(i)}
              className="relative h-px flex-1 overflow-hidden rounded-full bg-white/10"
            >
              <span
                ref={(el) => (segmentRefs.current[i] = el)}
                className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-primary shadow-[0_0_10px_rgba(255,90,31,0.5)]"
              />
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={speaker.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={springSoft}
              className="grid grid-cols-1 items-center gap-5 sm:gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-10 xl:gap-14"
            >
              {/* Identity */}
              <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-end lg:text-right">
                <motion.span
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    ...springSnappy,
                    delay: 0.05,
                  }}
                  className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[11px] font-medium text-primary-light backdrop-blur-sm"
                >
                  {speaker.category}
                </motion.span>

                <h3 className="font-display mt-2.5 text-2xl font-semibold uppercase leading-[0.95] tracking-tight text-text-primary sm:text-4xl xl:text-5xl">
                  {speaker.name.split(" ").map((word, i) => (
                    <span
                      key={word}
                      className="block overflow-hidden pb-[0.06em]"
                    >
                      <motion.span
                        className="block"
                        initial={{
                          y: "100%",
                          scale: 0.85,
                        }}
                        animate={{
                          y: "0%",
                          scale: 1,
                        }}
                        transition={{
                          ...springSoft,
                          delay: 0.1 + i * 0.09,
                        }}
                      >
                        {word}
                      </motion.span>
                    </span>
                  ))}
                </h3>

                {speaker.subBadge && (
                  <motion.span
                    initial={{
                      opacity: 0,
                      scale: 0.7,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      ...springSnappy,
                      delay: 0.32,
                    }}
                    className="mt-2 inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-text-dark"
                  >
                    {speaker.subBadge}
                  </motion.span>
                )}

                <div className="mt-2.5 space-y-0.5">
                  {speaker.roleLines.map((line, i) => (
                    <p key={line} className="text-xs text-text-muted">
                      <SplitReveal
                        text={line}
                        delay={0.28 + i * 0.06}
                        stagger={0.02}
                      />
                    </p>
                  ))}
                </div>
              </div>

              {/* Portrait */}
              <div className="order-1 flex justify-center lg:order-2">
                <motion.div
                  animate={{
                    y: [0, -7, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <PuzzlePortrait
                    key={revealKey}
                    src={speaker.image}
                    name={speaker.name}
                    size={190}
                  />
                </motion.div>
              </div>

              {/* Quote / keywords */}
              <div className="order-3 flex flex-col items-center text-center lg:items-start lg:text-left">
                <p className="max-w-sm text-base font-semibold leading-snug text-text-primary sm:text-lg xl:max-w-md xl:text-xl">
                  <SplitReveal
                    text={speaker.quote}
                    delay={0.18}
                    stagger={0.03}
                  />
                </p>

                <p className="mt-3 text-xs text-text-muted">
                  <SplitReveal
                    text={speaker.taglineLabel}
                    delay={0.42}
                    stagger={0.018}
                  />
                </p>

                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    ...springSoft,
                    delay: 0.58,
                  }}
                  style={{
                    transformOrigin: "left",
                  }}
                  className="mt-1.5 h-0.5 w-8 bg-primary shadow-[0_0_10px_rgba(255,90,31,0.45)]"
                />

                <div className="font-display mt-2.5 flex max-w-xs flex-wrap items-baseline justify-center gap-x-2.5 gap-y-0.5 lg:justify-start">
                  {speaker.keywords.map((kw, i) => (
                    <motion.span
                      key={kw.text}
                      initial={{
                        opacity: 0,
                        y: 10,
                        scale: 0.8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      transition={{
                        ...springSnappy,
                        delay: 0.62 + i * 0.045,
                      }}
                      className={`${kw.size} ${kw.weight} ${kw.tone} leading-none`}
                    >
                      {kw.text}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Highlight cards */}
        <div
          ref={cardsRef}
          className="mt-4 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-3 xl:gap-4"
        >
          {speaker.cards.map((card, i) => (
            <HighlightCard
              key={`${speaker.id}-${card.label}`}
              icon={card.icon}
              label={card.label}
              text={card.text}
              index={i}
              inView={cardsInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function HighlightCard({ icon: Icon, label, text, index, inView }) {
  const cardRef = useRef(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateXRaw = useTransform(mouseY, [0, 1], [6, -6]);

  const rotateYRaw = useTransform(mouseX, [0, 1], [-6, 6]);

  const rotateX = useSpring(rotateXRaw, {
    stiffness: 220,
    damping: 22,
  });

  const rotateY = useSpring(rotateYRaw, {
    stiffness: 220,
    damping: 22,
  });

  const glowX = useTransform(mouseX, [0, 1], ["0%", "100%"]);

  const glowY = useTransform(mouseY, [0, 1], ["0%", "100%"]);

  function handleMouseMove(e) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    mouseX.set((e.clientX - rect.left) / rect.width);

    mouseY.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
      }}
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      transition={{
        ...springSoft,
        delay: index * 0.08,
      }}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3.5 backdrop-blur-sm transition-colors duration-300 hover:border-primary/30 hover:bg-white/[0.04]"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(160px circle at ${glowX} ${glowY}, color-mix(in srgb, var(--color-primary) 14%, transparent), transparent 70%)`,
        }}
      />

      {Icon && (
        <Icon
          aria-hidden
          className="pointer-events-none absolute -right-2 -top-2 h-12 w-12 text-primary-light/10 transition-transform duration-500 group-hover:scale-110 group-hover:text-primary-light/20"
          strokeWidth={1.2}
        />
      )}

      <div className="relative flex items-center gap-2">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-light">
          {Icon && <Icon size={13} strokeWidth={2} />}
        </div>

        <p className="font-display text-sm font-semibold text-text-primary">
          {label}
        </p>
      </div>

      <p className="relative mt-1.5 text-xs leading-relaxed text-text-secondary">
        {text}
      </p>
    </motion.div>
  );
}

function PuzzlePortrait({ src, name, size = 190, cols = 6 }) {
  const fallbackTones = [
    "var(--color-primary)",
    "var(--color-primary-light)",
    "var(--color-primary-dark)",
    "var(--color-accent)",
  ];

  const containerRef = useRef(null);

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
          startRotate: (rand() - 0.5) * 160,
          startScale: 0.4 + rand() * 0.3,
          delay: rand() * 0.3,
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
      });

      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        pieces,
        {
          x: (i) => tiles[i].startX,
          y: (i) => tiles[i].startY,
          rotate: (i) => tiles[i].startRotate,
          scale: (i) => tiles[i].startScale,
          opacity: 0,
        },
        {
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          opacity: 1,
          duration: 0.95,
          delay: (i) => tiles[i].delay,
          ease: "back.out(1.6)",
        },
      );
    }, el);

    return () => ctx.revert();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, tiles]);

  return (
    <div
      ref={containerRef}
      className="relative h-[140px] w-[140px] shrink-0 overflow-hidden rounded-full border border-primary/30 bg-black sm:h-[210px] sm:w-[210px] lg:h-[280px] lg:w-[280px] xl:h-[320px] xl:w-[320px]"
      style={{
        boxShadow:
          "0 0 70px color-mix(in srgb, var(--color-primary) 14%, transparent)",
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
          }}
        />
      ))}

      <div className="pointer-events-none absolute inset-0 rounded-full bg-black/10" />

      <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-primary/30" />
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

/**
 * Background atmosphere.
 *
 * Large floating circles/orbs with very slow motion.
 * They intentionally stay low-opacity and blurred so they
 * add depth without fighting the content.
 */
function SectionBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* Large ambient orange orb */}
      <motion.div
        aria-hidden="true"
        className="absolute -left-32 top-[-10%] h-[420px] w-[420px] rounded-full bg-primary/[0.055] blur-[110px] sm:h-[520px] sm:w-[520px]"
        animate={{
          x: [0, 45, 10, 0],
          y: [0, 25, 55, 0],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Large right orb */}
      <motion.div
        aria-hidden="true"
        className="absolute -right-40 top-[5%] h-[500px] w-[500px] rounded-full bg-primary-light/[0.045] blur-[125px] sm:h-[620px] sm:w-[620px]"
        animate={{
          x: [0, -40, -10, 0],
          y: [0, 50, 15, 0],
          scale: [1, 0.94, 1.06, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Bottom atmosphere */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-[-20%] left-1/2 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-primary/[0.035] blur-[130px]"
        animate={{
          x: ["-50%", "-46%", "-54%", "-50%"],
          y: [0, -30, 20, 0],
          scale: [1, 1.05, 0.98, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating circle particles */}
      <motion.span
        aria-hidden="true"
        className="absolute left-[15%] top-[22%] h-16 w-16 rounded-full border border-primary/10 bg-primary/[0.025] blur-[1px]"
        animate={{
          x: [0, 18, -8, 0],
          y: [0, -24, 12, 0],
          scale: [1, 1.08, 0.94, 1],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.span
        aria-hidden="true"
        className="absolute right-[18%] top-[28%] h-24 w-24 rounded-full border border-primary-light/[0.08] bg-primary-light/[0.02] blur-[1px]"
        animate={{
          x: [0, -24, 12, 0],
          y: [0, 18, -15, 0],
          scale: [1, 0.93, 1.06, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.span
        aria-hidden="true"
        className="absolute bottom-[18%] left-[8%] h-10 w-10 rounded-full bg-primary/[0.08] blur-[1px]"
        animate={{
          x: [0, 26, -12, 0],
          y: [0, -18, 9, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.span
        aria-hidden="true"
        className="absolute bottom-[24%] right-[10%] h-14 w-14 rounded-full border border-primary/10 bg-primary/[0.03]"
        animate={{
          x: [0, -20, 8, 0],
          y: [0, 16, -12, 0],
          scale: [1, 1.12, 0.92, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Tiny distant particles */}
      <span
        aria-hidden="true"
        className="absolute left-[28%] top-[16%] h-1.5 w-1.5 rounded-full bg-primary-light/40 shadow-[0_0_10px_rgba(255,122,69,0.5)]"
      />

      <span
        aria-hidden="true"
        className="absolute right-[31%] top-[14%] h-1 w-1 rounded-full bg-primary/40 shadow-[0_0_8px_rgba(255,90,31,0.45)]"
      />

      <span
        aria-hidden="true"
        className="absolute bottom-[28%] left-[24%] h-1 w-1 rounded-full bg-primary-light/30"
      />

      <span
        aria-hidden="true"
        className="absolute bottom-[18%] right-[30%] h-1.5 w-1.5 rounded-full bg-primary/35 shadow-[0_0_9px_rgba(255,90,31,0.4)]"
      />

      {/* Extremely subtle radial focus */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(255,90,31,0.045), transparent 34%)",
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </div>
  );
}
