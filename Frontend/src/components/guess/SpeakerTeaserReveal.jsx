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

/**
 * DevTalks — Mystery Speaker Reveal
 *
 * Same file, same animation system as SpeakerReveal
 * (puzzle-tile portrait assembly, GSAP word-pop split text,
 * segmented autoplay rail, tilt highlight cards) — repointed at
 * a "guess who's speaking" teaser instead of a finished bio reveal.
 *
 * WHAT CHANGED FROM SpeakerReveal, AND WHY:
 *
 * - Identity is withheld, not shown. `PuzzlePortrait` still assembles
 *   itself from scattered tiles exactly as before, but the source
 *   image is desaturated (grayscale + darkened via CSS filter, no
 *   pixel editing needed) and a `MysteryMark` layer sits on top: a
 *   soft dark scrim plus a large "?" that pops in with the same
 *   `springSnappy` spring once the tiles finish assembling. The name
 *   heading is replaced by a redacted codename ("SPEAKER 01") so nothing
 *   in the DOM gives the identity away either.
 *
 * - Bio copy became clue copy. `roleLines` (their actual job title)
 *   is now `clues`: 2–4 short hint strings you write, each rendered
 *   with a numbered "CLUE 0N" tag using the same SplitReveal pop-in.
 *   The pull-quote is now a teaser line written to intrigue without
 *   naming anything. The keyword cascade lost the one item that
 *   used to spell out the speaker's real name — it's pure topic/vibe
 *   words now, safe to show pre-reveal.
 *
 * - Highlight cards became a clue-status rail: instead of three bio
 *   facts, each card is one clue slot showing whether it's live yet
 *   ("Unlocked" vs "Locked"), so the rail visually fills in as you
 *   edit `unlocked: true` on more clues week to week. Locked cards
 *   render with reduced opacity and a Lock icon instead of their topic
 *   icon — no animation changes, same tilt/glow interaction, just a
 *   conditional on what's inside.
 *
 * - Added a countdown strip under the header (`daysUntilEvent`,
 *   `eventDateLabel`) since "clues update as the event nears" implied
 *   people should be able to tell how close it is. It's a single
 *   static line, not wired to a live clock — update the two props
 *   when you know the real date, or replace with your own timer.
 *
 * - Everything structural is untouched: full `100dvh` layout, the
 *   `min-h-[100dvh]` mobile fallback with page scroll, the segmented
 *   autoplay rail, the infinite carousel wrap, the same spring
 *   presets, and the same GSAP SplitReveal mechanism.
 *
 * HOW TO UPDATE CLUES AS THE EVENT APPROACHES:
 *   Edit the `MYSTERY_SPEAKERS` array below. For each speaker:
 *     - flip a clue's `unlocked` to `true` when you want it live
 *     - add a new clue object to `clues` any time
 *     - swap `revealStatus` from "3 clues live" style copy as you go
 *   Nothing else in the component needs to change — the clue rail,
 *   the numbered clue list, and the "X/Y unlocked" tagline all derive
 *   from the array, so editing data is editing the page.
 *
 * Photos: still pointed at pravatar.cc placeholders purely so the
 * puzzle-reveal has pixels to scatter and reassemble — swap `image`
 * for a real (still-anonymized) photo whenever you like, the
 * grayscale + question-mark treatment is applied in CSS regardless
 * of what the source image actually shows.
 */

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

// Same shared spring presets as SpeakerReveal, kept identical so this
// component feels like the same physical material.
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

/** Identical mechanism to SpeakerReveal's SplitReveal — word-by-word
 *  GSAP pop-in, mount- or scroll-triggered. */
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

