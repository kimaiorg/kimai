"use client";

import { getAllActivities } from "@/api/activity.api";
import { getAllExpenses } from "@/api/expense.api";
import { updateTask } from "@/api/task.api";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/lib/redux-toolkit/hooks";
import { formatCurrency, handleErrorApi } from "@/lib/utils";
import { ActivityType } from "@/type_schema/activity";
import { ExpenseType } from "@/type_schema/expense";
import { CreateTaskRequestSchema, TaskType, UpdateTaskRequestDTO, UpdateTaskValidation } from "@/type_schema/task";
import { UserType } from "@/type_schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

export function TaskUpdateDialog({
  children,
  targetTask,
  fetchTasks
}: {
  children: React.ReactNode;
  targetTask: TaskType;
  fetchTasks: () => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [activityList, setActivityList] = useState<ActivityType[]>([]);
  const [expenseList, setExpenseList] = useState<ExpenseType[]>([]);
  const userList = useAppSelector((state) => state.userListState.users) as UserType[];
  const [totalPrice, setTotalPrice] = useState<number>(targetTask.quantity * targetTask.expense.cost);

  const updateTaskForm = useForm<UpdateTaskValidation>({
    resolver: zodResolver(CreateTaskRequestSchema),
    defaultValues: {
      title: targetTask.title,
      color: targetTask?.color || "#F3F4F6",
      deadline: targetTask.deadline,
      description: targetTask.description,
      activity_id: targetTask.activity.id.toString(),
      user_id: targetTask.user.user_id,
      quantity: targetTask.quantity.toString() || "",
      expense_id: targetTask.expense.id.toString() || "",
      billable: targetTask.billable ? "true" : "false"
    }
  });
  async function onSubmit(values: UpdateTaskValidation) {
    if (loading) return;
    setLoading(true);
    try {
      const { activity_id, expense_id, quantity, billable, ...rest } = values;
      const payload: UpdateTaskRequestDTO = {
        activity_id: Number(activity_id),
        expense_id: Number(expense_id),
        quantity: Number(quantity),
        billable: billable == "true",
        ...rest
      };
      console.log(payload);
      const response = await updateTask(payload, targetTask.id);

      if (response == 200) {
        toast("Success", {
          description: "Update task successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
        fetchTasks();
        updateTaskForm.reset();
        setOpen(false);
      } else {
        toast("Failed", {
          description: "Failed to update task. Please try again!",
          duration: 2000,
          className: "!bg-red-500 !text-white"
        });
      }
    } catch (error: unknown) {
      handleErrorApi({
        error,
        setError: updateTaskForm.setError
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchUsersAndActivities = async () => {
      try {
        const [activities, expenses] = await Promise.all([getAllActivities(), getAllExpenses()]);
        setActivityList(activities.data);
        setExpenseList(expenses.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchUsersAndActivities();
  }, []);

  const selectedExpenseId = useWatch({
    control: updateTaskForm.control,
    name: "expense_id"
  });

  const selectedQuantity = useWatch({
    control: updateTaskForm.control,
    name: "quantity"
  });

  useEffect(() => {
    if (!selectedQuantity || !selectedExpenseId || !expenseList || expenseList.length == 0) return;
    const expense = expenseList.find((expense) => expense.id.toString() == selectedExpenseId)!;
    // console.log(selectedExpenseId, expense);
    setTotalPrice(expense.cost * Number(selectedQuantity));
  }, [selectedQuantity, selectedExpenseId, expenseList]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <DialogHeader>
          <DialogTitle>Update task</DialogTitle>
        </DialogHeader>

        <Form {...updateTaskForm}>
          <form
            onSubmit={updateTaskForm.handleSubmit(onSubmit)}
            className="p-2 md:p-4 border border-gray-200 rounded-lg"
            noValidate
          >
            <div className="grid grid-cols-12 gap-4 mb-3 items-start">
              {/* Name and Color */}
              <FormField
                control={updateTaskForm.control}
                name="title"
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
                control={updateTaskForm.control}
                name="color"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input
                        type="color"
                        className="h-10 !mt-0 border-gray-200 cursor-pointer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={updateTaskForm.control}
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
              <FormField
                control={updateTaskForm.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="col-span-5">
                    <FormLabel>Due date</FormLabel>
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
              {activityList && (
                <FormField
                  control={updateTaskForm.control}
                  name="activity_id"
                  render={({ field }) => (
                    <FormItem className="col-span-7">
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
                  control={updateTaskForm.control}
                  name="user_id"
                  render={({ field }) => (
                    <FormItem className="col-span-10">
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
              <FormField
                control={updateTaskForm.control}
                name="billable"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Billable</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value == "true"}
                        onCheckedChange={(value) => field.onChange(value ? "true" : "false")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {expenseList && (
                <FormField
                  control={updateTaskForm.control}
                  name="expense_id"
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormLabel>Expense</FormLabel>
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
                            {expenseList.map((expense, index) => (
                              <SelectItem
                                key={index}
                                value={expense.id.toString()}
                              >
                                {expense.name} - {formatCurrency(expense.cost)}
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
                control={updateTaskForm.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="!mt-0 border-gray-200 cursor-pointer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem className="col-span-3">
                <FormLabel>Preview</FormLabel>
                <div className="col-span-5 flex items-center justify-between bg-gray-50 dark:bg-slate-800 px-2 py-1 rounded-md border border-gray-200 gap-2">
                  <span className="font-medium text-gray-700">Total:</span>
                  <span className="text-lg font-semibold text-main">{formatCurrency(totalPrice)}</span>
                </div>
              </FormItem>
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
