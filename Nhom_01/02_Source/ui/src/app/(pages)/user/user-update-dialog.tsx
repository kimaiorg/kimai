"use client";

import { getAllRoles, getUserRolePermissions } from "@/api/auth.api";
import { updateUser } from "@/api/user.api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { handleErrorApi } from "@/lib/utils";
import { RolePermissionType, RoleType } from "@/type_schema/role";
import { UpdateUserRequestSchema, UpdateUserRequestDTO, UserType } from "@/type_schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function UpdateUserModal({
  children,
  targetUser,
  fetchUsers
}: {
  children: React.ReactNode;
  targetUser: UserType;
  fetchUsers: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [rolePermission, setRolePermission] = useState<RolePermissionType>();

  const updateUserForm = useForm<UpdateUserRequestDTO>({
    resolver: zodResolver(UpdateUserRequestSchema),
    defaultValues: {
      name: targetUser.name,
      email: targetUser.email
    }
  });

  async function onSubmit(values: UpdateUserRequestDTO) {
    if (!rolePermission) return;
    if (loading) return;
    setLoading(true);
    try {
      const response = await updateUser(values, targetUser.user_id, rolePermission!.role.id);
      if (response == 200 || response == 201 || response == 204) {
        toast("Success", {
          description: "Update user successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
        fetchUsers();
        updateUserForm.reset();
        setOpen(false);
      } else {
        toast("Error", {
          description: "Update user failed",
          duration: 2000,
          className: "!bg-red-500 !text-white"
        });
      }
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: updateUserForm.setError
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchRolePermission = async () => {
      const response = await getUserRolePermissions(targetUser.user_id);
      setRolePermission(response);
      updateUserForm.setValue("roleId", response.role.id);
    };
    const fetchRole = async () => {
      const result = await getAllRoles();
      setRoles(result);
    };
    fetchRolePermission();
    setTimeout(() => {
      fetchRole();
    }, 1000);
  }, [targetUser]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border border-gray-300 bg-gray-50 dark:bg-slate-800 overflow-y-auto py-3 rounded-lg w-[95vw] md:w-[36rem]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Update User</DialogTitle>
        </DialogHeader>
        <div className="mt-0">
          <Form {...updateUserForm}>
            <form
              onSubmit={updateUserForm.handleSubmit(onSubmit)}
              className="p-2 md:p-4 border border-gray-200 rounded-lg"
              noValidate
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={updateUserForm.control}
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
                            className="!mt-0 border-gray-200"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={updateUserForm.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      {roles && rolePermission && (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={rolePermission.role.id}
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
                      )}
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
                  Update
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
