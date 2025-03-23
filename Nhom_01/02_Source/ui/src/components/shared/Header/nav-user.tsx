"use client";

import DefaultAvatar from "@/components/shared/default-avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Bell, LogOut, UserRoundSearch } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function NavUser() {
    // const [isLoadingUser, setIsLoadingUser] = useState(true);
    // const [user, setUser] = useState<UserType | null>(null);
    // const { isMobile } = useSidebar();
    const { user, isLoading } = useUser();
    const router = useRouter();
    // const userAuth = useAppSelector((state) => state.userState).user as UserType;
    // useLayoutEffect(() => {
    //     if (!userAuth) router.push("/login");
    // }, [userAuth]);
    // useEffect(() => {
    //     const getUserInfo = async () => {
    //         const response = await callGettingUserInfoRequest();
    //         if (response.hasOwnProperty("errorCode")) {
    //             setIsLoadingUser(false);
    //             return;
    //         }
    //         setUser(response as UserType);
    //         setIsLoadingUser(false);
    //     };
    //     getUserInfo();
    // }, []);
    const handleLogout = () => {
        toast("Logout", {
            description: "You are logging out",
            className: "bg-sky-500 text-white",
            duration: 3000,
        });
        window.location.href = "/api/auth/logout";
    };

    if (isLoading) {
        return <p className="text-end">Loading ...</p>;
    }
    if (!isLoading && !user) {
        return (
            <Button
                className="px-6 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition"
                onClick={() => (window.location.href = "/api/auth/login")}
            >
                Login
            </Button>
        );
    }
    return (
        <SidebarMenu className="w-1/4">
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-2 flex-row-reverse cursor-pointer">
                            <div className="h-8 w-8 rounded-full">
                                {/* <img src={defaultAvatar} alt="Default Avatar" className="w-full h-full" /> */}
                                <DefaultAvatar
                                    name={user!.name!}
                                    size={40}
                                />
                            </div>
                            <div className="grid flex-1 text-end text-sm leading-tight">
                                <span className="truncate font-semibold">{user!.name}</span>
                                {/* <span className="truncate text-xs">{user!.email}</span> */}
                            </div>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="min-w-56 rounded-lg"
                        align="end"
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <div className="h-7 w-7 rounded-full">
                                    <DefaultAvatar
                                        name={user!.name!}
                                        size={30}
                                    />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">{user!.name || "Admin"}</span>
                                    <span className="truncate text-xs">{user!.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => router.push("/profile")}
                            >
                                <UserRoundSearch />
                                Profile
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => router.push("/notification")}
                            >
                                <Bell />
                                Notifications
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={handleLogout}
                        >
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
