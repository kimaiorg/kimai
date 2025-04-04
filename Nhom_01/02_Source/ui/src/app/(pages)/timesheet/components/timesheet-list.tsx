"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Timesheet } from "@/type_schema/timesheet";
import { MoreHorizontal } from "lucide-react";
import { TimesheetPagination } from "./timesheet-pagination";

interface TimesheetListProps {
  timesheets: Timesheet[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onStartTimesheet?: (userId: string) => void;
  onEndTimesheet?: (userId: string) => void;
  currentUserId?: string;
}

export function TimesheetList({ 
  timesheets, 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage,
  onStartTimesheet,
  onEndTimesheet,
  currentUserId
}: TimesheetListProps) {
  // Calculate the current items to display based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = timesheets.slice(indexOfFirstItem, indexOfLastItem);

  // Format duration from seconds to HH:MM:SS
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "-";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if a timesheet is running (no end_time)
  const isRunning = (timesheet: Timesheet) => !timesheet.end_time;

  // Format date to local date and time
  const formatDateTime = (date?: Date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString();
  };

  return (
    <div>
      <div className="rounded-md border bg-white dark:bg-slate-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">DESCRIPTION</TableHead>
              <TableHead>PROJECT</TableHead>
              <TableHead>ACTIVITY</TableHead>
              <TableHead>START TIME</TableHead>
              <TableHead>END TIME</TableHead>
              <TableHead>DURATION</TableHead>
              <TableHead>USER</TableHead>
              <TableHead className="w-[5%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((timesheet) => (
              <TableRow key={timesheet.id} className={isRunning(timesheet) ? "bg-green-50 dark:bg-green-900/10" : ""}>
                <TableCell className="font-medium">
                  {timesheet.description || "-"}
                </TableCell>
                <TableCell>{timesheet.project || "-"}</TableCell>
                <TableCell>{timesheet.activity || "-"}</TableCell>
                <TableCell>{formatDateTime(timesheet.start_time)}</TableCell>
                <TableCell>{formatDateTime(timesheet.end_time)}</TableCell>
                <TableCell>{formatDuration(timesheet.duration)}</TableCell>
                <TableCell>{timesheet.user_name || timesheet.user_id}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Show details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Export</DropdownMenuItem>
                        <DropdownMenuItem>Create copy</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination component */}
      <TimesheetPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
