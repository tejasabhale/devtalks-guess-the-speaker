import { useEffect, useState } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import AppRoutes from "./routes/AppRoutes";
import Loader from "./components/common/Loader";

gsap.registerPlugin(ScrollTrigger);

function LenisGSAPConnector() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const update = (time) => {
      lenis.raf(time * 1000);
    };

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(update);
    };
  }, [lenis]);

  return null;
}

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <Loader onComplete={() => setLoading(false)} />;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        autoRaf: false,
      }}
    >
      <LenisGSAPConnector />
      <AppRoutes />
    </ReactLenis>
  );
}

export default App;
