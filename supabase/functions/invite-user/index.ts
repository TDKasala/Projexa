import { createClient } from "npm:@supabase/supabase-js@2";
import {
  corsHeaders,
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

    // Vérifie l'identité du demandeur
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

    // Vérifie le drapeau superadmin
    const { data: profile } = await adminClient
      .from("profiles")
      .select("is_superadmin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_superadmin) return errorResponse("Accès refusé", 403);

    const { email, company_id, role = "member" } = await req.json();
    if (!email || !company_id) {
      return errorResponse("Paramètres manquants : email et company_id requis", 400);
    }

    // Envoie l'invitation via l'API Admin Auth
    const { data: invite, error: inviteError } =
      await adminClient.auth.admin.inviteUserByEmail(email, {
        data: { company_id, role },
      });

    if (inviteError) return errorResponse(inviteError.message, 400);

    // Journal d'audit
    await adminClient.from("admin_audit_logs").insert({
      actor_id: user.id,
      action: "invite_user",
      target_type: "user",
      target_id: email,
      metadata: { company_id, role },
    });

    return jsonResponse({ data: { id: invite.user.id, email: invite.user.email } });
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : "Erreur interne");
  }
});
