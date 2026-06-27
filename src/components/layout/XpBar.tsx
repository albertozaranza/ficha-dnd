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
    <div className="xp-section">
      <div className="xp-bar">
        <div className="xp-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="xp-text">
        <span>{xp.toLocaleString()} XP</span>
        <span>{isMax ? "nível máximo" : next.toLocaleString() + " próx."}</span>
      </div>
    </div>
  );
}
