import { useEffect, useRef, useState } from "react";
import "./guessHero.css";

const EVENT_TARGET = new Date(Date.now() + 1000 * 60 * 60 * 26).getTime();

function useCountdown(target) {
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, target - Date.now()),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(Math.max(0, target - Date.now()));
    }, 1000);

    return () => clearInterval(id);
  }, [target]);

  const totalSeconds = Math.floor(timeLeft / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(value) {
  return String(value).padStart(2, "0");
}

const SPOTS = [
  { mod: "guess-hero__spot--left" },
  { mod: "guess-hero__spot--center" },
  { mod: "guess-hero__spot--right" },
];

export default function GuessHero() {
  const sectionRef = useRef(null);
  const spotlightRef = useRef(null);

  const { days, hours, minutes, seconds } = useCountdown(EVENT_TARGET);

  useEffect(() => {
    const section = sectionRef.current;
    const spotlight = spotlightRef.current;

    if (!section || !spotlight) return;

    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    if (!finePointer) return;

    const handleMove = (event) => {
      const rect = section.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      spotlight.style.setProperty("--mouse-x", `${x}px`);
      spotlight.style.setProperty("--mouse-y", `${y}px`);

      spotlight.classList.add("is-active");
    };

    const handleLeave = () => {
      spotlight.classList.remove("is-active");
    };

    section.addEventListener("mousemove", handleMove);
    section.addEventListener("mouseleave", handleLeave);

    return () => {
      section.removeEventListener("mousemove", handleMove);
      section.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  const units = [
    { label: "days", value: days },
    { label: "hrs", value: hours },
    { label: "min", value: minutes },
    { label: "sec", value: seconds },
  ];

  return (
    <section
      ref={sectionRef}
      id="guess"
      className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-app-bg px-6"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-30"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-radial-orange" />

        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "linear-gradient(to right, color-mix(in srgb, var(--color-text-primary) 4.5%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--color-text-primary) 4.5%, transparent) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="guess-hero__vignette absolute inset-0" />
      </div>

      <div
        className="guess-hero__stage pointer-events-none absolute inset-0 -z-20"
        aria-hidden="true"
      >
        {SPOTS.map((spot, index) => (
          <div key={spot.mod} className={`guess-hero__spot ${spot.mod}`}>
            <div className="guess-hero__beam" />

            <div className="guess-hero__figure">
              <div className="guess-hero__figure-head">
                <span className="guess-hero__ear guess-hero__ear--left" />
                <span className="guess-hero__ear guess-hero__ear--right" />

                <span className="guess-hero__face">
                  <span className="guess-hero__figure-question">?</span>
                </span>
              </div>

              <div className="guess-hero__neck" />

              <div className="guess-hero__shoulders">
                <span className="guess-hero__shoulder-highlight guess-hero__shoulder-highlight--left" />
                <span className="guess-hero__shoulder-highlight guess-hero__shoulder-highlight--right" />
              </div>

              <div className="guess-hero__figure-body">
                <span className="guess-hero__chest" />
                <span className="guess-hero__torso-center" />
              </div>

              <span className="guess-hero__arm guess-hero__arm--left" />
              <span className="guess-hero__arm guess-hero__arm--right" />
            </div>

            <div className="guess-hero__floor-glow" />

            <span className="guess-hero__file-number">0{index + 1}</span>
          </div>
        ))}
      </div>

      <div
        className="guess-hero__spotlight pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500"
        ref={spotlightRef}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in srgb, var(--color-text-primary) 90%, transparent) 0.6px, transparent 0.6px)",
          backgroundSize: "5px 5px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center">
        <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-border-light bg-surface-light px-4 py-1.5 text-sm font-medium text-text-secondary backdrop-blur-md">
          <span
            className="h-1.5 w-1.5 rounded-full bg-primary"
            style={{
              boxShadow:
                "0 0 10px color-mix(in srgb, var(--color-primary) 70%, transparent)",
            }}
          />

          <span>DevKraft presents DevTalks</span>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-1/2 h-40 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />

          <h1 className="relative max-w-3xl text-balance text-5xl font-bold leading-[1.05] tracking-tight text-gradient sm:text-6xl md:text-7xl">
            Guess the speaker
          </h1>
        </div>

        <p className="mt-6 max-w-lg text-base font-medium leading-relaxed text-text-secondary sm:text-lg">
          Three names are locked behind the countdown. Study the clues, place
          your guess for each one, and see how close you get before the reveal.
        </p>

        <div className="mt-12 flex items-center gap-2 font-mono sm:gap-4">
          {units.map((unit, index) => (
            <div key={unit.label} className="flex items-center gap-2 sm:gap-4">
              <div className="glass flex w-[4.25rem] flex-col items-center rounded-lg px-2 py-3 shadow-card sm:w-20 sm:rounded-xl sm:px-3 sm:py-3.5">
                <span className="text-2xl font-bold tabular-nums text-text-primary sm:text-3xl">
                  {pad(unit.value)}
                </span>

                <span className="mt-1 text-[9px] font-medium uppercase tracking-widest text-text-muted sm:text-[11px]">
                  {unit.label}
                </span>
              </div>

              {index < units.length - 1 && (
                <span className="text-xl font-bold text-border-orange sm:text-2xl">
                  :
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-border-light bg-surface-light px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-text-muted backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-primary/80" />
          identities remain classified
        </div>
      </div>

      <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-text-muted">
        <span className="font-mono text-[9px] font-medium uppercase tracking-[0.18em]">
          Scroll to investigate
        </span>

        <svg
          className="h-4 w-4 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M19 9l-7 7-7-7"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </div>
    </section>
  );
}
