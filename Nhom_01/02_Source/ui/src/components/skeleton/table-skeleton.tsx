"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

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

export function TimesheetTableSkeleton() {
  // Number of project rows to show in skeleton
  const projectCount = 6;
  // Number of day columns (7 days + total column)
  const dayCount = 8;

  return (
    <div className="space-y-4">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-md border">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="relative">
            <Skeleton className="h-10 w-[200px] rounded-md" />
          </div>
          <button className="p-2 rounded-md border">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-[180px] rounded-md" />
          <Skeleton className="h-10 w-[180px] rounded-md" />
          <div className="flex gap-2">
            <button className="p-2 rounded-md border flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>Excel</span>
            </button>
            <button className="p-2 rounded-md border flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Timesheet table */}
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <Skeleton className="h-5 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-5 w-12" />
              </TableHead>
              {Array.from({ length: dayCount - 2 }).map((_, index) => (
                <TableHead key={`day-${index}`}>
                  <div className="flex flex-col items-center">
                    <Skeleton className="h-5 w-16" />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: projectCount }).map((_, rowIndex) => (
              <TableRow key={`project-${rowIndex}`}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-200" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-12" />
                </TableCell>
                {Array.from({ length: dayCount - 2 }).map((_, dayIndex) => (
                  <TableCell
                    key={`cell-${rowIndex}-${dayIndex}`}
                    className="text-center"
                  >
                    {Math.random() > 0.6 && <Skeleton className="h-5 w-10 mx-auto" />}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {/* Total row */}
            <TableRow className="font-medium">
              <TableCell>
                <Skeleton className="h-5 w-12" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-5 w-12" />
              </TableCell>
              {Array.from({ length: dayCount - 2 }).map((_, index) => (
                <TableCell
                  key={`total-${index}`}
                  className="text-center"
                >
                  <Skeleton className="h-5 w-12 mx-auto" />
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
