import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", path: "/", hash: "", sectionId: "home" },
  { label: "Guess", path: "/", hash: "#guess", sectionId: "guess" },
  { label: "About", path: "/", hash: "#about", sectionId: "about" },
];

const EASE = [0.16, 1, 0.3, 1];

/*
 * DevTalks brand font:
 * Sora 800 -> DevTalks wordmark
 *
 * Mobile navigation:
 * Space Grotesk 700 -> Home / Guess / About
 */
const BRAND_FONT_ID = "devtalks-brand-font";

const BRAND_FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap";

function useBrandFonts() {
  useEffect(() => {
    if (document.getElementById(BRAND_FONT_ID)) return;

    const link = document.createElement("link");

    link.id = BRAND_FONT_ID;
    link.rel = "stylesheet";
    link.href = BRAND_FONT_HREF;

    document.head.appendChild(link);
  }, []);
}

const WORDMARK_STYLE = {
  fontFamily: "'Sora', sans-serif",
  fontWeight: 800,
  letterSpacing: "-0.045em",
};

const MOBILE_NAV_STYLE = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 700,
  letterSpacing: "-0.03em",
};

export default function Navbar() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  useBrandFonts();

  /*
   * Close mobile menu whenever the URL changes.
   */
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname, hash]);

  /*
   * Navbar scroll state.
   */
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 8);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /*
   * Scroll spy.
   *
   * Detects the section currently occupying the page.
   */
  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.getElementById(link.sectionId),
    ).filter(Boolean);

    if (!sections.length) return;

    let ticking = false;

    function updateActiveSection() {
      const navbarOffset = 100;
      let currentSection = "home";

      for (const section of sections) {
        const rect = section.getBoundingClientRect();

        if (rect.top <= navbarOffset) {
          currentSection = section.id;
        }
      }

      setActiveSection((previous) =>
        previous === currentSection ? previous : currentSection,
      );

      ticking = false;
    }

    function handleScrollSpy() {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    }

    updateActiveSection();

    window.addEventListener("scroll", handleScrollSpy, {
      passive: true,
    });

    window.addEventListener("resize", handleScrollSpy);

    return () => {
      window.removeEventListener("scroll", handleScrollSpy);
      window.removeEventListener("resize", handleScrollSpy);
    };
  }, [pathname]);

  /*
   * Sync active state with URL hash.
   */
  useEffect(() => {
    if (hash) {
      const sectionId = hash.replace("#", "");

      const exists = NAV_LINKS.some((link) => link.sectionId === sectionId);

      if (exists) {
        setActiveSection(sectionId);
      }
    } else if (pathname === "/" && window.scrollY < 100) {
      setActiveSection("home");
    }
  }, [hash, pathname]);

  /*
   * Single-page section navigation.
   */
  function handleNavClick(link) {
    setIsMenuOpen(false);

    /*
     * Home.
     */
    if (link.sectionId === "home") {
      window.history.replaceState(null, "", "/");

      setActiveSection("home");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    /*
     * Find section.
     */
    const section = document.getElementById(link.sectionId);

    if (!section) {
      navigate(`${link.path}${link.hash}`);
      return;
    }

    /*
     * Immediately activate clicked item.
     */
    setActiveSection(link.sectionId);

    /*
     * Update URL hash.
     */
    window.history.pushState(null, "", `${link.path}${link.hash}`);

    /*
     * Smooth scroll.
     */
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  /*
   * Close mobile menu on outside click.
   */
  useEffect(() => {
    function handlePointerDown(event) {
      if (!isMenuOpen) return;

      const clickedMenu = menuRef.current?.contains(event.target);

      const clickedToggle = toggleRef.current?.contains(event.target);

      if (!clickedMenu && !clickedToggle) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isMenuOpen]);

  /*
   * Escape closes mobile menu.
   */
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /*
   * Lock body scrolling while mobile menu is open.
   */
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <motion.header
        initial={{
          y: -24,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          ease: EASE,
        }}
        className="fixed left-0 right-0 top-0 z-50"
      >
        <nav
          className={`border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 ${
            isScrolled
              ? "border-[var(--color-border)] bg-[var(--color-bg-primary)]/85 shadow-[var(--shadow-card)]"
              : "border-transparent bg-[var(--color-bg-primary)]/40"
          }`}
          aria-label="Primary"
        >
          <div
            className={`relative mx-auto flex max-w-7xl items-center justify-between px-4 transition-[height] duration-300 sm:px-6 lg:px-8 ${
              isScrolled ? "h-14" : "h-16"
            }`}
          >
            <Logo onNavigate={() => handleNavClick(NAV_LINKS[0])} />

            {/* Mobile centered DevTalks wordmark */}
            <button
              type="button"
              onClick={() => handleNavClick(NAV_LINKS[0])}
              style={WORDMARK_STYLE}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[21px] text-[var(--color-text-primary)] md:hidden"
            >
              Dev
              <span className="text-[var(--color-primary)]">Talks</span>
            </button>

            {/* Desktop navigation */}
            <div className="pointer-events-none absolute inset-x-0 hidden justify-center md:flex">
              <div className="pointer-events-auto">
                <DesktopLinks
                  activeSection={activeSection}
                  onNavigate={handleNavClick}
                />
              </div>
            </div>

            {/* Animated Register button */}
            <div className="hidden items-center md:flex">
              <RegisterButton onNavigate={() => handleNavClick(NAV_LINKS[0])} />
            </div>

            {/* Mobile menu toggle */}
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-panel"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="relative z-10 flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-primary)] transition-colors duration-200 hover:bg-[var(--color-surface-hover)] md:hidden"
            >
              <HamburgerIcon isOpen={isMenuOpen} />
            </button>
          </div>
        </nav>

        {/* Mobile full-screen menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              id="mobile-nav-panel"
              initial={{
                opacity: 0,
                scale: 1.02,
                filter: "blur(8px)",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                scale: 1.02,
                filter: "blur(8px)",
              }}
              transition={{
                duration: 0.35,
                ease: EASE,
              }}
              className="bg-noir fixed inset-0 z-40 flex flex-col overflow-hidden md:hidden"
            >
              <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                <Logo onNavigate={() => handleNavClick(NAV_LINKS[0])} />

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                  className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] transition-colors duration-200 hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
                >
                  <CloseIcon />
                </button>
              </div>

              <MobileLinks
                activeSection={activeSection}
                onNavigate={handleNavClick}
              />

              <motion.div
                initial={{
                  opacity: 0,
                  y: 16,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
                  delay: 0.32,
                  ease: EASE,
                }}
                className="glass mx-6 mb-8 mt-auto rounded-[var(--radius-lg)] p-4"
              >
                <RegisterButton
                  fullWidth
                  onNavigate={() => handleNavClick(NAV_LINKS[0])}
                />

                <p className="mt-3 text-center text-xs tracking-wide text-[var(--color-text-muted)]">
                  DevTalks · Guess the Speaker
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Register button animations */}
      <style>{`
        @keyframes devtalks-nav-btn-sheen {
          0% {
            transform: translateX(-150%) skewX(-18deg);
          }

          100% {
            transform: translateX(260%) skewX(-18deg);
          }
        }

        @keyframes devtalks-nav-btn-ring {
          0% {
            transform: scale(0.94);
            opacity: 0.55;
          }

          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }

        .devtalks-nav-btn-sheen {
          animation: devtalks-nav-btn-sheen 3.4s ease-in-out infinite;
        }

        .devtalks-nav-btn-ring {
          animation: devtalks-nav-btn-ring 2.4s
            cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }

        .devtalks-register-btn:hover {
          box-shadow:
            0 0 40px color-mix(
              in srgb,
              var(--color-primary) 32%,
              transparent
            );
        }

        @media (prefers-reduced-motion: reduce) {
          .devtalks-nav-btn-sheen,
          .devtalks-nav-btn-ring {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </>
  );
}

function Logo({ onNavigate }) {
  return (
    <button
      type="button"
      onClick={onNavigate}
      className="group relative z-10 flex items-center gap-2 transition-transform duration-200 ease-out hover:scale-[1.02]"
    >
      <img
        src="/logo/devkraft.png"
        alt="DevTalks"
        className="h-8 w-auto object-contain drop-shadow-[0_0_10px_rgba(0,0,0,0.35)] transition-opacity duration-200 group-hover:opacity-90"
      />

      {/* Desktop wordmark */}
      <span
        style={WORDMARK_STYLE}
        className="hidden text-[21px] text-[var(--color-text-primary)] md:inline-flex"
      >
        Dev
        <span className="text-[var(--color-primary)] transition-colors duration-200 group-hover:text-[var(--color-primary-light)]">
          Talks
        </span>
      </span>
    </button>
  );
}

function DesktopLinks({ activeSection, onNavigate }) {
  const [hovered, setHovered] = useState(null);

  return (
    <ul
      className="glass flex items-center gap-1 rounded-full p-1"
      onMouseLeave={() => setHovered(null)}
    >
      {NAV_LINKS.map((link) => {
        const isActive = activeSection === link.sectionId;

        const isHovered = hovered === link.sectionId;

        return (
          <li key={link.sectionId} className="relative">
            <button
              type="button"
              onClick={() => onNavigate(link)}
              onMouseEnter={() => setHovered(link.sectionId)}
              className={`relative z-10 block rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "text-[var(--color-text-primary)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {link.label}
            </button>

            {isActive && (
              <motion.span
                layoutId="active-nav-pill"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 32,
                }}
                className="absolute inset-0 rounded-full border border-[var(--color-border-orange)] bg-[var(--color-surface-orange)] shadow-[var(--shadow-orange)]"
              />
            )}

            {!isActive && isHovered && (
              <motion.span
                layoutId="hover-nav-pill"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                }}
                className="absolute inset-0 rounded-full bg-[var(--color-surface-hover)]"
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

