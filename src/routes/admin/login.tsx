import { createFileRoute } from "@tanstack/react-router";
import { AdminLogin } from "@/admin/pages/AdminLogin";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});
