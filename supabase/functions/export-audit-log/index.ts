import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, errorResponse, handleOptions } from "../_shared/cors.ts";

function escapeCsv(val: unknown): string {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

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
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 1000), 5000);

    let query = adminClient
      .from("admin_audit_logs")
      .select("id, actor_id, action, target_type, target_id, metadata, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (from) query = query.gte("created_at", from);
    if (to) query = query.lte("created_at", to);

    const { data: logs } = await query;

    const header = "id,actor_id,action,target_type,target_id,metadata,created_at\n";
    const rows = (logs ?? [])
      .map((l) =>
        [
          l.id,
          l.actor_id,
          l.action,
          l.target_type,
          l.target_id,
          JSON.stringify(l.metadata ?? {}),
          l.created_at,
        ]
          .map(escapeCsv)
          .join(",")
      )
      .join("\n");

    return new Response(header + rows, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="audit-log-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "Erreur interne");
  }
});
