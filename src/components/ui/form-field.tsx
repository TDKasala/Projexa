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

/** Self-contained input field — shorthand for simple text/number/date inputs. */
export function InputField({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  required,
  as,
  rows = 3,
  step,
  min,
  max,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string | number;
  required?: boolean;
  as?: "input" | "textarea";
  rows?: number;
  step?: string;
  min?: string | number;
  max?: string | number;
}) {
  return (
    <div>
      <label htmlFor={name} className={LABEL_CLASS}>
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          className={FIELD_CLASS}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
          step={step}
          min={min}
          max={max}
          className={FIELD_CLASS}
        />
      )}
    </div>
  );
}
