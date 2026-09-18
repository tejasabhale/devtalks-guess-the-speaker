import { useEffect, useRef, useState } from "react";
import { Calendar, Clock3, MapPin, Play, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export default function EventTeaserVideo({
  videoSrc = "",
  poster = "",
  eventName = "DEVTALKS 2026",
  eyebrow = "DEVKRAFT · PRESENTS",
  date = "14 MAR",
  time = "10:00 AM",
  location = "DYPIT · PUNE",
}) {
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    setIsMuted(false);

    const attemptAutoplay = async () => {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    };

    attemptAutoplay();
  }, [videoSrc]);

  async function togglePlay() {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.paused) {
        await video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    } catch {
      setIsPlaying(false);
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  }

  return (
    <section className="relative h-[100dvh] min-h-[560px] w-full overflow-hidden bg-black">
      {/* Video */}
      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={poster}
          autoPlay
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center">
            <p className="font-display text-lg font-semibold text-text-primary">
              Add your teaser video
            </p>

            <p className="mt-1 text-xs text-text-muted">
              Pass a video URL through the `videoSrc` prop.
            </p>
          </div>
        </div>
      )}

      {/* Cinematic overlays */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black/20"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/65"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,90,31,0.06), transparent 45%)",
        }}
      />

      {/* Fine scanlines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent 0px, transparent 3px, rgba(255,255,255,0.08) 4px)",
        }}
      />

      {/* Subtle ambient glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-10%] top-[10%] h-[360px] w-[360px] rounded-full bg-primary/[0.05] blur-[120px]"
        animate={{
          x: [0, 35, 0],
          y: [0, 25, -5],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* UI */}
      <div className="relative z-10 flex h-full flex-col justify-between px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 xl:px-16">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-light opacity-60" />

                <span className="relative h-1.5 w-1.5 rounded-full bg-primary-light shadow-[0_0_10px_rgba(255,122,69,0.9)]" />
              </span>

              <span className="font-label text-[8px] uppercase tracking-[0.3em] text-white/50 sm:text-[9px]">
                {eyebrow}
              </span>
            </div>

            <p className="mt-2 font-display text-sm font-medium tracking-wide text-white/55 sm:text-base">
              {eventName}
            </p>
          </div>

          {/* Audio */}
          <motion.button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/75 backdrop-blur-md transition-colors hover:border-primary/40 hover:text-primary-light"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </motion.button>
        </div>

        {/* Center play fallback */}
        {!isPlaying && videoSrc && (
          <div className="flex items-center justify-center">
            <motion.button
              type="button"
              onClick={togglePlay}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              className="group relative flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur-md sm:h-20 sm:w-20"
            >
              <span className="absolute inset-[-10px] rounded-full border border-primary/20 transition-transform duration-500 group-hover:scale-110" />

              <Play size={24} fill="currentColor" className="ml-1" />
            </motion.button>
          </div>
        )}

        {/* Bottom metadata */}
        <div>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <EventPill icon={Calendar} label={date} />

            <EventPill icon={Clock3} label={time} />

            <EventPill icon={MapPin} label={location} />
          </div>

          <div className="mt-5 flex items-center gap-4 sm:mt-7">
            <div className="h-px flex-1 bg-white/10">
              <motion.div
                className="h-full origin-left bg-primary shadow-[0_0_10px_rgba(255,90,31,0.6)]"
                animate={{
                  scaleX: [0, 1],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />
            </div>

            <span className="font-label text-[8px] uppercase tracking-[0.25em] text-white/35 sm:text-[9px]">
              DEVKRAFT
            </span>

            <span className="h-px w-10 bg-white/10 sm:w-16" />
          </div>
        </div>
      </div>

      {/* Inner frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.07]"
      />
    </section>
  );
}

function EventPill({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 backdrop-blur-md">
      <Icon size={12} strokeWidth={1.8} className="text-primary-light" />

      <span className="font-label text-[8px] uppercase tracking-[0.16em] text-white/55 sm:text-[9px]">
        {label}
      </span>
    </div>
  );
}
