"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";

// Define the form schema with Zod
const preferencesFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"], {
    required_error: "Please select a theme."
  }),
  currency: z.string({
    required_error: "Please select a currency."
  }),
  region: z.string({
    required_error: "Please select a region."
  }),
  notifications: z.boolean().default(true),
  emailUpdates: z.boolean().default(false),
  autoTrack: z.boolean().default(true)
});

// Infer the type from the schema
type PreferencesFormValues = z.infer<typeof preferencesFormSchema>;

// Currency options
const currencies = [
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "JPY", label: "Japanese Yen (¥)" },
  { value: "CAD", label: "Canadian Dollar (C$)" },
  { value: "AUD", label: "Australian Dollar (A$)" },
  { value: "CNY", label: "Chinese Yuan (¥)" },
  { value: "INR", label: "Indian Rupee (₹)" }
];

// Region options
const regions = [
  { value: "US", label: "United States" },
  { value: "EU", label: "Europe" },
  { value: "UK", label: "United Kingdom" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "JP", label: "Japan" },
  { value: "CN", label: "China" },
  { value: "IN", label: "India" }
];

interface PreferencesStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function PreferencesStep({ onNext, onBack }: PreferencesStepProps) {
  // Initialize the form with React Hook Form
  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: {
      theme: "system",
      currency: "USD",
      region: "US",
      notifications: true,
      emailUpdates: false,
      autoTrack: true
    }
  });

  // Handle form submission
  function onSubmit(data: PreferencesFormValues) {
    console.log("Preferences data:", data);
    onNext();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Your Preferences</h2>
          <p className="mb-6 text-slate-600 dark:text-slate-300">Customize your experience to match your workflow.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Theme</FormLabel>
                  <FormDescription>Choose your preferred color theme</FormDescription>
                </div>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px] focus:ring-[#6e44ff]">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Currency</FormLabel>
                  <FormDescription>Select your preferred currency</FormDescription>
                </div>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px] focus:ring-[#6e44ff]">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem
                          key={currency.value}
                          value={currency.value}
                        >
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Region</FormLabel>
                  <FormDescription>Select your region</FormDescription>
                </div>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px] focus:ring-[#6e44ff]">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem
                          key={region.value}
                          value={region.value}
                        >
                          {region.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notifications"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Notification Sounds</FormLabel>
                  <FormDescription>Receive in-app notifications</FormDescription>
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
            name="emailUpdates"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Email Updates</FormLabel>
                  <FormDescription>Receive email updates about your activity</FormDescription>
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between"
        >
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            type="submit"
            className="text-white bg-gradient-to-r cursor-pointer from-[#6e44ff] to-[#936bff] hover:from-[#5a36d6] hover:to-[#7f5ce0]"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </form>
    </Form>
  );
}
