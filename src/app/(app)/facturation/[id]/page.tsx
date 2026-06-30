import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireProfileWithCompany } from "@/lib/dal";
import { InvoicePrint } from "@/components/facturation/invoice-print";
import { LinkButton } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/delete-button";
import { deleteInvoice } from "@/lib/actions/invoices";

export const metadata = { title: "Document commercial — Projexa" };

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireProfileWithCompany();
  const supabase = await createClient();

  const [{ data: invoice }, { data: items }, { data: company }] = await Promise.all([
    supabase.from("invoices").select("*").eq("id", id).eq("company_id", profile.company_id).single(),
    supabase.from("invoice_items").select("*").eq("invoice_id", id).order("id"),
    supabase.from("companies").select("*").eq("id", profile.company_id).single(),
  ]);

  if (!invoice || !company) {
    notFound();
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between print:hidden">
        <Link href="/facturation" className="text-sm text-muted hover:underline">
          ← Retour à la liste
        </Link>
        <div className="flex gap-2">
          <LinkButton href={`/facturation/${id}/modifier`} variant="outline">
            Modifier
          </LinkButton>
          <DeleteButton
            action={deleteInvoice.bind(null, id)}
            confirmMessage="Supprimer ce document ?"
            label="Supprimer"
          />
        </div>
      </div>

      <InvoicePrint invoice={invoice} items={items ?? []} company={company} />
    </div>
  );
}