function MobileLinks({ activeSection, onNavigate }) {
  return (
    <ul className="flex flex-1 flex-col items-center justify-center divide-y divide-[var(--color-border)] px-6 sm:px-10">
      {NAV_LINKS.map((link, index) => {
        const isActive = activeSection === link.sectionId;

        return (
          <motion.li
            key={link.sectionId}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.4,
              delay: 0.1 + index * 0.07,
              ease: EASE,
            }}
            className="w-full text-center"
          >
            <button
              type="button"
              onClick={() => onNavigate(link)}
              className="group flex w-full flex-col items-center gap-1.5 py-5"
            >
              <span className="font-mono text-xs tracking-widest text-[var(--color-text-muted)]">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span
                style={MOBILE_NAV_STYLE}
                className={`text-4xl transition-colors duration-200 sm:text-5xl ${
                  isActive
                    ? "text-[var(--color-primary-light)]"
                    : "text-[var(--color-text-primary)] group-hover:text-[var(--color-primary-light)]"
                }`}
              >
                {link.label}
              </span>
            </button>
          </motion.li>
        );
      })}
    </ul>
  );
}

function RegisterButton({ fullWidth = false, onNavigate }) {
  return (
    <button
      type="button"
      onClick={onNavigate}
      className={`devtalks-register-btn group relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border-orange)] px-4 py-2 text-sm font-semibold text-white outline-none transition-all duration-300 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[var(--color-primary-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] active:translate-y-0 ${
        fullWidth ? "w-full py-4 text-base" : ""
      }`}
      style={{
        backgroundImage:
          "linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 60%, var(--color-primary) 100%)",
      }}
    >
      {/* Pulsing outer ring */}
      <span className="devtalks-nav-btn-ring pointer-events-none absolute inset-0 rounded-[var(--radius-md)] border border-[var(--color-primary-light)]" />

      {/* Sweeping sheen */}
      <span
        className="devtalks-nav-btn-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3 opacity-60"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
        }}
      />

      {/* Button content */}
      <span className="relative text-white">Register</span>

      <svg
        className="relative h-3.5 w-3.5 text-white transition-transform duration-300 group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M14 5l7 7m0 0l-7 7m7-7H3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </button>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        d="M6 18L18 6M6 6l12 12"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function HamburgerIcon({ isOpen }) {
  return (
    <span className="relative block h-4 w-5">
      <motion.span
        className="absolute left-0 top-0 h-[1.5px] w-5 rounded-full bg-current"
        animate={{
          rotate: isOpen ? 45 : 0,
          y: isOpen ? 7 : 0,
        }}
        transition={{
          duration: 0.25,
          ease: "easeInOut",
        }}
      />

      <motion.span
        className="absolute left-0 top-1/2 h-[1.5px] w-5 -translate-y-1/2 rounded-full bg-current"
        animate={{
          opacity: isOpen ? 0 : 1,
        }}
        transition={{
          duration: 0.15,
        }}
      />

      <motion.span
        className="absolute bottom-0 left-0 h-[1.5px] w-5 rounded-full bg-current"
        animate={{
          rotate: isOpen ? -45 : 0,
          y: isOpen ? -7 : 0,
        }}
        transition={{
          duration: 0.25,
          ease: "easeInOut",
        }}
      />
    </span>
  );
}
