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
import { Project } from "@/type_schema/project";
import { MoreHorizontal } from "lucide-react";
import { ProjectPagination } from "./project-pagination";

interface ProjectListProps {
  projects: Project[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

export function ProjectList({ projects, currentPage, totalPages, onPageChange, itemsPerPage }: ProjectListProps) {
  // Calculate the current items to display based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className="rounded-md border bg-white dark:bg-slate-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">NAME</TableHead>
              <TableHead className="text-right">CUSTOMER</TableHead>
              <TableHead className="text-right">BUDGET</TableHead>
              <TableHead className="text-right">DATE RANGE</TableHead>
              <TableHead className="w-[5%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  {project.visible ? (
                    <div className="flex items-center">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: project.color || "#FF5733" }}
                      ></div>
                      <span className="ml-2">{project.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: project.color || "#6C757D" }}
                      ></div>
                      <span className="ml-2 text-muted-foreground">{project.name}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">{project.customer}</TableCell>
                <TableCell className="text-right">
                  {project.budget ? `$${project.budget.toLocaleString()}` : "-"}
                </TableCell>
                <TableCell className="text-right">
                  {project.start_date && project.end_date
                    ? `${project.start_date.toLocaleDateString()} - ${project.end_date.toLocaleDateString()}`
                    : project.start_date
                      ? `From ${project.start_date.toLocaleDateString()}`
                      : project.end_date
                        ? `Until ${project.end_date.toLocaleDateString()}`
                        : "-"}
                </TableCell>
                <TableCell>
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
                      <DropdownMenuItem>Show</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Permissions</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Filter data</DropdownMenuItem>
                      <DropdownMenuItem>Create activity</DropdownMenuItem>
                      <DropdownMenuItem>Create copy</DropdownMenuItem>
                      <DropdownMenuItem>Project details</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination component */}
      <ProjectPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
