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
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-[#333741]">
      <table
        className={`min-w-full divide-y divide-zinc-200 dark:divide-[#333741] ${className}`}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className = "", ...props }: TableHeadProps) {
  return (
    <thead className={`bg-zinc-50 dark:bg-[#161B26] ${className}`} {...props}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = "", ...props }: TableBodyProps) {
  return (
    <tbody
      className={`divide-y divide-zinc-200 bg-white dark:divide-[#333741] dark:bg-[#161B26] ${className}`}
      {...props}
    >
      {children}
    </tbody>
  );
}

export function TableRow({ children, hoverable = true, className = "", ...props }: TableRowProps) {
  const hoverClasses = hoverable ? "hover:bg-zinc-50 dark:hover:bg-[#1F242F]" : "";
  return (
    <tr className={`${hoverClasses} ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function TableHeader({
  children,
  className = "",
  align = "left",
  ...props
}: TableHeaderProps) {
  const alignmentClass =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";

  return (
    <th
      className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-[#94969C] ${alignmentClass} ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className = "",
  align = "left",
  ...props
}: TableCellProps) {
  const alignmentClass =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";

  return (
    <td
      className={`whitespace-nowrap px-6 py-4 text-sm text-zinc-700 dark:text-[#CECFD2] ${alignmentClass} ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}
