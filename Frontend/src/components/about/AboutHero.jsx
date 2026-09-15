import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const TERMINAL_SCRIPT = [
  { type: "command", text: "./devkraft" },
  { type: "output", text: "INITIALIZING COMMUNITY..." },
  { type: "progress", text: "[████████████████████] 100%" },
  { type: "space" },
  { type: "highlight", text: "3 EVENTS. ONE COMMUNITY." },
  { type: "space" },
  { type: "event", text: "DEV CHEF      → CREATE" },
  { type: "event", text: "DEV CLASH     → COMPETE" },
  { type: "event", text: "DEVTALKS      → CONNECT" },
  { type: "space" },
  { type: "label", text: "MISSION" },
  { type: "mission", text: "LEARN → BUILD → SHARE" },
  { type: "space" },
  { type: "status", text: "STATUS: STILL BUILDING_" },
];

const CODE_SYMBOLS = [
  { text: "</>", left: "7%", top: "18%", size: "18px", delay: 0 },
  { text: "{}", left: "18%", top: "72%", size: "22px", delay: 1.2 },
  { text: "01", left: "35%", top: "12%", size: "14px", delay: 0.6 },
  { text: "=>", left: "46%", top: "82%", size: "20px", delay: 1.8 },
  { text: "&&", left: "62%", top: "17%", size: "16px", delay: 0.9 },
  { text: "</>", left: "76%", top: "70%", size: "20px", delay: 1.5 },
  { text: "01", left: "88%", top: "28%", size: "13px", delay: 0.3 },
  { text: "{}", left: "92%", top: "82%", size: "18px", delay: 2.1 },
  { text: "01", left: "10%", top: "45%", size: "12px", delay: 1.7 },
  { text: "=>", left: "81%", top: "50%", size: "15px", delay: 2.4 },
];

const easeOutExpo = [0.16, 1, 0.3, 1];

function useTypedTerminal(script, { startDelay = 900 } = {}) {
  const reduceMotion = useReducedMotion();
  const [lines, setLines] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setLines(script);
      setLineIndex(script.length);
      setStarted(true);
      return;
    }

    const timer = setTimeout(() => {
      setStarted(true);
    }, startDelay);

    return () => clearTimeout(timer);
  }, [reduceMotion, script, startDelay]);

  useEffect(() => {
    if (!started || reduceMotion) return;
    if (lineIndex >= script.length) return;

    const entry = script[lineIndex];

    if (entry.type === "space") {
      const timer = setTimeout(() => {
        setLines((prev) => [...prev, entry]);
        setLineIndex((index) => index + 1);
      }, 160);

      return () => clearTimeout(timer);
    }

    if (charIndex < entry.text.length) {
      const speed =
        entry.type === "command"
          ? 45
          : entry.type === "progress"
            ? 8
            : 16;

      const timer = setTimeout(() => {
        setCurrentText(entry.text.slice(0, charIndex + 1));
        setCharIndex((index) => index + 1);
      }, speed);

      return () => clearTimeout(timer);
    }

    const pause =
      entry.type === "command"
        ? 320
        : entry.type === "progress"
          ? 240
          : 140;

    const timer = setTimeout(() => {
      setLines((prev) => [...prev, entry]);
      setCurrentText("");
      setCharIndex(0);
      setLineIndex((index) => index + 1);
    }, pause);

    return () => clearTimeout(timer);
  }, [
    started,
    reduceMotion,
    charIndex,
    lineIndex,
    script,
  ]);

  return {
    lines,
    currentText,
    currentEntry: script[lineIndex],
    finished: lineIndex >= script.length,
    started,
  };
}

function getLineClass(type) {
  switch (type) {
    case "command":
      return "text-[var(--color-primary-light)]";

    case "highlight":
      return "font-semibold text-[var(--color-text-primary)]";

    case "event":
      return "text-[var(--color-accent-light)]";

    case "progress":
      return "text-[var(--color-primary)]";

    case "label":
      return "font-semibold tracking-[0.16em] text-[var(--color-text-muted)]";

    case "mission":
      return "text-[var(--color-primary-light)]";

    case "status":
      return "font-semibold text-[var(--color-primary)]";

    default:
      return "text-[var(--color-text-secondary)]";
  }
}

