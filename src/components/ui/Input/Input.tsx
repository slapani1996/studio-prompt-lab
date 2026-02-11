"use client";

import { forwardRef } from "react";
import type { InputProps, TextareaProps, FormGroupProps } from "./types";

const baseInputClasses =
  "block w-full rounded-md border border-zinc-300 px-3 py-2 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-[#4c566a] dark:bg-[#434c5e] dark:text-[#eceff4]";

const errorInputClasses =
  "border-rose-500 focus:border-rose-500 focus:ring-rose-500";

const labelClasses =
  "block text-sm font-medium text-zinc-700 dark:text-[#e5e9f0]";

const errorTextClasses = "mt-1 text-sm text-rose-600 dark:text-rose-400";

const helperTextClasses = "mt-1 text-sm text-zinc-500 dark:text-[#d8dee9]";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const inputClasses = `${baseInputClasses} ${error ? errorInputClasses : ""} ${className}`;

    return (
      <div>
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${label ? "mt-1" : ""} ${inputClasses}`}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className={errorTextClasses}>
            {error}
          </p>
        )}
        {helperText && !error && <p className={helperTextClasses}>{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const inputClasses = `${baseInputClasses} ${error ? errorInputClasses : ""} ${className}`;

    return (
      <div>
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`${label ? "mt-1" : ""} ${inputClasses}`}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className={errorTextClasses}>
            {error}
          </p>
        )}
        {helperText && !error && <p className={helperTextClasses}>{helperText}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export function FormGroup({
  label,
  htmlFor,
  error,
  helperText,
  children,
  required,
}: FormGroupProps) {
  return (
    <div>
      {label && (
        <label htmlFor={htmlFor} className={labelClasses}>
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <div className={label ? "mt-1" : ""}>{children}</div>
      {error && <p className={errorTextClasses}>{error}</p>}
      {helperText && !error && <p className={helperTextClasses}>{helperText}</p>}
    </div>
  );
}
