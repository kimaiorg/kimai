"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { handleErrorApi } from "@/lib/utils";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import { useState } from "react";
import { toast } from "sonner";
import { UpdateUserRequestDTO, UpdateUserRequestSchema } from "@/type_schema/user.schema";

export function UpdateUserForm({ user, back }: { user: UserProfile; back: () => void }) {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const updateUserForm = useForm<UpdateUserRequestDTO>({
    resolver: zodResolver(UpdateUserRequestSchema),
    defaultValues: {
      name: user.name!,
      email: user.email!
    }
  });
  async function onSubmit(values: UpdateUserRequestDTO) {
    if (loading) return;
    setLoading(true);
    try {
      // console.log({ ...values, image: image });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast("Update successfully", {
        description: "Update info successfully",
        duration: 2000,
        className: "!bg-green-500 !text-white"
      });
      back();
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: updateUserForm.setError
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <Form {...updateUserForm}>
      <form
        onSubmit={updateUserForm.handleSubmit(onSubmit)}
        className="p-4"
        noValidate
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="image">
            <label
              htmlFor="uploadFile1"
              className="bg-white text-gray-500 font-semibold text-base rounded max-w-md h-36 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-11 mb-2 fill-gray-500"
                viewBox="0 0 32 32"
              >
                <path
                  d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                  data-original="#000000"
                />
                <path
                  d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                  data-original="#000000"
                />
              </svg>
              Upload file
              <input
                type="file"
                id="uploadFile1"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  setImage(e.target.files ? e.target.files[0] : null);
                }}
                value=""
              />
              <p className="text-xs font-medium text-gray-400 mt-2">PNG, JPG SVG, WEBP, and GIF are Allowed.</p>
            </label>
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="your image"
                className="mt-2 w-96 mx-auto border rounded-sm"
              />
            )}
          </div>
          <div className="info">
            <FormField
              control={updateUserForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      type="email"
                      {...field}
                      className="!mt-0"
                    />
                  </FormControl>
                  {/* <FormDescription>* This is the field requiring you to fill.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={updateUserForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                      className="!mt-0"
                    />
                  </FormControl>
                  {/* <FormDescription>* This is the field requiring you to fill.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={updateUserForm.control}
              name="roleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    {...field}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full !mt-0">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Admin</SelectItem>
                      <SelectItem value="2">Counterpart</SelectItem>
                      <SelectItem value="3">Player</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <FormDescription>* This is the field requiring you to fill.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={updateUserForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter your password"
                      className="mt-0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              defaultValue="123456"
            />
          </div>
        </div>
        <div className="!mt-5 flex justify-center items-center gap-5 ">
          <Button
            className="block"
            onClick={() => back()}
            variant="destructive"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="block bg-lime-500 hover:bg-lime-600"
          >
            Update {loading ? <span className="animate-spin">⌛</span> : ""}
          </Button>
        </div>
      </form>
    </Form>
  );
}
