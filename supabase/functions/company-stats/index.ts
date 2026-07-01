import { createClient } from "npm:@supabase/supabase-js@2";
import {
  errorResponse,
  handleOptions,
  jsonResponse,
} from "../_shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return handleOptions();

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return errorResponse("Non autorisé", 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: authError,
    } = await callerClient.auth.getUser();
    if (authError || !user) return errorResponse("Non autorisé", 401);

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: profile } = await adminClient
      .from("profiles")
      .select("is_superadmin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_superadmin) return errorResponse("Accès refusé", 403);

    const url = new URL(req.url);
    const companyId = url.searchParams.get("company_id");

    let companiesQuery = adminClient.from("companies").select("id, name, is_active, created_at");
    if (companyId) companiesQuery = companiesQuery.eq("id", companyId);

    const { data: companies } = await companiesQuery;
    if (!companies) return jsonResponse({ data: [] });

    const stats = await Promise.all(
      companies.map(async (company) => {
        const [
          { count: usersCount },
          { count: projectsCount },
          { data: budgetRows },
          { count: invoicesCount },
          { data: invoiceTotals },
          { count: docsCount },
        ] = await Promise.all([
          adminClient
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .eq("company_id", company.id),
          adminClient
            .from("projects")
            .select("*", { count: "exact", head: true })
            .eq("company_id", company.id),
          adminClient
            .from("projects")
            .select("budget")
            .eq("company_id", company.id),
          adminClient
            .from("invoices")
            .select("*", { count: "exact", head: true })
            .eq("company_id", company.id),
          adminClient
            .from("invoices")
            .select("total")
            .eq("company_id", company.id)
            .eq("status", "payee"),
          adminClient
            .from("documents")
            .select("*", { count: "exact", head: true })
            .eq("company_id", company.id),
        ]);

        const totalBudget = (budgetRows ?? []).reduce(
          (s, p) => s + (p.budget ?? 0),
          0
        );
        const paidRevenue = (invoiceTotals ?? []).reduce(
          (s, i) => s + (i.total ?? 0),
          0
        );

        return {
          company_id: company.id,
          company_name: company.name,
          is_active: company.is_active,
          created_at: company.created_at,
          users_count: usersCount ?? 0,
          projects_count: projectsCount ?? 0,
          total_budget: totalBudget,
          invoices_count: invoicesCount ?? 0,
          paid_revenue: paidRevenue,
          documents_count: docsCount ?? 0,
        };
      })
    );

    return jsonResponse({ data: stats });
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "Erreur interne");
  }
});
