import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const StartSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsUrl = "https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8";

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

  return (
    <section
      id="process"
      className="relative w-full min-h-[600px] md:min-h-[700px] flex items-center justify-center bg-black overflow-hidden py-24"
    >
      {/* Background HLS Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none opacity-40"
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

      {/* Centered Content */}
      <div className="relative z-20 w-full max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-6 md:gap-8">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white tracking-wider font-body border border-white/5 uppercase shadow-sm"
        >
          How It Works
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-4xl sm:text-5xl md:text-6xl font-heading italic text-white tracking-tight leading-[0.9] max-w-xl"
        >
          You dream it. We ship it.
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-white/60 font-body font-light text-sm sm:text-base md:text-lg leading-relaxed max-w-xl"
        >
          Share your vision. Our AI handles the rest&mdash;wireframes, design,
          code, launch. All in days, not quarters.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-2"
        >
          <a
            href="#contact"
            className="liquid-glass-strong rounded-full px-7 py-3.5 text-sm font-medium font-body text-white border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] flex items-center gap-1.5 shadow-xl hover:bg-white/5"
          >
            Get Started
            <ArrowUpRight className="h-4.5 w-4.5" />
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default StartSection;
