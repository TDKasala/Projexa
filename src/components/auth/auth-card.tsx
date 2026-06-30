import Image from "next/image";
import Link from "next/link";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-xl">
        <Link href="/" className="mb-6 flex items-center justify-center gap-2">
          <Image src="/icon.svg" alt="Projexa" width={40} height={40} className="rounded-lg" />
          <span className="text-xl font-bold text-navy-950">PROJEXA</span>
        </Link>

        <h1 className="text-center text-xl font-bold text-navy-950">{title}</h1>
        <p className="mt-1 text-center text-sm text-muted">{subtitle}</p>

        <div className="mt-6">{children}</div>

        <div className="mt-6 text-center text-sm text-muted">{footer}</div>
      </div>
    </div>
  );
}
