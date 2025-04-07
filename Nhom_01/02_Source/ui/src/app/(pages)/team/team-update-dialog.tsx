"use client";

import { updateTeam } from "@/api/team.api";
import { getAllUsers } from "@/api/user.api";
import DefaultAvatar from "@/components/shared/default-avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { handleErrorApi } from "@/lib/utils";
import { CreateTeamRequestSchema, CreateTeamValidation, TeamType, UpdateTeamRequestDTO } from "@/type_schema/team";
import { UserType } from "@/type_schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function TeamUpdateDialog({
  children,
  targetTeam,
  refetchTeams
}: {
  children: React.ReactNode;
  targetTeam: TeamType;
  refetchTeams: () => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [userList, setUserList] = useState<UserType[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>(targetTeam.users);
  const [loading, setLoading] = useState<boolean>(false);
  const [teamLead, setTeamLead] = useState<string | undefined>(targetTeam.lead?.user_id);
  const [memberRequiredMessage, setMemberRequiredMessage] = useState<string>("");

  const updateTeamForm = useForm<CreateTeamValidation>({
    resolver: zodResolver(CreateTeamRequestSchema),
    defaultValues: {
      name: targetTeam.name,
      color: targetTeam.color
    }
  });

  async function onSubmit(values: CreateTeamValidation) {
    if (!selectedUsers.length) {
      setMemberRequiredMessage("Please add at least one member");
      return;
    } else if (!teamLead) {
      setMemberRequiredMessage("Please select a team lead");
      return;
    } else {
      setMemberRequiredMessage("");
    }
    if (loading) return;
    setLoading(true);

    try {
      const payload: UpdateTeamRequestDTO = {
        ...values,
        lead: teamLead!,
        users: selectedUsers.map((user) => user.user_id)
      };
      console.log(payload);
      const response = await updateTeam(payload, targetTeam.id);
      if (response == 200) {
        toast("Success", {
          description: "Update team successfully",
          duration: 2000,
          className: "!bg-lime-500 !text-white"
        });
        refetchTeams();
        setOpen(false);
        updateTeamForm.reset();
      } else {
        toast("Error", {
          description: "Update team failed",
          duration: 2000,
          className: "!bg-red-500 !text-white"
        });
      }
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: updateTeamForm.setError
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getAllUsers();
      setUserList(result.users);
    };
    fetchUsers();
  }, []);

  const availableUsers: UserType[] = userList.filter(
    (user) => !selectedUsers.some((selectedUser) => selectedUser.user_id === user.user_id)
  );

  const handleUserSelection = (userId: string) => {
    setMemberRequiredMessage("");
    const user = availableUsers.find((user) => user.user_id === userId);
    if (user) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((user) => user.user_id !== userId));
  };

  const toggleTeamLead = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userId = event.target.value;
    setTeamLead(userId);
  };

  const memberListErrorMsg =
    selectedUsers.length > 0 ? !selectedUsers.some((user) => user.user_id === teamLead) : false;

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[90%] lg:w-[45rem] border-gray-200">
        <DialogHeader className="border-b border-b-gray-200 pb-2">
          <DialogTitle className="text-xl">Update team</DialogTitle>
        </DialogHeader>

        <Form {...updateTeamForm}>
          <form
            onSubmit={updateTeamForm.handleSubmit(onSubmit)}
            className="p-2 md:p-4 border border-gray-200 rounded-lg"
            noValidate
          >
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-5 gap-4 items-start">
                <div className="col-span-4">
                  <FormField
                    control={updateTeamForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter team name"
                            className="!mt-0 border-gray-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={updateTeamForm.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input
                          type="color"
                          className="!mt-0 border-gray-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <div className="flex items-center">
                  <label className="text-sm font-medium">
                    Add member <span className="text-red-500">*</span>
                  </label>
                </div>
                <Select onValueChange={handleUserSelection}>
                  <SelectTrigger
                    className={`mt-1 w-full cursor-pointer ${memberRequiredMessage ? "border-red-500" : "border-gray-200"}`}
                  >
                    <SelectValue
                      placeholder="Select a user"
                      className="placeholder:text-gray-400"
                    />
                  </SelectTrigger>
                  <SelectContent className="w-full border-gray-200 max-h-80">
                    {availableUsers.map((user, index) => (
                      <SelectItem
                        key={index}
                        value={user.user_id}
                      >
                        {user.name} - {user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {memberRequiredMessage && <p className="text-sm text-red-500">{memberRequiredMessage}</p>}

                <p className="text-sm text-muted-foreground mt-1">
                  Add a new user to the team by selecting it from the list. Afterwards you can decide if the user should
                  become a teamlead.
                </p>
              </div>

              <div>
                <div className="flex items-center">
                  <label className="text-sm font-medium">
                    Member <span className="text-red-500">*</span>
                  </label>
                </div>
                <p className="text-sm text-muted-foreground">The selected / highlighted users are team leaders.</p>

                <ScrollArea
                  className={`mt-2 max-h-40 overflow-auto border rounded-lg p-1 ${memberListErrorMsg ? "border-red-500" : "border-gray-200 "}`}
                >
                  {selectedUsers.length == 0 && <p className="text-center">Empty</p>}
                  <RadioGroup
                    onChange={toggleTeamLead}
                    className="rounded cursor-pointer !gap-1"
                    defaultValue={teamLead}
                  >
                    {selectedUsers.map((user, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between py-1 px-3 border rounded-lg border-gray-200`}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value={user.user_id}
                            id={user.user_id}
                            className="border border-gray-200"
                          />
                          <div className={`flex items-center justify-center w-8 h-8 rounded`}>
                            <DefaultAvatar
                              name={user.name}
                              size={40}
                              textSize={20}
                              index={index}
                            />
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className=" cursor-pointer"
                          onClick={() => handleRemoveUser(user.user_id)}
                        >
                          <Trash2 className="h-5 w-5 text-gray-500 dark:text-white" />
                        </Button>
                      </div>
                    ))}
                  </RadioGroup>
                </ScrollArea>
                {memberListErrorMsg && <p className="text-sm text-red-500">Please select at least one team lead.</p>}
              </div>
            </div>

            <DialogFooter className="sm:justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                className="border-gray-200 cursor-pointer"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
              <Button
                type="submit"
                className="bg-lime-500 hover:bg-lime-600 text-white cursor-pointer"
              >
                Update
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
