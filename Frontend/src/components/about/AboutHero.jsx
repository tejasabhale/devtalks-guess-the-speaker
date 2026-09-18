import { useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Canvas 2D's fillStyle/strokeStyle can't parse `var(--color-x)`.
 * Read the real computed CSS token, convert hex -> "r, g, b",
 * and use that value inside the canvas.
 */
function hexToRgbTriplet(hex, fallback) {
  const match = hex.trim().match(/^#([0-9a-f]{6})$/i);

  if (!match) return fallback;

  const int = parseInt(match[1], 16);

  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;

  return `${r}, ${g}, ${b}`;
}

function readColorToken(varName, fallback) {
  if (typeof window === "undefined") return fallback;

  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();

  if (!raw) return fallback;

  return hexToRgbTriplet(raw, fallback);
}

function useNetworkMesh(canvasRef, sectionRef, reduceMotion) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;

    if (!canvas || !section) return;

    const nodeRgb = readColorToken("--color-primary-light", "255, 148, 90");

    const linkRgb = readColorToken("--color-primary", "255, 122, 69");

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes = [];
    let animationId = null;

    const pointer = {
      x: 0,
      y: 0,
      active: false,
    };

    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    function makeNode() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 1.3 + Math.random() * 1.5,
      };
    }

    function resize() {
      const rect = section.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = width * height;

      const target = Math.round(Math.min(85, Math.max(24, area / 17000)));

      const next = [];

      for (let i = 0; i < target; i++) {
        next.push(nodes[i] || makeNode());
      }

      nodes = next;
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      const linkDistance = width < 640 ? 85 : 125;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;

          const dist = Math.hypot(dx, dy);

          if (dist < linkDistance) {
            const opacity = (1 - dist / linkDistance) * 0.32;

            ctx.strokeStyle = `rgba(${linkRgb}, ${opacity})`;

            ctx.lineWidth = 1;

            ctx.beginPath();

            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);

            ctx.stroke();
          }
        }

        if (pointer.active) {
          const dx = nodes[i].x - pointer.x;

          const dy = nodes[i].y - pointer.y;

          const dist = Math.hypot(dx, dy);

          if (dist < 150) {
            const opacity = (1 - dist / 150) * 0.45;

            ctx.strokeStyle = `rgba(${nodeRgb}, ${opacity})`;

            ctx.lineWidth = 1;

            ctx.beginPath();

            ctx.moveTo(nodes[i].x, nodes[i].y);

            ctx.lineTo(pointer.x, pointer.y);

            ctx.stroke();
          }
        }
      }

      for (const node of nodes) {
        ctx.beginPath();

        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(${nodeRgb}, 0.85)`;

        ctx.fill();
      }
    }

    function tick() {
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) {
          node.vx *= -1;
        }

        if (node.y < 0 || node.y > height) {
          node.vy *= -1;
        }

        if (pointer.active) {
          const dx = node.x - pointer.x;

          const dy = node.y - pointer.y;

          const dist = Math.hypot(dx, dy);

          const radius = 120;

          if (dist < radius && dist > 0.01) {
            const force = ((radius - dist) / radius) * 1.4;

            node.x += (dx / dist) * force;

            node.y += (dy / dist) * force;
          }
        }
      }

      draw();

      animationId = requestAnimationFrame(tick);
    }

    function handleMove(event) {
      const rect = section.getBoundingClientRect();

      pointer.x = event.clientX - rect.left;

      pointer.y = event.clientY - rect.top;

      pointer.active = true;
    }

    function handleLeave() {
      pointer.active = false;
    }

    resize();

    window.addEventListener("resize", resize);

    if (reduceMotion) {
      draw();
    } else {
      if (finePointer) {
        section.addEventListener("mousemove", handleMove);

        section.addEventListener("mouseleave", handleLeave);
      }

      animationId = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener("resize", resize);

      section.removeEventListener("mousemove", handleMove);

      section.removeEventListener("mouseleave", handleLeave);

      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [canvasRef, sectionRef, reduceMotion]);
}

/**
 * Scroll-driven animation.
 *
 * Lenis is handled globally in App.jsx.
 * ScrollTrigger follows the global Lenis scroll position.
 *
 * The important part is `scrub`:
 *
 * Scroll down -> animation moves forward.
 * Scroll up   -> animation moves backward.
 *
 * This makes the whole section feel continuous instead of
 * behaving like a one-time entrance animation.
 */
function useScrollAnimations(
  sectionRef,
  contentRef,
  canvasRef,
  washRef,
  indicatorRef,
  reduceMotion,
) {
  useLayoutEffect(() => {
    if (reduceMotion) return;

    const section = sectionRef.current;
    const content = contentRef.current;
    const canvas = canvasRef.current;
    const wash = washRef.current;
    const indicator = indicatorRef.current;

    if (!section || !content) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 768px)",
          mobile: "(max-width: 767px)",
        },
        (context) => {
          const { desktop } = context.conditions;

          const contentDistance = desktop ? -145 : -75;

          const canvasDistance = desktop ? 65 : 32;

          const timelineEnd = "bottom top";

          /*
           * =====================================================
           * REVEAL
           * =====================================================
           */

          const revealElements = gsap.utils.toArray(
            "[data-about-reveal]",
            content,
          );

          if (revealElements.length) {
            gsap.set(revealElements, {
              opacity: 0,
              y: desktop ? 45 : 30,
              filter: "blur(10px)",
            });

            const revealTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 88%",
                end: "top 35%",
                scrub: 1.15,
                invalidateOnRefresh: true,
              },
            });

            revealTimeline.to(revealElements, {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              ease: "none",
              stagger: 0.08,
            });
          }

          /*
           * =====================================================
           * MAIN PARALLAX
           * =====================================================
           */

          const parallaxTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 96%",
              end: timelineEnd,
              scrub: 1.35,
              invalidateOnRefresh: true,
            },
          });

          parallaxTimeline
            .fromTo(
              content,
              {
                y: 40,
                scale: 0.985,
              },
              {
                y: contentDistance,
                scale: desktop ? 0.95 : 0.97,
                ease: "none",
                duration: 1,
              },
              0,
            )
            .fromTo(
              canvas,
              {
                y: 0,
                scale: 1,
                opacity: 1,
              },
              {
                y: canvasDistance,
                scale: desktop ? 1.08 : 1.04,
                opacity: 0.68,
                ease: "none",
                duration: 1,
              },
              0,
            )
            .fromTo(
              wash,
              {
                scale: 1,
                opacity: 0.58,
              },
              {
                scale: 1.17,
                opacity: 0.82,
                ease: "none",
                duration: 1,
              },
              0,
            );

          /*
           * =====================================================
           * HEADING
           * =====================================================
           */

          const headline = content.querySelector("[data-about-title]");

          if (headline) {
            gsap.fromTo(
              headline,
              {
                y: 0,
                scale: 1,
                letterSpacing: desktop ? "-0.055em" : "-0.05em",
              },
              {
                y: desktop ? -25 : -16,
                scale: desktop ? 0.97 : 0.985,
                letterSpacing: desktop ? "-0.07em" : "-0.06em",
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top 92%",
                  end: timelineEnd,
                  scrub: 1.25,
                  invalidateOnRefresh: true,
                },
              },
            );
          }

          /*
           * =====================================================
           * DESCRIPTION
           * =====================================================
           */

          const description = content.querySelector("[data-about-description]");

          if (description) {
            gsap.fromTo(
              description,
              {
                y: 0,
              },
              {
                y: desktop ? -18 : -12,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top 90%",
                  end: timelineEnd,
                  scrub: 1.3,
                  invalidateOnRefresh: true,
                },
              },
            );
          }

          /*
           * =====================================================
           * ACTIONS
           * =====================================================
           */

          const actions = content.querySelector("[data-about-actions]");

          if (actions) {
            gsap.fromTo(
              actions,
              {
                y: 0,
                scale: 1,
              },
              {
                y: desktop ? -14 : -9,
                scale: desktop ? 0.985 : 0.99,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top 88%",
                  end: timelineEnd,
                  scrub: 1.35,
                  invalidateOnRefresh: true,
                },
              },
            );
          }

          /*
           * =====================================================
           * SCROLL INDICATOR
           * =====================================================
           */

          if (indicator) {
            gsap.fromTo(
              indicator,
              {
                scaleX: 1,
                opacity: 1,
              },
              {
                scaleX: 0,
                opacity: 0,
                transformOrigin: "center center",
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top top",
                  end: "32% top",
                  scrub: 1.1,
                  invalidateOnRefresh: true,
                },
              },
            );
          }

          /*
           * =====================================================
           * EXTRA CANVAS DEPTH
           * =====================================================
           */

          if (canvas) {
            gsap.fromTo(
              canvas,
              {
                x: 0,
              },
              {
                x: desktop ? 18 : 8,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top top",
                  end: timelineEnd,
                  scrub: 1.4,
                  invalidateOnRefresh: true,
                },
              },
            );
          }

          /*
           * =====================================================
           * REFRESH
           * =====================================================
           */

          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
          });

          return () => {};
        },
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [sectionRef, contentRef, canvasRef, washRef, indicatorRef, reduceMotion]);
}

export default function AboutHero() {
  const reduceMotion = useReducedMotion();

  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const washRef = useRef(null);
  const indicatorRef = useRef(null);

  useNetworkMesh(canvasRef, sectionRef, Boolean(reduceMotion));

  useScrollAnimations(
    sectionRef,
    contentRef,
    canvasRef,
    washRef,
    indicatorRef,
    Boolean(reduceMotion),
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative isolate flex min-h-screen w-full items-center overflow-hidden bg-[var(--color-bg)] px-6 py-24 sm:py-28"
    >
      {/* =====================================================
          ATMOSPHERIC WASH
      ====================================================== */}

      <div
        className="pointer-events-none absolute inset-0 -z-20"
        aria-hidden="true"
      >
        <div
          ref={washRef}
          className="absolute inset-0 bg-radial-orange will-change-transform"
        />
      </div>

      {/* =====================================================
          NETWORK CANVAS
      ====================================================== */}

      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 -z-10 will-change-transform"
        aria-hidden="true"
      />

      {/* =====================================================
          FOCUS GRADIENT
      ====================================================== */}

      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--color-bg) 0%, var(--color-bg) 30%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        ref={contentRef}
        className="relative z-10 mx-auto w-full max-w-5xl px-0 will-change-transform sm:px-4"
      >
        <div className="flex flex-col items-center text-center">
          {/* =================================================
              EYEBROW
          ================================================== */}

          <div
            data-about-reveal
            className="mb-7 inline-flex w-fit items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2 backdrop-blur-xl sm:px-4"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-primary)] shadow-[0_0_12px_var(--color-primary)]" />

            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)] sm:text-[10px] md:text-xs">
              DevKraft Club
            </span>
          </div>

          {/* =================================================
              TITLE
          ================================================== */}

          <h1
            data-about-title
            data-about-reveal
            className="max-w-4xl bg-gradient-to-r from-[var(--color-text-primary)] via-[var(--color-text-primary)] to-[var(--color-primary-light)] bg-clip-text text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-transparent sm:text-6xl md:text-7xl lg:text-[5.25rem] will-change-transform"
          >
            Where developers build.
          </h1>

          {/* =================================================
              DESCRIPTION
          ================================================== */}

          <p
            data-about-description
            data-about-reveal
            className="mt-5 max-w-md text-sm leading-relaxed text-[var(--color-text-secondary)] will-change-transform sm:mt-6 sm:text-base md:text-lg"
          >
            One community. Learn, build, ship.
          </p>

          {/* =================================================
              ACTIONS
          ================================================== */}

          <div
            data-about-actions
            data-about-reveal
            className="mt-8 flex w-full flex-col items-center gap-3 will-change-transform sm:mt-10 sm:w-auto sm:flex-row"
          >
            <motion.div
              whileHover={
                reduceMotion
                  ? {}
                  : {
                      y: -2,
                    }
              }
              whileTap={
                reduceMotion
                  ? {}
                  : {
                      scale: 0.97,
                    }
              }
              className="w-full sm:w-auto"
            >
              <Link
                to="/#devtalks"
                className="block rounded-md bg-[var(--color-primary)] px-6 py-3.5 text-center text-sm font-medium text-[var(--color-text-dark)] shadow-[var(--shadow-orange)] transition-colors duration-300 hover:bg-[var(--color-primary-light)]"
              >
                Explore DevTalks
              </Link>
            </motion.div>

            <motion.div
              whileHover={
                reduceMotion
                  ? {}
                  : {
                      y: -2,
                    }
              }
              whileTap={
                reduceMotion
                  ? {}
                  : {
                      scale: 0.97,
                    }
              }
              className="w-full sm:w-auto"
            >
              <Link
                to="/#devkraft"
                className="glass block rounded-md px-6 py-3.5 text-center text-sm font-medium text-[var(--color-text-primary)] transition-colors duration-300 hover:border-[var(--color-border-orange)]"
              >
                What We Do
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* =====================================================
          SCROLL INDICATOR
      ====================================================== */}

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
        <div
          ref={indicatorRef}
          className="h-px w-20 origin-center bg-[var(--color-primary)] will-change-transform sm:w-24"
        />

        <div className="hidden items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] sm:flex">
          <span className="h-px w-8 bg-[var(--color-border)]" />
          Scroll to explore
          <span className="h-px w-8 bg-[var(--color-border)]" />
        </div>
      </div>
    </section>
  );
}
