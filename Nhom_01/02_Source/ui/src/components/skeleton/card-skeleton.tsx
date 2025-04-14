import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RoleCardSkeleton({ roleCount }: { roleCount: number }) {
  return (
    <>
      {Array.from({ length: roleCount }).map((_, index) => (
        <Card
          key={`role-${index}`}
          className="p-4"
        >
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        </Card>
      ))}
    </>
  );
}
