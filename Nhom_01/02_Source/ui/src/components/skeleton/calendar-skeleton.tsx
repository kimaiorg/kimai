import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
export function CalendarSkeleton() {
  // Generate time slots from 6am to 9pm
  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 6;
    return hour < 12 ? `${hour}am` : hour === 12 ? `12pm` : `${hour - 12}pm`;
  });

  // Generate days of the week
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex flex-col h-full w-full space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            disabled
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            disabled
            className="ml-2"
          >
            today
          </Button>
        </div>
        <Skeleton className="h-6 w-48" />
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            disabled
          >
            day
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled
          >
            week
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled
          >
            month
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-md overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 border-r bg-muted/20">
            <Skeleton className="h-5 w-12" />
          </div>
          {days.map((day, index) => (
            <div
              key={index}
              className="p-2 text-center border-r last:border-r-0 bg-muted/20"
            >
              <Skeleton className="h-5 w-20 mx-auto" />
            </div>
          ))}
        </div>

        {/* Time Slots */}
        <div className="grid grid-cols-8 divide-y">
          {timeSlots.map((time, timeIndex) => (
            <div
              key={timeIndex}
              className="contents"
            >
              {/* Time Label */}
              <div className="p-2 border-r flex items-start">
                <Skeleton className="h-4 w-10" />
              </div>

              {/* Day Cells */}
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                // Randomly decide if this cell should have an event skeleton
                const hasEvent = Math.random() < 0.1;
                const isLongEvent = Math.random() < 0.3;
                const height = isLongEvent ? "h-24" : "h-8";

                return (
                  <div
                    key={`${timeIndex}-${dayIndex}`}
                    className="p-1 border-r last:border-r-0 min-h-16 relative"
                  >
                    {hasEvent && (
                      <div className="absolute inset-1">
                        <Skeleton className={`w-full ${height} rounded-sm`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
