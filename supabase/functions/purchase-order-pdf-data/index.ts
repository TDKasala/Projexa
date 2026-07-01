import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, handleOptions, jsonResponse, errorResponse } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return handleOptions();

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return errorResponse("Non autorisé", 401);

    const url = new URL(req.url);
    const poId = url.searchParams.get("po_id");
    if (!poId) return errorResponse("po_id requis", 400);

    const client = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await client.auth.getUser();
    if (!user) return errorResponse("Non autorisé", 401);

    const [{ data: order }, { data: items }, { data: profile }] = await Promise.all([
      client
        .from("purchase_orders")
        .select("*, suppliers(*), projects(name)")
        .eq("id", poId)
        .single(),
      client
        .from("purchase_order_items")
        .select("*")
        .eq("purchase_order_id", poId)
        .order("sort_order"),
      client.from("profiles").select("*, companies(*)").eq("id", user.id).single(),
    ]);

    if (!order) return errorResponse("Commande introuvable", 404);

    const company = (profile as { companies: Record<string, unknown> } | null)?.companies ?? {};

    return jsonResponse({
      order,
      items: items ?? [],
      company,
      generated_at: new Date().toISOString(),
    });
  } catch (err) {
    return errorResponse(String(err));
  }
});
