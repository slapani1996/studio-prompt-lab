"use client";

import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, cycleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <button
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium"
        style={{ color: "var(--sidebar-text)" }}
        disabled
      >
        <Sun className="h-5 w-5" />
        <span>Theme</span>
      </button>
    );
  }

  const Icon = theme === "light" ? Sun : Moon;
  const label = theme === "light" ? "Light" : "Dark";

  return (
    <button
      onClick={cycleTheme}
      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors"
      style={{ backgroundColor: "transparent", color: "var(--sidebar-text)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--sidebar-hover)";
        e.currentTarget.style.color = "var(--sidebar-text-active)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = "var(--sidebar-text)";
      }}
      aria-label={`Current theme: ${label}. Click to toggle theme.`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </button>
  );
}

export default ThemeToggle;
