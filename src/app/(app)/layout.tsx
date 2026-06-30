import { requireProfileWithCompany } from "@/lib/dal";
import { AppShell } from "@/components/layout/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfileWithCompany();

  return <AppShell userEmail={profile.email}>{children}</AppShell>;
}
