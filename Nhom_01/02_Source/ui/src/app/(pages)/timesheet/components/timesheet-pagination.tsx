"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface TimesheetPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TimesheetPagination({ currentPage, totalPages, onPageChange }: TimesheetPaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // If total pages is less than or equal to maxPagesToShow, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page, last page, and current page
      // Then add pages before and after current page

      // Start with current page
      pageNumbers.push(currentPage);

      // Add pages before current page
      const beforeCount = Math.min(Math.floor((maxPagesToShow - 3) / 2), currentPage - 1);
      for (let i = 1; i <= beforeCount; i++) {
        pageNumbers.unshift(currentPage - i);
      }

      // Add pages after current page
      const afterCount = Math.min(maxPagesToShow - 1 - beforeCount, totalPages - currentPage);
      for (let i = 1; i <= afterCount; i++) {
        pageNumbers.push(currentPage + i);
      }

      // If we still have room, add more pages before
      while (pageNumbers.length < maxPagesToShow - 2 && pageNumbers[0] > 1) {
        pageNumbers.unshift(pageNumbers[0] - 1);
      }

      // Add first page if not already included
      if (pageNumbers[0] > 1) {
        pageNumbers.unshift(1);
        // Add ellipsis if there's a gap
        if (pageNumbers[1] > 2) {
          pageNumbers.splice(1, 0, -1); // -1 represents ellipsis
        }
      }

      // Add last page if not already included
      if (pageNumbers[pageNumbers.length - 1] < totalPages) {
        // Add ellipsis if there's a gap
        if (pageNumbers[pageNumbers.length - 1] < totalPages - 1) {
          pageNumbers.push(-1); // -1 represents ellipsis
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pageNumbers.map((page, index) =>
        page === -1 ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2"
          >
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onPageChange(page)}
            className="h-8 w-8"
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
