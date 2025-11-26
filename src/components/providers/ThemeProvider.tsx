"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { safeStorage } from "../../utils/webViewUtils";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);

    if (typeof window !== "undefined") {
      const html = document.documentElement;

      // Remove all theme classes
      html.classList.remove("light", "dark");
      html.removeAttribute("data-theme");

      // Add the new theme class and data attribute for KitKat compatibility
      html.classList.add(newTheme);
      html.setAttribute("data-theme", newTheme);

      // Store in localStorage (WebView-safe)
      safeStorage.setItem("theme", newTheme);

      console.log("Theme set to:", newTheme, "HTML classes:", html.className);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      // Get stored theme or default to dark (WebView-safe)
      const storedTheme = safeStorage.getItem("theme") as Theme | null;
      const initialTheme = storedTheme || "dark";

      console.log("Initializing theme:", initialTheme);
      setTheme(initialTheme);
    }
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <ThemeContext.Provider
        value={{
          theme: "dark",
          setTheme: () => {},
          toggleTheme: () => {},
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
