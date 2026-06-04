import React, { useState, useEffect } from "react";
import logoIcon from "@/assets/logo-icon.png";
import { ArrowUpRight, Menu, X, LogOut, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { onAuthStateChange, UserSession, authService } from "@/lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentSession) => {
      setSession(currentSession);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await authService.signOut();
    toast({
      title: "Logged Out",
      description: "Successfully logged out of your showcase profile.",
    });
    navigate("/");
  };

  const navLinks = [
    { label: "Home", href: "/#home" },
    { label: "Services", href: "/#services" },
    { label: "Work", href: "/works" },
    { label: "Process", href: "/#process" },
    { label: "Pricing", href: "/#pricing" },
  ];

  return (
    <>
      <nav className="fixed top-4 left-0 right-0 z-50 px-8 lg:px-16 py-3 flex items-center justify-between">
        {/* Left: Logo image */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
          <img src={logoIcon} alt="Element Designs" className="h-12 w-12 object-contain" />
          <span className="font-heading italic text-xl tracking-tight text-white inline-block">
            Element Designs
          </span>
        </Link>

        {/* Center/Right Pill for Desktop */}
        <div className="hidden md:flex items-center justify-center liquid-glass rounded-full px-2.5 py-1">
          <div className="flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isAnchor = link.href.startsWith("/#");
              return isAnchor ? (
                <a
                  key={link.label}
                  href={link.href.substring(1)} // convert /#section to #section for smooth scroll
                  className="px-3.5 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors font-body rounded-full hover:bg-white/5"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  to={link.href}
                  className="px-3.5 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors font-body rounded-full hover:bg-white/5"
                >
                  {link.label}
                </Link>
              );
            })}

            {session ? (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/10">
                {session.role === "admin" && (
                  <Link
                    to="/admin"
                    className="bg-white/10 text-white border border-white/10 font-body font-medium hover:bg-white/20 transition-all rounded-full px-3.5 py-1.5 text-xs flex items-center gap-1 shadow-sm"
                  >
                    <Shield className="h-3.5 w-3.5 text-white/80" />
                    Admin Control
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-white text-black font-body font-medium hover:bg-white/90 transition-all rounded-full px-3.5 py-1.5 text-xs flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  Logout
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="ml-2 bg-white text-black font-body font-medium hover:bg-white/90 transition-all rounded-full px-4 py-1.5 text-sm flex items-center gap-1 shadow-sm hover:scale-[1.03] active:scale-[0.98]"
              >
                Access Showroom
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Hamburger menu */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="liquid-glass rounded-full p-2.5 hover:bg-white/10 transition-colors flex items-center justify-center border border-white/10 text-white"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col justify-between p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={logoIcon} alt="Element Designs" className="h-12 w-12 object-contain" />
                <span className="font-heading italic text-xl tracking-tight text-white">
                  Element Designs
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="liquid-glass rounded-full p-2.5 hover:bg-white/10 transition-colors flex items-center justify-center border border-white/10 text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Links */}
            <div className="flex flex-col gap-6 my-auto text-left pl-4">
              {navLinks.map((link, idx) => {
                const isAnchor = link.href.startsWith("/#");
                return isAnchor ? (
                  <motion.a
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: idx * 0.05 }}
                    key={link.label}
                    href={link.href.substring(1)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-heading italic text-4xl md:text-5xl text-white/70 hover:text-white hover:pl-2 transition-all duration-300"
                  >
                    {link.label}
                  </motion.a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-heading italic text-4xl md:text-5xl text-white/70 hover:text-white hover:pl-2 transition-all duration-300"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Footer / CTA Button */}
            <div className="flex flex-col gap-4">
              {session ? (
                <div className="flex flex-col gap-3">
                  {session.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center bg-white/10 text-white border border-white/10 font-body font-medium hover:bg-white/20 transition-all rounded-full py-3.5 flex items-center justify-center gap-1.5 text-base shadow-lg"
                    >
                      <Shield className="h-5 w-5" />
                      Admin Control Board
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-center bg-white text-black font-body font-medium hover:bg-white/95 transition-all rounded-full py-3.5 flex items-center justify-center gap-1.5 text-base shadow-lg cursor-pointer"
                  >
                    Logout
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-white text-black font-body font-medium hover:bg-white/95 transition-all rounded-full py-3.5 flex items-center justify-center gap-1 text-base shadow-lg"
                >
                  Access Showroom
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              )}
              <p className="text-center text-white/30 text-xs font-body pt-4">
                &copy; 2026 Element Designs. All rights reserved.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
