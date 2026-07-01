import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, handleOptions, jsonResponse, errorResponse } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return handleOptions();

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return errorResponse("Non autorisé", 401);

    const url = new URL(req.url);
    const projectId = url.searchParams.get("project_id");

    const client = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await client.auth.getUser();
    if (!user) return errorResponse("Non autorisé", 401);

    let projectsQuery = client.from("projects").select("id, name, status, budget, progress_percent, start_date, end_date");
    if (projectId) projectsQuery = projectsQuery.eq("id", projectId);

    const [
      { data: projects },
      { data: orders },
      { data: invoices },
      { data: timeEntries },
    ] = await Promise.all([
      projectsQuery,
      client.from("purchase_orders").select("project_id, total_amount, status").neq("status", "annulee"),
      client.from("invoices").select("project_id, total, status").neq("status", "annulee"),
      client.from("time_entries").select("project_id, hours, personnel(daily_rate)"),
    ]);

    // Build per-project spend map from orders
    const ordersByProject = new Map<string, number>();
    for (const o of orders ?? []) {
      if (o.project_id) {
        ordersByProject.set(o.project_id, (ordersByProject.get(o.project_id) ?? 0) + Number(o.total_amount));
      }
    }

    // Build per-project labour cost from time entries
    const labourByProject = new Map<string, number>();
    for (const e of timeEntries ?? []) {
      if (!e.project_id) continue;
      const dailyRate = (e.personnel as { daily_rate: number | null } | null)?.daily_rate ?? 0;
      const cost = (Number(e.hours) / 8) * dailyRate;
      labourByProject.set(e.project_id, (labourByProject.get(e.project_id) ?? 0) + cost);
    }

    // Build per-project revenue from invoices
    const revenueByProject = new Map<string, number>();
    const paidByProject = new Map<string, number>();
    for (const i of invoices ?? []) {
      if (!i.project_id) continue;
      revenueByProject.set(i.project_id, (revenueByProject.get(i.project_id) ?? 0) + Number(i.total));
      if (i.status === "payee") {
        paidByProject.set(i.project_id, (paidByProject.get(i.project_id) ?? 0) + Number(i.total));
      }
    }

    const kpis = (projects ?? []).map((p) => {
      const budget = Number(p.budget ?? 0);
      const material_cost = ordersByProject.get(p.id) ?? 0;
      const labour_cost = Math.round((labourByProject.get(p.id) ?? 0) * 100) / 100;
      const total_cost = material_cost + labour_cost;
      const revenue = revenueByProject.get(p.id) ?? 0;
      const paid = paidByProject.get(p.id) ?? 0;
      const margin = revenue - total_cost;
      const margin_pct = revenue > 0 ? Math.round((margin / revenue) * 100) : null;
      const budget_consumed_pct = budget > 0 ? Math.round((total_cost / budget) * 100) : null;
      const over_budget = budget > 0 && total_cost > budget;

      // Burn rate: daily spend (if project has dates)
      let burn_rate: number | null = null;
      if (p.start_date) {
        const start = new Date(p.start_date).getTime();
        const now = Date.now();
        const days = Math.max(1, Math.round((now - start) / 86400000));
        burn_rate = Math.round((total_cost / days) * 100) / 100;
      }

      return {
        project_id: p.id,
        project_name: p.name,
        status: p.status,
        progress_percent: p.progress_percent,
        budget,
        material_cost,
        labour_cost,
        total_cost,
        revenue,
        paid,
        margin,
        margin_pct,
        budget_consumed_pct,
        over_budget,
        burn_rate,
      };
    });

    const totals = kpis.reduce(
      (acc, k) => ({
        total_budget: acc.total_budget + k.budget,
        total_cost: acc.total_cost + k.total_cost,
        total_revenue: acc.total_revenue + k.revenue,
        total_paid: acc.total_paid + k.paid,
        total_margin: acc.total_margin + k.margin,
        over_budget_count: acc.over_budget_count + (k.over_budget ? 1 : 0),
      }),
      { total_budget: 0, total_cost: 0, total_revenue: 0, total_paid: 0, total_margin: 0, over_budget_count: 0 }
    );

    return jsonResponse({
      totals,
      projects: kpis,
      generated_at: new Date().toISOString(),
    });
  } catch (err) {
    return errorResponse(String(err));
  }
});
