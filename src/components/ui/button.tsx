import Link from "next/link";
import { cn } from "@/lib/utils";

const VARIANT_CLASS = {
  primary: "bg-blue-600 text-white hover:bg-blue-500",
  outline: "border border-border text-navy-950 hover:bg-slate-100",
  danger: "border border-danger/30 text-danger hover:bg-red-50",
  ghost: "text-navy-950 hover:bg-slate-100",
};

type Variant = keyof typeof VARIANT_CLASS;

const BASE_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 disabled:pointer-events-none";

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button className={cn(BASE_CLASS, VARIANT_CLASS[variant], className)} {...props} />
  );
}

export function LinkButton({
  href,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={cn(BASE_CLASS, VARIANT_CLASS[variant], className)}>
      {children}
    </Link>
  );
}
