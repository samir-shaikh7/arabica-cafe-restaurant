import { createFileRoute } from "@tanstack/react-router";
import { AdminPromotions } from "@/admin/pages/AdminPromotions";

export const Route = createFileRoute("/admin/promotions")({
  component: AdminPromotions,
});
