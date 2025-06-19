"use client";

import { getAllActivities } from "@/api/activity.api";
import { getAllCategories } from "@/api/category.api";
import { updateExpense } from "@/api/expense.api";
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
import {
  CreateExpenseRequestSchema,
  ExpenseType,
  UpdateExpenseRequestDTO,
  UpdateExpenseValidation
} from "@/type_schema/expense";
import { ProjectType } from "@/type_schema/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

export function ExpenseUpdateDialog({
  children,
  targetExpense,
  fetchExpenses
}: {
  children: React.ReactNode;
  targetExpense: ExpenseType;
  fetchExpenses: () => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [activityList, setActivityList] = useState<ActivityType[] | null>(null);
  const [projectList, setProjectList] = useState<ProjectType[]>([]);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);

  const updateExpenseForm = useForm<UpdateExpenseValidation>({
    resolver: zodResolver(CreateExpenseRequestSchema),
    defaultValues: {
      name: targetExpense.name,
      color: targetExpense.color,
      description: targetExpense.description,
      activity_id: targetExpense.activity.id.toString(),
      project_id: targetExpense.project.id.toString(),
      category_id: targetExpense.category.id.toString(),
      cost: targetExpense.cost.toString()
    }
  });
  async function onSubmit(values: UpdateExpenseValidation) {
    if (loading) return;
    setLoading(true);
    try {
      const { activity_id, project_id, category_id, cost, ...rest } = values;
      const payload: UpdateExpenseRequestDTO = {
        activity_id: Number(activity_id),
        project_id: Number(project_id),
        category_id: Number(category_id),
        cost: Number(cost),
        ...rest
      };

      const response = await updateExpense(payload, targetExpense.id);

      if (response == 201 || response == 200 || response == 204) {
        toast("Success", {
          description: "Update expense successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
        fetchExpenses();
        updateExpenseForm.reset();
        setOpen(false);
      } else {
        toast("Failed", {
          description: "Failed to update expense. Please try again!",
          duration: 2000,
          className: "!bg-red-500 !text-white"
        });
      }
    } catch (error: unknown) {
      handleErrorApi({
        error,
        setError: updateExpenseForm.setError
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchUsersAndActivities = async () => {
      try {
        const [projects, activities, categories] = await Promise.all([
          getAllProjects(1, 250),
          getAllActivities(1, 260),
          getAllCategories(1, 260)
        ]);
        setProjectList(projects.data);
        setCategoryList(categories.data);
        setActivityList(activities.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchUsersAndActivities();
  }, []);

  const selectedProjectId = useWatch({
    control: updateExpenseForm.control,
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
          <DialogTitle>Update expense</DialogTitle>
        </DialogHeader>

        <Form {...updateExpenseForm}>
          <form
            onSubmit={updateExpenseForm.handleSubmit(onSubmit)}
            className="p-2 md:p-4 border border-gray-200 rounded-lg"
            noValidate
          >
            <div className="grid grid-cols-12 gap-4 mb-3 items-start">
              {/* Name and Color */}
              <FormField
                control={updateExpenseForm.control}
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
                control={updateExpenseForm.control}
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
                control={updateExpenseForm.control}
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
                  control={updateExpenseForm.control}
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
              {activityList && (
                <FormField
                  control={updateExpenseForm.control}
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
                  control={updateExpenseForm.control}
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
                control={updateExpenseForm.control}
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
                {loading ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
