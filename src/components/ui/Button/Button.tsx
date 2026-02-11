"use client";

import type { ButtonProps } from "./types";

const variantClasses: Record<string, string> = {
  primary:
    "bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50",
  secondary:
    "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-[#333741] dark:bg-[#161B26] dark:text-[#CECFD2] dark:hover:bg-[#1F242F]",
  danger:
    "bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/50",
  ghost:
    "text-zinc-600 hover:bg-zinc-100 dark:text-[#94969C] dark:hover:bg-[#1F242F]",
  text:
    "text-zinc-600 hover:text-zinc-900 dark:text-[#94969C] dark:hover:text-white",
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
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none";

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
