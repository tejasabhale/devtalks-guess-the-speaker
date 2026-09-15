import { useState, useRef } from "react";

const RESPONSES = [
  "Your guess might be right — the signal's getting stronger.",
  "Bold pick. The clues aren't ruling it out.",
  "Interesting. That name keeps coming up in the guesses.",
  "Not the most popular guess so far, which could mean something.",
  "The countdown isn't talking, but your guess has been logged.",
  "That's a name to watch. Check back after the reveal.",
];

const SLOTS = [
  {
    id: "slot-01",
    label: "SPEAKER_01",
    clues: [
      "Last commit was pushed at 2:14 AM, three days ago.",
      "Bio mentions exactly one open-source project with 10k+ stars.",
      "Has spoken at a DevTalks event before — just not this track.",
    ],
  },
  {
    id: "slot-02",
    label: "SPEAKER_02",
    clues: [
      "Talk abstract was submitted under a working title, then renamed twice.",
      "Travels in from a city with a direct flight to the venue.",
      "Known for skipping slides and going straight to a live terminal.",
    ],
  },
  {
    id: "slot-03",
    label: "SPEAKER_03",
    clues: [
      "Coffee order on the speaker form: something with oat milk.",
      "Has shipped something in production that most people here already use.",
      "Once gave a talk that ran eleven minutes over — nobody minded.",
    ],
  },
];

const META_ITEMS = ["REVEAL STATUS: LOCKED", "LIVE LEADERBOARD OPEN"];

function randomResponse() {
  return RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
}

