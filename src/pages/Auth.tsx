import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService, getSession } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import logoIcon from "@/assets/logo-icon.png";
import { ArrowLeft, Lock, Mail, UserPlus, LogIn, ShieldAlert, Sparkles, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

const Auth: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") === "admin" ? "admin" : "login";

  const [activeTab, setActiveTab] = useState<"login" | "signup" | "admin">(defaultTab as any);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect accordingly
  useEffect(() => {
    const session = getSession();
    if (session) {
      if (session.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/works");
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please enter both email and password.",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (activeTab === "signup") {
        const res = await authService.signUp(email.trim(), password.trim());
        if (res.success) {
          toast({
            title: "Account Created Successfully",
            description: res.error || "You are now logged in. Welcoming you to your portfolio showcase!",
          });
          navigate("/works");
        } else {
          toast({
            variant: "destructive",
            title: "Registration Failed",
            description: res.error || "Please verify your input and try again.",
          });
        }
      } else {
        // Handle User Login or Admin Login
        const res = await authService.signIn(email.trim(), password.trim());
        if (res.success) {
          toast({
            title: "Logged In Successfully",
            description: `Welcome back${res.role === "admin" ? " Chief Officer!" : "!"}`,
          });
          
          if (res.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/works");
          }
        } else {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: res.error || "Invalid credentials. Please verify your inputs.",
          });
        }
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-body overflow-x-hidden p-6 flex flex-col justify-between relative selection:bg-white selection:text-black">
      {/* Background Animated Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[140px] pointer-events-none animate-pulse" style={{ animationDuration: "8s" }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white/[0.03] rounded-full blur-[160px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between pb-6 mb-6">
        <Link
          to="/"
          className="liquid-glass rounded-full px-4 py-2 text-xs text-white/70 hover:text-white flex items-center gap-1.5 border border-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Home
        </Link>
        <div className="flex items-center gap-2">
          <img src={logoIcon} alt="Element Designs" className="h-10 w-10 object-contain" />
          <span className="font-heading italic text-xl tracking-tight text-white inline-block">Element Designs</span>
        </div>
      </div>

      {/* Main Form Box */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full liquid-glass rounded-[32px] p-6 sm:p-8 border border-white/5 shadow-2xl flex flex-col gap-6"
        >
          {/* Brand Introduction */}
          <div className="flex flex-col items-center text-center gap-2">
            <h2 className="text-3xl font-heading italic text-white tracking-tight flex items-center gap-2">
              {activeTab === "admin" ? (
                <>
                  <ShieldAlert className="h-6 w-6 text-white/80" />
                  Admin Console
                </>
              ) : activeTab === "signup" ? (
                <>
                  <UserPlus className="h-6 w-6 text-white/80" />
                  Join the Showcase
                </>
              ) : (
                <>
                  <Sparkles className="h-6 w-6 text-white/80" />
                  Access Portfolio
                </>
              )}
            </h2>
            <p className="text-xs text-white/40 font-light font-body max-w-xs mt-1">
              {activeTab === "admin" 
                ? "Restricted credentials board. Enter administration key pass."
                : activeTab === "signup"
                ? "Register a client profile to explore fully loaded visual showcase deliverability."
                : "Authentication terminal. Connect and explore design deliverables."}
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 bg-white/[0.02] border border-white/5 rounded-2xl p-1 relative">
            <button
              onClick={() => {
                setActiveTab("login");
                setEmail("");
                setPassword("");
              }}
              className={`py-2 text-xs rounded-xl font-medium transition-all duration-300 relative z-10 cursor-pointer ${
                activeTab === "login" ? "text-black font-semibold" : "text-white/60 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab("signup");
                setEmail("");
                setPassword("");
              }}
              className={`py-2 text-xs rounded-xl font-medium transition-all duration-300 relative z-10 cursor-pointer ${
                activeTab === "signup" ? "text-black font-semibold" : "text-white/60 hover:text-white"
              }`}
            >
              Register
            </button>
            <button
              onClick={() => {
                setActiveTab("admin");
                setEmail("");
                setPassword("");
              }}
              className={`py-2 text-xs rounded-xl font-medium transition-all duration-300 relative z-10 cursor-pointer ${
                activeTab === "admin" ? "text-black font-semibold" : "text-white/60 hover:text-white"
              }`}
            >
              Admin
            </button>

            {/* Sliding backdrop */}
            <div
              className="absolute top-1 bottom-1 bg-white rounded-[10px] shadow-sm transition-all duration-300 ease-out z-0"
              style={{
                left: activeTab === "login" ? "4px" : activeTab === "signup" ? "33.33%" : "66.66%",
                right: activeTab === "login" ? "66.66%" : activeTab === "signup" ? "33.33%" : "4px",
              }}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            {/* Email Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-wider text-white/30 font-medium">
                {activeTab === "admin" ? "Admin Access Email" : "Email Address"}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 flex items-center justify-center">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  required
                  type="email"
                  placeholder={activeTab === "admin" ? "executive@elementdesigns.com" : "client@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all font-light"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-wider text-white/30 font-medium">
                Passphrase
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 flex items-center justify-center">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all font-light"
                />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-center bg-white text-black font-body font-medium hover:bg-white/90 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all rounded-full py-3.5 text-sm flex items-center justify-center gap-2 shadow-lg mt-3 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-black" />
              ) : activeTab === "signup" ? (
                <>
                  <UserPlus className="h-4 w-4 text-black" />
                  Create Showcase Profile
                </>
              ) : activeTab === "admin" ? (
                <>
                  <LogIn className="h-4 w-4 text-black" />
                  Authenticate Executive Panel
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 text-black" />
                  Verify Credentials
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <div className="relative z-10 text-center py-6 text-white/20 text-[10px] tracking-widest font-mono uppercase">
        SECURED ENVELOPE / ELEMENT DESIGNS &copy; 2026
      </div>
    </div>
  );
};

export default Auth;
