import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.substring(1);

      const scrollToTarget = () => {
        const element = document.getElementById(targetId);

        if (!element) return;

        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      };

      const timeout = setTimeout(scrollToTarget, 0);

      return () => clearTimeout(timeout);
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname, hash]);

  return null;
};

export default ScrollManager;
