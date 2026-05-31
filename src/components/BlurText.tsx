import React from "react";
import { motion } from "motion/react";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number; // Configurable stagger delay (default 200ms or 0.2s)
  direction?: "bottom" | "top";
}

const BlurText: React.FC<BlurTextProps> = ({
  text,
  className = "",
  delay = 0.1, // Stagger delay (e.g. 100ms or 200ms)
  direction = "bottom",
}) => {
  const words = text.split(" ");

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: delay,
      },
    },
  };

  const startY = direction === "bottom" ? 50 : -50;

  const childVariants = {
    hidden: {
      filter: "blur(10px)",
      opacity: 0,
      y: startY,
    },
    visible: {
      // Step duration is 0.35s per keyframe step.
      // From hidden (0s) -> intermediate (0.35s) -> final (0.7s)
      filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
      opacity: [0, 0.5, 1],
      y: [startY, direction === "bottom" ? -5 : 5, 0],
      transition: {
        duration: 0.7,
        times: [0, 0.5, 1],
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.h1
      className={`inline-block text-balance ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-visible py-1">
          <motion.span
            className="inline-block mr-[0.25em]"
            variants={childVariants}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
};

export default BlurText;
