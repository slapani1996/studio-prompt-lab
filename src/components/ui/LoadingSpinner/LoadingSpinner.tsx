'use client';

import type { LoadingSpinnerProps } from './types';

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-4',
  lg: 'h-12 w-12 border-4',
};

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-violet-500 border-t-transparent ${sizeClasses[size]} ${className}`}
    />
  );
}
