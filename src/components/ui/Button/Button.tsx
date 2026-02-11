"use client";

import type { ButtonProps } from "./types";

const variantClasses: Record<string, string> = {
  primary:
    "bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50",
  secondary:
    "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-[#4c566a] dark:bg-[#3b4252] dark:text-[#e5e9f0] dark:hover:bg-[#434c5e]",
  danger:
    "bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/50",
  ghost:
    "text-zinc-600 hover:bg-zinc-100 dark:text-[#d8dee9] dark:hover:bg-[#434c5e]",
  text:
    "text-zinc-600 hover:text-zinc-900 dark:text-[#d8dee9] dark:hover:text-[#eceff4]",
};

const sizeClasses: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-[#2e3440]";

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const isDisabled = disabled || loading;

  const loadingSpinner = (
    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
  );

  return (
    <button className={classes} disabled={isDisabled} {...props}>
      {loading && loadingSpinner}
      {!loading && icon && iconPosition === "left" && icon}
      {children}
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
}
