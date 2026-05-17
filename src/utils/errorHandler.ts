import { AxiosError } from "axios";
import toast from "react-hot-toast";

const errorHandler = (err: any) => {
  if (err instanceof AxiosError) {
    const data = err.response?.data;
    const message =
      (typeof data?.message === "string" && data.message) ||
      (typeof data?.error === "string" && data.error) ||
      (typeof data?.errors === "object" && Object.values(data.errors).flat().join(", "));
    return toast.error(message || "Something went wrong!");
  }
  return toast.error("Error occurred!");
};

export { errorHandler };
