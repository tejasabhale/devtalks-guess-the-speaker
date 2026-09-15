import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Guess", path: "/guess" },
  { label: "About", path: "/about" },
];

const EASE = [0.16, 1, 0.3, 1];

/**
 * Primary site navigation for DevTalks — Guess the Speaker.
 * Sticky, glassmorphic, cinematic orange/black identity.
 *
 * Desktop: logo left, links centered with a sliding active pill,
 *          CTA right. Bar tightens + gains a hairline on scroll.
 * Mobile:  full-screen overlay drawer with staggered links and
 *          a prominent CTA, instead of a cramped inline dropdown.
 */
export default function Navbar() {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Close on outside click.
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
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isMenuOpen]);

  // Close on escape key.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") setIsMenuOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Lock body scroll while the mobile panel is open.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Track scroll to tighten / darken the bar once the page moves.
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 8);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="fixed top-0 left-0 right-0 z-50"
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
          <Logo />

          {/* Mobile-only wordmark, centered independently of the mark above which stays left */}
          <Link
            to="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-semibold tracking-tight text-[var(--color-text-primary)] md:hidden"
          >
            Dev<span className="text-[var(--color-primary)]">Talks</span>
          </Link>

          {/* Desktop links — centered, independent of logo/CTA width */}
          <div className="pointer-events-none absolute inset-x-0 hidden justify-center md:flex">
            <div className="pointer-events-auto">
              <DesktopLinks pathname={pathname} />
            </div>
          </div>

          <div className="hidden items-center md:flex">
            <RegisterButton />
          </div>

          {/* Mobile toggle */}
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

      {/* Mobile full-screen drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-nav-panel"
            initial={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.02, filter: "blur(8px)" }}
            transition={{ duration: 0.35, ease: EASE }}
            className="bg-noir fixed inset-0 z-40 flex flex-col overflow-hidden md:hidden"
          >
            {/* In-panel header: logo + explicit close, mirrors the bar above */}
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
              <Logo onNavigate={() => setIsMenuOpen(false)} />
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] transition-colors duration-200 hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
              >
                <CloseIcon />
              </button>
            </div>

            <MobileLinks pathname={pathname} />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.32, ease: EASE }}
              className="glass mx-6 mb-8 mt-auto rounded-[var(--radius-lg)] p-4"
            >
              <RegisterButton
                fullWidth
                onNavigate={() => setIsMenuOpen(false)}
              />
              <p className="mt-3 text-center text-xs tracking-wide text-[var(--color-text-muted)]">
                DevTalks · Guess the Speaker
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function Logo({ onNavigate }) {
  return (
    <Link
      to="/"
      onClick={onNavigate}
      className="group relative z-10 flex items-center gap-2 transition-transform duration-200 ease-out hover:scale-[1.02]"
    >
      <img
        src="/logo/devkraft.png"
        alt="DevTalks"
        className="h-8 w-auto object-contain drop-shadow-[0_0_10px_rgba(0,0,0,0.35)] transition-opacity duration-200 group-hover:opacity-90"
      />
      <span className="hidden text-xl font-semibold tracking-tight text-[var(--color-text-primary)] md:inline-flex">
        Dev
        <span className="text-[var(--color-primary)] transition-colors duration-200 group-hover:text-[var(--color-primary-light)]">
          Talks
        </span>
      </span>
    </Link>
  );
}

function DesktopLinks({ pathname }) {
  const [hovered, setHovered] = useState(null);

  return (
    <ul
      className="glass flex items-center gap-1 rounded-full p-1"
      onMouseLeave={() => setHovered(null)}
    >
      {NAV_LINKS.map((link) => {
        const isActive = pathname === link.path;
        const isHovered = hovered === link.path;
        return (
          <li key={link.path} className="relative">
            <Link
              to={link.path}
              onMouseEnter={() => setHovered(link.path)}
              className={`relative z-10 block rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "text-[var(--color-text-primary)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {link.label}
            </Link>

            {isActive && (
              <motion.span
                layoutId="active-nav-pill"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-full border border-[var(--color-border-orange)] bg-[var(--color-surface-orange)] shadow-[var(--shadow-orange)]"
              />
            )}
            {!isActive && isHovered && (
              <motion.span
                layoutId="hover-nav-pill"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className="absolute inset-0 rounded-full bg-[var(--color-surface-hover)]"
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

function MobileLinks({ pathname }) {
  return (
    <ul className="flex flex-1 flex-col items-center justify-center divide-y divide-[var(--color-border)] px-6 sm:px-10">
      {NAV_LINKS.map((link, index) => {
        const isActive = pathname === link.path;
        return (
          <motion.li
            key={link.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.1 + index * 0.07,
              ease: EASE,
            }}
            className="w-full text-center"
          >
            <Link
              to={link.path}
              className="group flex flex-col items-center gap-1.5 py-5"
            >
              <span className="font-mono text-xs tracking-widest text-[var(--color-text-muted)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex items-center gap-2">
                <span
                  className={`text-4xl font-semibold tracking-tight transition-colors duration-200 sm:text-5xl ${
                    isActive
                      ? "text-[var(--color-primary-light)]"
                      : "text-[var(--color-text-primary)] group-hover:text-[var(--color-primary-light)]"
                  }`}
                >
                  {link.label}
                </span>
                {isActive && (
                  <span className="h-2 w-2 rounded-full bg-[var(--color-primary)] shadow-[var(--shadow-orange)]" />
                )}
              </span>
            </Link>
          </motion.li>
        );
      })}
    </ul>
  );
}

function RegisterButton({ fullWidth = false, onNavigate }) {
  return (
    <Link
      to="/"
      onClick={onNavigate}
      className={`group relative inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--color-border-orange)] bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-text-dark)] shadow-[var(--shadow-orange)] transition-all duration-200 hover:bg-[var(--color-primary-light)] hover:shadow-[0_0_50px_rgba(255,90,31,0.4)] ${
        fullWidth ? "w-full py-4 text-base" : ""
      }`}
    >
      Register
      <svg
        className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
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
    </Link>
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
        transition={{ duration: 0.25, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute left-0 top-1/2 h-[1.5px] w-5 -translate-y-1/2 rounded-full bg-current"
        animate={{ opacity: isOpen ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.span
        className="absolute bottom-0 left-0 h-[1.5px] w-5 rounded-full bg-current"
        animate={{
          rotate: isOpen ? -45 : 0,
          y: isOpen ? -7 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      />
    </span>
  );
}
