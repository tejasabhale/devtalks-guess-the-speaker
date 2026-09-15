import { useEffect } from "react";
import Hero from "../../components/home/Hero";

const Home = () => {
  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });

      return;
    }

    const scrollToSection = () => {
      const element = document.querySelector(hash);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    const timeout = setTimeout(scrollToSection, 150);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <main>
      <div id="home" className="scroll-mt-24">
        <Hero />
      </div>
    </main>
  );
};

export default Home;
