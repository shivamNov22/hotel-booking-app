export default function Checkbox({ label, className = "", ...props }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 ${className}`}>
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded border-slate-400 text-brand-blue focus:ring-brand-blue"
        {...props}
      />
      {label && <span className="text-sm text-slate-700">{label}</span>}
    </label>
  );
}
