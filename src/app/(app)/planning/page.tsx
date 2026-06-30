import { CalendarRange } from "lucide-react";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata = { title: "Planning & gestion du temps — Projexa" };

export default function PlanningPage() {
  return (
    <PagePlaceholder
      title="Planning & gestion du temps"
      description="Planifiez vos tâches avec un diagramme de Gantt."
      icon={CalendarRange}
    />
  );
}
