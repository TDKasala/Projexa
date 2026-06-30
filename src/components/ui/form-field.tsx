export const FIELD_CLASS =
  "mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-blue-600";
export const LABEL_CLASS = "block text-sm font-medium text-navy-950";

export function FormField({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={LABEL_CLASS}>
        {label}
        {required && " *"}
      </label>
      {children}
    </div>
  );
}
