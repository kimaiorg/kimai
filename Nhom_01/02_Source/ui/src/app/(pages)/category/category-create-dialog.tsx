"use client";

import { addNewCategory } from "@/api/category.api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { handleErrorApi } from "@/lib/utils";
import { CreateCategoryRequestSchema, CreateCategoryValidation } from "@/type_schema/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function CategoryCreateDialog({
  children,
  fetchCategories
}: {
  children: React.ReactNode;
  fetchCategories: () => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const createCategoryForm = useForm<CreateCategoryValidation>({
    resolver: zodResolver(CreateCategoryRequestSchema),
    defaultValues: {
      name: "Write unit test",
      description: "",
      color: "#1FDB3E"
    }
  });
  async function onSubmit(values: CreateCategoryValidation) {
    if (loading) return;
    setLoading(true);
    try {
      const response = await addNewCategory(values);

      if (response == 201 || response == 200 || response == 204) {
        toast("Success", {
          description: "Add new category successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
        fetchCategories();
        createCategoryForm.reset();
        setOpen(false);
      } else {
        toast("Failed", {
          description: "Failed to add category. Please try again!",
          duration: 2000,
          className: "!bg-red-500 !text-white"
        });
      }
    } catch (error: unknown) {
      handleErrorApi({
        error,
        setError: createCategoryForm.setError
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {}, []);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <DialogHeader>
          <DialogTitle>Create category</DialogTitle>
        </DialogHeader>

        <Form {...createCategoryForm}>
          <form
            onSubmit={createCategoryForm.handleSubmit(onSubmit)}
            className="p-2 md:p-4 border border-gray-200 rounded-lg"
            noValidate
          >
            <div className="grid grid-cols-12 gap-4 mb-3 items-start">
              {/* Name and Color */}
              <FormField
                control={createCategoryForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-10">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the category name"
                        className="!mt-0 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createCategoryForm.control}
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
                control={createCategoryForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-12">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter description for this category"
                        rows={2}
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
