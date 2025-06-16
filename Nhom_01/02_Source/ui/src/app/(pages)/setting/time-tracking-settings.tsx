"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const timeTrackingFormSchema = z.object({
  timetrackingMode: z.string(),
  defaultStartTime: z.string(),
  allowFutureEntries: z.boolean().default(true),
  allowEmptyDuration: z.boolean().default(true),
  allowOverlappingEntries: z.boolean().default(true),
  allowOverbooking: z.boolean().default(true),
  maxSimultaneousEntries: z.string(),
  minuteSelectionFromTo: z.string(),
  minuteSelectionDuration: z.string(),
  maxDuration: z.string()
});

type TimeTrackingFormValues = z.infer<typeof timeTrackingFormSchema>;

const defaultValues: TimeTrackingFormValues = {
  timetrackingMode: "[Default] start and end times can be edited",
  defaultStartTime: "now",
  allowFutureEntries: true,
  allowEmptyDuration: true,
  allowOverlappingEntries: true,
  allowOverbooking: true,
  maxSimultaneousEntries: "1",
  minuteSelectionFromTo: "15",
  minuteSelectionDuration: "15",
  maxDuration: "0"
};

export default function TimeTrackingSettings() {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<TimeTrackingFormValues>({
    resolver: zodResolver(timeTrackingFormSchema),
    defaultValues
  });

  function onSubmit(data: TimeTrackingFormValues) {
    setIsPending(true);
    // Simulate API call
    setTimeout(() => { 
      setIsPending(false);
    }, 1000);
  }

  function onReset() {
    form.reset(defaultValues);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Time Tracking</h1>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="timetrackingMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base after:ml-0.5 after:text-red-500 after:content-['*']">
                  Timetracking mode
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full border border-gray-200">
                      <SelectValue placeholder="Select timetracking mode" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border border-gray-200">
                    <SelectItem value="[Default] start and end times can be edited">
                      [Default] start and end times can be edited
                    </SelectItem>
                    <SelectItem value="Duration only mode">Duration only mode</SelectItem>
                    <SelectItem value="Start-stop mode">Start-stop mode</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="defaultStartTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base after:ml-0.5 after:text-red-500 after:content-['*']">
                  Default start-time (not used in all timetracking modes)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border border-gray-200"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allowFutureEntries"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Allow time entries in the future</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-[#936bff]!"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allowEmptyDuration"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Allow time entries with an empty duration</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-[#936bff]!"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allowOverlappingEntries"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Allow overlapping time entries</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-[#936bff]!"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allowOverbooking"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Allow overbooking of stored budgets</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-[#936bff]!"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxSimultaneousEntries"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base after:ml-0.5 after:text-red-500 after:content-['*']">
                  Permitted number of simultaneously running time entries
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border border-gray-200"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minuteSelectionFromTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base after:ml-0.5 after:text-red-500 after:content-['*']">
                  Minute selection for From & To
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full border border-gray-200">
                      <SelectValue placeholder="Select minute interval" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="60">60</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minuteSelectionDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base after:ml-0.5 after:text-red-500 after:content-['*']">
                  Minute selection for Duration
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full border border-gray-200">
                      <SelectValue placeholder="Select minute interval" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="60">60</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base after:ml-0.5 after:text-red-500 after:content-['*']">
                  Maximum duration of a timesheet record in minutes before saving is rejected (0 = deactivated)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border border-gray-200"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex space-x-2">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-main text-white"
            >
              Save
            </Button>
            <Button
              type="button"
              className="bg-rose-500 hover:bg-rose-600 text-white"
              onClick={onReset}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
