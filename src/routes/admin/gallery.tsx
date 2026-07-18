import { createFileRoute } from "@tanstack/react-router";
import { AdminGallery } from "@/admin/pages/AdminGallery";

export const Route = createFileRoute("/admin/gallery")({
  component: AdminGallery,
});
