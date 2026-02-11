"use client";

import { useState, type ReactNode } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
} from "./Table";
import { Pagination } from "../Pagination";

export interface PaginatedTableColumn {
  header: string;
  align?: "left" | "center" | "right";
}

export interface PaginatedTableProps<T> {
  data: T[];
  columns: PaginatedTableColumn[];
  renderRow: (item: T, index: number) => ReactNode;
  pageSize?: number;
  emptyMessage?: ReactNode;
  className?: string;
}

export function PaginatedTable<T>({
  data,
  columns,
  renderRow,
  pageSize = 10,
  emptyMessage,
  className = "",
}: PaginatedTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  // Reset to page 1 if current page exceeds total pages (e.g., after filtering)
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  if (data.length === 0 && emptyMessage) {
    return <>{emptyMessage}</>;
  }

  return (
    <div className={className}>
      <Table>
        <TableHead>
          <TableRow hoverable={false}>
            {columns.map((column, index) => (
              <TableHeader key={index} align={column.align}>
                {column.header}
              </TableHeader>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((item, index) => renderRow(item, startIndex + index))}
        </TableBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        totalItems={data.length}
      />
    </div>
  );
}
