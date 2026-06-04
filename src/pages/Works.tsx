import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSession, authService } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import logoIcon from "@/assets/logo-icon.png";
import { ArrowLeft, LogOut, Laptop, Tablet, Smartphone, ExternalLink, RefreshCw, Eye, Code2, Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import feature1 from "@/assets/feature-1.gif";
import feature2 from "@/assets/feature-2.gif";
import { getValue, setValue, initializeStore } from "@/lib/db";

interface ShowcaseProject {
  id: string;
  title: string;
  category: string;
  websiteLink: string;
  imageType: "finlytic" | "wealth" | "custom";
  imageUrl?: string;
  createdAt: string;
}

const Works: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [showcases, setShowcases] = useState<ShowcaseProject[]>([]);
  const [activeProject, setActiveProject] = useState<ShowcaseProject | null>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [viewType, setViewType] = useState<"live" | "static">("static");
  const [iframeKey, setIframeKey] = useState(0);

  // Load Showcases & Optional Session
  useEffect(() => {
    const currentSession = getSession();
    setSession(currentSession);

    const loadData = async () => {
      await initializeStore();
      const saved = await getValue<ShowcaseProject[]>("element_designs_projects");
      if (saved && saved.length > 0) {
        setShowcases(saved);
        setActiveProject(saved[0]);
      } else {
        // Default fallback if empty
        const defaultShowcases: ShowcaseProject[] = [
          {
            id: "1",
            title: "High-Performance Website Development",
            category: "Web Development",
            websiteLink: "#contact",
            imageType: "finlytic",
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            title: "Data-Driven Digital Marketing",
            category: "Digital Marketing",
            websiteLink: "#contact",
            imageType: "wealth",
            createdAt: new Date().toISOString(),
          },
        ];
        await setValue("element_designs_projects", defaultShowcases);
        setShowcases(defaultShowcases);
        setActiveProject(defaultShowcases[0]);
      }
    };

    loadData();
  }, [navigate, toast]);

  // Auto-detect mobile screen for optimized preview defaults
  useEffect(() => {
    if (window.innerWidth < 768) {
      setPreviewMode("mobile");
    }
  }, []);

  const handleLogout = async () => {
    await authService.signOut();
    toast({
      title: "Logged Out",
      description: "You have safely signed out of your showcase profile.",
    });
    navigate("/");
  };

  const getMediaSrc = (item: ShowcaseProject) => {
    if (item.imageType === "finlytic") return feature1;
    if (item.imageType === "wealth") return feature2;
    return item.imageUrl || feature1;
  };

  const handleRefreshIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  if (!activeProject) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/50 text-sm">
        Loading showcase showroom...
      </div>
    );
  }

  // Calculate viewport dimensions based on responsive toggle
  const getViewportWidth = () => {
    if (previewMode === "mobile") return "380px";
    if (previewMode === "tablet") return "768px";
    return "100%";
  };

  return (
    <div className="min-h-screen bg-black text-white font-body selection:bg-white selection:text-black overflow-x-hidden p-6 md:p-10 relative flex flex-col gap-8">
      {/* Background Glows */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none" />

      {/* Premium Navigation Header */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="liquid-glass rounded-full p-2.5 text-white/70 hover:text-white border border-white/5 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
            title="Back to Home"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <img src={logoIcon} alt="Element Designs" className="h-10 w-10 object-contain" />
          <div className="text-left">
            <h1 className="font-heading italic text-xl tracking-tight text-white leading-none">Creative Showroom</h1>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Client Interface Session</span>
          </div>
        </div>

        {/* User Identity info & Logout Action */}
        {session ? (
          <div className="flex items-center justify-between md:justify-end gap-4 bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-2.5">
            <div className="flex flex-col items-start md:items-end text-left md:text-right">
              <span className="text-[9px] uppercase tracking-wider text-white/30 font-medium">Active Member</span>
              <span className="text-xs font-mono text-white/70 font-light truncate max-w-[200px]" title={session.email}>
                {session.email}
              </span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <button
              onClick={handleLogout}
              className="liquid-glass rounded-xl px-3.5 py-1.5 text-xs text-white/60 hover:text-red-400 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="liquid-glass rounded-xl px-4 py-2 text-xs text-white/70 hover:text-white border border-white/5 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            Client Sign In
          </Link>
        )}
      </div>

      {/* Main Studio Workbench Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Left Side: Portfolio Project Explorer */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="liquid-glass rounded-[28px] p-6 border border-white/5 shadow-2xl flex flex-col gap-6 max-h-[800px] overflow-y-auto">
            <div className="flex flex-col items-start gap-1">
              <span className="px-2 py-0.5 rounded-full text-[9px] bg-white/10 text-white border border-white/5 uppercase tracking-widest font-semibold">
                Portfolio index
              </span>
              <h2 className="text-2xl font-heading italic text-white mt-1">Design Deliverables</h2>
              <p className="text-white/40 text-xs font-light mt-1">
                Select a premium project below to activate full viewport simulations and interactive live code analysis.
              </p>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3">
              {showcases.map((project) => {
                const isActive = activeProject.id === project.id;
                return (
                  <button
                    key={project.id}
                    onClick={() => {
                      setActiveProject(project);
                      setIframeKey((prev) => prev + 1);
                    }}
                    className={`w-full text-left rounded-2xl p-4 transition-all border flex flex-col gap-2 relative overflow-hidden group cursor-pointer ${
                      isActive
                        ? "bg-white text-black border-white shadow-xl scale-[1.01]"
                        : "bg-white/[0.02] text-white border-white/5 hover:border-white/15"
                    }`}
                  >
                    {/* Glow backdrop on hover */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}

                    <div className="flex items-center justify-between gap-2 z-10">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[8px] tracking-wider uppercase font-semibold border ${
                          isActive
                            ? "bg-black/10 text-black border-black/10"
                            : "bg-white/10 text-white/70 border-white/5"
                        }`}
                      >
                        {project.category}
                      </span>
                    </div>

                    <h3
                      className={`text-base font-body font-medium transition-colors z-10 ${
                        isActive ? "text-black" : "text-white"
                      }`}
                    >
                      {project.title}
                    </h3>

                    <div className="flex items-center gap-1 z-10 text-[10px] font-mono opacity-40 select-none">
                      <Globe className="h-3 w-3" />
                      <span className="truncate max-w-[220px]">{project.websiteLink}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Virtual Viewport Display Monitor */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Viewport Control Panel */}
          <div className="liquid-glass rounded-2xl p-4 border border-white/5 shadow-md flex flex-wrap items-center justify-between gap-4">
            
            {/* View options: static vs live */}
            <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1">
              <button
                onClick={() => setViewType("static")}
                className={`px-3 py-1.5 text-xs rounded-[8px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewType === "static" ? "bg-white text-black font-semibold shadow" : "text-white/60 hover:text-white"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Screen Mockup
              </button>
              <button
                onClick={() => {
                  setViewType("live");
                  setIframeKey((prev) => prev + 1);
                }}
                className={`px-3 py-1.5 text-xs rounded-[8px] font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewType === "live" ? "bg-white text-black font-semibold shadow" : "text-white/60 hover:text-white"
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                Live Active Preview
              </button>
            </div>

            {/* Viewport size toggles (Available for both, but particularly useful for live preview) */}
            <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1">
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`p-2 rounded-[8px] transition-all cursor-pointer ${
                  previewMode === "desktop" ? "bg-white text-black shadow" : "text-white/60 hover:text-white"
                }`}
                title="Desktop Layout Simulator"
              >
                <Laptop className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPreviewMode("tablet")}
                className={`p-2 rounded-[8px] transition-all cursor-pointer ${
                  previewMode === "tablet" ? "bg-white text-black shadow" : "text-white/60 hover:text-white"
                }`}
                title="Tablet Layout Simulator"
              >
                <Tablet className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`p-2 rounded-[8px] transition-all cursor-pointer ${
                  previewMode === "mobile" ? "bg-white text-black shadow" : "text-white/60 hover:text-white"
                }`}
                title="Mobile Layout Simulator"
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>

            {/* External link & Action CTA */}
            <div className="flex items-center gap-2">
              {viewType === "live" && (
                <button
                  onClick={handleRefreshIframe}
                  className="liquid-glass rounded-xl p-2.5 text-white/70 hover:text-white border border-white/5 transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
                  title="Reload Iframe Link"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
              )}
              <a
                href={activeProject.websiteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black font-body font-medium hover:bg-white/95 rounded-xl px-4 py-2 text-xs flex items-center gap-1.5 shadow transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Visit Site
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

          </div>

          {/* High Fidelity Mock-Browser Frame Monitor */}
          <div className="flex-1 min-h-[500px] md:min-h-[600px] flex items-center justify-center bg-neutral-950/40 rounded-[32px] border border-white/5 p-4 md:p-6 overflow-hidden relative shadow-inner">
            
            {/* Viewport container with simulated responsive width */}
            <motion.div
              animate={{ width: getViewportWidth() }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="h-full max-h-[700px] min-h-[500px] md:min-h-[580px] bg-[#0c0c0c] border border-white/10 rounded-2xl flex flex-col shadow-2xl overflow-hidden max-w-full"
            >
              
              {/* Virtual Browser Window Bar */}
              <div className="bg-[#121212] border-b border-white/10 px-4 py-3 flex items-center justify-between select-none">
                
                {/* Traffic Light Dots */}
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f56] opacity-80" />
                  <div className="h-3 w-3 rounded-full bg-[#ffbd2e] opacity-80" />
                  <div className="h-3 w-3 rounded-full bg-[#27c93f] opacity-80" />
                </div>

                {/* Simulated URL bar */}
                <div className="bg-white/5 border border-white/5 rounded-lg px-4 py-1 text-[10px] text-white/50 font-mono w-1/2 md:w-3/5 text-center truncate">
                  {activeProject.websiteLink}
                </div>

                {/* Viewport size tag */}
                <div className="text-[9px] uppercase font-semibold text-white/30 tracking-widest">
                  {previewMode}
                </div>

              </div>

              {/* Viewport content area */}
              <div className="flex-1 w-full bg-[#0a0a0a] relative overflow-y-auto">
                <AnimatePresence mode="wait">
                  {viewType === "static" ? (
                    <motion.div
                      key="static-frame"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full min-h-[460px] md:min-h-[540px] flex items-start justify-center p-4 bg-[#0a0a0a]"
                    >
                      <img
                        src={getMediaSrc(activeProject)}
                        alt={activeProject.title}
                        className="w-full h-auto object-contain rounded-lg opacity-90 select-none shadow-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = feature1;
                        }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`live-frame-${iframeKey}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full min-h-[460px] md:min-h-[540px] relative bg-white"
                    >
                      {/* Warning check if link is empty or not standard url */}
                      {(!activeProject.websiteLink.startsWith("http://") && !activeProject.websiteLink.startsWith("https://")) ? (
                        <div className="absolute inset-0 bg-[#0a0a0a] text-white/40 flex flex-col items-center justify-center text-center gap-3 p-6">
                          <Eye className="h-8 w-8 text-white/20" />
                          <p className="text-xs font-light max-w-xs">
                            This project URL is registered locally. Click "Screen Mockup" or click "Visit Site" above to explore.
                          </p>
                        </div>
                      ) : (
                        <iframe
                          src={activeProject.websiteLink}
                          title={activeProject.title}
                          className="w-full h-full min-h-[460px] md:min-h-[540px] border-0"
                          sandbox="allow-scripts allow-same-origin allow-popups"
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Works;
