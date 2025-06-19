"use client";

import { getAllActivities } from "@/api/activity.api";
import { getAllCategories } from "@/api/category.api";
import { addNewExpense } from "@/api/expense.api";
import { getAllProjects } from "@/api/project.api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { handleErrorApi } from "@/lib/utils";
import { ActivityType } from "@/type_schema/activity";
import { CategoryType } from "@/type_schema/category";
import { CreateExpenseRequestDTO, CreateExpenseRequestSchema, CreateExpenseValidation } from "@/type_schema/expense";
import { ProjectType } from "@/type_schema/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

export function ExpenseCreateDialog({
  children,
  fetchExpenses
}: {
  children: React.ReactNode;
  fetchExpenses: () => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [activityList, setActivityList] = useState<ActivityType[] | null>(null);
  const [projectList, setProjectList] = useState<ProjectType[]>([]);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);

  const createExpenseForm = useForm<CreateExpenseValidation>({
    resolver: zodResolver(CreateExpenseRequestSchema),
    defaultValues: {
      name: "Write unit test",
      color: "#ff4d3a",
      description: "",
      activity_id: "",
      project_id: "",
      category_id: "",
      cost: "0"
    }
  });
  async function onSubmit(values: CreateExpenseValidation) {
    if (loading) return;
    setLoading(true);
    try {
      const { activity_id, project_id, category_id, cost, ...rest } = values;
      const payload: CreateExpenseRequestDTO = {
        activity_id: Number(activity_id),
        project_id: Number(project_id),
        category_id: Number(category_id),
        cost: Number(cost),
        ...rest
      };

      const response = await addNewExpense(payload);

      if (response == 201 || response == 200 || response == 204) {
        toast("Success", {
          description: "Add new expense successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
        fetchExpenses();
        createExpenseForm.reset();
        setOpen(false);
      } else {
        toast("Failed", {
          description: "Failed to add expense. Please try again!",
          duration: 2000,
          className: "!bg-red-500 !text-white"
        });
      }
    } catch (error: unknown) {
      handleErrorApi({
        error,
        setError: createExpenseForm.setError
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchUsersAndActivities = async () => {
      try {
        const [projects, categories] = await Promise.all([getAllProjects(1, 299), getAllCategories(1, 299)]);
        setProjectList(projects.data);
        setCategoryList(categories.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchUsersAndActivities();
  }, []);

  const selectedProjectId = useWatch({
    control: createExpenseForm.control,
    name: "project_id"
  });

  useEffect(() => {
    if (!selectedProjectId) return;

    const fetchActivities = async () => {
      try {
        const activities = await getAllActivities(1, 299, undefined, undefined, undefined, selectedProjectId);
        setActivityList(activities.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
    fetchActivities();
  }, [selectedProjectId]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <DialogHeader>
          <DialogTitle>Create expense</DialogTitle>
        </DialogHeader>

        <Form {...createExpenseForm}>
          <form
            onSubmit={createExpenseForm.handleSubmit(onSubmit)}
            className="p-2 md:p-4 border border-gray-200 rounded-lg"
            noValidate
          >
            <div className="grid grid-cols-12 gap-4 mb-3 items-start">
              {/* Name and Color */}
              <FormField
                control={createExpenseForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-10">
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
              <FormField
                control={createExpenseForm.control}
                name="color"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input
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
                control={createExpenseForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-12">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the expense"
                        rows={2}
                        className="!mt-0 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {projectList && (
                <FormField
                  control={createExpenseForm.control}
                  name="project_id"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Project</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full !mt-0 border-gray-200">
                              <SelectValue placeholder="Select a project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border border-gray-200">
                            {projectList.map((project, index) => (
                              <SelectItem
                                key={index}
                                value={project.id.toString()}
                              >
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
              {!activityList && (
                <>
                  <FormLabel>Activity</FormLabel>
                  <p className="col-span-12 text-center text-sm text-gray-700 dark:text-white">
                    Please select a project
                  </p>
                </>
              )}
              {activityList && activityList.length === 0 && (
                <>
                  <FormLabel>Activity</FormLabel>
                  <p className="col-span-12 text-center text-sm text-gray-700 dark:text-white">
                    There is no activity in this project
                  </p>
                </>
              )}
              {activityList && activityList.length > 0 && (
                <FormField
                  control={createExpenseForm.control}
                  name="activity_id"
                  render={({ field }) => (
                    <FormItem className="col-span-12">
                      <FormLabel>Activity</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full !mt-0 border-gray-200">
                              <SelectValue placeholder="Select an activity" />
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
              {categoryList && (
                <FormField
                  control={createExpenseForm.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem className="col-span-9">
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          {...field}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full !mt-0 border-gray-200">
                              <SelectValue placeholder="Select an category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoryList.map((category, index) => (
                              <SelectItem
                                key={index}
                                value={category.id.toString()}
                              >
                                {category.name}
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
                control={createExpenseForm.control}
                name="cost"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Costs</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter expense cost"
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
                className="bg-main cursor-pointer text-white"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
