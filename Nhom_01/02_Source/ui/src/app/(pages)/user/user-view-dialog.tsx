"use client";

import { getUserRolePermissions } from "@/api/auth.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RolePermissionType } from "@/type_schema/role";
import { UserType } from "@/type_schema/user.schema";
import { format } from "date-fns";
import { BadgeCheck, Calendar, CheckCircle2, Key, Mail, Shield, ShieldAlert, UserCircle, UserIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function UserViewDialog({ children, user }: { children: React.ReactNode; user: UserType }) {
  const [open, setOpen] = useState(false);
  const [rolePermission, setRolePermission] = useState<RolePermissionType>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRolePermission = async () => {
      setLoading(true);
      try {
        const result = await getUserRolePermissions(user.user_id);
        setRolePermission(result);
      } catch (error) {
        console.error("Failed to fetch role permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open && user.user_id) {
      getRolePermission();
    }
  }, [user.user_id, open]);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (error) {
      return dateString;
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarImage
                  src={user.picture}
                  alt={user.name}
                />
                <AvatarFallback className="text-lg font-medium bg-primary/10 text-primary">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold">{user.name}</DialogTitle>
                <p className="text-muted-foreground">{user.nickname || user.email}</p>
              </div>
              {rolePermission?.role && (
                <Badge
                  variant="outline"
                  className="px-3 py-1 text-sm bg-primary/10 border-primary/20 text-primary"
                >
                  {rolePermission.role.name}
                </Badge>
              )}
            </div>
          </DialogHeader>

          <Separator />

          <Tabs
            defaultValue="profile"
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="profile"
                className="cursor-pointer"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="permissions"
                className="cursor-pointer"
              >
                Permissions
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="profile"
              className="space-y-6 pt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <UserIcon className="h-5 w-5" />
                      User Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <UserCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Full Name</p>
                          <p className="font-medium">{user.name}</p>
                        </div>
                      </div>

                      {user.nickname && (
                        <div className="flex items-start gap-3">
                          <UserIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Nickname</p>
                            <p className="font-medium">{user.nickname}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{user.email}</p>
                            {user.email_verified ? (
                              <Badge
                                variant="outline"
                                className="bg-secondary text-white text-xs"
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-amber-50 border-amber-200 text-amber-700 text-xs"
                              >
                                Not Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Key className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">User ID</p>
                          <p className="font-medium text-xs font-mono bg-muted p-1 rounded">{user.user_id}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 border-l-2 border-green-500 pl-4 py-1">
                        <div>
                          <p className="font-medium">Account Created</p>
                          <p className="text-sm text-muted-foreground">{formatDate(user.created_at)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 border-l-2 border-amber-500 pl-4 py-1">
                        <div>
                          <p className="font-medium">Last Updated</p>
                          <p className="text-sm text-muted-foreground">{formatDate(user.updated_at)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent
              value="permissions"
              className="space-y-6 pt-4"
            >
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                </div>
              ) : (
                <>
                  {rolePermission ? (
                    <div className="space-y-6">
                      <Card className="border border-gray-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Role
                          </CardTitle>
                          <CardDescription>User's assigned role and its description</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-primary/90 hover:bg-primary/80">{rolePermission.role.name}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{rolePermission.role.description}</p>
                        </CardContent>
                      </Card>

                      <Card className="border border-gray-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5" />
                            Permissions
                          </CardTitle>
                          <CardDescription>List of permissions granted to this user</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {rolePermission.permissions.map((permission) => (
                              <div
                                key={permission.permission_name}
                                className="flex items-start gap-2 p-3 rounded-md border bg-card border border-gray-200"
                              >
                                <BadgeCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-medium text-sm">{permission.permission_name}</p>
                                  <p className="text-xs text-muted-foreground">{permission.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center text-muted-foreground">
                        <ShieldAlert className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No role or permissions information available for this user.</p>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
