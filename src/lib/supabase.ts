import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://qyngenapdhvjuyxnyfnh.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserSession {
  email: string;
  role: "admin" | "user";
  id: string;
}

// Single fixed admin credentials
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "niranjtoms691@gmail.com";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "ElementDesign@2026";

// Simple local state observer for react components
type AuthListener = (session: UserSession | null) => void;
const listeners = new Set<AuthListener>();

export const getSession = (): UserSession | null => {
  const saved = localStorage.getItem("liquid_auth_session");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
};

const setSession = (session: UserSession | null) => {
  if (session) {
    localStorage.setItem("liquid_auth_session", JSON.stringify(session));
  } else {
    localStorage.removeItem("liquid_auth_session");
  }
  listeners.forEach((listener) => listener(session));
};

export const onAuthStateChange = (listener: AuthListener) => {
  listeners.add(listener);
  // Initial emit
  listener(getSession());
  return () => {
    listeners.delete(listener);
  };
};

export const authService = {
  async signUp(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    // Intercept admin registration
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return { success: false, error: "The admin email is reserved and cannot be registered." };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Automatically sign in user
      if (data.user) {
        setSession({
          email: data.user.email || email,
          role: "user",
          id: data.user.id,
        });
        return { success: true };
      }
      return { success: true, error: "Please check your email for a confirmation link!" };
    } catch (err: any) {
      // If Supabase call fails or has network issues, fall back to simulated registration
      console.warn("Supabase auth error, using fallback simulated registration:", err);
      
      const localUsers = JSON.parse(localStorage.getItem("liquid_simulated_users") || "[]");
      if (localUsers.some((u: any) => u.email === email)) {
        return { success: false, error: "User already exists." };
      }
      
      const newUser = { email, password, id: Math.random().toString(36).substring(2, 9) };
      localUsers.push(newUser);
      localStorage.setItem("liquid_simulated_users", JSON.stringify(localUsers));
      
      setSession({
        email: newUser.email,
        role: "user",
        id: newUser.id,
      });
      return { success: true };
    }
  },

  async signIn(email: string, password: string): Promise<{ success: boolean; role?: "admin" | "user"; error?: string }> {
    // Intercept fixed admin login
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      if (password === ADMIN_PASSWORD) {
        const adminSession: UserSession = {
          email: ADMIN_EMAIL,
          role: "admin",
          id: "admin-fixed-id",
        };
        setSession(adminSession);
        return { success: true, role: "admin" };
      } else {
        return { success: false, error: "Invalid admin password." };
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const userSession: UserSession = {
          email: data.user.email || email,
          role: "user",
          id: data.user.id,
        };
        setSession(userSession);
        return { success: true, role: "user" };
      }
      return { success: false, error: "Failed to sign in. User session could not be established." };
    } catch (err: any) {
      console.warn("Supabase signin error, trying fallback local database:", err);
      
      // Fallback local auth for testing
      const localUsers = JSON.parse(localStorage.getItem("liquid_simulated_users") || "[]");
      const matchedUser = localUsers.find((u: any) => u.email === email && u.password === password);
      
      if (matchedUser) {
        const userSession: UserSession = {
          email: matchedUser.email,
          role: "user",
          id: matchedUser.id,
        };
        setSession(userSession);
        return { success: true, role: "user" };
      }
      
      return { success: false, error: err.message || "Invalid credentials." };
    }
  },

  async signOut() {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase signOut error, logging out locally:", e);
    }
    setSession(null);
  }
};
