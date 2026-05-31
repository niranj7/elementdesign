import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, Play } from "lucide-react";
import BlurText from "./BlurText";

const HeroSection: React.FC = () => {
  // Animating subtext and buttons with blur in
  const blurInVariants = (delay: number) => ({
    hidden: {
      filter: "blur(10px)",
      opacity: 0,
      y: 20,
    },
    visible: {
      filter: "blur(0px)",
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.6,
        ease: "easeOut",
      },
    },
  });

  return (
    <section
      id="home"
      className="relative w-full min-h-[90vh] md:h-[1000px] overflow-visible flex flex-col justify-between bg-black text-white"
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/images/hero_bg.jpeg"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none opacity-80"
        src="/videos/hero_video.mp4"
      />

      {/* Dark Overlay (Subtle) */}
      <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none" />

      {/* Bottom Gradient Fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[300px] z-0 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #000000)",
        }}
      />

      {/* Center Content Area */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center pt-[170px] flex flex-col items-center">
        
        {/* Badge Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="liquid-glass rounded-full px-1 py-1 flex items-center gap-2 max-w-fit mb-8 border border-white/5 shadow-md"
        >
          <span className="bg-white text-black rounded-full px-3 py-1 text-[10px] sm:text-xs font-semibold tracking-wider uppercase">
            Services
          </span>
          <span className="pr-3 text-[11px] sm:text-xs font-medium font-body text-white/90">
            Website Development &amp; Digital Marketing
          </span>
        </motion.div>

        {/* Heading via BlurText */}
        <BlurText
          text="The Website Your Brand Deserves"
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.85] tracking-[-3px] sm:tracking-[-4px] max-w-2xl mb-6"
          delay={0.08}
        />

        {/* Subtext */}
        <motion.p
          variants={blurInVariants(0.8)}
          initial="hidden"
          animate="visible"
          className="text-sm sm:text-base md:text-lg text-white/80 font-body font-light leading-relaxed max-w-xl mb-8 mt-2"
        >
          We specialize in high-performance website development and result-driven digital marketing. Simple. Effective. Built to grow your business.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={blurInVariants(1.1)}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-xs sm:max-w-none px-4 sm:px-0"
        >
          <Link
            to="/works"
            className="w-full sm:w-auto text-center justify-center liquid-glass-strong text-white font-body font-medium rounded-full px-6 py-3.5 text-sm flex items-center gap-1.5 border border-white/20 hover:border-white/40 hover:scale-[1.03] active:scale-[0.97] transition-all shadow-lg bg-white/10 hover:bg-white/20"
          >
            See Our Works
            <ArrowUpRight className="h-4.5 w-4.5 text-white" />
          </Link>
          <a
            href="#contact"
            className="w-full sm:w-auto text-center justify-center liquid-glass-strong text-white/80 hover:text-white font-body font-medium rounded-full px-6 py-3.5 text-sm flex items-center gap-1.5 border border-white/5 hover:border-white/15 hover:scale-[1.03] active:scale-[0.97] transition-all hover:bg-white/5"
          >
            Get Started
          </a>
        </motion.div>
      </div>

      {/* Partners Bar at the bottom */}
      <div className="relative z-10 mt-auto w-full max-w-6xl mx-auto px-6 pb-12 pt-8 flex flex-col items-center gap-8">
        {/* Label Pill */}
        <div className="liquid-glass rounded-full px-4 py-1.5 text-xs text-white/50 tracking-wider font-body font-light uppercase border border-white/5 shadow-sm">
          Trusted by the teams behind
        </div>

        {/* Partners grid */}
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-20">
          {["Stripe", "Vercel", "Linear", "Notion", "Figma"].map((partner) => (
            <span
              key={partner}
              className="text-2xl md:text-3xl font-heading italic text-white/60 hover:text-white hover:scale-105 transition-all duration-300 select-none cursor-default"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
