"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ThemeSettings = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  foregroundColor: string;
  mutedColor: string;
  cardBackground: string;
  fontFamily: string;
  headingFont: string;
  borderRadius: string;
  darkMode: string;
};

const defaultTheme: ThemeSettings = {
  primaryColor: "#6366f1",
  secondaryColor: "#8b5cf6",
  accentColor: "#06b6d4",
  backgroundColor: "#ffffff",
  foregroundColor: "#171717",
  mutedColor: "#f5f5f5",
  cardBackground: "#ffffff",
  fontFamily: "Inter",
  headingFont: "Inter",
  borderRadius: "0.5rem",
  darkMode: "false",
};

const ThemeContext = createContext<ThemeSettings>(defaultTheme);

export function useThemeSettings() {
  return useContext(ThemeContext);
}

function hexToHsl(hex: string): string {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function hexToRgb(hex: string): string {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `${r} ${g} ${b}`;
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(defaultTheme);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(() => {});

    // Listen for settings updates from admin page
    const handler = (e: CustomEvent<ThemeSettings>) => {
      setSettings(e.detail);
    };
    window.addEventListener("theme-updated" as string, handler as EventListener);
    return () => window.removeEventListener("theme-updated" as string, handler as EventListener);
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    // Colors
    root.style.setProperty("--primary", hexToHsl(settings.primaryColor));
    root.style.setProperty("--primary-foreground", "#0 0% 100%");
    root.style.setProperty("--secondary", hexToHsl(settings.secondaryColor));
    root.style.setProperty("--secondary-foreground", "#0 0% 100%");
    root.style.setProperty("--accent", hexToHsl(settings.accentColor));
    root.style.setProperty("--accent-foreground", "#0 0% 100%");
    root.style.setProperty("--background", hexToHsl(settings.backgroundColor));
    root.style.setProperty("--foreground", hexToHsl(settings.foregroundColor));
    root.style.setProperty("--muted", hexToHsl(settings.mutedColor));
    root.style.setProperty("--muted-foreground", hexToHsl(settings.foregroundColor));
    root.style.setProperty("--card", hexToHsl(settings.cardBackground));
    root.style.setProperty("--card-foreground", hexToHsl(settings.foregroundColor));
    root.style.setProperty("--border", hexToHsl(settings.mutedColor));
    root.style.setProperty("--input", hexToHsl(settings.mutedColor));
    root.style.setProperty("--ring", hexToHsl(settings.primaryColor));

    // Fonts
    root.style.setProperty("--font-sans", `${settings.fontFamily}, ui-sans-serif, system-ui, sans-serif`);
    root.style.setProperty("--font-heading", `${settings.headingFont}, ui-sans-serif, system-ui, sans-serif`);

    // Border radius
    root.style.setProperty("--radius", settings.borderRadius);
  }, [settings]);

  return (
    <ThemeContext.Provider value={settings}>
      {children}
    </ThemeContext.Provider>
  );
}