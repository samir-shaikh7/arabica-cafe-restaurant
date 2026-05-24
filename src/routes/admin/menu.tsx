import { createFileRoute } from "@tanstack/react-router";
import { AdminMenu } from "@/admin/pages/AdminMenu";

export const Route = createFileRoute("/admin/menu")({
  component: AdminMenu,
});
