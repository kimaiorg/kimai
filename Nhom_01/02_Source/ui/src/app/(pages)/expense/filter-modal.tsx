"use client";

import type React from "react";

import { getAllActivities } from "@/api/activity.api";
import { getAllCategories } from "@/api/category.api";
import { getAllProjects } from "@/api/project.api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { activityFilters, ActivityType } from "@/type_schema/activity";
import { CategoryType } from "@/type_schema/category";
import { ProjectType } from "@/type_schema/project";
import { Filter, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function FilterExpenseModal({
  children,
  keyword,
  sortBy,
  sortOrder,
  projectId,
  activityId,
  categoryId,
  handleFilterChangeAction
}: {
  children: React.ReactNode;
  keyword: string;
  sortBy: string;
  sortOrder: string;
  projectId: string;
  activityId: string;
  categoryId: string;
  handleFilterChangeAction: (props: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: sortBy,
    sortOrder: sortOrder,
    projectId: projectId,
    activityId: activityId,
    categoryId: categoryId
  });
  const [projectList, setProjectList] = useState<ProjectType[] | null>(null);
  const [activityList, setActivityList] = useState<ActivityType[] | null>(null);
  const [categoryList, setCategoryList] = useState<CategoryType[] | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const [projects, activities, categories] = await Promise.all([
          getAllProjects(),
          getAllActivities(),
          getAllCategories()
        ]);
        setProjectList(projects.data);
        setActivityList(activities.data);
        setCategoryList(categories.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    handleFilterChangeAction({
      _sortBy: filters.sortBy,
      _sortOrder: filters.sortOrder,
      _projectId: filters.projectId,
      _activityId: filters.activityId,
      _categoryId: filters.categoryId
    });
    setOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      sortBy: "",
      sortOrder: "",
      projectId: "",
      activityId: "",
      categoryId: ""
    });
  };

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-80 border border-gray-200 !p-0"
        align="end"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 pl-2">
            <Filter className="h-4 w-4" />
            <h4 className="font-medium">Filter Expenses</h4>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="!m-0" />

        <div className="grid gap-4 p-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label htmlFor="sortBy">Sort By</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => handleFilterChange("sortBy", value)}
              >
                <SelectTrigger
                  id="sortBy"
                  className="border border-gray-200 !w-full"
                >
                  <SelectValue
                    placeholder="Sort By"
                    defaultValue={filters.sortBy}
                  />
                </SelectTrigger>
                <SelectContent>
                  {activityFilters.map((filter, index) => (
                    <SelectItem
                      key={index}
                      value={filter.name}
                    >
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sortOrder">Order</Label>
              <Select
                value={filters.sortOrder}
                onValueChange={(value) => handleFilterChange("sortOrder", value)}
              >
                <SelectTrigger
                  id="sortOrder"
                  className="border border-gray-200 !w-full"
                >
                  <SelectValue
                    placeholder="Order"
                    defaultValue={filters.sortOrder}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {projectList && (
            <div className="grid gap-2">
              <Label htmlFor="projectId">Project</Label>
              <Select
                onValueChange={(value) => handleFilterChange("projectId", value)}
                value={filters.projectId}
              >
                <SelectTrigger className="w-full !mt-0 border-gray-200">
                  <SelectValue
                    placeholder="Select project"
                    defaultValue={filters.projectId}
                  />
                </SelectTrigger>
                <SelectContent>
                  {projectList.map((project, index) => (
                    <SelectItem
                      key={index}
                      value={project.id.toString()}
                      className="flex items-center gap-1"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: project.color || "#FF5733" }}
                      ></div>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {activityList && (
            <div className="grid gap-2">
              <Label htmlFor="activityId">Activity</Label>
              <Select
                onValueChange={(value) => handleFilterChange("activityId", value)}
                value={filters.activityId}
              >
                <SelectTrigger className="w-full !mt-0 border-gray-200">
                  <SelectValue
                    placeholder="Select project"
                    defaultValue={filters.projectId}
                  />
                </SelectTrigger>
                <SelectContent>
                  {activityList.map((activity, index) => (
                    <SelectItem
                      key={index}
                      value={activity.id.toString()}
                      className="flex items-center gap-1"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: activity.color || "#FF5733" }}
                      ></div>
                      {activity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {categoryList && (
            <div className="grid gap-2">
              <Label htmlFor="categoryId">Category</Label>
              <Select
                onValueChange={(value) => handleFilterChange("categoryId", value)}
                value={filters.categoryId}
              >
                <SelectTrigger className="w-full !mt-0 border-gray-200">
                  <SelectValue
                    placeholder="Select project"
                    defaultValue={filters.projectId}
                  />
                </SelectTrigger>
                <SelectContent>
                  {categoryList.map((category, index) => (
                    <SelectItem
                      key={index}
                      value={category.id.toString()}
                      className="flex items-center gap-1"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: "#FF5733" }}
                      ></div>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Separator className="mt-1" />

        <div className="flex justify-end p-2 items-stretch gap-2">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer border border-gray-200"
            onClick={handleResetFilters}
          >
            Reset
          </Button>
          <Button
            size="sm"
            className="cursor-pointer bg-main text-white"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
