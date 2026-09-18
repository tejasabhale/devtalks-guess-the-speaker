import GuessHero from "../../components/guess/GuessHero";
import SpeakerReveal from "../../components/guess/SpeakerReveal";
import SpeakerTeaserReveal from "../../components/guess/SpeakerTeaserReveal";
import "./guess.css";

export default function Guess() {
  return (
    <main className="bg-app-bg" id="guess">
      <GuessHero />
      <SpeakerTeaserReveal />
      <SpeakerReveal />
    </main>
  );
}
