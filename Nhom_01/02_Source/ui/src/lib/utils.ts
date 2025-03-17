import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
export const defaultAvatar = "https://icons.veryicon.com/png/o/miscellaneous/two-color-webpage-small-icon/user-244.png";
export const defaultGameImage =
    "https://t4.ftcdn.net/jpg/04/42/21/53/360_F_442215355_AjiR6ogucq3vPzjFAAEfwbPXYGqYVAap.jpg";
export const defaultVoucherImage = "https://agencyvn.com/wp-content/uploads/2019/05/Voucher-l%C3%A0-g%C3%AC.jpg";
export const defaultEventImage = "http://image.gmarket.co.kr/service_image/2020/01/28/20200128144035177873_0_0.jpg";
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
            message: item.message,
        });
    });
};
