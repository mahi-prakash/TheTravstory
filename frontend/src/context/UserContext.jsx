import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";

const UserContext = createContext(null);

const API_URL = "http://localhost:5000/api";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || sessionStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
  const fetchUser = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
      } else {
        // Token is invalid, clear it
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };
  fetchUser();
}, [token]);

  useEffect(() => {
    // Listen for Supabase OAuth redirects
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // User logged in via Supabase Google OAuth!
        // Sync with our custom backend
        try {
          const id = session.user.id;
          const { email, full_name, avatar_url } = session.user.user_metadata;
          const data = await loginWithGoogle(id, email, full_name, avatar_url);
          
          // 🔥 REDIRECT GUARD: Only redirect if we are on an auth-related page
          // This prevents the "refresh redirect" bug where users are kicked out of /planner
          const currentPath = window.location.pathname;
          const isAuthPage = currentPath === "/" || currentPath === "/auth" || currentPath === "/quiz";

          if (isAuthPage) {
            if (data.user.quiz_completed) {
              navigate("/chat");
            } else {
              navigate("/quiz");
            }
          }
          
        } catch (err) {
          console.error("Failed to sync Supabase Google login with backend:", err);
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password, persist = true) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Login failed");

    if (persist) {
      localStorage.setItem("token", data.token);
    } else {
      sessionStorage.setItem("token", data.token);
    }
    
    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const loginWithGoogle = async (id, email, name, picture) => {
    const res = await fetch(`${API_URL}/auth/google-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, email, name, picture }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Google Login failed");

    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/");
  };

  const setPersonality = (tag) => {
    setUser((prev) => ({ ...prev, personalityTag: tag }));
  };

  const updatePreferences = (prefs) => {
    setUser((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, ...prefs },
    }));
  };

  return (
    <UserContext.Provider
      value={{ user, token, login, loginWithGoogle, logout, setUser, setPersonality, updatePreferences }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);