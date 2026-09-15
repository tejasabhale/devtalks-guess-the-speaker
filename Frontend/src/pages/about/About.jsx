import AboutHero from "../../components/about/AboutHero";
import AboutClub from "../../components/about/AboutClub";
import AboutDevTalks from "../../components/about/AboutDevTalks";
import AboutCTA from "../../components/about/AboutCTA";

export default function About() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <AboutHero />
      <AboutClub />
      <AboutDevTalks />
      <AboutCTA />
    </main>
  );
}
