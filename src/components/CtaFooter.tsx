import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const CtaFooter: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsUrl = "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8";

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
      id="pricing"
      className="relative w-full pt-32 pb-12 bg-black overflow-hidden flex flex-col items-center justify-between min-h-[750px]"
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

      {/* Centered CTA Content */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-6 text-center my-auto flex flex-col items-center gap-6 sm:gap-8">
        
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading italic text-white tracking-tight leading-[0.85] max-w-3xl"
        >
          Your next website starts here.
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="text-white/70 font-body font-light text-sm sm:text-base md:text-lg leading-relaxed max-w-xl"
        >
          Book a free strategy call. See what AI-powered design can do. No
          commitment, no pressure. Just possibilities.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-2"
        >
          <a
            href="#contact"
            className="liquid-glass-strong rounded-full px-6 py-3 text-sm font-medium font-body text-white border border-white/10 hover:border-white/20 transition-all hover:scale-[1.03] active:scale-[0.97] flex items-center gap-1 hover:bg-white/5 shadow-xl"
          >
            Book a Call
            <ArrowUpRight className="h-4.5 w-4.5" />
          </a>
          <a
            href="#pricing-details"
            className="bg-white text-black font-body font-medium hover:bg-white/90 transition-all rounded-full px-6 py-3 text-sm hover:scale-[1.03] active:scale-[0.97] shadow-xl"
          >
            View Pricing
          </a>
        </motion.div>
      </div>

      {/* Footer bar at the bottom */}
      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 mt-32 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Left copyright info */}
        <p className="text-white/40 text-xs font-body tracking-wider cursor-default">
          &copy; 2026 Studio. All rights reserved.
        </p>

        {/* Right footer links */}
        <div className="flex items-center gap-6">
          {["Privacy", "Terms", "Contact"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-white/40 hover:text-white/80 transition-colors text-xs font-body uppercase tracking-widest"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CtaFooter;
