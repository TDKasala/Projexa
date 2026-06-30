"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import type { InvoiceType, InvoiceStatus } from "@/lib/types";

export type InvoiceFormState = { error: string | null };

function num(value: FormDataEntryValue | null): number {
  const n = Number(String(value ?? "").trim());
  return Number.isFinite(n) ? n : 0;
}

function opt(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s || null;
}

export type LineItem = { description: string; quantity: number; unit: string | null; unit_price: number; total: number };

function parseLineItems(formData: FormData): LineItem[] {
  const descriptions = formData.getAll("item_description");
  const quantities = formData.getAll("item_quantity");
  const units = formData.getAll("item_unit");
  const unitPrices = formData.getAll("item_unit_price");
  const items: LineItem[] = [];
  for (let i = 0; i < descriptions.length; i++) {
    const description = String(descriptions[i] ?? "").trim();
    if (!description) continue;
    const quantity = Number(String(quantities[i] ?? "1").trim()) || 1;
    const unit_price = Number(String(unitPrices[i] ?? "0").trim()) || 0;
    items.push({
      description,
      quantity,
      unit: String(units[i] ?? "").trim() || null,
      unit_price,
      total: quantity * unit_price,
    });
  }
  return items;
}

export async function createInvoice(
  _prevState: InvoiceFormState,
  formData: FormData
): Promise<InvoiceFormState> {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();

  const taxRate = num(formData.get("tax_rate"));
  const items = parseLineItems(formData);
  if (items.length === 0) {
    return { error: "Ajoutez au moins une ligne à la facture." };
  }

  const subtotal = items.reduce((s, item) => s + item.total, 0);
  const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100;
  const total = subtotal + taxAmount;

  const { data: invoice, error: invErr } = await supabase
    .from("invoices")
    .insert({
      company_id: profile.company_id,
      project_id: opt(formData.get("project_id")),
      invoice_number: opt(formData.get("invoice_number")),
      type: (String(formData.get("type") ?? "facture") as InvoiceType),
      status: (String(formData.get("status") ?? "brouillon") as InvoiceStatus),
      client_name: opt(formData.get("client_name")),
      client_address: opt(formData.get("client_address")),
      client_phone: opt(formData.get("client_phone")),
      client_email: opt(formData.get("client_email")),
      client_rccm: opt(formData.get("client_rccm")),
      issue_date: String(formData.get("issue_date") ?? new Date().toISOString().slice(0, 10)),
      due_date: opt(formData.get("due_date")),
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total,
      notes: opt(formData.get("notes")),
      created_by: profile.id,
    })
    .select("id")
    .single();

  if (invErr || !invoice) {
    return { error: "Impossible de créer la facture. Réessayez." };
  }

  await supabase.from("invoice_items").insert(
    items.map((item) => ({ ...item, invoice_id: invoice.id }))
  );

  revalidatePath("/facturation");
  redirect(`/facturation/${invoice.id}`);
}

export async function updateInvoice(
  id: string,
  _prevState: InvoiceFormState,
  formData: FormData
): Promise<InvoiceFormState> {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();

  const taxRate = num(formData.get("tax_rate"));
  const items = parseLineItems(formData);
  if (items.length === 0) {
    return { error: "Ajoutez au moins une ligne à la facture." };
  }

  const subtotal = items.reduce((s, item) => s + item.total, 0);
  const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100;
  const total = subtotal + taxAmount;

  const { error: invErr } = await supabase
    .from("invoices")
    .update({
      project_id: opt(formData.get("project_id")),
      invoice_number: opt(formData.get("invoice_number")),
      type: (String(formData.get("type") ?? "facture") as InvoiceType),
      status: (String(formData.get("status") ?? "brouillon") as InvoiceStatus),
      client_name: opt(formData.get("client_name")),
      client_address: opt(formData.get("client_address")),
      client_phone: opt(formData.get("client_phone")),
      client_email: opt(formData.get("client_email")),
      client_rccm: opt(formData.get("client_rccm")),
      issue_date: String(formData.get("issue_date") ?? new Date().toISOString().slice(0, 10)),
      due_date: opt(formData.get("due_date")),
      subtotal,
      tax_rate: taxRate,
      tax_amount: taxAmount,
      total,
      notes: opt(formData.get("notes")),
    })
    .eq("id", id)
    .eq("company_id", profile.company_id);

  if (invErr) {
    return { error: "Impossible de mettre à jour la facture. Réessayez." };
  }

  await supabase.from("invoice_items").delete().eq("invoice_id", id);
  await supabase.from("invoice_items").insert(
    items.map((item) => ({ ...item, invoice_id: id }))
  );

  revalidatePath("/facturation");
  revalidatePath(`/facturation/${id}`);
  redirect(`/facturation/${id}`);
}

export async function deleteInvoice(id: string): Promise<void> {
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();
  await supabase.from("invoices").delete().eq("id", id).eq("company_id", profile.company_id);
  revalidatePath("/facturation");
}
