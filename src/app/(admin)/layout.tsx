import { requireSuperAdmin } from "@/lib/dal-admin";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSuperAdmin();
  return <AdminShell>{children}</AdminShell>;
}
