import { createFileRoute } from "@tanstack/react-router";
import { AdminCategories } from "@/admin/pages/AdminCategories";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});
