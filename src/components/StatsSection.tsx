import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import { motion } from "motion/react";

const StatsSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsUrl = "https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [hlsUrl]);

  const stats = [
    { value: "200+", label: "Sites launched" },
    { value: "98%", label: "Client satisfaction" },
    { value: "3.2x", label: "More conversions" },
    { value: "5 days", label: "Average delivery" },
  ];

  return (
    <section className="relative w-full py-24 bg-black overflow-hidden flex items-center justify-center min-h-[500px]">
      {/* Background desaturated HLS video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none opacity-30"
        style={{ filter: "saturate(0)" }}
      />

      {/* Top Gradient Fade */}
      <div
        className="absolute top-0 left-0 right-0 h-[200px] z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, #000000, transparent)",
        }}
      />

      {/* Bottom Gradient Fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[200px] z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to top, #000000, transparent)",
        }}
      />

      {/* Content Area */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="liquid-glass rounded-3xl p-8 sm:p-12 md:p-16 border border-white/5 shadow-2xl flex flex-col items-center justify-center text-center"
        >
          {/* Stats Grid */}
          <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-4xl sm:text-5xl lg:text-6xl font-heading italic text-white tracking-tight leading-none">
                  {stat.value}
                </span>
                <span className="text-white/60 font-body font-light text-xs sm:text-sm tracking-wide uppercase">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
