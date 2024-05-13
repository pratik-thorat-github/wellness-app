import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function successToast(string: string) {
  return toast.success(string, {
    position: "bottom-center",
  });
}

export function errorToast(string: string) {
  return toast.error(string, {
    position: "bottom-center",
  });
}

export function infoToast(string: string) {
  return toast.info(string, {
    position: "bottom-center",
  });
}
