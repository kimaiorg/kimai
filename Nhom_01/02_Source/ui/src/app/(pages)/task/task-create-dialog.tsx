"use client";

import { getAllActivities } from "@/api/activity.api";
import { addNewTask } from "@/api/task.api";
import { getAllUsers } from "@/api/user.api";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { handleErrorApi } from "@/lib/utils";
import { ActivityType } from "@/type_schema/activity";
import { CreateTaskRequestDTO, CreateTaskRequestSchema, CreateTaskValidation } from "@/type_schema/task";
import { UserType } from "@/type_schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function TaskCreateDialog({ children, fetchTasks }: { children: React.ReactNode; fetchTasks: () => void }) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [activityList, setActivityList] = useState<ActivityType[]>([]);
  const [userList, setUserList] = useState<UserType[]>([]);

  const createTaskForm = useForm<CreateTaskValidation>({
    resolver: zodResolver(CreateTaskRequestSchema),
    defaultValues: {
      title: "Write unit test",
      deadline: "2023-01-02",
      description: "VIP customer",
      activity_id: "",
      user_id: ""
    }
  });
  async function onSubmit(values: CreateTaskValidation) {
    if (loading) return;
    setLoading(true);
    try {
      const { activity_id, ...rest } = values;
      const payload: CreateTaskRequestDTO = {
        activity_id: Number(activity_id),
        ...rest
      };
      console.log(payload);
      const response = await addNewTask(payload);

      if (response == 201) {
        toast("Success", {
          description: "Add new task successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
        fetchTasks();
        createTaskForm.reset();
        setOpen(false);
      } else {
        toast("Failed", {
          description: "Failed to add task. Please try again!",
          duration: 2000,
          className: "!bg-red-500 !text-white"
        });
      }
    } catch (error: unknown) {
      handleErrorApi({
        error,
        setError: createTaskForm.setError
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchUsersAndActivities = async () => {
      try {
        const users = await getAllUsers();
        setUserList(users.users);
        const activities = await getAllActivities();
        setActivityList(activities.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchUsersAndActivities();
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <DialogHeader>
          <DialogTitle>Create task</DialogTitle>
        </DialogHeader>

        <Form {...createTaskForm}>
          <form
            onSubmit={createTaskForm.handleSubmit(onSubmit)}
            className="p-2 md:p-4 border border-gray-200 rounded-lg"
            noValidate
          >
            <div className="grid grid-cols-12 gap-4 mb-3 items-start">
              {/* Name and Color */}
              <FormField
                control={createTaskForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-12">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the task name"
                        className="!mt-0 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={createTaskForm.control}
                name="timeEstimate"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Estimate time</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="h-10 !mt-0 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              {/* <FormField
                control={createTaskForm.control}
                name="from"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel>From</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={createTaskForm.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value}
                        setDate={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Company Name and VAT ID */}
              <FormField
                control={createTaskForm.control}
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
              {activityList && (
                <FormField
                  control={createTaskForm.control}
                  name="activity_id"
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormLabel>Activity</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full !mt-0 border-gray-200">
                              <SelectValue placeholder="Select activity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {activityList.map((activity, index) => (
                              <SelectItem
                                key={index}
                                value={activity.id.toString()}
                              >
                                {activity.name}
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
              {userList && (
                <FormField
                  control={createTaskForm.control}
                  name="user_id"
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormLabel>Assignee</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full !mt-0 border-gray-200">
                              <SelectValue placeholder="Select an assignee" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {userList.map((user, index) => (
                              <SelectItem
                                key={index}
                                value={user.user_id.toString()}
                              >
                                {user.name}
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
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="bg-lime-500 hover:bg-lime-600 cursor-pointer text-white"
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
