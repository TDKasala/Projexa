import { cn } from "@/lib/utils";

const TONE_CLASS = {
  neutral: "bg-slate-100 text-slate-700",
  blue: "bg-blue-600/10 text-blue-600",
  orange: "bg-orange-500/10 text-orange-500",
  success: "bg-green-600/10 text-success",
  danger: "bg-red-600/10 text-danger",
};

export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: keyof typeof TONE_CLASS;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        TONE_CLASS[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
