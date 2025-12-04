"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type FontFamily = "sans" | "serif" | "mono" | "inter";

interface SettingsContextType {
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [fontFamily, setFontFamily] = useState<FontFamily>("sans");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedFont = localStorage.getItem("fontFamily") as FontFamily;
    if (savedFont) {
      setFontFamily(savedFont);
    }
    setIsLoaded(true);
  }, []);

  const handleSetFontFamily = (font: FontFamily) => {
    setFontFamily(font);
    localStorage.setItem("fontFamily", font);
  };

  const value = {
    fontFamily,
    setFontFamily: handleSetFontFamily,
  };

  // Prevent flash of default font by rendering children only after loading preference
  // or render anyway but with default font (better UX to show something)
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
