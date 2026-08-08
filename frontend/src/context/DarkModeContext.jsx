// frontend/src/context/DarkModeContext.jsx

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.theme || "light";
      }
    } catch (e) {}
    return localStorage.getItem("homy_theme") || "light";
  });

  const [currency, setCurrencyState] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.currency || "₹";
      }
    } catch (e) {}
    return localStorage.getItem("homy_currency") || "₹";
  });

  const [language, setLanguageState] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.language || "English";
      }
    } catch (e) {}
    return localStorage.getItem("homy_language") || "English";
  });

  const [isDark, setIsDark] = useState(false);

  // Sync preferences with MongoDB user account & local session details
  const syncPreferences = async (updatedFields) => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        const nextUser = { ...parsed, ...updatedFields };
        localStorage.setItem("user", JSON.stringify(nextUser));
        
        // Dispatch storage event to alert other tabs and navbar
        window.dispatchEvent(new Event("storage"));

        // Save preferences inside MongoDB
        await axios.put(`${API_BASE_URL}/users/${parsed._id}`, updatedFields);
      }
    } catch (err) {
      console.error("Preferences sync error:", err);
    }
  };

  const setTheme = (t) => {
    setThemeState(t);
    localStorage.setItem("homy_theme", t);
    syncPreferences({ theme: t });
  };

  const setCurrency = (c) => {
    setCurrencyState(c);
    localStorage.setItem("homy_currency", c);
    syncPreferences({ currency: c });
  };

  const setLanguage = (l) => {
    setLanguageState(l);
    localStorage.setItem("homy_language", l);
    syncPreferences({ language: l });
  };

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.theme && parsed.theme !== theme) setThemeState(parsed.theme);
          if (parsed.currency && parsed.currency !== currency) setCurrencyState(parsed.currency);
          if (parsed.language && parsed.language !== language) setLanguageState(parsed.language);
        }
      } catch (e) {}
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [theme, currency, language]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (resolvedTheme) => {
      if (resolvedTheme === "dark") {
        root.classList.add("dark");
        setIsDark(true);
      } else {
        root.classList.remove("dark");
        setIsDark(false);
      }
    };

    if (theme === "system") {
      applyTheme("light");
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  // Display layer price formatting (Base prices are stored in INR)
  // INR (₹) = base_price * 1
  // USD ($) = base_price * 0.012
  // EUR (€) = base_price * 0.011
  const formatPrice = (inrPrice) => {
    if (inrPrice === undefined || inrPrice === null) return "";
    let rate = 1;
    let symbol = "₹";
    
    if (currency === "$") {
      rate = 0.012;
      symbol = "$";
    } else if (currency === "€") {
      rate = 0.011;
      symbol = "€";
    }

    const converted = Math.round(inrPrice * rate);
    return `${symbol}${converted.toLocaleString("en-IN")}`;
  };

  return (
    <PreferencesContext.Provider value={{ 
      theme, setTheme, isDark, 
      currency, setCurrency, 
      language, setLanguage, 
      formatPrice 
    }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
};

// Aliases for backward-compatibility with existing pages importing DarkModeContext
export const DarkModeProvider = PreferencesProvider;
export const useDarkMode = () => {
  const { theme, setTheme, isDark } = usePreferences();
  return { theme, setTheme, isDark };
};
