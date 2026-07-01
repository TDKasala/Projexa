import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, handleOptions, jsonResponse, errorResponse } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return handleOptions();

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return errorResponse("Non autorisé", 401);

    const client = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await client.auth.getUser();
    if (!user) return errorResponse("Non autorisé", 401);

    const { data: materials } = await client
      .from("materials")
      .select("id, name, unit, quantity, min_stock, unit_price, projects(name)")
      .not("min_stock", "is", null)
      .order("name");

    const alerts = (materials ?? [])
      .filter((m) => Number(m.quantity) < Number(m.min_stock))
      .map((m) => ({
        id: m.id,
        name: m.name,
        unit: m.unit,
        quantity: Number(m.quantity),
        min_stock: Number(m.min_stock),
        shortage: Number(m.min_stock) - Number(m.quantity),
        unit_price: m.unit_price ? Number(m.unit_price) : null,
        restock_cost: m.unit_price
          ? Math.round((Number(m.min_stock) - Number(m.quantity)) * Number(m.unit_price) * 100) / 100
          : null,
        project: (m.projects as { name: string } | null)?.name ?? null,
        severity: Number(m.quantity) === 0 ? "critique" : "attention",
      }));

    const critical = alerts.filter((a) => a.severity === "critique").length;
    const warning = alerts.filter((a) => a.severity === "attention").length;
    const total_restock_cost = alerts.reduce((s, a) => s + (a.restock_cost ?? 0), 0);

    return jsonResponse({
      summary: { critical, warning, total_alerts: alerts.length, total_restock_cost },
      alerts,
      checked_at: new Date().toISOString(),
    });
  } catch (err) {
    return errorResponse(String(err));
  }
});