export default function SpeakerTeaserReveal({
  autoplayMs = 7000,
  eventDateLabel = "March 14",
  daysUntilEvent = 21,
}) {
  const [index, setIndex] = useState(0);
  const [revealKey, setRevealKey] = useState(0);

  const speaker = MYSTERY_SPEAKERS[index];

  const cardsRef = useRef(null);

  const cardsInView = useInView(cardsRef, {
    once: false,
    amount: 0.3,
  });

  const segmentRefs = useRef([]);
  const segmentTweenRef = useRef(null);

  function goTo(nextIndex) {
    const wrapped =
      (nextIndex + MYSTERY_SPEAKERS.length) % MYSTERY_SPEAKERS.length;

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
    <section className="font-body relative flex min-h-[100dvh] w-full flex-col overflow-y-auto bg-app-bg px-5 py-8 sm:px-10 sm:py-6 lg:h-[100dvh] lg:overflow-hidden lg:px-16 lg:py-6 xl:px-24 2xl:px-32">
      <FontStyles />
      <SectionBackdrop />

      <div className="relative z-10 mx-auto flex h-full w-full flex-col justify-between">
        {/* header row */}
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-light opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-light" />
            </span>

            <h2 className="font-display text-xl font-semibold tracking-tight text-text-primary sm:text-2xl">
              <SplitReveal text="Guess the speaker" trigger="scroll" />
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-1 text-[11px] text-text-secondary sm:flex">
              <Calendar size={12} strokeWidth={2} />

              <span>
                {eventDateLabel} · {daysUntilEvent}d left
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <motion.button
                type="button"
                aria-label="Previous mystery speaker"
                onClick={() => goTo(index - 1)}
                whileHover={{ scale: 1.08, rotate: -4 }}
                whileTap={{ scale: 0.9 }}
                transition={springSnappy}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-secondary transition-colors duration-200 hover:border-border-orange hover:text-primary-light"
              >
                <ChevronLeft size={17} strokeWidth={2.5} />
              </motion.button>

              <motion.button
                type="button"
                aria-label="Next mystery speaker"
                onClick={() => goTo(index + 1)}
                whileHover={{ scale: 1.08, rotate: 4 }}
                whileTap={{ scale: 0.9 }}
                transition={springSnappy}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border-orange bg-surface-orange text-primary-light transition-colors duration-200 hover:bg-primary hover:text-text-dark"
              >
                <ChevronRight size={17} strokeWidth={2.5} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* segmented autoplay rail */}
        <div
          className="mb-4 flex w-full gap-1.5 sm:mb-6"
          role="tablist"
          aria-label="Mystery speakers"
        >
          {MYSTERY_SPEAKERS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to ${s.codename}`}
              onClick={() => goTo(i)}
              className="relative h-px flex-1 overflow-hidden rounded-full bg-border"
            >
              <span
                ref={(el) => {
                  segmentRefs.current[i] = el;
                }}
                className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-primary"
              />
            </button>
          ))}
        </div>

        {/* mystery speaker detail */}
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
              {/* left: codename + clue list */}
              <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-end lg:text-right">
                <motion.span
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    ...springSnappy,
                    delay: 0.05,
                  }}
                  className="inline-flex items-center rounded-full bg-surface-orange px-2.5 py-0.5 text-[11px] font-medium text-primary-light"
                >
                  {speaker.track}
                </motion.span>

                <h3 className="font-display mt-2.5 text-2xl font-semibold uppercase leading-[0.95] tracking-tight text-text-primary sm:text-4xl xl:text-5xl">
                  {speaker.codename.split(" ").map((word, i) => (
                    <span
                      key={word + i}
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
                  {speaker.revealStatus}
                </motion.span>

                <div className="mt-3 space-y-1.5">
                  {speaker.clues.map((clue, i) => (
                    <p
                      key={clue.text}
                      className={`flex items-start gap-1.5 text-xs leading-relaxed lg:justify-end ${
                        clue.unlocked
                          ? "text-text-secondary"
                          : "text-text-muted/50"
                      }`}
                    >
                      <span className="font-label mt-px shrink-0 text-[10px] tracking-wide text-primary-light/70 lg:order-2">
                        {`CLUE 0${i + 1}`}
                      </span>

                      <span className="lg:order-1">
                        {clue.unlocked ? (
                          <SplitReveal
                            text={clue.text}
                            delay={0.28 + i * 0.06}
                            stagger={0.015}
                          />
                        ) : (
                          "•••••• •••• ••••• ••• ••••••••."
                        )}
                      </span>
                    </p>
                  ))}
                </div>
              </div>

              {/* center: mystery portrait */}
              <div className="order-1 flex justify-center lg:order-2">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <PuzzlePortrait
                    key={revealKey}
                    src={speaker.image}
                    name={speaker.codename}
                    size={190}
                  />
                </motion.div>
              </div>

              {/* right: teaser + keyword cascade */}
              <div className="order-3 flex flex-col items-center text-center lg:items-start lg:text-left">
                <p className="max-w-sm text-base font-semibold leading-snug text-text-primary sm:text-lg xl:max-w-md xl:text-xl">
                  <SplitReveal
                    text={speaker.teaser}
                    delay={0.18}
                    stagger={0.03}
                  />
                </p>

                <p className="mt-3 flex items-center gap-1.5 text-xs text-text-muted">
                  <HelpCircle size={12} strokeWidth={2} />

                  <SplitReveal
                    text="Think you know who it is?"
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
                  className="mt-1.5 h-0.5 w-8 bg-primary"
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

        {/* clue-status rail */}
        <div
          ref={cardsRef}
          className="mt-4 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-3 xl:gap-4"
        >
          {speaker.clues.slice(0, 3).map((clue, i) => (
            <ClueCard
              key={`${speaker.id}-clue-${i}`}
              index={i}
              clue={clue}
              defaultIcon={speaker.cardIcon}
              inView={cardsInView}
            />
          ))}
        </div>

        <p className="mt-3 text-center text-[11px] text-text-muted sm:text-left">
          New clues unlock as {eventDateLabel} gets closer — check back weekly.
        </p>
      </div>
    </section>
  );
}

/** Same tilt + glow card as SpeakerReveal's HighlightCard, but the
 *  content and icon depend on whether this clue slot is unlocked yet. */
function ClueCard({ clue, defaultIcon: Icon = Sparkles, index, inView }) {
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

  const ShownIcon = clue.unlocked ? Icon : Lock;

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
      animate={
        inView
          ? {
              opacity: clue.unlocked ? 1 : 0.55,
              y: 0,
            }
          : {
              opacity: 0,
              y: 18,
            }
      }
      transition={{
        ...springSoft,
        delay: index * 0.08,
      }}
      className={`group relative overflow-hidden rounded-xl border px-4 py-3.5 transition-colors duration-300 ${
        clue.unlocked
          ? "border-border bg-surface hover:border-border-orange"
          : "border-border/60 bg-surface/60"
      }`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(160px circle at ${glowX} ${glowY}, color-mix(in srgb, var(--color-primary) 16%, transparent), transparent 70%)`,
        }}
      />

      <ShownIcon
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-2 h-12 w-12 text-primary-light/10 transition-transform duration-500 group-hover:scale-110 group-hover:text-primary-light/20"
        strokeWidth={1.2}
      />

      <div className="relative flex items-center gap-2">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-orange text-primary-light">
          <ShownIcon size={13} strokeWidth={2} />
        </div>

        <p className="font-display text-sm font-semibold text-text-primary">
          {clue.unlocked ? "Unlocked" : "Locked"}
        </p>
      </div>

      <p className="relative mt-1.5 text-xs leading-relaxed text-text-secondary">
        {clue.unlocked ? clue.text : "This clue drops closer to the event."}
      </p>
    </motion.div>
  );
}

