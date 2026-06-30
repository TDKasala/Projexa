import type { Database, UserRole } from "@/lib/supabase/types";

export type { UserRole };
export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
