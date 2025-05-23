import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toastAction = ({ data, ...props }: { data: any }) => {
  if (data.error) {
    toast.error(data.message);
  } else {
    toast.success(data.message);
  }
};
