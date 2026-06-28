import { XP_THRESHOLDS } from "../../lib/constants";

interface XpBarProps {
  level: number;
  xp: number;
}

export function XpBar({ level, xp }: XpBarProps) {
  const next = XP_THRESHOLDS[level] ?? XP_THRESHOLDS[XP_THRESHOLDS.length - 2];
  const prev = XP_THRESHOLDS[level - 1] ?? 0;
  const isMax = next === Infinity;
  const pct = isMax ? 100 : Math.min(100, ((xp - prev) / (next - prev)) * 100);

  return (
    <div className="xp-section px-4 py-2.5 border-b border-(--border) shrink-0">
      <div className="h-0.75 bg-(--bg-active) rounded-sm overflow-hidden mb-1">
        <div className="h-full bg-(--accent) rounded-sm transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-(--text-3)">
        <span>{xp.toLocaleString()} XP</span>
        <span>{isMax ? "nível máximo" : next.toLocaleString() + " próx."}</span>
      </div>
    </div>
  );
}
