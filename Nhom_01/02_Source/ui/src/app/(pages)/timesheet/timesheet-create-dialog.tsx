"use client";

import { getAllTasksByUserId } from "@/api/task.api";
import { addNewTimesheetRecord, requestStartTrackingTimesheet } from "@/api/timesheet.api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { handleErrorApi } from "@/lib/utils";
import { ActivityType } from "@/type_schema/activity";
import { CustomerProjectType } from "@/type_schema/project";
import { CommonRequestType, RequestTypeType } from "@/type_schema/request";
import { TaskResponseType } from "@/type_schema/task";
import {
  CreateTimesheetRequestDTO,
  CreateTimesheetRequestSchema,
  CreateTimesheetValidation,
  TimesheetStartTrackingRequestType
} from "@/type_schema/timesheet";
import { useUser } from "@auth0/nextjs-auth0/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function TimesheetCreateDialog({
  children,
  fetchTimesheets
}: {
  children: React.ReactNode;
  fetchTimesheets: () => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [taskList, setTaskList] = useState<TaskResponseType[]>([]);
  const { user: currentUser, isLoading } = useUser();
  const [project, setProject] = useState<CustomerProjectType | null>(null);
  const [activity, setActivity] = useState<ActivityType | null>(null);

  const createTimesheetForm = useForm<CreateTimesheetValidation>({
    resolver: zodResolver(CreateTimesheetRequestSchema),
    defaultValues: {
      task_id: "",
      description: "Description about your task here"
    }
  });
  async function onSubmit(values: CreateTimesheetValidation) {
    if (loading) return;
    setLoading(true);
    try {
      const { task_id, ...rest } = values;
      const payload: CreateTimesheetRequestDTO = {
        ...rest,
        task_id: Number(task_id),
        user_name: "Will be deleted",
        project_id: project!.id,
        activity_id: activity!.id
      };
      const response = await addNewTimesheetRecord(payload);

      if (response != null) {
        toast("Success", {
          description: "Start tracking task successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
        const selectedTask = taskList.find((task) => task.id.toString() === response.task_id.toString());
        // console.log(selectedTask);
        const taskName = selectedTask!.title;
        const payload: CommonRequestType<TimesheetStartTrackingRequestType> = {
          comment: `Start tracking for task: ${taskName}`,
          target_id: response.id,
          team_id: selectedTask!.activity!.team!.id,
          type: RequestTypeType.START_TIMESHEET,
          request_data: {}
        };
        const res = await requestStartTrackingTimesheet(payload);

        fetchTimesheets();
        createTimesheetForm.reset();
        setOpen(false);
      } else {
        toast("Failed", {
          description: "Failed to start tracking task. Please try again!",
          duration: 2000,
          className: "!bg-red-500 !text-white"
        });
      }
    } catch (error: unknown) {
      handleErrorApi({
        error,
        setError: createTimesheetForm.setError
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await getAllTasksByUserId(1, 100, currentUser!.sub!);
        setTaskList(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]);

  const handleFetchDataFromTaskId = (taskId: string) => {
    const task = taskList.find((task) => task.id.toString() === taskId);
    setActivity(task!.activity!);
    setProject(task!.activity!.project!);
  };

  if (isLoading) {
    return (
      <>
        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogTrigger asChild>{children}</DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
            <DialogHeader>
              <DialogTitle>Loading...</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <DialogHeader>
          <DialogTitle>Start tracking</DialogTitle>
        </DialogHeader>

        <Form {...createTimesheetForm}>
          <form
            onSubmit={createTimesheetForm.handleSubmit(onSubmit)}
            className="p-2 md:p-4 border border-gray-200 rounded-lg"
            noValidate
          >
            <div className="grid grid-cols-12 gap-4 mb-3 items-start">
              <FormField
                control={createTimesheetForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-12">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your company name"
                        rows={2}
                        className="!mt-0 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {taskList && (
                <FormField
                  control={createTimesheetForm.control}
                  name="task_id"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Task</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value); // Update form state
                            handleFetchDataFromTaskId(value); // Your custom logic
                          }}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full !mt-0 border-gray-200">
                              <SelectValue placeholder="Select a task" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {taskList.map((task, index) => (
                              <SelectItem
                                key={index}
                                value={task.id.toString()}
                              >
                                {task.title}
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
              <div className="col-span-12">
                <h1>Project and activity:</h1>
                <MoreInfoPreview
                  activity={activity}
                  project={project}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="bg-main cursor-pointer text-white"
              >
                Start
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function MoreInfoPreview({
  activity,
  project
}: {
  activity: ActivityType | null;
  project: CustomerProjectType | null;
}) {
  return (
    <>
      {(!activity || !project) && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-1">You have not selected a task.</p>
      )}
      {activity && project && (
        <div className="col-span-12 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Project Card */}
          <div className="border border-gray-200 rounded-lg shadow-sm px-5 py-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Project Info</h2>
              <span
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{ backgroundColor: project.color, color: "white" }}
              >
                {project.project_number}
              </span>
            </div>
            <div className="text-sm space-y-1">
              <p>
                <strong>Name:</strong> {project.name}
              </p>
              <p>
                <strong>Order:</strong> #{project.order_number}
              </p>
              <p>
                <strong>Start:</strong> {new Date(project.start_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Activity Card */}
          <div className="border border-gray-200 rounded-lg shadow-sm px-5 py-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Activity Info</h2>
              <span
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{ backgroundColor: activity.color, color: "white" }}
              >
                #{activity.activity_number}
              </span>
            </div>
            <div className="text-sm space-y-1">
              <p>
                <strong>Name:</strong> {activity.name}
              </p>
              <p>
                <strong>Description:</strong> {activity.description || "—"}
              </p>
              <p>
                <strong>Team:</strong> {activity.team?.name || "—"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
