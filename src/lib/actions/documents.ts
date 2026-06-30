"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";

export type DocumentUploadState = { error: string | null };

export async function uploadDocument(
  _prevState: DocumentUploadState,
  formData: FormData
): Promise<DocumentUploadState> {
  const profile = await requireProfileWithCompany();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Veuillez sélectionner un fichier." };
  }

  const maxSize = 20 * 1024 * 1024; // 20 MB
  if (file.size > maxSize) {
    return { error: "Le fichier dépasse la taille maximale de 20 Mo." };
  }

  const projectId = String(formData.get("project_id") ?? "").trim() || null;
  const customName = String(formData.get("name") ?? "").trim() || file.name;

  const supabase = await createClient();

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${profile.company_id}/${Date.now()}_${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(filePath, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return { error: "Échec du téléversement du fichier. Réessayez." };
  }

  const { error: dbError } = await supabase.from("documents").insert({
    company_id: profile.company_id,
    project_id: projectId,
    name: customName,
    file_path: filePath,
    file_size: file.size,
    mime_type: file.type || null,
    uploaded_by: profile.id,
  });

  if (dbError) {
    await supabase.storage.from("documents").remove([filePath]);
    return { error: "Impossible d'enregistrer le document. Réessayez." };
  }

  revalidatePath("/documents");
  return { error: null };
}

export async function deleteDocument(id: string, filePath: string): Promise<void> {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  await supabase.from("documents").delete().eq("id", id).eq("company_id", profile.company_id);
  await supabase.storage.from("documents").remove([filePath]);
  revalidatePath("/documents");
}
