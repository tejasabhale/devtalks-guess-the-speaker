import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

const easeOutExpo = [0.16, 1, 0.3, 1];

const NODE_RGB = "255, 148, 90"; // primary-light
const LINK_RGB = "255, 122, 69"; // primary

function useNetworkMesh(canvasRef, sectionRef, reduceMotion) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes = [];
    let animationId = null;

    const pointer = { x: 0, y: 0, active: false };

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
            ctx.strokeStyle = `rgba(${LINK_RGB}, ${opacity})`;
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
            ctx.strokeStyle = `rgba(${NODE_RGB}, ${opacity})`;
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
        ctx.fillStyle = `rgba(${NODE_RGB}, 0.85)`;
        ctx.fill();
      }
    }

    function tick() {
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

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
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [canvasRef, sectionRef, reduceMotion]);
}

export default function AboutHero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);

  useNetworkMesh(canvasRef, sectionRef, Boolean(reduceMotion));

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: easeOutExpo },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-screen w-full items-center overflow-hidden bg-[var(--color-bg)] px-6 py-24 sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-radial-orange" />
      </div>

      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      />

      {/* Centered wash so the headline stays legible while the mesh fills the whole screen */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--color-bg) 0%, var(--color-bg) 30%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-0 sm:px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col items-center text-center"
        >
          <motion.div
            variants={itemVariants}
            className="mb-7 inline-flex w-fit items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2 backdrop-blur-xl sm:px-4"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-primary)] shadow-[0_0_12px_var(--color-primary)]" />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)] sm:text-[10px] md:text-xs">
              DevKraft Club
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="max-w-4xl bg-gradient-to-r from-[var(--color-text-primary)] via-[var(--color-text-primary)] to-[var(--color-primary-light)] bg-clip-text text-5xl font-semibold leading-[1.02] tracking-[-0.055em] text-transparent sm:text-6xl md:text-7xl lg:text-[5.25rem]"
          >
            Where developers build.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-5 max-w-md text-sm leading-relaxed text-[var(--color-text-secondary)] sm:mt-6 sm:text-base md:text-lg"
          >
            One community. Learn, build, ship.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex w-full flex-col items-center gap-3 sm:mt-10 sm:w-auto sm:flex-row"
          >
            <motion.a
              href="#devtalks"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-md bg-[var(--color-primary)] px-6 py-3.5 text-center text-sm font-medium text-[var(--color-text-dark)] shadow-[var(--shadow-orange)] transition-colors duration-300 hover:bg-[var(--color-primary-light)] sm:w-auto"
            >
              Explore DevTalks
            </motion.a>

            <motion.a
              href="#what-we-do"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="glass rounded-md px-6 py-3.5 text-center text-sm font-medium text-[var(--color-text-primary)] transition-colors duration-300 hover:border-[var(--color-border-orange)] sm:w-auto"
            >
              What We Do
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] sm:flex">
        <span className="h-px w-8 bg-[var(--color-border)]" />
        Scroll to explore
        <span className="h-px w-8 bg-[var(--color-border)]" />
      </div>
    </section>
  );
}
