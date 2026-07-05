"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export function SearchBar({ placeholder = "Rechercher…" }: { placeholder?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = (new FormData(e.currentTarget).get("q") as string | null) ?? "";
    const params = new URLSearchParams(searchParams.toString());
    if (q.trim()) {
      params.set("q", q.trim());
    } else {
      params.delete("q");
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xs">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
        size={15}
      />
      <input
        name="q"
        type="search"
        defaultValue={searchParams.get("q") ?? ""}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-600"
      />
    </form>
  );
}
