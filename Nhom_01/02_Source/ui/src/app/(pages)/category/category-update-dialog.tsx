"use client";

import { updateCategory } from "@/api/category.api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { handleErrorApi } from "@/lib/utils";
import { CategoryType, CreateCategoryRequestSchema, UpdateCategoryValidation } from "@/type_schema/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function CategoryUpdateDialog({
  children,
  targetCategory,
  fetchCategories
}: {
  children: React.ReactNode;
  targetCategory: CategoryType;
  fetchCategories: () => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const updateCategoryForm = useForm<UpdateCategoryValidation>({
    resolver: zodResolver(CreateCategoryRequestSchema),
    defaultValues: {
      name: targetCategory.name,
      description: targetCategory.description,
      color: targetCategory.color || "#1FDB3E"
    }
  });
  async function onSubmit(values: UpdateCategoryValidation) {
    if (loading) return;
    setLoading(true);
    try {
      // const { cost, ...rest } = values;
      // const payload: UpdateCategoryRequestDTO = {
      //   cost: Number(cost),
      //   ...rest
      // };
      // console.log(payload);
      const response = await updateCategory(values, targetCategory.id);

      if (response == 200 || response == 201 || response == 204) {
        toast("Success", {
          description: "Update category successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
        fetchCategories();
        updateCategoryForm.reset();
        setOpen(false);
      } else {
        toast("Failed", {
          description: "Failed to update category. Please try again!",
          duration: 2000,
          className: "!bg-red-500 !text-white"
        });
      }
    } catch (error: unknown) {
      handleErrorApi({
        error,
        setError: updateCategoryForm.setError
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <DialogHeader>
          <DialogTitle>Update category</DialogTitle>
        </DialogHeader>

        <Form {...updateCategoryForm}>
          <form
            onSubmit={updateCategoryForm.handleSubmit(onSubmit)}
            className="p-2 md:p-4 border border-gray-200 rounded-lg"
            noValidate
          >
            <div className="grid grid-cols-12 gap-4 mb-3 items-start">
              <FormField
                control={updateCategoryForm.control}
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
                control={updateCategoryForm.control}
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
                control={updateCategoryForm.control}
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

              {/* <FormField
                control={updateCategoryForm.control}
                name="cost"
                render={({ field }) => (
                  <FormItem className="col-span-4">
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="h-10 !mt-0 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updateCategoryForm.control}
                name="visible"
                render={({ field }) => (
                  <FormItem className="col-span-4">
                    <FormLabel>Visible</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-violet-600!"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
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
