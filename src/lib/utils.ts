/**
 * Returns Tailwind CSS classes for status badge styling
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'running':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'pending':
    default:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
  }
}

/**
 * Safely parse JSON with a fallback value
 */
export function safeJsonParse<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Format a date string or Date object
 */
export function formatDate(date: string | Date, format: 'date' | 'datetime' = 'datetime'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (format === 'date') {
    return d.toLocaleDateString();
  }

  return d.toLocaleString();
}

/**
 * Truncate an ID string for display
 */
export function truncateId(id: string, length: number = 8): string {
  if (id.length <= length) return id;
  return `${id.slice(0, length)}...`;
}