function TerminalLine({ entry, text }) {
  if (entry.type === "space") {
    return <div className="h-2" aria-hidden="true" />;
  }

  const isCommand = entry.type === "command";

  return (
    <div className={`${getLineClass(entry.type)} whitespace-pre`}>
      {isCommand && (
        <span className="mr-1.5 text-[var(--color-text-muted)] sm:mr-2">
          $
        </span>
      )}

      <span>{text}</span>
    </div>
  );
}

export default function AboutHero() {
  const reduceMotion = useReducedMotion();

  const {
    lines,
    currentText,
    currentEntry,
    finished,
    started,
  } = useTypedTerminal(TERMINAL_SCRIPT);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 22,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: easeOutExpo,
      },
    },
  };

  return (
    <section className="relative flex min-h-screen w-full items-center overflow-hidden bg-[var(--color-bg)] px-0 py-24 sm:py-28 lg:min-h-screen lg:py-20">
      <style>{`
        @keyframes devkraft-blink {
          0%, 49% {
            opacity: 1;
          }

          50%, 100% {
            opacity: 0;
          }
        }

        @keyframes code-float {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg);
            opacity: 0.08;
          }

          50% {
            transform: translate3d(0, -10px, 0) rotate(2deg);
            opacity: 0.18;
          }
        }

        .devkraft-cursor {
          display: inline-block;
          width: 0.55em;
          animation: devkraft-blink 1s step-start infinite;
        }

        .code-symbol {
          position: absolute;
          color: var(--color-primary-light);
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco,
            Consolas, "Liberation Mono", "Courier New", monospace;
          font-weight: 600;
          line-height: 1;
          user-select: none;
          animation: code-float 6s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .devkraft-cursor,
          .code-symbol {
            animation: none;
          }
        }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <motion.div
          className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[var(--color-primary)]/20 blur-3xl sm:h-[28rem] sm:w-[28rem] lg:h-[34rem] lg:w-[34rem]"
          animate={
            reduceMotion
              ? {}
              : {
                  x: [0, 24, 0],
                  y: [0, -18, 0],
                }
          }
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute -bottom-40 -left-40 h-72 w-72 rounded-full bg-[var(--color-primary)]/10 blur-3xl sm:h-[26rem] sm:w-[26rem]"
          animate={
            reduceMotion
              ? {}
              : {
                  x: [0, -18, 0],
                  y: [0, 20, 0],
                }
          }
          transition={{
            duration: 17,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.055]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(244,240,232,0.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,90,31,0.06),transparent_28%),radial-gradient(circle_at_80%_50%,rgba(255,90,31,0.07),transparent_28%)]" />

        <div className="absolute inset-0 overflow-hidden">
          {CODE_SYMBOLS.map((symbol, index) => (
            <motion.span
              key={`${symbol.text}-${index}`}
              className="code-symbol"
              style={{
                left: symbol.left,
                top: symbol.top,
                fontSize: symbol.size,
                animationDelay: `${symbol.delay}s`,
              }}
              animate={
                reduceMotion
                  ? {}
                  : {
                      x: [0, index % 2 === 0 ? 8 : -8, 0],
                      y: [0, -10, 0],
                    }
              }
              transition={{
                duration: 7 + (index % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: symbol.delay,
              }}
            >
              {symbol.text}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] items-center px-5 sm:px-8 md:px-10 lg:px-14 xl:px-20">
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex w-full flex-col justify-center"
          >
            <motion.div
              variants={itemVariants}
              className="mb-5 inline-flex w-fit items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2 backdrop-blur-xl sm:mb-6 sm:px-4"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-primary)] shadow-[0_0_12px_var(--color-primary)]" />

              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)] sm:text-[10px] md:text-xs">
                DevKraft Club
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="max-w-3xl bg-gradient-to-r from-[var(--color-text-primary)] via-[var(--color-text-primary)] to-[var(--color-primary-light)] bg-clip-text text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-transparent sm:text-5xl md:text-6xl lg:text-[3.8rem] xl:text-[4.3rem]"
            >
              Where developers actually build things.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--color-text-secondary)] sm:mt-6 sm:text-base md:text-lg"
            >
              DevKraft is our college's developer community — a home for
              students who'd rather ship something than just talk about it. We
              learn together, build together, and create experiences that bring
              the community closer.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-7 flex w-full flex-col gap-3 sm:mt-9 sm:flex-row"
            >
              <motion.a
                href="#devtalks"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-md bg-[var(--color-primary)] px-6 py-3.5 text-center text-sm font-medium text-[var(--color-text-dark)] shadow-[var(--shadow-orange)] transition-colors duration-300 hover:bg-[var(--color-primary-light)] sm:w-auto"
              >
                Explore DevTalks
              </motion.a>

              <motion.a
                href="#what-we-do"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="glass rounded-md px-6 py-3.5 text-center text-sm font-medium text-[var(--color-text-primary)] transition-colors duration-300 hover:border-[var(--color-border-orange)] sm:w-auto"
              >
                What We Do
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              y: 32,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.25,
              ease: easeOutExpo,
            }}
            className="w-full"
          >
            <div className="glass w-full overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
              <div className="flex h-11 items-center justify-between border-b border-[var(--color-border-light)] px-4 sm:px-5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-error)]/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-warning)]/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-success)]/70" />

                  <span className="ml-2 text-xs text-[var(--color-text-muted)] sm:ml-3">
                    devkraft — zsh
                  </span>
                </div>

                <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-[var(--color-text-muted)] sm:text-[9px]">
                  SYSTEM / ACTIVE
                </span>
              </div>

              <div className="grid h-[21rem] grid-cols-[1fr_92px] sm:h-[22rem] sm:grid-cols-[1fr_125px] md:grid-cols-[1fr_155px] lg:h-[23rem] lg:grid-cols-[1fr_180px]">
                <div className="min-w-0 overflow-hidden px-3 py-5 font-mono text-[9px] leading-relaxed sm:px-5 sm:py-6 sm:text-xs md:text-sm">
                  {lines.map((entry, index) => (
                    <TerminalLine
                      key={`${entry.type}-${index}`}
                      entry={entry}
                      text={entry.text}
                    />
                  ))}

                  {!finished && started && currentEntry && (
                    <div
                      className={`${getLineClass(
                        currentEntry.type,
                      )} whitespace-pre`}
                    >
                      {currentEntry.type === "command" && (
                        <span className="mr-1.5 text-[var(--color-text-muted)] sm:mr-2">
                          $
                        </span>
                      )}

                      <span>{currentText}</span>

                      <span className="devkraft-cursor text-[var(--color-primary-light)]">
                        ▍
                      </span>
                    </div>
                  )}
                </div>

                <div className="relative flex min-w-0 items-center justify-center overflow-hidden border-l border-[var(--color-border-light)] px-2 sm:px-4">
                  <motion.div
                    animate={
                      reduceMotion
                        ? {}
                        : {
                            y: [0, -6, 0],
                            rotate: [0, 1.5, 0],
                          }
                    }
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative flex items-center justify-center"
                  >
                    <div className="absolute h-20 w-20 rounded-full bg-[var(--color-primary)]/10 blur-2xl sm:h-24 sm:w-24" />

                    <img
                      src="/logo/devkraft.png"
                      alt="DevKraft logo"
                      className="relative h-14 w-14 object-contain drop-shadow-[0_0_20px_rgba(255,90,31,0.28)] sm:h-20 sm:w-20 md:h-24 md:w-24"
                    />
                  </motion.div>

                  <span className="absolute bottom-2 left-0 right-0 px-1 text-center font-mono text-[5px] uppercase tracking-[0.12em] text-[var(--color-text-muted)] sm:text-[7px] sm:tracking-[0.16em]">
                    DEVKRAFT // COMMUNITY
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] sm:flex">
        <span className="h-px w-8 bg-[var(--color-border)]" />
        Scroll to explore
        <span className="h-px w-8 bg-[var(--color-border)]" />
      </div>
    </section>
  );
}