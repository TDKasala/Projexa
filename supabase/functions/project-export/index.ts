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
    if (!projectId) return errorResponse("project_id requis", 400);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const client = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user } } = await client.auth.getUser();
    if (!user) return errorResponse("Non autorisé", 401);

    // Fetch project with all related data in parallel
    const [
      { data: project },
      { data: tasks },
      { data: milestones },
      { data: personnel },
      { data: materials },
      { data: orders },
      { data: reports },
    ] = await Promise.all([
      client.from("projects").select("*").eq("id", projectId).single(),
      client.from("project_tasks").select("*, personnel(full_name)").eq("project_id", projectId).order("sort_order"),
      client.from("project_milestones").select("*").eq("project_id", projectId).order("due_date"),
      client.from("personnel").select("id, full_name, role, daily_rate, status").eq("project_id", projectId),
      client.from("materials").select("*").eq("project_id", projectId),
      client.from("purchase_orders").select("*, suppliers(name)").eq("project_id", projectId).neq("status", "annulee"),
      client.from("progress_reports").select("*").eq("project_id", projectId).order("report_date", { ascending: false }).limit(10),
    ]);

    if (!project) return errorResponse("Projet introuvable", 404);

    const format = url.searchParams.get("format") ?? "json";

    if (format === "csv") {
      const rows: string[] = [];
      rows.push("Section,Champ,Valeur");
      rows.push(`Projet,Nom,${csvEscape(project.name)}`);
      rows.push(`Projet,Client,${csvEscape(project.client_name ?? "")}`);
      rows.push(`Projet,Statut,${csvEscape(project.status)}`);
      rows.push(`Projet,Avancement,${project.progress_percent}%`);
      rows.push(`Projet,Budget,${project.budget ?? 0} FC`);
      rows.push(`Projet,Début,${project.start_date ?? ""}`);
      rows.push(`Projet,Fin,${project.end_date ?? ""}`);
      rows.push("");
      rows.push("Tâches,Titre,Statut,Priorité,Assigné,Échéance");
      for (const t of tasks ?? []) {
        rows.push(`Tâche,${csvEscape(t.title)},${t.status},${t.priority},${csvEscape((t.personnel as { full_name: string } | null)?.full_name ?? "")},${t.due_date ?? ""}`);
      }
      rows.push("");
      rows.push("Personnel,Nom,Rôle,Taux journalier,Statut");
      for (const p of personnel ?? []) {
        rows.push(`Personnel,${csvEscape(p.full_name)},${csvEscape(p.role ?? "")},${p.daily_rate ?? 0},${p.status}`);
      }
      rows.push("");
      rows.push("Jalons,Titre,Échéance,Complété");
      for (const m of milestones ?? []) {
        rows.push(`Jalon,${csvEscape(m.title)},${m.due_date},${m.completed_at ? "Oui" : "Non"}`);
      }

      const csv = rows.join("\n");
      return new Response(csv, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="projet-${projectId}.csv"`,
        },
      });
    }

    return jsonResponse({
      project,
      tasks: tasks ?? [],
      milestones: milestones ?? [],
      personnel: personnel ?? [],
      materials: materials ?? [],
      orders: orders ?? [],
      recent_reports: reports ?? [],
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
