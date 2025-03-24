import { clsx, type ClassValue } from "clsx";
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
