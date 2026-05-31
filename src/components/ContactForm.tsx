import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Mail, Send, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

const ContactForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState("Website Development");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setLoading(true);
    
    const submission = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      project_type: projectType,
      message: message.trim(),
      created_at: new Date().toISOString()
    };

    // 1. Try to send to Excel Webhook if configured
    const webhookUrl = import.meta.env.VITE_EXCEL_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submission),
          mode: "cors"
        });
        console.log("Submission pushed to Excel Webhook integration.");
      } catch (webhookErr) {
        console.warn("Excel Webhook push failed:", webhookErr);
      }
    }

    try {
      // 2. Try to send to Supabase database
      const { error } = await supabase
        .from("contact_submissions")
        .insert([submission]);
      
      if (error) throw error;
      
      console.log("Submission successfully saved to Supabase backend.");
    } catch (err) {
      console.warn("Supabase insertion failed, saving to local fallback storage:", err);
    } finally {
      // 3. Always store in local fallback registry to be accessible in Admin Panel
      const localSubmissions = JSON.parse(localStorage.getItem("element_designs_contact_submissions") || "[]");
      localSubmissions.unshift(submission);
      localStorage.setItem("element_designs_contact_submissions", JSON.stringify(localSubmissions));

      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full py-24 bg-black overflow-hidden flex items-center justify-center px-6 md:px-12"
    >
      {/* Dynamic Glow Backdrops */}
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-white/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center gap-8 text-center">
        {/* Badge */}
        <div className="liquid-glass rounded-full px-3.5 py-1.5 text-xs text-white/50 tracking-wider uppercase font-body border border-white/5 shadow-sm">
          Get In Touch
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading italic text-white tracking-tight leading-[0.9] max-w-xl">
          Let's build something beautiful.
        </h2>

        {/* Form Container */}
        <div className="w-full max-w-xl mx-auto mt-4">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="liquid-glass rounded-3xl p-8 border border-white/5 shadow-2xl flex flex-col gap-6"
              >
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
                  {/* Name Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
                      Your Name *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Sarah Chen"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all font-light"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="sarah@luminary.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all font-light"
                    />
                  </div>

                  {/* Contact Number Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
                      Contact Number *
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+1 (555) 019-2834"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all font-light"
                    />
                  </div>

                  {/* Project Type */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
                      Project Type
                    </label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="bg-neutral-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 font-light cursor-pointer"
                    >
                      <option>Website Development</option>
                      <option>Digital Marketing</option>
                      <option>Other / General Consultation</option>
                    </select>
                  </div>

                  {/* Message Input */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium">
                      Tell Us About Your Project *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="We need a premium web presence for our SaaS app featuring glassmorphism elements..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/20 transition-all font-light resize-none"
                    />
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="liquid-glass-strong text-white border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 rounded-full py-3.5 text-sm flex items-center justify-center gap-2 mt-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <>
                        Send Message
                        <Send className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="liquid-glass rounded-3xl p-12 border border-white/10 shadow-2xl flex flex-col items-center justify-center text-center gap-6"
              >
                {/* Success Checkmark with glowing ring */}
                <div className="liquid-glass-strong rounded-full w-16 h-16 flex items-center justify-center border border-white/20 text-white relative shadow-2xl">
                  <div className="absolute inset-0 rounded-full bg-white/5 blur-md" />
                  <Check className="h-7 w-7 stroke-[3] relative z-10" />
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-heading italic text-white leading-tight">
                    Thank you, {name.split(" ")[0]}!
                  </h3>
                  <p className="text-white/60 font-light text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
                    Your message has been received. Our team will review your project details and reach out within 24 hours.
                  </p>
                </div>

                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-white text-black font-body font-medium hover:bg-white/90 active:scale-[0.97] transition-all rounded-full px-6 py-2.5 text-xs shadow-lg mt-2 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Send Another Inquiry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
