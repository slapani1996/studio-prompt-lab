"use client";

import type {
  TableProps,
  TableHeadProps,
  TableBodyProps,
  TableRowProps,
  TableHeaderProps,
  TableCellProps,
} from "./types";

export function Table({ children, className = "", ...props }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-[#4c566a]">
      <table
        className={`min-w-full divide-y divide-zinc-200 dark:divide-[#4c566a] ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className = "", ...props }: TableHeadProps) {
  return (
    <thead className={`bg-zinc-50 dark:bg-[#3b4252] ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = "", ...props }: TableBodyProps) {
  return (
    <tbody
      className={`divide-y divide-zinc-200 bg-white dark:divide-[#4c566a] dark:bg-[#3b4252] ${className}`}
      {...props}
    >
      {children}
    </tbody>
  );
}

export function TableRow({ children, hoverable = true, className = "", ...props }: TableRowProps) {
  const hoverClasses = hoverable ? "hover:bg-zinc-50 dark:hover:bg-[#434c5e]" : "";
  return (
    <tr className={`${hoverClasses} ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function TableHeader({ children, className = "", ...props }: TableHeaderProps) {
  return (
    <th
      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-[#d8dee9] ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = "", ...props }: TableCellProps) {
  return (
    <td
      className={`whitespace-nowrap px-6 py-4 text-sm text-zinc-700 dark:text-[#e5e9f0] ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}