/** Same puzzle-tile assembly as SpeakerReveal's PuzzlePortrait, with
 *  two additions: tiles render desaturated/darkened via CSS filter
 *  (no image editing needed), and a MysteryMark ("?" badge) fades in
 *  on top once the tiles finish settling, so the face never actually
 *  reads even though a real photo can sit underneath. */
function PuzzlePortrait({ src, name, size = 190, cols = 6 }) {
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

      gsap.set(markRef.current, {
        opacity: 1,
        scale: 1,
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

      tl.fromTo(
        markRef.current,
        {
          opacity: 0,
          scale: 0.5,
          rotate: -12,
        },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.5,
          ease: "back.out(2.2)",
        },
        "-=0.25",
      );
    }, el);

    return () => ctx.revert();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, tiles]);

  return (
    <div
      ref={containerRef}
      className="relative h-[140px] w-[140px] shrink-0 overflow-hidden rounded-full border border-border-orange bg-app-bg-secondary sm:h-[210px] sm:w-[210px] lg:h-[280px] lg:w-[280px] xl:h-[320px] xl:w-[320px]"
      style={{
        boxShadow:
          "0 16px 48px color-mix(in srgb, var(--color-primary) 20%, transparent)",
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
            backgroundColor: `color-mix(in srgb, ${tile.fallback} 55%, var(--color-app-bg-secondary))`,
            backgroundImage: `url(${src})`,
            backgroundSize: `${cols * 100}% ${cols * 100}%`,
            backgroundPosition: `${tile.bgPosX}% ${tile.bgPosY}%`,
            filter: "grayscale(1) brightness(0.55) contrast(1.05)",
          }}
        />
      ))}

      {/* dark scrim */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-app-bg-secondary/35" />

      {/* question mark */}
      <div
        ref={markRef}
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0"
        aria-hidden
      >
        <span
          className="font-display select-none text-[64px] font-bold leading-none text-primary-light sm:text-[96px] lg:text-[128px] xl:text-[148px]"
          style={{
            textShadow:
              "0 4px 24px color-mix(in srgb, var(--color-app-bg) 60%, transparent)",
          }}
        >
          ?
        </span>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-border-orange/60" />
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
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border-light) 1px, transparent 1px), linear-gradient(90deg, var(--color-border-light) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 20%, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 20%, black 0%, transparent 70%)",
        }}
      />

      <div
        className="absolute left-1/2 top-0 h-[380px] w-[720px] -translate-x-1/2 -translate-y-1/3 rounded-full opacity-50 blur-[140px]"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-primary) 16%, transparent)",
        }}
      />
    </div>
  );
}
