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
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");

    const client = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await client.auth.getUser();
    if (!user) return errorResponse("Non autorisé", 401);

    let query = client
      .from("progress_reports")
      .select("*, projects(name, client_name)")
      .order("report_date", { ascending: false });

    if (projectId) query = query.eq("project_id", projectId);
    if (from) query = query.gte("report_date", from);
    if (to) query = query.lte("report_date", to);

    const { data: reports } = await query;

    const format = url.searchParams.get("format") ?? "json";

    if (format === "csv") {
      const rows = [
        "Date,Projet,Client,Avancement,Ouvriers,Météo,Résumé,Problèmes,Prochaines étapes",
      ];
      for (const r of reports ?? []) {
        const proj = r.projects as { name: string; client_name: string | null } | null;
        rows.push([
          r.report_date,
          csvEscape(proj?.name ?? ""),
          csvEscape(proj?.client_name ?? ""),
          `${r.overall_percent}%`,
          r.workers_present ?? "",
          csvEscape(r.weather ?? ""),
          csvEscape(r.summary),
          csvEscape(r.problems ?? ""),
          csvEscape(r.next_steps ?? ""),
        ].join(","));
      }
      return new Response(rows.join("\n"), {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="rapports-avancement.csv"`,
        },
      });
    }

    return jsonResponse({
      reports: reports ?? [],
      count: (reports ?? []).length,
      exported_at: new Date().toISOString(),
    });
  } catch (err) {
    return errorResponse(String(err));
  }
});

function csvEscape(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}
