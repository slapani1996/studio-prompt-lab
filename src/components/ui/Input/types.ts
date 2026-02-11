import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export interface FormGroupProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  helperText?: string;
  children: ReactNode;
  required?: boolean;
}
