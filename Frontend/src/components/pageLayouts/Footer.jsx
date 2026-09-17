import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/*
 * DevTalks brand font
 * Same Sora font used in the Navbar.
 */
const WORDMARK_FONT_ID = "devtalks-wordmark-font";

const WORDMARK_FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&display=swap";

const WORDMARK_FONT_CLASS = "font-['Sora']";

function useWordmarkFont() {
  useEffect(() => {
    if (document.getElementById(WORDMARK_FONT_ID)) return;

    const link = document.createElement("link");
    link.id = WORDMARK_FONT_ID;
    link.rel = "stylesheet";
    link.href = WORDMARK_FONT_HREF;

    document.head.appendChild(link);
  }, []);
}

/* Social links */
const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/devkraft.dpu",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle
          cx="12"
          cy="12"
          r="4.2"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="17.35" cy="6.65" r="1.1" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/devkraftclub",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <path
          d="M4 4l7.2 9.4L4.3 20h2.1l6.02-5.86L16.9 20H20l-7.55-9.86L19.4 4h-2.1l-5.53 5.4L7.1 4H4z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/dev-kraft",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="3"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M7.5 10v6.5M7.5 7.5v.01M11.5 16.5V13c0-1.4.9-2.4 2.2-2.4 1.3 0 2 .9 2 2.4v3.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const SOCIAL_GROUP_VARIANTS = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const SOCIAL_ITEM_VARIANTS = {
  hidden: {
    opacity: 0,
    y: 6,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

function SocialLinks({ className = "" }) {
  return (
    <motion.div
      className={`flex items-center gap-3.5 sm:gap-4 ${className}`}
      variants={SOCIAL_GROUP_VARIANTS}
      initial="hidden"
      animate="visible"
    >
      {SOCIAL_LINKS.map(({ name, href, icon }) => (
        <motion.a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          variants={SOCIAL_ITEM_VARIANTS}
          whileHover="hover"
          whileTap={{ scale: 0.9 }}
          initial="rest"
          animate="rest"
          className="
            group/social
            relative
            flex
            h-9
            w-9
            shrink-0
            items-center
            justify-center
            rounded-full
            text-[var(--color-text-muted)]
            sm:h-8
            sm:w-8
          "
        >
          {/* Hover glow */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[var(--color-primary)]"
            variants={{
              rest: {
                opacity: 0,
                scale: 0.6,
              },
              hover: {
                opacity: 0.12,
                scale: 1,
              },
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
          />

          {/* Hover ring */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border"
            variants={{
              rest: {
                opacity: 0,
                scale: 0.82,
              },
              hover: {
                opacity: 1,
                scale: 1,
              },
            }}
            transition={{
              duration: 0.28,
              ease: "easeOut",
            }}
            style={{
              borderColor: "var(--color-primary)",
            }}
          />

          {/* Icon */}
          <motion.span
            className="relative block h-[17px] w-[17px] sm:h-[18px] sm:w-[18px]"
            variants={{
              rest: {
                color: "var(--color-text-muted)",
                scale: 1,
                rotate: 0,
              },
              hover: {
                color: "var(--color-primary)",
                scale: 1.1,
                rotate: -4,
              },
            }}
            transition={{
              duration: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {icon}
          </motion.span>
        </motion.a>
      ))}
    </motion.div>
  );
}

export default function Footer() {
  useWordmarkFont();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="
        relative
        w-full
        overflow-hidden
        border-t
        border-[var(--color-border)]
        bg-[#080808]
      "
    >
      {/* Background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        aria-hidden="true"
        style={{
          backgroundImage: `
            radial-gradient(
              circle at 1px 1px,
              rgba(244, 240, 232, 0.8) 0.8px,
              transparent 0.9px
            )
          `,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top accent */}
      <motion.div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-px
          w-[68%]
          -translate-x-1/2
          bg-gradient-to-r
          from-transparent
          via-[var(--color-primary)]/35
          to-transparent
          sm:w-[55%]
        "
        animate={{
          opacity: [0.25, 0.5, 0.25],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Desktop signal */}
      <motion.div
        className="
          pointer-events-none
          absolute
          left-[-15%]
          top-1/2
          hidden
          h-px
          w-40
          bg-gradient-to-r
          from-transparent
          via-[var(--color-primary)]/20
          to-transparent
          sm:block
        "
        animate={{
          x: ["0%", "850%"],
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatDelay: 4,
          ease: "linear",
        }}
      />

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1600px]
          px-4
          py-6

          sm:px-6
          sm:py-6

          md:px-8

          lg:grid
          lg:grid-cols-[1fr_auto_1fr]
          lg:items-center
          lg:gap-6
          lg:px-8
          lg:py-6

          xl:px-10
        "
      >
        {/* =====================================================
            MOBILE / TABLET
            ===================================================== */}
        <div className="flex flex-col items-center lg:hidden">
          {/* Top row */}
          <div className="flex items-center justify-center">
            <Link
              to="/"
              className="group flex shrink-0 items-center"
              aria-label="DevKraft home"
            >
              <img
                src="/logo/devkraft.png"
                alt="DevTalks"
                className="
                  h-6
                  w-auto
                  object-contain
                  transition-opacity
                  duration-200
                  group-hover:opacity-90
                  sm:h-7
                "
              />
            </Link>

            <span
              aria-hidden="true"
              className="
                mx-3
                h-4
                w-px
                bg-[var(--color-border)]
                sm:mx-3.5
                sm:h-5
              "
            />

            <Link
              to="/"
              className={`
                ${WORDMARK_FONT_CLASS}
                group/wordmark
                relative
                text-[17px]
                font-extrabold
                leading-none
                tracking-[-0.04em]
                text-[var(--color-text-primary)]
                sm:text-lg
              `}
            >
              <motion.span
                className="relative inline-block"
                whileHover="hover"
                initial="rest"
                animate="rest"
              >
                <motion.span
                  variants={{
                    rest: { opacity: 1 },
                    hover: { opacity: 0.9 },
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Dev
                  <span className="text-[var(--color-primary)]">Talks</span>
                </motion.span>

                <motion.span
                  aria-hidden="true"
                  className="
                    absolute
                    -bottom-1
                    left-0
                    h-px
                    w-full
                    origin-center
                    bg-gradient-to-r
                    from-transparent
                    via-[var(--color-primary)]
                    to-transparent
                  "
                  variants={{
                    rest: {
                      scaleX: 0,
                      opacity: 0,
                    },
                    hover: {
                      scaleX: 1,
                      opacity: 0.8,
                    },
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </motion.span>
            </Link>
          </div>

          {/* Subtle divider */}
          <span
            aria-hidden="true"
            className="
              my-5
              h-px
              w-14
              bg-[var(--color-border)]
              sm:my-5
              sm:w-16
            "
          />

          {/* Socials */}
          <SocialLinks />

          {/* Credit */}
          <p
            className="
              mt-4
              text-[10px]
              font-medium
              tracking-[0.01em]
              text-[var(--color-text-muted)]
              sm:mt-4
              sm:text-xs
            "
          >
            Built by Team DevKraft
          </p>
        </div>

        {/* =====================================================
            DESKTOP
            ===================================================== */}

        {/* Logo */}
        <div className="hidden lg:flex lg:w-auto lg:justify-start">
          <Link
            to="/"
            className="group inline-flex shrink-0 items-center"
            aria-label="DevKraft home"
          >
            <img
              src="/logo/devkraft.png"
              alt="DevTalks"
              className="
                h-7
                w-auto
                object-contain
                transition-opacity
                duration-200
                group-hover:opacity-90
              "
            />
          </Link>
        </div>

        {/* Wordmark */}
        <div className="hidden lg:flex lg:w-full lg:justify-center">
          <Link
            to="/"
            className={`
              ${WORDMARK_FONT_CLASS}
              group/wordmark
              inline-block
              text-xl
              font-extrabold
              leading-none
              tracking-[-0.04em]
              text-[var(--color-text-primary)]
            `}
          >
            <motion.span
              className="relative inline-block"
              whileHover="hover"
              initial="rest"
              animate="rest"
            >
              <motion.span
                variants={{
                  rest: { opacity: 1 },
                  hover: { opacity: 0.9 },
                }}
                transition={{ duration: 0.2 }}
              >
                Dev
                <span className="text-[var(--color-primary)]">Talks</span>
              </motion.span>

              <motion.span
                aria-hidden="true"
                className="
                  absolute
                  -bottom-1
                  left-0
                  h-px
                  w-full
                  origin-center
                  bg-gradient-to-r
                  from-transparent
                  via-[var(--color-primary)]
                  to-transparent
                "
                variants={{
                  rest: {
                    scaleX: 0,
                    opacity: 0,
                  },
                  hover: {
                    scaleX: 1,
                    opacity: 0.8,
                  },
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </motion.span>
          </Link>
        </div>

        {/* Socials + credit */}
        <div
          className="
            hidden
            lg:flex
            lg:w-auto
            lg:flex-row
            lg:items-center
            lg:justify-end
            lg:gap-4
          "
        >
          <SocialLinks />

          <span
            aria-hidden="true"
            className="h-4 w-px bg-[var(--color-border)]"
          />

          <p
            className="
              shrink-0
              whitespace-nowrap
              text-sm
              text-[var(--color-text-muted)]
              transition-colors
              duration-200
              hover:text-[var(--color-primary)]/80
            "
          >
            Built by Team DevKraft
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
