import GuessHero from "../../components/guess/GuessHero";
import GuessSpeakers from "../../components/guess/GuessSpeaker";
import './guess.css'

export default function Guess() {
  return (
    <main className="bg-app-bg" id="guess">
      <GuessHero />
      <GuessSpeakers />
    </main>
  );
}
