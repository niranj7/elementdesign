import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import feature1 from "@/assets/feature-1.gif";
import feature2 from "@/assets/feature-2.gif";
import { ArrowUpRight } from "lucide-react";
import { getValue, setValue, initializeStore } from "@/lib/db";

interface ShowcaseProject {
  id: string;
  title: string;
  category: string;
  websiteLink: string;
  imageType: "finlytic" | "wealth" | "custom";
  imageUrl?: string;
  createdAt: string;
  description?: string;
}

const DEFAULT_SHOWCASES: ShowcaseProject[] = [
  {
    id: "1",
    title: "High-Performance Website Development",
    category: "Web Development",
    websiteLink: "#contact", // Smooth scroll fallback
    imageType: "finlytic",
    description: "We build modern, responsive, and blazing-fast websites that are optimized to capture attention and convert visitors. From elegant landing pages to complex corporate portals, we write clean code and craft flawless user experiences.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Data-Driven Digital Marketing",
    category: "Digital Marketing",
    websiteLink: "#contact",
    imageType: "wealth",
    description: "Grow your online presence with highly targeted, data-backed marketing strategies. We cover SEO, social media campaigns, paid ads, and conversion rate optimization (CRO) to bring steady traffic and real sales to your business.",
    createdAt: new Date().toISOString(),
  },
];

const FeaturesChess: React.FC = () => {
  const [showcases, setShowcases] = useState<ShowcaseProject[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      await initializeStore();
      const saved = await getValue<ShowcaseProject[]>("element_designs_projects");
      if (saved) {
        const mapped = saved.map((item: any) => ({
          ...item,
          description: item.description || `High-performance digital products and results-driven marketing solutions tailored exactly to your brand.`,
        }));
        setShowcases(mapped);
      } else {
        await setValue("element_designs_projects", DEFAULT_SHOWCASES);
        setShowcases(DEFAULT_SHOWCASES);
      }
    };
    loadProjects();
  }, []);

  const rowVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const getMediaSrc = (item: ShowcaseProject) => {
    if (item.imageType === "finlytic") return feature1;
    if (item.imageType === "wealth") return feature2;
    return item.imageUrl || feature1;
  };

  return (
    <section id="services" className="w-full bg-black py-24 px-6 md:px-12 lg:px-24">
      {/* Section Header */}
      <div className="w-full max-w-4xl mx-auto text-center mb-20 flex flex-col items-center gap-4">
        <span className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white tracking-wider font-body border border-white/5 uppercase shadow-sm">
          Capabilities
        </span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading italic text-white tracking-tight leading-[0.9]">
          Pro features. Zero complexity.
        </h2>
      </div>

      {/* Rows Container */}
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-24 lg:gap-32">
        {showcases.map((item, index) => {
          const isEven = index % 2 === 0;
          const isAnchor = item.websiteLink.startsWith("#");

          return (
            <motion.div
              key={item.id}
              variants={rowVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-150px" }}
              className={`flex flex-col items-center gap-12 lg:gap-20 ${
                isEven ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
            >
              {/* Column 1: Typography */}
              <div className="flex-1 text-left flex flex-col items-start gap-5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] bg-white/10 text-white border border-white/5 uppercase tracking-wider font-semibold">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-heading italic text-white leading-tight mt-1">
                  {item.title}
                </h3>
                <p
                  className="text-white/60 font-body font-light text-sm sm:text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.description || "" }}
                />
                
                {isAnchor ? (
                  <a
                    href={item.websiteLink}
                    className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium font-body text-white border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1 mt-2"
                  >
                    Get Started
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                ) : (
                  <a
                    href={item.websiteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium font-body text-white border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1 mt-2 cursor-pointer"
                  >
                    Visit Website
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
              </div>

              {/* Column 2: visual representation */}
              <div className="flex-1 w-full max-w-xl">
                <div className="liquid-glass rounded-2xl overflow-hidden border border-white/5 shadow-2xl hover:scale-[1.01] transition-transform duration-500">
                  <img
                    src={getMediaSrc(item)}
                    alt={item.title}
                    className="w-full h-auto object-cover opacity-90 select-none pointer-events-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = feature1;
                    }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturesChess;
