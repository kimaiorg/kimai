"use client";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { UserType } from "@/type_schema/user.schema";
import { Mail, Phone, Star } from "lucide-react";

export function MemberHoverCard({
  children,
  member,
  lead
}: {
  children: React.ReactNode;
  member: UserType;
  lead: UserType;
}) {
  return (
    <HoverCard
      closeDelay={0}
      openDelay={0}
    >
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80 border border-gray-200">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center">
              <h4 className="text-sm font-semibold">{member?.name}</h4>
              {member?.user_id == lead?.user_id && (
                <div className="ml-2 flex items-center text-blue-500">
                  <Star className="h-3 w-3 mr-1" />
                  <span className="text-xs">Team Lead</span>
                </div>
              )}
            </div>
            {/* <p className="text-sm text-muted-foreground">{member.color}</p> */}
            <div className="flex items-center pt-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">{member?.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-3.5 w-3.5 text-muted-foreground mr-1" />
              <span className="text-xs text-muted-foreground">{member?.updated_at}</span>
            </div>
          </div>
        </div>
        {/* <div className="mt-4 border-t pt-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Department: {department}</span>
            <span>Joined: {member.}</span>
          </div>
        </div> */}
      </HoverCardContent>
    </HoverCard>
  );
}
