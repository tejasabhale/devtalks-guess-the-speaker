import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

const DEFAULT_VIDEO = "/videos/devtalks-teaser.mp4";
const DEFAULT_POSTER = "/images/devtalks-teaser-poster.webp";

const LOADER_DURATION = 10000;
const END_TRANSITION_DURATION = 850;

const EASE = [0.16, 1, 0.3, 1];

const WORDMARK_STYLE = {
  fontFamily: "'Sora', sans-serif",
  fontWeight: 800,
  letterSpacing: "-0.045em",
  fontSynthesis: "none",
};

export default function Loader({
  onComplete,
  videoSrc = DEFAULT_VIDEO,
  poster = DEFAULT_POSTER,
}) {
  const videoRef = useRef(null);
  const progressStartRef = useRef(null);
  const completionTimerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let mounted = true;

    video.preload = "auto";
    video.playsInline = true;
    video.autoplay = true;
    video.muted = false;
    video.currentTime = 0;

    const updateProgress = (timestamp) => {
      if (!mounted) return;

      if (!progressStartRef.current) {
        progressStartRef.current = timestamp;
      }

      const elapsed = timestamp - progressStartRef.current;
      const nextProgress = Math.min((elapsed / LOADER_DURATION) * 100, 100);

      setProgress(nextProgress);

      if (nextProgress < 100 && !exiting) {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      }
    };

    const startTimeline = () => {
      progressStartRef.current = null;
      cancelAnimationFrame(animationFrameRef.current);

      animationFrameRef.current = requestAnimationFrame(updateProgress);

      clearTimeout(completionTimerRef.current);

      completionTimerRef.current = setTimeout(finishLoader, LOADER_DURATION);
    };

    const playVideo = async () => {
      try {
        video.muted = false;
        setIsMuted(false);

        await video.play();

        if (!mounted) return;

        setIsPlaying(true);
        startTimeline();
      } catch {
        /*
         * Unmuted autoplay can be blocked by the browser.
         * Fall back to muted autoplay so the teaser still starts.
         */
        try {
          video.muted = true;
          setIsMuted(true);

          await video.play();

          if (!mounted) return;

          setIsPlaying(true);
          startTimeline();
        } catch {
          /*
           * If playback itself is unavailable, still run the
           * 10-second loader timeline so the site never gets stuck.
           */
          setIsPlaying(false);
          startTimeline();
        }
      }
    };

    const enableAudio = async () => {
      try {
        video.muted = false;
        setIsMuted(false);

        if (video.paused) {
          await video.play();
        }
      } catch {
        // Ignore browser playback restrictions.
      }
    };

    const handleLoadedData = () => {
      playVideo();
    };

    const handlePlay = () => {
      if (!mounted) return;
      setIsPlaying(true);
    };

    const handlePause = () => {
      if (!mounted) return;
      setIsPlaying(false);
    };

    const handleError = () => {
      console.error("DevTalks teaser video failed to load.", video.error);

      setIsPlaying(false);

      /*
       * The loader should still transition after 10 seconds
       * instead of getting permanently stuck.
       */
      startTimeline();
    };

    window.addEventListener("pointerdown", enableAudio, { once: true });

    window.addEventListener("keydown", enableAudio, { once: true });

    video.addEventListener("loadeddata", handleLoadedData);

    video.addEventListener("play", handlePlay);

    video.addEventListener("pause", handlePause);

    video.addEventListener("error", handleError);

    video.load();

    /*
     * Start immediately if the browser has already cached
     * enough data to play.
     */
    if (video.readyState >= 2) {
      playVideo();
    }

    return () => {
      mounted = false;

      cancelAnimationFrame(animationFrameRef.current);

      clearTimeout(completionTimerRef.current);

      window.removeEventListener("pointerdown", enableAudio);

      window.removeEventListener("keydown", enableAudio);

      video.removeEventListener("loadeddata", handleLoadedData);

      video.removeEventListener("play", handlePlay);

      video.removeEventListener("pause", handlePause);

      video.removeEventListener("error", handleError);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoSrc]);

  function finishLoader() {
    if (exiting) return;

    setProgress(100);
    setExiting(true);

    cancelAnimationFrame(animationFrameRef.current);

    clearTimeout(completionTimerRef.current);

    const video = videoRef.current;

    if (video) {
      video.pause();
    }

    setTimeout(() => {
      onComplete?.();
    }, END_TRANSITION_DURATION);
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);

    if (video.paused) {
      video.play().catch(() => {});
    }
  }

  return (
    <motion.div
      initial={{
        opacity: 1,
        scale: 1,
      }}
      animate={{
        opacity: exiting ? 0 : 1,
        scale: exiting ? 1.04 : 1,
      }}
      transition={{
        duration: END_TRANSITION_DURATION / 1000,
        ease: EASE,
      }}
      className="fixed inset-0 z-[100] overflow-hidden bg-black"
      role="status"
      aria-label="Loading DevTalks"
    >
      {/* 9:16 video */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          scale: exiting ? 1.07 : 1,
        }}
        transition={{
          duration: END_TRANSITION_DURATION / 1000,
          ease: EASE,
        }}
      >
        <div className="relative h-[100dvh] w-auto max-w-[100vw]">
          <video
            ref={videoRef}
            src={videoSrc}
            poster={poster}
            autoPlay
            playsInline
            preload="auto"
            controls={false}
            className="h-full w-auto max-w-[100vw] object-contain"
          />

          {/* Base vignette */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/70"
          />

          {/* Orange atmosphere */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            animate={{
              opacity: exiting ? 0.75 : 0.35,
              scale: exiting ? 1.2 : 1,
            }}
            transition={{
              duration: END_TRANSITION_DURATION / 1000,
              ease: EASE,
            }}
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,90,31,0.12), transparent 55%)",
            }}
          />

          {/* Scanlines */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.045]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(180deg, transparent 0px, transparent 3px, rgba(255,255,255,0.08) 4px)",
            }}
          />
        </div>
      </motion.div>

      {/* Ending black curtain */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 bg-black"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: exiting ? 1 : 0,
        }}
        transition={{
          duration: END_TRANSITION_DURATION / 1000,
          ease: EASE,
        }}
      />

      {/* Ending orange flash */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-31"
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: exiting ? [0, 0.3, 0] : 0,
          scale: exiting ? [0.8, 1.15, 1.3] : 0.8,
        }}
        transition={{
          duration: END_TRANSITION_DURATION / 1000,
          ease: EASE,
        }}
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,90,31,0.3), transparent 40%)",
        }}
      />

      {/* Top branding */}
      <div className="absolute left-0 right-0 top-0 z-40 flex items-start justify-between px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-light opacity-70" />

              <span className="relative h-1.5 w-1.5 rounded-full bg-primary-light shadow-[0_0_10px_rgba(255,122,69,0.8)]" />
            </span>

            <span className="font-label text-[8px] uppercase tracking-[0.28em] text-white/50 sm:text-[9px]">
              DEVKRAFT · PRESENTS
            </span>
          </div>

          <span
            style={WORDMARK_STYLE}
            className="mt-2 block select-none text-lg text-white/85 sm:text-xl"
          >
            Dev
            <span className="text-primary">Talks</span>
          </span>
        </div>

        {/* Audio control */}
        <motion.button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Turn audio on" : "Turn audio off"}
          whileHover={{
            scale: 1.06,
          }}
          whileTap={{
            scale: 0.94,
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/75 backdrop-blur-md transition-colors hover:border-primary/40 hover:text-primary-light sm:h-10 sm:w-10"
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </motion.button>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 z-40 px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
        <div className="flex items-center gap-3">
          {/* 10 second timeline */}
          <div className="h-px flex-1 overflow-hidden bg-white/10">
            <motion.div
              className="h-full origin-left bg-primary shadow-[0_0_14px_rgba(255,90,31,0.75)]"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          {/* Timer */}
          <span className="font-label min-w-[34px] text-right text-[8px] tracking-[0.18em] text-white/40 sm:text-[9px]">
            {formatTime(
              Math.max(
                0,
                Math.ceil(LOADER_DURATION - (progress / 100) * LOADER_DURATION),
              ),
            )}
          </span>

          {/* Skip */}
          <motion.button
            type="button"
            onClick={finishLoader}
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            className="font-label rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[8px] uppercase tracking-[0.18em] text-white/50 backdrop-blur-md transition-colors hover:border-primary/40 hover:text-white sm:px-3.5"
          >
            Skip
          </motion.button>
        </div>
      </div>

      {/* Outer frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-50 ring-1 ring-inset ring-white/[0.06]"
      />
    </motion.div>
  );
}

function formatTime(milliseconds) {
  const seconds = Math.ceil(milliseconds / 1000);

  return `00:${String(seconds).padStart(2, "0")}`;
}
