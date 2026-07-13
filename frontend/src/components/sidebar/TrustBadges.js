const ICON_BG = {
  bolt: "bg-emerald-100 text-emerald-600",
  shield: "bg-blue-100 text-blue-600",
  tag: "bg-amber-100 text-amber-600",
};

const ICON_GLYPH = {
  bolt: "⚡",
  shield: "🛡",
  tag: "🏷",
};

export default function TrustBadges({ badges }) {
  return (
    <div className="space-y-3">
      {badges.map((badge) => (
        <div
          key={badge.title}
          className="flex items-start gap-3 rounded-lg bg-white p-3 shadow-card"
        >
          <span
            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${ICON_BG[badge.icon]}`}
            aria-hidden="true"
          >
            {ICON_GLYPH[badge.icon]}
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {badge.title}
            </p>
            <p className="text-xs text-slate-500">{badge.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
