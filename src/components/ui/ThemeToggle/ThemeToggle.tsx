"use client";

import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, cycleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <button
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-400"
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
      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
      style={{ backgroundColor: "transparent" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "var(--sidebar-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
      }}
      aria-label={`Current theme: ${label}. Click to toggle theme.`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </button>
  );
}

export default ThemeToggle;
