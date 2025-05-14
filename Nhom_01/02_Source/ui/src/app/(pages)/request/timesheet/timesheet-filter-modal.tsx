"use client";

import type React from "react";

import { getAllTeams } from "@/api/team.api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
import { activityFilters } from "@/type_schema/activity";
import { TeamResponseType } from "@/type_schema/team";
import { UserType } from "@/type_schema/user.schema";
import { Filter, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function FilterTimesheetV2Modal({
  children,
  sortBy,
  sortOrder,
  teamId,
  userId,
  handleFilterChangeAction
}: {
  children: React.ReactNode;
  sortBy: string;
  sortOrder: string;
  teamId: string;
  userId: string;
  handleFilterChangeAction: (props: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: sortBy,
    sortOrder: sortOrder,
    teamId: teamId,
    userId: userId
  });
  const [teamList, setTeamList] = useState<TeamResponseType[] | null>(null);
  const userList = useAppSelector((state) => state.userListState.users) as UserType[];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teams] = await Promise.all([getAllTeams()]);
        setTeamList(teams.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    handleFilterChangeAction({
      _sortBy: filters.sortBy,
      _sortOrder: filters.sortOrder,
      _teamId: filters.teamId,
      _userId: filters.userId
    });
    setOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      sortBy: "",
      sortOrder: "",
      teamId: "",
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
            <h4 className="font-medium">Filter Activities</h4>
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

          {teamList && (
            <div className="grid gap-2">
              <Label htmlFor="teamId">Project</Label>
              <Select
                onValueChange={(value) => handleFilterChange("teamId", value)}
                value={filters.teamId}
              >
                <SelectTrigger className="w-full !mt-0 border-gray-200">
                  <SelectValue
                    placeholder="Select team"
                    defaultValue={filters.teamId}
                  />
                </SelectTrigger>
                <SelectContent>
                  {teamList.map((team, index) => (
                    <SelectItem
                      key={index}
                      value={team.id.toString()}
                      className="flex items-center gap-1"
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: team.color || "#FF5733" }}
                      ></div>
                      {team.name}
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
                  <SelectValue placeholder="Select a user" />
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
