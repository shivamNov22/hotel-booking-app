export default function StatCard({ label, value, trendIcon: TrendIcon, pieIcon: PieIcon }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-trinity-900/60">{label}</p>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-3xl font-semibold text-trinity-900">{value}</p>
        {TrendIcon && <TrendIcon size={22} className="text-trinity-500" />}
        {PieIcon && <PieIcon size={28} className="text-trinity-500" />}
      </div>
    </div>
  );
}
