"use client";

import { getRequestById, requestCards, RequestPageType } from "@/app/(pages)/request/request-items";
import { AuthenticatedRoute } from "@/components/shared/authenticated-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/lib/i18n";
import { RequestViewType } from "@/type_schema/request";
import { SendHorizontal } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

function RequestPage() {
  const queryParams = useSearchParams();
  const requestId = queryParams.get("rq") || RequestPageType.TIMESHEET;
  const { t } = useTranslation();
  const [selectedRequest, setSelectedRequest] = useState<RequestViewType>(getRequestById(requestId) || requestCards[0]);

  const handleSelectingRequest = (component: RequestViewType) => {
    setSelectedRequest(component);
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Request Management</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {requestCards.map((request, index) => (
          <Card
            className="overflow-hidden border border-gray-200 !py-3"
            key={index}
          >
            <div className="relative">
              <CardHeader>
                <CardTitle className={`text-2xl ${request.textColor}`}>{request.title}</CardTitle>
                <CardDescription className="">{request.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end pt-2 relative z-10">
                <button
                  className="bg-main text-white cursor-pointer px-3 flex gap-1 items-center rounded-lg"
                  onClick={() => handleSelectingRequest(request)}
                >
                  View
                  <SendHorizontal
                    stroke="white"
                    size={14}
                  />
                </button>
              </CardContent>
              <div className="absolute right-0 top-0 h-full w-1/3 flex items-center justify-center opacity-10 z-[1]">
                <div className={`${request.background || "bg-amber-200"} rounded-full p-12`}>{request.icon}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {selectedRequest && (
        <>
          <div className="">
            <div className="py-5">
              <div className="max-w-[70%] mx-auto">
                <Separator />
              </div>
            </div>
            <selectedRequest.component />
          </div>
        </>
      )}
    </>
  );
}

export default AuthenticatedRoute(RequestPage, []);
