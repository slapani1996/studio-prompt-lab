'use client';

import type { ItemCardProps } from './types';

export function ItemCard({
  title,
  subtitle,
  description,
  image,
  badge,
  actions,
  onClick,
  selected = false,
  className = '',
}: ItemCardProps) {
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={`overflow-hidden rounded-lg border bg-white shadow-sm transition-all dark:bg-[#3b4252] ${
        selected
          ? 'border-[#88c0d0] ring-2 ring-[#88c0d0]/30 dark:ring-[#88c0d0]/30'
          : 'border-zinc-200 dark:border-[#4c566a]'
      } ${isClickable ? 'cursor-pointer hover:shadow-lg hover:shadow-violet-500/10' : ''} ${className}`}
    >
      {image && (
        <div className="aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-[#434c5e]">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-medium text-zinc-900 dark:text-[#eceff4]">{title}</h3>
            {subtitle && (
              <p className="mt-0.5 truncate text-sm text-zinc-500 dark:text-[#d8dee9]">
                {subtitle}
              </p>
            )}
          </div>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>

        {description && (
          <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-[#d8dee9]">
            {description}
          </p>
        )}

        {actions && (
          <div className="mt-4 flex items-center justify-end gap-2">{actions}</div>
        )}
      </div>
    </div>
  );
}
