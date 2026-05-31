import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StartSection from "@/components/StartSection";
import FeaturesChess from "@/components/FeaturesChess";
import FeaturesGrid from "@/components/FeaturesGrid";
import StatsSection from "@/components/StatsSection";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import CtaFooter from "@/components/CtaFooter";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black overflow-x-hidden relative">
      <div className="relative z-10">
        {/* Fixed floating navbar */}
        <Navbar />

        {/* Cinematic Hero (1000px height, CloudFront MP4 video background) */}
        <HeroSection />

        {/* Inner page content container */}
        <div className="bg-black relative z-10">
          
          {/* Start Section ("How It Works" HLS background video) */}
          <StartSection />

          {/* Features Chess (alternating text/gif rows) */}
          <FeaturesChess />

          {/* Features Grid ("Why Us" 4-card grid) */}
          <FeaturesGrid />

          {/* Stats Section (HLS desaturated background video + metrics card) */}
          <StatsSection />

          {/* Testimonials (3-card review grid) */}
          <Testimonials />

          {/* Glassmorphic Contact Form */}
          <ContactForm />

          {/* CTA + Footer (HLS background video + footer menu bar) */}
          <CtaFooter />
          
        </div>
      </div>
    </div>
  );
};

export default Index;
