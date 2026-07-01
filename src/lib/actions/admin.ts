"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/dal-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import type { UserRole } from "@/lib/types";

export type AdminActionState = { error: string | null; success?: boolean };

async function logAdminAction(
  actorId: string,
  action: string,
  targetType: string | null,
  targetId: string | null,
  metadata?: Record<string, unknown>
) {
  const admin = createAdminClient();
  await admin.from("admin_audit_logs").insert({
    actor_id: actorId,
    action,
    target_type: targetType,
    target_id: targetId,
    metadata: metadata ?? null,
  });
}

export async function getAdminOverview() {
  await requireSuperAdmin();
  const admin = createAdminClient();

  const [
    { count: totalCompanies },
    { count: activeCompanies },
    { count: totalUsers },
    { count: superAdmins },
    { count: totalProjects },
    { data: budgetRows },
    { count: totalInvoices },
    { data: recentCompanies },
    { data: recentLogs },
  ] = await Promise.all([
    admin.from("companies").select("*", { count: "exact", head: true }),
    admin.from("companies").select("*", { count: "exact", head: true }).eq("is_active", true),
    admin.from("profiles").select("*", { count: "exact", head: true }),
    admin.from("profiles").select("*", { count: "exact", head: true }).eq("is_superadmin", true),
    admin.from("projects").select("*", { count: "exact", head: true }),
    admin.from("projects").select("budget"),
    admin.from("invoices").select("*", { count: "exact", head: true }),
    admin
      .from("companies")
      .select("id, name, is_active, created_at, email")
      .order("created_at", { ascending: false })
      .limit(8),
    admin
      .from("admin_audit_logs")
      .select("id, actor_id, action, target_type, target_id, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const totalBudget = (budgetRows ?? []).reduce((s, p) => s + (p.budget ?? 0), 0);

  return {
    totalCompanies: totalCompanies ?? 0,
    activeCompanies: activeCompanies ?? 0,
    totalUsers: totalUsers ?? 0,
    superAdmins: superAdmins ?? 0,
    totalProjects: totalProjects ?? 0,
    totalBudget,
    totalInvoices: totalInvoices ?? 0,
    recentCompanies: recentCompanies ?? [],
    recentLogs: recentLogs ?? [],
  };
}

export async function getCompaniesWithStats() {
  await requireSuperAdmin();
  const admin = createAdminClient();

  const { data: companies } = await admin
    .from("companies")
    .select("id, name, is_active, created_at, email, phone, owner_id")
    .order("created_at", { ascending: false });

  if (!companies) return [];

  const withStats = await Promise.all(
    companies.map(async (company) => {
      const [{ count: usersCount }, { count: projectsCount }] = await Promise.all([
        admin
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("company_id", company.id),
        admin
          .from("projects")
          .select("*", { count: "exact", head: true })
          .eq("company_id", company.id),
      ]);
      return {
        ...company,
        users_count: usersCount ?? 0,
        projects_count: projectsCount ?? 0,
      };
    })
  );

  return withStats;
}

export async function getCompanyDetail(id: string) {
  await requireSuperAdmin();
  const admin = createAdminClient();

  const [{ data: company }, { data: users }, { data: projects }] = await Promise.all([
    admin.from("companies").select("*").eq("id", id).single(),
    admin
      .from("profiles")
      .select("id, full_name, email, role, is_superadmin, created_at")
      .eq("company_id", id)
      .order("created_at"),
    admin
      .from("projects")
      .select("id, name, status, progress_percent, budget, start_date, end_date")
      .eq("company_id", id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return { company, users: users ?? [], projects: projects ?? [] };
}

export async function getAllUsers() {
  await requireSuperAdmin();
  const admin = createAdminClient();

  const { data: users } = await admin
    .from("profiles")
    .select("id, full_name, email, role, is_superadmin, company_id, created_at")
    .order("created_at", { ascending: false });

  if (!users) return [];

  const userIds = users.map((u) => u.company_id).filter(Boolean) as string[];
  const uniqueIds = [...new Set(userIds)];

  let companyMap: Record<string, string> = {};
  if (uniqueIds.length > 0) {
    const { data: companies } = await admin
      .from("companies")
      .select("id, name")
      .in("id", uniqueIds);
    companyMap = Object.fromEntries((companies ?? []).map((c) => [c.id, c.name]));
  }

  return users.map((u) => ({
    ...u,
    company_name: u.company_id ? (companyMap[u.company_id] ?? "—") : "—",
  }));
}

export async function getAuditLogs(page = 0, limit = 50) {
  await requireSuperAdmin();
  const admin = createAdminClient();

  const { data: logs } = await admin
    .from("admin_audit_logs")
    .select("id, actor_id, action, target_type, target_id, metadata, created_at")
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (!logs) return [];

  const actorIds = [...new Set(logs.map((l) => l.actor_id).filter(Boolean))] as string[];
  let actorMap: Record<string, string> = {};
  if (actorIds.length > 0) {
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, full_name, email")
      .in("id", actorIds);
    actorMap = Object.fromEntries(
      (profiles ?? []).map((p) => [p.id, p.full_name ?? p.email ?? p.id])
    );
  }

  return logs.map((l) => ({
    ...l,
    actor_label: l.actor_id ? (actorMap[l.actor_id] ?? l.actor_id) : "Système",
  }));
}

export async function getSystemSettings() {
  await requireSuperAdmin();
  const admin = createAdminClient();

  const { data: settings } = await admin
    .from("system_settings")
    .select("*")
    .order("key");

  return settings ?? [];
}

export async function toggleCompany(
  companyId: string,
  isActive: boolean
): Promise<AdminActionState> {
  const profile = await requireSuperAdmin();
  const admin = createAdminClient();

  const { error } = await admin
    .from("companies")
    .update({ is_active: isActive })
    .eq("id", companyId);

  if (error) return { error: "Impossible de modifier l'état de l'entreprise." };

  await logAdminAction(
    profile.id,
    isActive ? "company_activated" : "company_deactivated",
    "company",
    companyId
  );
  revalidatePath("/admin/entreprises");
  return { error: null, success: true };
}

export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<AdminActionState> {
  const profile = await requireSuperAdmin();
  const admin = createAdminClient();

  const { error } = await admin.from("profiles").update({ role }).eq("id", userId);

  if (error) return { error: "Impossible de modifier le rôle." };

  await logAdminAction(profile.id, "update_user_role", "user", userId, { role });
  revalidatePath("/admin/utilisateurs");
  return { error: null, success: true };
}

export async function updateSystemSetting(
  key: string,
  value: string
): Promise<AdminActionState> {
  const profile = await requireSuperAdmin();
  const admin = createAdminClient();

  const { error } = await admin
    .from("system_settings")
    .upsert({ key, value, updated_by: profile.id });

  if (error) return { error: "Impossible de mettre à jour le paramètre." };

  await logAdminAction(profile.id, "update_setting", "setting", key, { value });
  revalidatePath("/admin/parametres");
  return { error: null, success: true };
}

export async function inviteUserToCompany(
  email: string,
  companyId: string,
  role: UserRole
): Promise<AdminActionState> {
  const profile = await requireSuperAdmin();
  const admin = createAdminClient();

  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { company_id: companyId, role },
  });

  if (error) return { error: error.message };

  await logAdminAction(profile.id, "invite_user", "user", email, {
    company_id: companyId,
    role,
  });
  revalidatePath("/admin/utilisateurs");
  return { error: null, success: true };
}
