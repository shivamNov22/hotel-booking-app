const VARIANTS = {
  primary:
    "bg-brand-orange hover:bg-brand-orangeDark text-white shadow-card",
  secondary:
    "bg-white hover:bg-slate-50 text-brand-navy border border-slate-300",
  confirm: "bg-brand-green hover:bg-emerald-700 text-white shadow-card",
  ghost: "bg-transparent hover:bg-slate-100 text-brand-navy",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
