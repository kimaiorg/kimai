"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";

interface SkeletonTableProps {
  columns?: number;
  rows?: number;
}

export function TableSkeleton({ columns = 6, rows = 10 }: SkeletonTableProps) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={`row-${rowIndex}`}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={`cell-${rowIndex}-${colIndex}`}>
              <Skeleton className={`h-5 w-full ${colIndex === 0 ? "max-w-[80px]" : "max-w-[120px]"}`} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
