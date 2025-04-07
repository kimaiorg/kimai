"use client";

import { addNewActivity } from "@/api/activity.api";
import { getAllProjects } from "@/api/project.api";
import { getAllTeams } from "@/api/team.api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { handleErrorApi } from "@/lib/utils";
import {
  ActivityType,
  CreateActivityRequestDTO,
  CreateActivityRequestSchema,
  UpdateActivityRequestDTO,
  UpdateActivityValidation
} from "@/type_schema/activity";
import { ProjectType } from "@/type_schema/project";
import { TeamSimpleType } from "@/type_schema/team";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function ActivityUpdateDialog({
  children,
  targetActivity,
  fetchActivities
}: {
  children: React.ReactNode;
  targetActivity: ActivityType;
  fetchActivities: () => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [projectList, setProjectList] = useState<ProjectType[]>([]);
  const [teamList, setTeamList] = useState<TeamSimpleType[]>([]);

  const updateActivityForm = useForm<UpdateActivityValidation>({
    resolver: zodResolver(CreateActivityRequestSchema),
    defaultValues: {
      name: targetActivity.name,
      color: targetActivity.color,
      description: targetActivity.description,
      budget: targetActivity.budget.toString(),
      activity_number: targetActivity.activity_number.toString(),
      project_id: targetActivity.project_id.toString(),
      team_id: targetActivity.team_id.toString()
    }
  });
  async function onSubmit(values: UpdateActivityValidation) {
    console.log(values);
    if (loading) return;
    setLoading(true);
    try {
      const { project_id, team_id, budget, activity_number, ...rest } = values;
      const payload: UpdateActivityRequestDTO = {
        ...rest,
        project_id: parseInt(project_id),
        budget: parseInt(budget),
        activity_number: parseInt(activity_number),
        team_id: parseInt(team_id)
      };
      const response = await addNewActivity(payload);
      if (response == 201) {
        toast("Success", {
          description: "Add new activity successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
        fetchActivities();
        updateActivityForm.reset();
        setOpen(false);
      } else {
        toast("Failed", {
          description: "Failed to add activity. Please try again!",
          duration: 2000,
          className: "!bg-red-500 !text-white"
        });
      }
    } catch (error: unknown) {
      handleErrorApi({
        error,
        setError: updateActivityForm.setError
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getAllProjects();
        setProjectList(projects.data);
        const teams = await getAllTeams();
        setTeamList(teams.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <DialogHeader>
          <DialogTitle>Update activity</DialogTitle>
        </DialogHeader>

        <Form {...updateActivityForm}>
          <form
            onSubmit={updateActivityForm.handleSubmit(onSubmit)}
            className="p-2 md:p-4 border border-gray-200 rounded-lg"
            noValidate
          >
            <div className="grid grid-cols-12 gap-4 mb-3 items-start">
              {/* Name and Color */}
              <FormField
                control={updateActivityForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-10">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter activity name"
                        className="!mt-0 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateActivityForm.control}
                name="color"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input
                        id="color"
                        type="color"
                        className="h-10 !mt-0 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateActivityForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-12">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your company name"
                        rows={3}
                        className="!mt-0 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {projectList.length > 0 && (
                <FormField
                  control={updateActivityForm.control}
                  name="project_id"
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormLabel>Project</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full !mt-0 border-gray-200">
                              <SelectValue
                                placeholder="Select project"
                                defaultValue={field.value}
                              />
                            </SelectTrigger>
                          </FormControl>
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {teamList.length > 0 && (
                <FormField
                  control={updateActivityForm.control}
                  name="team_id"
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormLabel>Team</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full !mt-0 border-gray-200">
                              <SelectValue
                                placeholder="Select a team"
                                defaultValue={field.value}
                              />
                            </SelectTrigger>
                          </FormControl>
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
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={updateActivityForm.control}
                name="activity_number"
                render={({ field }) => (
                  <FormItem className="col-span-4">
                    <FormLabel>Activity Number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter the budget"
                        className="!mt-0 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateActivityForm.control}
                name="budget"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter the budget"
                        className="!mt-0 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="bg-lime-500 hover:bg-lime-600 cursor-pointer"
              >
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
