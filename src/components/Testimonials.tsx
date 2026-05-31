import React from "react";
import { motion } from "motion/react";

const Testimonials: React.FC = () => {
  const reviews = [
    {
      quote: "A complete rebuild in five days. The result outperformed everything we'd spent months building before.",
      name: "Sarah Chen",
      role: "CEO, Luminary",
    },
    {
      quote: "Conversions up 4x. That's not a typo. The design just works differently when it's built on real data.",
      name: "Marcus Webb",
      role: "Head of Growth, Arcline",
    },
    {
      quote: "They didn't just design our site. They defined our brand. World-class doesn't begin to cover it.",
      name: "Elena Voss",
      role: "Brand Director, Helix",
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
    hidden: { opacity: 0, y: 35 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  return (
    <section id="work-testimonials" className="w-full bg-black py-24 px-6 md:px-12 lg:px-24">
      {/* Header */}
      <div className="w-full max-w-4xl mx-auto text-center mb-16 flex flex-col items-center gap-4">
        <span className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white tracking-wider font-body border border-white/5 uppercase shadow-sm">
          What They Say
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
          Don't take our word for it.
        </h2>
      </div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {reviews.map((review, idx) => (
          <motion.div
            key={idx}
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className="liquid-glass rounded-2xl p-8 flex flex-col justify-between text-left gap-8 border border-white/5 shadow-xl cursor-default"
          >
            {/* Quote Block */}
            <p className="text-white/80 font-body font-light text-sm sm:text-base leading-relaxed italic">
              &ldquo;{review.quote}&rdquo;
            </p>

            {/* Author Profile */}
            <div className="flex flex-col gap-1 border-t border-white/5 pt-4">
              <span className="text-white font-body font-medium text-sm">
                {review.name}
              </span>
              <span className="text-white/50 font-body font-light text-xs uppercase tracking-wider">
                {review.role}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Testimonials;
