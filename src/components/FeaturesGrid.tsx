import React from "react";
import { motion } from "motion/react";
import { Zap, Palette, BarChart3, Shield } from "lucide-react";

const FeaturesGrid: React.FC = () => {
  const cards = [
    {
      icon: Zap,
      title: "Days, Not Months",
      description: "Concept to launch at a pace that redefines fast. Because waiting isn't a strategy.",
    },
    {
      icon: Palette,
      title: "Obsessively Crafted",
      description: "Every detail considered. Every element refined. Design so precise, it feels inevitable.",
    },
    {
      icon: BarChart3,
      title: "Built to Convert",
      description: "Layouts informed by data. Decisions backed by performance. Results you can measure.",
    },
    {
      icon: Shield,
      title: "Secure by Default",
      description: "Enterprise-grade protection comes standard. SSL, DDoS mitigation, compliance. All included.",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section id="work" className="w-full bg-black py-24 px-6 md:px-12 lg:px-24">
      {/* Grid Header */}
      <div className="w-full max-w-4xl mx-auto text-center mb-16 flex flex-col items-center gap-4">
        <span className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white tracking-wider font-body border border-white/5 uppercase shadow-sm">
          Why Us
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
          The difference is everything.
        </h2>
      </div>

      {/* Grid List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="liquid-glass rounded-2xl p-6 flex flex-col items-start text-left gap-4 border border-white/5 shadow-xl hover:border-white/10 group cursor-default"
            >
              {/* Icon Container */}
              <div className="liquid-glass-strong rounded-full w-10 h-10 flex items-center justify-center border border-white/10 text-white group-hover:scale-110 transition-transform duration-300">
                <Icon className="h-5 w-5" />
              </div>

              {/* Title & Body */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-body font-medium text-white group-hover:text-white/95">
                  {card.title}
                </h3>
                <p className="text-white/60 font-body font-light text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default FeaturesGrid;
