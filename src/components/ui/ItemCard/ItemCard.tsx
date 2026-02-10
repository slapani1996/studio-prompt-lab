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
      className={`overflow-hidden rounded-lg border bg-white shadow-sm transition-all dark:bg-gray-800 ${
        selected
          ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
          : 'border-gray-200 dark:border-gray-700'
      } ${isClickable ? 'cursor-pointer hover:shadow-md' : ''} ${className}`}
    >
      {image && (
        <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
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
            <h3 className="truncate font-medium text-gray-900 dark:text-white">{title}</h3>
            {subtitle && (
              <p className="mt-0.5 truncate text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>

        {description && (
          <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
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