function SpeakerCard({ slot, index }) {
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("idle");
  const [clueOpen, setClueOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [pointer, setPointer] = useState({
    x: 50,
    y: 50,
  });

  const cardRef = useRef(null);
  const submitTimeoutRef = useRef(null);

  const isRevealed = false;

  function handleSubmit(event) {
    event.preventDefault();

    if (!guess.trim() || status === "scanning") {
      return;
    }

    setStatus("scanning");
    setFeedback("");

    submitTimeoutRef.current = window.setTimeout(() => {
      setFeedback(randomResponse());
      setStatus("done");
    }, 650);
  }

  function handleMouseMove(event) {
    const element = cardRef.current;

    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();

    const px = (event.clientX - rect.left) / rect.width - 0.5;

    const py = (event.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      x: px * -6,
      y: py * 6,
    });

    setPointer({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });

    setPointer({
      x: 50,
      y: 50,
    });
  }

  function handleCardClick(event) {
    if (event.target.closest("form")) {
      return;
    }

    setClueOpen((open) => !open);
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      className="guess-card group relative flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-border bg-app-bg-secondary shadow-[var(--shadow-card)] transition-[box-shadow,border-color] duration-300 ease-out hover:border-border-orange hover:shadow-[0_24px_70px_rgba(0,0,0,0.55)]"
      style={{
        animation: "guess-card-in 560ms cubic-bezier(0.16,1,0.3,1) both",
        animationDelay: `${index * 90}ms`,
        transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        "--pointer-x": `${pointer.x}%`,
        "--pointer-y": `${pointer.y}%`,
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-30 rounded-[inherit] border border-primary/0 transition-[border-color,box-shadow] duration-500 group-hover:border-primary/20 group-hover:shadow-[inset_0_0_35px_rgba(255,90,31,0.06),0_0_30px_rgba(255,90,31,0.08)]" />

      <div
        className="pointer-events-none absolute inset-0 z-20 hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:block"
        style={{
          background:
            "radial-gradient(280px circle at var(--pointer-x) var(--pointer-y), rgba(255, 90, 31, 0.11), transparent 68%)",
        }}
      />

      <div className="relative aspect-[4/5] overflow-hidden bg-app-bg-secondary">
        {isRevealed ? (
          <img
            src="/speakers/placeholder.jpg"
            alt="Speaker portrait"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          />
        ) : (
          <>
            <svg
              viewBox="0 0 200 250"
              className="absolute inset-0 h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              aria-hidden="true"
            >
              <rect width="200" height="250" fill="var(--color-bg-secondary)" />

              <circle cx="100" cy="95" r="42" fill="var(--color-bg-elevated)" />

              <path
                d="M30 250c0-55 31.3-95 70-95s70 40 70 95"
                fill="var(--color-bg-elevated)"
              />
            </svg>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,90,31,0.08),transparent_48%)]" />

            <div className="absolute inset-0 bg-[repeating-linear-gradient(180deg,rgba(0,0,0,0)_0px,rgba(0,0,0,0)_3px,rgba(0,0,0,0.09)_4px)] opacity-70" />

            <span
              className="speaker-particle speaker-particle-a"
              aria-hidden="true"
            />

            <span
              className="speaker-particle speaker-particle-b"
              aria-hidden="true"
            />

            <span
              className="speaker-particle speaker-particle-c"
              aria-hidden="true"
            />

            <span
              className="speaker-particle speaker-particle-d"
              aria-hidden="true"
            />

            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(240px circle at var(--pointer-x) var(--pointer-y), rgba(255,122,69,0.08), transparent 68%)",
              }}
            />
          </>
        )}

        <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-border-light bg-app-bg/75 px-2.5 py-1 font-mono text-[11px] text-text-secondary backdrop-blur-sm">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isRevealed ? "bg-success" : "bg-primary pulse-dot"
            }`}
          />

          {isRevealed ? "revealed" : "locked"}
        </div>

        {!isRevealed && (
          <div className="absolute right-3 top-3 z-10 hidden items-center gap-1 rounded-full border border-border-light bg-app-bg/70 px-2.5 py-1 font-mono text-[10px] text-text-muted opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 sm:flex">
            hover for evidence
          </div>
        )}

        {!isRevealed && (
          <div
            className={`clue-panel absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-app-bg via-app-bg/90 to-app-bg/10 p-4 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
              clueOpen
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
            }`}
          >
            <span className="mb-2 font-mono text-[10px] uppercase tracking-wide text-primary-light">
              Evidence
            </span>

            <ul className="space-y-1.5">
              {slot.clues.map((clue, clueIndex) => (
                <li
                  key={clue}
                  className={`clue-line flex gap-2 text-xs leading-snug text-text-secondary ${
                    clueOpen ? "clue-line-in" : ""
                  }`}
                  style={{
                    transitionDelay: `${clueIndex * 70}ms`,
                  }}
                >
                  <span className="mt-0.5 text-primary">›</span>

                  <span>{clue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!isRevealed && (
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-full border border-border-light bg-app-bg/70 px-2 py-1 font-mono text-[10px] text-text-muted backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-0 sm:hidden">
            tap for evidence
          </div>
        )}
      </div>

      <div className="relative flex flex-1 flex-col gap-4 p-5">
        <span className="font-mono text-xs text-text-muted">{slot.label}</span>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <label htmlFor={slot.id} className="sr-only">
            Guess who this is
          </label>

          <div className="flex gap-2">
            <input
              id={slot.id}
              type="text"
              value={guess}
              onChange={(event) => setGuess(event.target.value)}
              placeholder="Type your guess"
              disabled={status === "scanning"}
              className="w-full rounded-md border border-border bg-app-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-[border-color,box-shadow] duration-200 focus:border-primary-light focus-visible:outline-2 focus-visible:outline-primary-light disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={status === "scanning"}
              className="relative shrink-0 overflow-hidden rounded-md border border-border-orange bg-surface-orange px-4 py-2 text-sm font-medium text-primary-light transition-all duration-200 hover:bg-primary hover:text-text-dark active:scale-95 disabled:cursor-wait"
            >
              <span
                className={`inline-flex items-center gap-1.5 transition-opacity duration-150 ${
                  status === "scanning" ? "opacity-0" : "opacity-100"
                }`}
              >
                Guess
              </span>

              {status === "scanning" && (
                <span className="absolute inset-0 flex items-center justify-center gap-1">
                  <span className="scan-dot" />

                  <span
                    className="scan-dot"
                    style={{
                      animationDelay: "120ms",
                    }}
                  />

                  <span
                    className="scan-dot"
                    style={{
                      animationDelay: "240ms",
                    }}
                  />
                </span>
              )}
            </button>
          </div>

          {feedback && status === "done" && (
            <p
              key={feedback}
              className="feedback-in text-sm text-text-secondary"
            >
              {feedback}
            </p>
          )}
        </form>
      </div>

      <style>{`
        @keyframes guess-card-in {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes feedback-in {
          from {
            opacity: 0;
            transform: translateY(4px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-dot {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(255, 90, 31, 0.45);
          }

          50% {
            box-shadow: 0 0 0 4px rgba(255, 90, 31, 0);
          }
        }

        @keyframes scan-dot {
          0%,
          80%,
          100% {
            opacity: 0.25;
            transform: translateY(0);
          }

          40% {
            opacity: 1;
            transform: translateY(-2px);
          }
        }

        @keyframes ember-a {
          0%,
          100% {
            opacity: 0;
            transform: translate3d(0, 8px, 0) scale(0.8);
          }

          20% {
            opacity: 0.5;
          }

          70% {
            opacity: 0.3;
          }

          100% {
            transform: translate3d(12px, -34px, 0) scale(1);
          }
        }

        @keyframes ember-b {
          0%,
          100% {
            opacity: 0;
            transform: translate3d(0, 6px, 0) scale(0.7);
          }

          25% {
            opacity: 0.4;
          }

          75% {
            opacity: 0.25;
          }

          100% {
            transform: translate3d(-16px, -28px, 0) scale(1);
          }
        }

        @keyframes ember-c {
          0%,
          100% {
            opacity: 0;
            transform: translate3d(0, 10px, 0) scale(0.8);
          }

          20% {
            opacity: 0.45;
          }

          80% {
            opacity: 0.25;
          }

          100% {
            transform: translate3d(10px, -40px, 0) scale(1);
          }
        }

        @keyframes ember-d {
          0%,
          100% {
            opacity: 0;
            transform: translate3d(0, 6px, 0) scale(0.75);
          }

          30% {
            opacity: 0.35;
          }

          75% {
            opacity: 0.2;
          }

          100% {
            transform: translate3d(-8px, -24px, 0) scale(1);
          }
        }

        .guess-card {
          will-change: transform;
        }

        .speaker-particle {
          position: absolute;
          z-index: 4;
          width: 3px;
          height: 3px;
          border-radius: 999px;
          background: var(--color-primary-light);
          box-shadow: 0 0 8px rgba(255, 122, 69, 0.5);
          pointer-events: none;
          opacity: 0;
        }

        .speaker-particle-a {
          left: 29%;
          top: 68%;
        }

        .speaker-particle-b {
          left: 54%;
          top: 62%;
        }

        .speaker-particle-c {
          left: 68%;
          top: 74%;
        }

        .speaker-particle-d {
          left: 43%;
          top: 78%;
        }

        .guess-card:hover .speaker-particle-a {
          animation: ember-a 3.4s ease-in-out infinite;
        }

        .guess-card:hover .speaker-particle-b {
          animation: ember-b 4s ease-in-out infinite 0.4s;
        }

        .guess-card:hover .speaker-particle-c {
          animation: ember-c 3.8s ease-in-out infinite 0.9s;
        }

        .guess-card:hover .speaker-particle-d {
          animation: ember-d 4.2s ease-in-out infinite 1.1s;
        }

        .clue-line {
          opacity: 0;
          transform: translateY(6px);
          transition:
            opacity 260ms ease-out,
            transform 260ms ease-out;
        }

        .group:hover .clue-line,
        .clue-line-in {
          opacity: 1;
          transform: translateY(0);
        }

        .feedback-in {
          animation: feedback-in 320ms
            cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .pulse-dot {
          animation: pulse-dot 2.2s ease-out infinite;
        }

        .scan-dot {
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: currentColor;
          animation: scan-dot 900ms ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .guess-card,
          .speaker-particle,
          .scan-dot,
          .clue-line,
          .pulse-dot {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function GuessSpeakers() {
  return (
    <section className="relative w-full overflow-hidden bg-app-bg-primary px-6 py-24 sm:px-10 lg:px-16 xl:px-24">
      <SectionBackdrop />

      <div className="relative z-10 mx-auto w-full max-w-[1800px]">
        {/* Eyebrow badge, matches the Hero's language */}
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-light bg-app-bg/70 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-text-secondary backdrop-blur-sm"
          style={{
            animation: "guess-card-in 560ms cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-primary" />
          Guess the lineup
        </div>

        <div className="flex flex-col justify-between gap-8 border-b border-border pb-10 lg:flex-row lg:items-end">
          <div
            className="max-w-2xl"
            style={{
              animation: "guess-card-in 560ms cubic-bezier(0.16,1,0.3,1) both",
              animationDelay: "60ms",
            }}
          >
            <h2 className="text-3xl font-semibold leading-tight text-text-primary sm:text-4xl lg:text-5xl">
              Three names. Zero confirmations.
            </h2>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
              Each card holds one DevTalks speaker. Hover a card for evidence on
              desktop, tap it on mobile, then submit a guess — right or wrong,
              DevKraft is keeping count.
            </p>
          </div>

          {/* Status meta, echoes the Hero + Footer for continuity */}
          <div
            className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-text-muted lg:justify-end"
            style={{
              animation: "guess-card-in 560ms cubic-bezier(0.16,1,0.3,1) both",
              animationDelay: "120ms",
            }}
          >
            {META_ITEMS.map((item, index) => (
              <span key={item} className="flex items-center gap-3">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
                  {item}
                </span>
                {index < META_ITEMS.length - 1 && (
                  <span className="text-border-light">|</span>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SLOTS.map((slot, index) => (
            <SpeakerCard key={slot.id} slot={slot} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Faint stage-floor grid + ambient glow, ties this section back to the Hero/Loader. */
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
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute left-1/2 top-0 h-[380px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[140px]"
        style={{ backgroundColor: "rgba(255, 90, 31, 0.16)" }}
      />
    </div>
  );
}
