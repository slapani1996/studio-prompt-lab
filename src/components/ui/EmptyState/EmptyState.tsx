'use client';

import type { EmptyStateProps } from './types';

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 p-8 text-center dark:border-[#4c566a]">
      {icon && (
        <div className="mb-4 text-zinc-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-zinc-900 dark:text-[#eceff4]">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-zinc-500 dark:text-[#d8dee9]">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
