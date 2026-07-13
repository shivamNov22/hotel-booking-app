export default function Input({ label, className = "", ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-xs font-medium text-brand-blue">
          {label}
        </span>
      )}
      <input
        className={`w-full rounded-md border border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-blue focus:ring-1 focus:ring-brand-blue ${className}`}
        {...props}
      />
    </label>
  );
}
