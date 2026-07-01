import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders, handleOptions, jsonResponse, errorResponse } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return handleOptions();

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return errorResponse("Non autorisé", 401);

    const url = new URL(req.url);
    const from = url.searchParams.get("from") ?? firstDayOfMonth();
    const to = url.searchParams.get("to") ?? today();
    const personnelId = url.searchParams.get("personnel_id");

    const client = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await client.auth.getUser();
    if (!user) return errorResponse("Non autorisé", 401);

    let query = client
      .from("time_entries")
      .select("*, personnel(full_name, role, daily_rate), projects(name)")
      .gte("entry_date", from)
      .lte("entry_date", to)
      .order("entry_date", { ascending: false });

    if (personnelId) query = query.eq("personnel_id", personnelId);

    const { data: entries } = await query;

    // Aggregate by personnel
    const byPersonnel = new Map<string, {
      id: string;
      name: string;
      role: string | null;
      daily_rate: number | null;
      total_hours: number;
      entries: typeof entries;
    }>();

    for (const e of entries ?? []) {
      const p = e.personnel as { full_name: string; role: string | null; daily_rate: number | null } | null;
      if (!p) continue;
      const key = e.personnel_id;
      if (!byPersonnel.has(key)) {
        byPersonnel.set(key, {
          id: key,
          name: p.full_name,
          role: p.role,
          daily_rate: p.daily_rate,
          total_hours: 0,
          entries: [],
        });
      }
      const rec = byPersonnel.get(key)!;
      rec.total_hours += Number(e.hours);
      rec.entries!.push(e);
    }

    const personnel = Array.from(byPersonnel.values()).map((p) => ({
      ...p,
      total_cost: p.daily_rate ? Math.round((p.total_hours / 8) * p.daily_rate * 100) / 100 : null,
    }));

    const total_hours = personnel.reduce((s, p) => s + p.total_hours, 0);
    const total_cost = personnel.reduce((s, p) => s + (p.total_cost ?? 0), 0);

    const format = url.searchParams.get("format") ?? "json";

    if (format === "csv") {
      const rows = ["Date,Membre,Rôle,Projet,Heures,Description"];
      for (const e of entries ?? []) {
        const p = e.personnel as { full_name: string; role: string | null } | null;
        const proj = e.projects as { name: string } | null;
        rows.push([
          e.entry_date,
          csvEscape(p?.full_name ?? ""),
          csvEscape(p?.role ?? ""),
          csvEscape(proj?.name ?? ""),
          e.hours,
          csvEscape(e.description ?? ""),
        ].join(","));
      }
      return new Response(rows.join("\n"), {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="pointage-${from}-${to}.csv"`,
        },
      });
    }

    return jsonResponse({
      period: { from, to },
      total_hours,
      total_cost,
      personnel,
      generated_at: new Date().toISOString(),
    });
  } catch (err) {
    return errorResponse(String(err));
  }
});

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function firstDayOfMonth(): string {
  const d = new Date();
  d.setDate(1);
  return d.toISOString().slice(0, 10);
}

function csvEscape(val: string): string {
  if (val.includes(",") || val.includes('"') || val.includes("\n")) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}
