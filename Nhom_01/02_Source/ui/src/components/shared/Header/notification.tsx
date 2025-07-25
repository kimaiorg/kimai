"use client";

import { callMarkAsReadNotificationRequest, getAllNotifications } from "@/api/notification.api";
import { RequestPageType } from "@/app/(pages)/request/request-items";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationType, NotificationTypeType } from "@/type_schema/notification";
import { useUser } from "@auth0/nextjs-auth0/client";
import { formatDistanceToNow } from "date-fns";
import { BellRing, Calendar, Clock, CreditCard, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Notification({ children }: { children: React.ReactNode }) {
  // Define state, actions here
  const [notifications, setNotifications] = useState<NotificationType[] | null>(null);
  const router = useRouter();
  const { user: currentUser } = useUser();

  const getNotifications = async () => {
    const result = await getAllNotifications();
    // console.log(result.data);
    result.data = result.data.filter((notification) => notification.user_id === currentUser!.sub).slice(0, 3);
    setNotifications(result.data);
  };

  useEffect(() => {
    getNotifications();
    const interval = setInterval(() => {
      getNotifications();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const determineUrl = (type: NotificationTypeType, targetId: string) => {
    switch (type) {
      case "expense_request":
        return `/request?rq=${RequestPageType.TASK}&targetId=${targetId}`;
      case "absence_request":
        return `/request?rq=${RequestPageType.ABSENCE}&targetId=${targetId}`;
      case "timesheet_request":
        return `/request?rq=${RequestPageType.TIMESHEET}&targetId=${targetId}`;
      default:
        return `/request`;
    }
  };

  const handleMarkAsReadAndRedirect = async (notification: NotificationType) => {
    if (!notification.has_read) {
      const result = await callMarkAsReadNotificationRequest(notification.id.toString());
      if (result == 200 || result == 201) {
        const currentNotifications = [...notifications!];
        const notificationIndex = currentNotifications.findIndex((n) => n.id === notification.id);
        currentNotifications[notificationIndex].has_read = true;
        setNotifications(currentNotifications);
      }
    }
    const determinedUrl = determineUrl(notification.type, notification.target_id);

    router.push(determinedUrl);
  };

  const getNotificationIcon = (type: NotificationTypeType) => {
    switch (type) {
      case NotificationTypeType.EXPENSE_REQUEST:
      case NotificationTypeType.EXPENSE_REQUEST_STATUS:
        return <CreditCard className="h-10 w-8 text-emerald-500" />;
      case NotificationTypeType.ABSENCE_REQUEST:
      case NotificationTypeType.ABSENCE_REQUEST_STATUS:
        return <Calendar className="h-8 w-8 text-violet-500" />;
      case NotificationTypeType.TIMESHEET_REQUEST:
      case NotificationTypeType.TIMESHEET_REQUEST_STATUS:
        return <Clock className="h-8 w-8 text-amber-500" />;
      default:
        return <FileText className="h-8 w-8 text-sky-500" />;
    }
  };

  const numOfUnReadNotifications = (notifications || []).filter((notification) => !notification.has_read).length;

  return (
    <div className="p-0">
      <Popover>
        <PopoverTrigger className="flex items-center">
          <div className="relative">
            {children}
            {numOfUnReadNotifications > 0 && (
              <div className="absolute top-0 right-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                </span>
              </div>
            )}
          </div>
        </PopoverTrigger>
        {/* Render the two newest notifications below */}
        <PopoverContent
          className="w-96 p-0 mt-1 border border-gray-200"
          align="end"
        >
          <div className="flex items-center justify-between px-3 py-1 border-b">
            <h3 className="font-medium">Notifications</h3>
            {numOfUnReadNotifications > 0 && (
              <Badge
                variant="secondary"
                className="font-medium text-xs text-white"
              >
                {numOfUnReadNotifications} unread
              </Badge>
            )}
          </div>

          <div className="">
            {!notifications && (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex gap-3"
                  >
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {notifications && notifications.length === 0 && (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <BellRing className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">No notifications</p>
                <p className="text-xs text-muted-foreground mt-1">You don't have any notifications yet</p>
              </div>
            )}

            {notifications && notifications.length > 0 && (
              <div className="border-t border-gray-200">
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-3 border-b border-gray-200 hover:bg-muted/50 cursor-pointer transition-colors ${
                      !notification.has_read ? "bg-gray-100 dark:bg-slate-800" : ""
                    }`}
                    onClick={() => handleMarkAsReadAndRedirect(notification)}
                  >
                    <div className="flex items-center justify-center h-10 w-10 rounded-md mr-3">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`text-sm truncate ${!notification.has_read ? "font-medium" : ""}`}>
                          {notification.title}
                        </h4>
                        <span className="text-[10px] text-muted-foreground mt-1 block w-20 text-end">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: false })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.type === NotificationTypeType.TIMESHEET_REQUEST
                          ? "A member has just started a timesheet"
                          : notification.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-2 pb-1 border-t text-center">
            <Link
              href="/notifications"
              className="text-xs hover:text-[#6e44ff] hover:underline inline-flex items-center"
            >
              View all notifications
              <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
