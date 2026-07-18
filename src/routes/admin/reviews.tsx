import { createFileRoute } from "@tanstack/react-router";
import { AdminReviews } from "@/admin/pages/AdminReviews";

export const Route = createFileRoute("/admin/reviews")({
  component: AdminReviews,
});
