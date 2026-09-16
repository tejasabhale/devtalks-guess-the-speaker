import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/**
 * DevTalks hero section — DevKraft club
 *
 * Every themed color below is either a Tailwind utility backed by a
 * @theme token (bg-app-bg, text-primary, border-border-orange, ...) or,
 * for opacity-tinted glows/shadows, `color-mix(in srgb, var(--token) X%,
 * transparent)` — so nothing here is a hardcoded hex/rgba that could
 * drift from the design tokens.
 *
 * Two exceptions, left as plain black/white on purpose: the sheen
 * highlight on the CTA and the darkest gradient stop in the backdrop.
 * Neither corresponds to a token in your @theme (there's no "white"
 * token, and no color matches #050505 exactly) — see the comments
 * inline at each spot.
 */
export default function HeroSection() {
  const heroRef = useRef(null);
  const spotRef = useRef(null);
  const idleRef = useRef({ idle: true, t: 0, raf: null });

  useEffect(() => {
    const hero = heroRef.current;
    const spot = spotRef.current;
    if (!hero || !spot) return;

    const setSpot = (x, y) => {
      const rect = hero.getBoundingClientRect();
      const px = ((x - rect.left) / rect.width) * 100;
      const py = ((y - rect.top) / rect.height) * 100;
      spot.style.setProperty("--mx", `${px}%`);
      spot.style.setProperty("--my", `${py}%`);
    };

    const handleMouseMove = (e) => {
      idleRef.current.idle = false;
      setSpot(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (e.touches[0]) {
        idleRef.current.idle = false;
        setSpot(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    // gentle idle drift so the spotlight still feels alive before anyone moves the cursor
    const idleLoop = () => {
      const state = idleRef.current;
      if (state.idle) {
        state.t += 0.006;
        const x = 50 + Math.sin(state.t) * 18;
        const y = 40 + Math.cos(state.t * 0.8) * 10;
        spot.style.setProperty("--mx", `${x}%`);
        spot.style.setProperty("--my", `${y}%`);
      }
      state.raf = requestAnimationFrame(idleLoop);
    };

    hero.addEventListener("mousemove", handleMouseMove);
    hero.addEventListener("touchmove", handleTouchMove, { passive: true });
    idleLoop();

    return () => {
      hero.removeEventListener("mousemove", handleMouseMove);
      hero.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(idleRef.current.raf);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-app-bg"
      style={{
        backgroundImage: [
          "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 38%)",
          // No token matches #050505 exactly — mixing app-bg toward black
          // keeps this tied to the token instead of a bare magic hex.
          "linear-gradient(180deg, var(--color-app-bg) 0%, var(--color-app-bg-primary) 55%, color-mix(in srgb, var(--color-app-bg) 45%, black) 100%)",
        ].join(", "),
      }}
    >
      {/* faint stage-floor grid, grounds the "stage" concept */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border-light) 1px, transparent 1px), linear-gradient(90deg, var(--color-border-light) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 60%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 60%, black 0%, transparent 75%)",
        }}
      />

      {/* spotlight that tracks the cursor, like a stage light scanning the floor */}
      <div
        ref={spotRef}
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          "--mx": "50%",
          "--my": "40%",
          background:
            "radial-gradient(circle 420px at var(--mx) var(--my), color-mix(in srgb, var(--color-accent) 16%, transparent), color-mix(in srgb, var(--color-primary) 6%, transparent) 35%, transparent 65%)",
        }}
      />

      <FloatingIcons />

      <div className="relative z-20 mx-auto max-w-[860px] px-6 text-center">
        <p className="mb-7 inline-flex items-center gap-2 text-sm text-text-secondary">
          <span className="devtalks-pulse-dot h-[7px] w-[7px] rounded-full bg-primary" />
          DevKraft presents
        </p>

        <div className="mb-5 flex items-center justify-center gap-4">
          <div className="devtalks-sway relative flex flex-shrink-0 origin-top items-center justify-center">
            <span className="devtalks-ring-pulse absolute -inset-3.5 rounded-full border border-border-orange" />
            <MicIcon
              className="h-10 w-10 sm:h-14 sm:w-14"
              style={{
                filter:
                  "drop-shadow(0 0 14px color-mix(in srgb, var(--color-primary) 45%, transparent))",
              }}
            />
          </div>

          <h1
            className="m-0 font-sans text-[clamp(3.2rem,10vw,7.5rem)] font-extrabold leading-[0.95] tracking-tight text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-text-primary) 55%, var(--color-primary-light) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            DevTalks
          </h1>
        </div>

        <p className="mx-auto mb-10 max-w-[520px] text-base leading-relaxed text-text-secondary sm:text-lg">
          Every year, <span className="text-text-muted">DevKraft</span> brings a
          speaker to our stage. This year, we&apos;re not telling you who —
          you&apos;re guessing.
        </p>

        <GuessButton />
      </div>

      <style>{`
        @keyframes devtalks-pulse-dot {
          0%   { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-primary) 55%, transparent); }
          70%  { box-shadow: 0 0 0 10px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }
        .devtalks-pulse-dot { animation: devtalks-pulse-dot 1.8s ease-out infinite; }

        @keyframes devtalks-sway {
          0%, 100% { transform: rotate(-4deg); }
          50%      { transform: rotate(4deg); }
        }
        .devtalks-sway { animation: devtalks-sway 4.2s ease-in-out infinite; }

        @keyframes devtalks-ring-pulse {
          0%   { transform: scale(0.7); opacity: 0.9; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .devtalks-ring-pulse { animation: devtalks-ring-pulse 2.6s ease-out infinite; }

        @keyframes devtalks-drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50%      { transform: translate(18px, -26px) rotate(8deg); }
        }
        @keyframes devtalks-drift-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50%      { transform: translate(-22px, 20px) rotate(-6deg); }
        }
        .devtalks-f1 { animation: devtalks-drift 9s cubic-bezier(0.16,1,0.3,1) infinite; }
        .devtalks-f2 { animation: devtalks-drift-slow 11s cubic-bezier(0.16,1,0.3,1) infinite; }
        .devtalks-f3 { animation: devtalks-drift-slow 8s cubic-bezier(0.16,1,0.3,1) infinite; }
        .devtalks-f4 { animation: devtalks-drift 10s cubic-bezier(0.16,1,0.3,1) infinite; }
        .devtalks-f5 { animation: devtalks-drift 13s cubic-bezier(0.16,1,0.3,1) infinite; }
        .devtalks-f6 { animation: devtalks-drift-slow 12s cubic-bezier(0.16,1,0.3,1) infinite; }

        @keyframes devtalks-btn-sheen {
          0%   { transform: translateX(-130%) skewX(-18deg); }
          100% { transform: translateX(230%) skewX(-18deg); }
        }
        .devtalks-btn-sheen { animation: devtalks-btn-sheen 3.2s ease-in-out infinite; }

        @keyframes devtalks-btn-ring {
          0%   { transform: scale(0.92); opacity: 0.55; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        .devtalks-btn-ring { animation: devtalks-btn-ring 2.2s cubic-bezier(0.16,1,0.3,1) infinite; }

        .devtalks-guess-btn:hover {
          box-shadow: 0 0 64px color-mix(in srgb, var(--color-primary) 45%, transparent);
        }

        @media (prefers-reduced-motion: reduce) {
          .devtalks-pulse-dot, .devtalks-sway, .devtalks-ring-pulse,
          .devtalks-f1, .devtalks-f2, .devtalks-f3, .devtalks-f4, .devtalks-f5, .devtalks-f6,
          .devtalks-btn-sheen, .devtalks-btn-ring {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </section>
  );
}

/**
 * Primary CTA — a layered, "stage light" button rather than a flat pill:
 * pulsing outer ring, gradient fill, a light sheen that sweeps across on
 * a loop, and a live-status microcopy line underneath for social proof.
 */
function GuessButton() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Link
        to="/#guess"
        className="devtalks-guess-btn group relative inline-flex items-center gap-2.5 overflow-hidden rounded-lg px-9 py-4 font-semibold text-text-dark shadow-orange outline-none transition-all duration-300 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg active:translate-y-0"
        style={{
          backgroundImage:
            "linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 60%, var(--color-primary) 100%)",
        }}
      >
        {/* pulsing outer ring, echoes the mic ring above */}
        <span className="devtalks-btn-ring pointer-events-none absolute inset-0 rounded-lg border border-primary-light" />

        {/* light sheen sweeping across the button on a loop — plain white
            highlight, intentionally not tokenized (no "white" token exists) */}
        <span
          className="devtalks-btn-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3 opacity-60"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
          }}
        />

        <span className="relative">Guess the speaker</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1"
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
      </Link>

      <p className="inline-flex items-center gap-1.5 text-xs text-text-muted">
        <span className="devtalks-pulse-dot h-1.5 w-1.5 rounded-full bg-primary" />
        Live leaderboard open — no sign-up to play
      </p>
    </div>
  );
}

function MicIcon({ className, style }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="url(#devtalks-mic-gradient)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id="devtalks-mic-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-accent-light)" />
          <stop offset="100%" stopColor="var(--color-primary)" />
        </linearGradient>
      </defs>
      <path d="M12 15a3.5 3.5 0 0 0 3.5-3.5v-5a3.5 3.5 0 0 0-7 0v5A3.5 3.5 0 0 0 12 15Z" />
      <path d="M19 11.5a7 7 0 0 1-14 0" />
      <path d="M12 18.5V22" />
      <path d="M8.5 22h7" />
    </svg>
  );
}

function FloatingIcons() {
  const strokeClass = "stroke-accent-light fill-none opacity-[0.16]";
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      <svg
        className={`devtalks-f1 absolute left-[10%] top-[14%] w-[46px] ${strokeClass}`}
        viewBox="0 0 24 24"
        strokeWidth="1.4"
      >
        <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" />
        <path d="M19 11a7 7 0 0 1-14 0" />
        <path d="M12 18v3" />
        <path d="M9 21h6" />
      </svg>
      <svg
        className={`devtalks-f2 absolute left-[16%] top-[68%] w-[34px] ${strokeClass}`}
        viewBox="0 0 24 24"
        strokeWidth="1.4"
      >
        <path d="M21 12a8 8 0 1 1-3.6-6.67L21 4l-1.2 3.9A7.96 7.96 0 0 1 21 12Z" />
      </svg>
      <svg
        className={`devtalks-f3 absolute right-[12%] top-[22%] w-[40px] ${strokeClass}`}
        viewBox="0 0 24 24"
        strokeWidth="1.4"
      >
        <rect x="3" y="5" width="18" height="15" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 3v4" />
        <path d="M16 3v4" />
      </svg>
      <svg
        className={`devtalks-f4 absolute right-[18%] top-[72%] w-[30px] ${strokeClass}`}
        viewBox="0 0 24 24"
        strokeWidth="1.4"
      >
        <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
        <rect x="2" y="14" width="5" height="7" rx="1.5" />
        <rect x="17" y="14" width="5" height="7" rx="1.5" />
      </svg>
      <svg
        className={`devtalks-f5 absolute left-[5%] top-[46%] w-[26px] ${strokeClass}`}
        viewBox="0 0 24 24"
        strokeWidth="1.4"
      >
        <path d="M12 3v3" />
        <path d="M12 18v3" />
        <path d="M3 12h3" />
        <path d="M18 12h3" />
        <circle cx="12" cy="12" r="4" />
      </svg>
      <svg
        className={`devtalks-f6 absolute right-[6%] top-[40%] w-[24px] ${strokeClass}`}
        viewBox="0 0 24 24"
        strokeWidth="1.4"
      >
        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
      </svg>
    </div>
  );
}
