"use client";

import { getAllRoles } from "@/api/auth.api";
import { addNewUser } from "@/api/user.api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { handleErrorApi } from "@/lib/utils";
import { RoleType } from "@/type_schema/role";
import { CreateUserRequestDTO, CreateUserRequestSchema } from "@/type_schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function AddUserModal({ children, fetchUsers }: { children: React.ReactNode; fetchUsers: () => void }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState<RoleType[]>([]);

  const createUserForm = useForm<CreateUserRequestDTO>({
    resolver: zodResolver(CreateUserRequestSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      repassword: ""
    }
  });

  async function onSubmit(values: CreateUserRequestDTO) {
    if (loading) return;
    setLoading(true);
    try {
      const response = await addNewUser(values);
      if (response == 201) {
        toast("Success", {
          description: "Add new user successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
        fetchUsers();
        createUserForm.reset();
        setOpen(false);
      } else {
        toast("Error", {
          description: "Add new user failed",
          duration: 2000,
          className: "!bg-red-500 !text-white"
        });
      }
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: createUserForm.setError
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchRole = async () => {
      const result = await getAllRoles();
      setRoles(result);
    };
    setTimeout(() => fetchRole(), 500);
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border border-gray-300 bg-gray-50 dark:bg-slate-800 overflow-y-auto py-3 rounded-lg w-[95vw]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Add User</DialogTitle>
        </DialogHeader>
        <div className="mt-0">
          <Form {...createUserForm}>
            <form
              onSubmit={createUserForm.handleSubmit(onSubmit)}
              className="p-2 md:p-4 border border-gray-200 rounded-lg"
              noValidate
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={createUserForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your name"
                            {...field}
                            className="!mt-0 border-gray-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createUserForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            type="email"
                            {...field}
                            className="!mt-0 border-gray-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createUserForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your password"
                            type="password"
                            {...field}
                            className="!mt-0 border-gray-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createUserForm.control}
                    name="repassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Re-enter your password"
                            type="password"
                            {...field}
                            className="!mt-0 border-gray-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={createUserForm.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        {...field}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full !mt-0 border-gray-200 !cursor-pointer">
                            <SelectValue placeholder="Select an role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="z-50 border-gray-200">
                          {roles.map((role, index) => (
                            <SelectItem
                              key={index}
                              value={role.id}
                            >
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="!mt-6 flex justify-center items-center gap-5 ">
                <Button
                  type="submit"
                  className="block bg-lime-500 text-white hover:bg-lime-600 transition cursor-pointer"
                >
                  Create
                  {loading && <span className="ml-2 animate-spin">⌛</span>}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
