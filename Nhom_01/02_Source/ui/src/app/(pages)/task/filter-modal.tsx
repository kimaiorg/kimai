"use client";

import type React from "react";

import { getAllActivities } from "@/api/activity.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
import { activityFilters, ActivityType } from "@/type_schema/activity";
import { UserType } from "@/type_schema/user.schema";
import { Filter, X } from "lucide-react";
import { useEffect, useState } from "react";
import { TeamResponseType } from "@/type_schema/team";
import { getAllTeams } from "@/api/team.api";

export default function FilterTaskModal({
  children,
  keyword,
  sortBy,
  sortOrder,
  activityId,
  userId,
  handleFilterChangeAction
}: {
  children: React.ReactNode;
  keyword: string;
  sortBy: string;
  sortOrder: string;
  activityId: string;
  userId: string;
  handleFilterChangeAction: (props: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    keyword: keyword,
    sortBy: sortBy,
    sortOrder: sortOrder,
    activityId: activityId,
    userId: userId
  });
  const [activityList, setActivityList] = useState<ActivityType[] | null>(null);
  const userList = useAppSelector((state) => state.userListState.users) as UserType[];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activities] = await Promise.all([getAllActivities()]);
        setActivityList(activities.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    handleFilterChangeAction({
      _keyword: filters.keyword,
      _sortBy: filters.sortBy,
      _sortOrder: filters.sortOrder,
      _activityId: filters.activityId,
      _userId: filters.userId
    });
    setOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      keyword: "",
      sortBy: "",
      sortOrder: "desc",
      activityId: "",
      userId: ""
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
            <h4 className="font-medium">Filter Tasks</h4>
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
          <div className="grid gap-2 md:hidden">
            <Label htmlFor="keyword">Keyword</Label>
            <Input
              id="keyword"
              placeholder="Search..."
              className="border border-gray-200"
              value={filters.keyword}
              onChange={(e) => handleFilterChange("keyword", e.target.value)}
            />
          </div>

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

          {activityList && (
            <div className="grid gap-2">
              <Label htmlFor="activityId">Activity</Label>
              <Select
                onValueChange={(value) => handleFilterChange("activityId", value)}
                value={filters.activityId}
              >
                <SelectTrigger className="w-full !mt-0 border-gray-200">
                  <SelectValue
                    placeholder="Select activity"
                    defaultValue={filters.activityId}
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

          {userList && (
            <div className="grid gap-2">
              <Label htmlFor="userId">User</Label>
              <Select
                onValueChange={(value) => handleFilterChange("userId", value)}
                value={filters.userId}
              >
                <SelectTrigger className="w-full !mt-0 border-gray-200">
                  <SelectValue
                    placeholder="Select user"
                    defaultValue={filters.userId}
                  />
                </SelectTrigger>
                <SelectContent>
                  {userList.map((user, index) => (
                    <SelectItem
                      key={index}
                      value={user.user_id}
                      className="flex items-center gap-1"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: "#FF5733" }}
                      ></div>
                      {user.name}
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
