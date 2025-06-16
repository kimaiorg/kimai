"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import UploadFileModal from "@/app/(pages)/profile/upload-file-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUser } from "@auth0/nextjs-auth0/client";

// Define the form schema with Zod
const profileFormSchema = z.object({
  nickname: z
    .string()
    .min(2, {
      message: "Nickname must be at least 2 characters."
    })
    .max(30, {
      message: "Nickname must not be longer than 30 characters."
    }),
  avatarUrl: z.string().optional()
});

// Infer the type from the schema
type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function ProfileStep({ onNext, onBack }: ProfileStepProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { user: currentUser } = useUser();

  // Initialize the form with React Hook Form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      nickname: currentUser!.nickname || currentUser!.name! || "",
      avatarUrl: currentUser!.picture || ""
    }
  });

  // Handle form submission
  function onSubmit(data: ProfileFormValues) {
    // console.log("Profile data:", data);
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
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Your Profile</h2>
          <p className="mb-6 text-slate-600 dark:text-slate-300">
            Personalize your profile with an avatar and nickname.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-8"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-36 h-36 relative group">
              <Avatar className="h-full w-full">
                <AvatarImage src={avatarFile ? URL.createObjectURL(avatarFile) : ""} />
                <AvatarFallback
                  style={{ backgroundColor: "rgba(110, 68, 255, 0.1)" }}
                  className="color-main"
                >
                  {form.watch("nickname") ? form.watch("nickname")[0].toUpperCase() : "?"}
                </AvatarFallback>
              </Avatar>
              {avatarFile && (
                <div className="absolute top-1 right-1 hidden group-hover:flex items-center justify-center border border-rose-600  p-2 rounded-full shadow-lg cursor-pointer bg-white">
                  <Trash2
                    className="w-5 h-5"
                    stroke="red"
                    onClick={() => setAvatarFile(null)}
                  />
                </div>
              )}
            </div>
            <UploadFileModal onUploadFile={(avatarFile) => setAvatarFile(avatarFile)}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex gap-2 border-main color-main"
              >
                <Upload className="h-4 w-4" />
                Upload Avatar
              </Button>
            </UploadFileModal>
          </div>

          <div className="w-full max-w-md">
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nickname</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your nickname"
                      {...field}
                      className="focus-visible:ring-[#6e44ff]"
                    />
                  </FormControl>
                  <FormMessage className="color-main" />
                </FormItem>
              )}
            />
          </div>
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
