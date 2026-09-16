import React from "react";
import Landing from "../landing/Landing";
import Guess from "../guess/Guess";
import About from "../about/About";
import SectionDivider from "../../components/common/SectionDivider";

const Home = () => {
  return (
    <div>
      <Landing />
      <SectionDivider
        fromColor="var(--color-app-bg)"
        toColor="var(--color-app-bg-secondary)"
      />
      <Guess />
      <SectionDivider
        fromColor="var(--color-app-bg)"
        toColor="var(--color-app-bg-secondary)"
      />
      <About />
    </div>
  );
};

export default Home;
