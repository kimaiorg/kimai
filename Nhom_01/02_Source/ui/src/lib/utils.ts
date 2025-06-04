import { WeekOptionType } from "@/type_schema/report";
import { clsx, type ClassValue } from "clsx";
import { formatDate } from "date-fns";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};
export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({ status, payload }: { status: number; payload: any }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: 422;
  payload: EntityErrorPayload;
  constructor({ status, payload }: { status: 422; payload: EntityErrorPayload }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

export const handleErrorForm = ({ error, setError }: { error: EntityError; setError: UseFormSetError<any> }) => {
  error.payload.errors.forEach((item) => {
    setError(item.field, {
      type: "server",
      message: item.message
    });
  });
};

export const handleErrorApi = ({
  error,
  setError,
  duration
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  // console.log(error);
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message
      });
    });
  } else {
    toast("Error", {
      description: error?.payload?.message || "Unexpected error! Please try again.",
      className: "!bg-red-500 !text-white",
      duration: duration || 2000
    });
  }
};

export function secondsToTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
/**
 * Format seconds to a human-readable duration string (HH:MM)
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (HH:MM)
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
}

/**
 * Format number to currency string
 * @param amount - Amount to format
 * @param currency - Currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
}

export const currencyFormat = (value: number, currency: string) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency
  }).format(value);

export const generateWeekOption = (): WeekOptionType[] => {
  const currentYear = new Date().getFullYear();
  const result: WeekOptionType[] = [];

  // Find the first Monday of the year
  const date = new Date(currentYear, 0, 1); // Jan 1st
  while (date.getDay() !== 1) {
    // 1 = Monday
    date.setDate(date.getDate() + 1);
  }

  let weekNumber = 1;
  while (date.getFullYear() === currentYear || (date.getFullYear() === currentYear + 1 && date.getDay() !== 1)) {
    const fromDate = new Date(date);
    const toDate = new Date(date);
    toDate.setDate(toDate.getDate() + 6); // Sunday

    result.push({
      week: weekNumber,
      label: `Week ${weekNumber} - ${currentYear} | ${formatDate(fromDate, "dd/MM")} - ${formatDate(toDate, "dd/MM")}`,
      from: fromDate.toISOString(),
      to: toDate.toISOString()
    });

    weekNumber++;
    date.setDate(date.getDate() + 7); // Move to next Monday
  }
  return result;
};

export const getWeekNumber = (date: Date, weekOptions: WeekOptionType[]): number => {
  const currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
  const currentWeekOption = weekOptions.filter((weekOption) => {
    return currentDate >= weekOption.from && currentDate <= weekOption.to;
  });
  console.log(currentWeekOption);
  return currentWeekOption![0].week;
};

export function getRandTime(): number {
  const min = 0; // 1 hour in seconds
  const max = 36000; // 10 hours in seconds
  const interval = 900; // 15 minutes in seconds

  const minIndex = Math.ceil(min / interval); // First valid index
  const maxIndex = Math.floor(max / interval); // Last valid index

  const randomIndex = Math.floor(Math.random() * (maxIndex - minIndex + 1)) + minIndex;

  return randomIndex * interval;
}
