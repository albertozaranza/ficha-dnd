import type { AttrKey } from "../../types";
import { ATTR_ABBR } from "../../lib/constants";

interface StatCardProps {
  attrKey: AttrKey;
  score: number;
  modifier: string;
  saveBonus: string;
  saveProficient: boolean;
  onScoreChange: (value: number) => void;
  onSavePipClick: () => void;
}

export function StatCard({ attrKey, score, modifier, saveBonus, saveProficient, onScoreChange, onSavePipClick }: StatCardProps) {
  return (
    <div className="stat-card" data-attr={attrKey}>
      <div className="stat-abbr">{ATTR_ABBR[attrKey]}</div>
      <input
        className="stat-score-input"
        type="number"
        min={1}
        max={30}
        value={score}
        onChange={(e) => onScoreChange(parseInt(e.target.value) || 10)}
      />
      <div className="stat-mod-circle">{modifier}</div>
      <div className="stat-save-row">
        <span className="stat-save-val">{saveBonus}</span>
        <span style={{ color: "var(--text-3)", fontSize: 10 }}>TR</span>
        <span
          className={`save-pip-dot${saveProficient ? " proficient" : ""}`}
          title="Proficiência em TR"
          onClick={(e) => { e.stopPropagation(); onSavePipClick(); }}
        />
      </div>
    </div>
  );
}
