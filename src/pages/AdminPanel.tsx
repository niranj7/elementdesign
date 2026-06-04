import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.png";
import { ArrowLeft, Trash2, PlusCircle, Layers, AlertCircle, LogOut, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useToast } from "@/hooks/use-toast";
import { getSession, authService } from "@/lib/supabase";
import feature1 from "@/assets/feature-1.gif";
import feature2 from "@/assets/feature-2.gif";
import { getValue, setValue, initializeStore } from "@/lib/db";

export interface ShowcaseProject {
  id: string;
  title: string;
  category: string;
  websiteLink: string;
  imageType: "finlytic" | "wealth" | "custom";
  imageUrl?: string;
  createdAt: string;
}

const DEFAULT_SHOWCASES: ShowcaseProject[] = [
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

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showcases, setShowcases] = useState<ShowcaseProject[]>([]);
  
  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Premium Website");
  const [websiteLink, setWebsiteLink] = useState("");
  const [imageType, setImageType] = useState<"finlytic" | "wealth" | "custom">("finlytic");
  const [customUrl, setCustomUrl] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [activeView, setActiveView] = useState<"portfolio" | "leads">("portfolio");
  const [leads, setLeads] = useState<any[]>([]);
 
  // Load Projects and Protect Route
  useEffect(() => {
    const session = getSession();
    if (!session || session.role !== "admin") {
      toast({
        variant: "destructive",
        title: "Access Restricted",
        description: "Administration terminal is strictly restricted to executive credentials.",
      });
      navigate("/auth?tab=admin");
      return;
    }

    const loadData = async () => {
      await initializeStore();
      
      const saved = await getValue<ShowcaseProject[]>("element_designs_projects");
      if (saved) {
        setShowcases(saved);
      } else {
        await setValue("element_designs_projects", DEFAULT_SHOWCASES);
        setShowcases(DEFAULT_SHOWCASES);
      }

      const savedLeads = await getValue<any[]>("element_designs_contact_submissions");
      if (savedLeads) {
        setLeads(savedLeads);
      }
    };

    loadData();
  }, [navigate]);

  // Save Helper
  const saveShowcases = async (updated: ShowcaseProject[]) => {
    await setValue("element_designs_projects", updated);
    setShowcases(updated);
  };

  const handleDeleteLead = async (index: number) => {
    const updated = [...leads];
    updated.splice(index, 1);
    await setValue("element_designs_contact_submissions", updated);
    setLeads(updated);
    toast({
      title: "Lead Removed",
      description: "Successfully cleared contact submission.",
    });
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    
    // Define headers
    const headers = ["Name", "Email", "Phone", "Project Type", "Message", "Submission Date"];
    
    // Map leads to rows
    const rows = leads.map(lead => [
      `"${(lead.name || "").replace(/"/g, '""')}"`,
      `"${(lead.email || "").replace(/"/g, '""')}"`,
      `"${(lead.phone || "").replace(/"/g, '""')}"`,
      `"${(lead.project_type || "").replace(/"/g, '""')}"`,
      `"${(lead.message || "").replace(/"/g, '""')}"`,
      `"${new Date(lead.created_at).toLocaleString()}"`
    ]);
    
    // Combine to CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `element_designs_leads_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Successful",
      description: "Successfully exported customer leads to Excel-compatible CSV file.",
    });
  };

  // File Select Handler (Converts to Base64)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2.5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Please select an image smaller than 2.5MB to save in browser memory.",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setImageType("custom");
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Handler
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !websiteLink.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please fill in all required fields (Website Title and URL Link).",
      });
      return;
    }

    if (imageType === "custom" && !uploadedImage && !customUrl.trim()) {
      toast({
        variant: "destructive",
        title: "Image Required",
        description: "Please upload an image file or enter a direct image URL.",
      });
      return;
    }

    // Format Link URL correctly
    let formattedLink = websiteLink.trim();
    if (!formattedLink.startsWith("http://") && !formattedLink.startsWith("https://") && !formattedLink.startsWith("#")) {
      formattedLink = "https://" + formattedLink;
    }

    const newShowcase: ShowcaseProject = {
      id: Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      category,
      websiteLink: formattedLink,
      imageType,
      imageUrl: imageType === "custom" ? (uploadedImage || customUrl.trim()) : undefined,
      createdAt: new Date().toISOString(),
    };

    const updated = [newShowcase, ...showcases];
    await saveShowcases(updated);

    // Reset Form
    setTitle("");
    setWebsiteLink("");
    setCustomUrl("");
    setUploadedImage("");
    toast({
      title: "Showcase Published",
      description: `Successfully uploaded and showcased "${title}"!`,
    });
  };

  // Delete Handler
  const handleDelete = async (id: string, projTitle: string) => {
    const updated = showcases.filter((p) => p.id !== id);
    await saveShowcases(updated);
    toast({
      title: "Deleted Showcase",
      description: `Removed project "${projTitle}" from portfolio.`,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-body overflow-x-hidden p-6 md:p-12 relative selection:bg-white selection:text-black">
      {/* Glow Backdrop */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Navigation */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between border-b border-white/5 pb-6 mb-12">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="liquid-glass rounded-full px-4 py-2 text-xs text-white/70 hover:text-white flex items-center gap-1.5 border border-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Homepage
          </Link>
          <button
            onClick={async () => {
              await authService.signOut();
              toast({
                title: "Logged Out",
                description: "Executive session terminated safely.",
              });
              navigate("/");
            }}
            className="liquid-glass rounded-full px-4 py-2 text-xs text-white/50 hover:text-red-400 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <img src={logoIcon} alt="Element Designs" className="h-10 w-10 object-contain" />
          <span className="font-heading italic text-xl tracking-tight text-white">Showcase Control Board</span>
        </div>
      </div>

      {/* View Toggle Tabs */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex bg-white/[0.02] border border-white/5 rounded-2xl p-1 mb-8 max-w-md">
        <button
          onClick={() => setActiveView("portfolio")}
          className={`flex-1 py-2 text-xs rounded-xl font-medium transition-all duration-300 cursor-pointer ${
            activeView === "portfolio" ? "bg-white text-black font-semibold shadow-sm" : "text-white/60 hover:text-white"
          }`}
        >
          Portfolio Registry ({showcases.length})
        </button>
        <button
          onClick={() => setActiveView("leads")}
          className={`flex-1 py-2 text-xs rounded-xl font-medium transition-all duration-300 cursor-pointer ${
            activeView === "leads" ? "bg-white text-black font-semibold shadow-sm" : "text-white/60 hover:text-white"
          }`}
        >
          Customer Leads ({leads.length})
        </button>
      </div>

      {activeView === "portfolio" ? (
        <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Form: Website Upload Form */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/5 shadow-2xl flex flex-col gap-6">
              <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                <PlusCircle className="h-5 w-5 text-white/80" />
                <h2 className="text-2xl font-heading italic text-white">Showcase New Website</h2>
              </div>

              <form onSubmit={handlePublish} className="flex flex-col gap-5 text-left">
                {/* Website Title */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
                    Website / Project Title *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g., DeFi Interface Suite"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all font-light"
                  />
                </div>

                {/* Website Link */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
                    Live Website Link (URL) *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g., https://defi.luminary.com"
                    value={websiteLink}
                    onChange={(e) => setWebsiteLink(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all font-light"
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
                    Showcase Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-neutral-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 font-light cursor-pointer"
                  >
                    <option>Premium Website</option>
                    <option>SaaS Platform</option>
                    <option>Brand Portfolio</option>
                    <option>Web3 Interface</option>
                  </select>
                </div>

                {/* Image selection */}
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
                    Showcasing Image/GIF
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["finlytic", "wealth", "custom"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setImageType(type)}
                        className={`py-2 px-3 text-xs rounded-xl font-medium border capitalize transition-all cursor-pointer ${
                          imageType === type
                            ? "bg-white text-black border-white"
                            : "bg-white/5 text-white/70 border-white/10 hover:border-white/20"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {imageType === "custom" && (
                    <div className="flex flex-col gap-3 mt-1 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                      {/* Local File Uploader */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] uppercase tracking-wider text-white/30 font-medium">
                          Upload Website Preview Image *
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="text-xs text-white/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-medium file:bg-white file:text-black file:hover:bg-white/95 file:cursor-pointer cursor-pointer bg-white/5 p-2 rounded-xl border border-white/10 w-full"
                        />
                      </div>

                      <div className="flex items-center justify-between text-[8px] text-white/30 uppercase tracking-widest px-1">
                        <span>or</span>
                      </div>

                      {/* Image URL Input */}
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[9px] uppercase tracking-wider text-white/30 font-medium">
                          Direct Image Web URL
                        </span>
                        <input
                          type="text"
                          placeholder="e.g. https://domain.com/mock.png"
                          value={customUrl}
                          onChange={(e) => {
                            setCustomUrl(e.target.value);
                            setUploadedImage("");
                          }}
                          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white/20 transition-all font-light"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Dynamic Showcase Image Preview Box */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
                    Live Showcase Preview
                  </label>
                  <div className="liquid-glass rounded-2xl h-44 w-full overflow-hidden border border-white/5 flex items-center justify-center bg-white/[0.01] shadow-inner relative group">
                    <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center text-[10px] uppercase tracking-widest text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      Visual Deliverable Preview
                    </div>
                    {imageType === "finlytic" ? (
                      <img src={feature1} alt="Finlytic Preset" className="w-full h-full object-cover opacity-80" />
                    ) : imageType === "wealth" ? (
                      <img src={feature2} alt="Wealth Preset" className="w-full h-full object-cover opacity-80" />
                    ) : uploadedImage ? (
                      <img src={uploadedImage} alt="Uploaded File" className="w-full h-full object-cover opacity-90" />
                    ) : customUrl ? (
                      <img
                        src={customUrl}
                        alt="URL Input Preview"
                        className="w-full h-full object-cover opacity-80"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = logoIcon;
                        }}
                      />
                    ) : (
                      <div className="text-xs text-white/30 font-light flex items-center gap-1.5 uppercase tracking-widest select-none">
                        No Image Loaded
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full text-center bg-white text-black font-body font-medium hover:bg-white/90 active:scale-[0.98] transition-all rounded-full py-3.5 text-sm flex items-center justify-center gap-1.5 shadow-lg mt-2 cursor-pointer"
                >
                  Publish Live Showcase
                </button>
              </form>
            </div>
          </div>

          {/* Right Side: Showcase registry list */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/5 shadow-2xl flex flex-col gap-6">
              <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                <Layers className="h-5 w-5 text-white/80" />
                <h2 className="text-2xl font-heading italic text-white">Featured Portfolio Registry</h2>
              </div>

              {showcases.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center gap-3">
                  <AlertCircle className="h-8 w-8 text-white/30 animate-pulse" />
                  <p className="text-white/40 text-sm font-light">
                    No showcased websites found. Upload your first live website using the form!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 max-h-[660px] overflow-y-auto pr-2">
                  {showcases.map((project) => (
                    <div
                      key={project.id}
                      className="liquid-glass rounded-2xl p-5 border border-white/5 shadow-md flex items-center justify-between gap-4 hover:border-white/10 transition-colors"
                    >
                      <div className="flex flex-col items-start text-left gap-1">
                        <span className="px-2 py-0.5 rounded-full text-[9px] bg-white/10 text-white border border-white/5 uppercase tracking-wider font-semibold">
                          {project.category}
                        </span>
                        <h3 className="text-lg font-body font-medium text-white mt-1">
                          {project.title}
                        </h3>
                        <p className="text-white/40 text-xs font-light font-mono truncate max-w-sm">
                          {project.websiteLink}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        className="liquid-glass rounded-full p-2.5 text-white/50 hover:text-red-400 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                        title="Remove Showcase"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      ) : (
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-6">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/5 shadow-2xl flex flex-col gap-6 text-left">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-white/80" />
                <h2 className="text-2xl font-heading italic text-white">Contact Form Inquiries</h2>
              </div>
              <div className="flex items-center gap-3">
                {leads.length > 0 && (
                  <button
                    onClick={handleExportCSV}
                    className="bg-white text-black font-body font-medium hover:bg-white/90 active:scale-[0.97] transition-all rounded-full px-4 py-2 text-xs flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    Export to Excel (CSV)
                  </button>
                )}
                <span className="text-xs text-white/40">{leads.length} Total Submissions</span>
              </div>
            </div>

            {leads.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center gap-3">
                <AlertCircle className="h-8 w-8 text-white/30 animate-pulse" />
                <p className="text-white/40 text-sm font-light">
                  No contact inquiries found. Submissions from the contact form will appear here.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {leads.map((lead, index) => (
                  <div
                    key={index}
                    className="liquid-glass rounded-2xl p-6 border border-white/5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-white/10 transition-colors"
                  >
                    <div className="flex flex-col gap-2 text-left flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-white">{lead.name}</span>
                        <span className="text-xs text-white/40 font-mono">({lead.email})</span>
                        {lead.phone && (
                          <span className="text-xs text-white/40 font-mono">({lead.phone})</span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[9px] bg-white/10 text-white border border-white/5 uppercase tracking-wider font-semibold">
                          {lead.project_type || "General Inquiry"}
                        </span>
                      </div>
                      <p className="text-white/70 font-body font-light text-sm bg-white/[0.01] border border-white/5 rounded-xl p-4 mt-1 leading-relaxed whitespace-pre-wrap">
                        {lead.message}
                      </p>
                      <span className="text-[10px] text-white/30 font-mono mt-1">
                        Received: {new Date(lead.created_at).toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteLead(index)}
                      className="liquid-glass rounded-full p-2.5 text-white/50 hover:text-red-400 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 active:scale-95 transition-all flex items-center justify-center cursor-pointer max-w-fit align-self-end sm:align-self-center"
                      title="Clear Submission"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
