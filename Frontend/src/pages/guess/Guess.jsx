import GuessHero from "../../components/guess/GuessHero";
import GuessSpeakers from "../../components/guess/GuessSpeaker";

export default function Guess() {
  return (
    <main className="bg-app-bg">
      <GuessHero />
      <GuessSpeakers />

      {/* Shared animations for this page. Move these into your global
          stylesheet alongside the existing tokens if you'd rather not
          ship a <style> tag with the component. */}
      <style>{`
        @keyframes grid-drift {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 56px 56px, 56px 56px; }
        }
        .animate-grid-drift {
          animation: grid-drift 14s linear infinite;
        }

        @keyframes scan {
          0% { transform: translateY(-100%); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(600%); opacity: 0; }
        }
        .scan-line {
          background: linear-gradient(
            180deg,
            transparent,
            rgba(255, 138, 61, 0.35),
            transparent
          );
          animation: scan 3.4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-grid-drift,
          .scan-line {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
