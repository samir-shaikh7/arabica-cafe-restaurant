import { createFileRoute } from "@tanstack/react-router";
import { AdminSettings } from "@/admin/pages/AdminSettings";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});
