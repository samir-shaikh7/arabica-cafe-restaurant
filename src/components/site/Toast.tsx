import { toast } from "sonner";

export function useToast() {
  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    } else if (type === "warning") {
      toast.warning(message);
    } else {
      toast(message);
    }
  };

  return { showToast };
}
