"use client";

import { useEffect } from "react";
import type { ModalProps } from "./types";
import { X } from "lucide-react";

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  className,
  scrollable = false,
}: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div
        className={`relative z-10 w-full ${sizeClasses[size]} mx-4 rounded-lg bg-white shadow-xl dark:bg-[#161B26] ${scrollable ? "max-h-[90vh] flex flex-col" : ""} ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-[#333741]">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-900/20 dark:hover:text-zinc-400"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className={`px-6 py-4 ${scrollable ? "overflow-y-auto flex-1 min-h-0" : ""}`}>{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-3 border-t border-zinc-200 px-6 py-4 dark:border-[#333741]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
