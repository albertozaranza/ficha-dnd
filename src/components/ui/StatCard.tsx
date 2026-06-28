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
    <div
      className="bg-(--bg-surface) border border-(--border) rounded-2xl pt-3.5 px-2.5 pb-2.5 text-center transition-all duration-150 hover:border-(--border-hi) hover:shadow-(--shadow)"
      data-attr={attrKey}
    >
      <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-(--text-3) mb-1.5">{ATTR_ABBR[attrKey]}</div>
      <input
        className="font-cinzel text-[32px] font-bold text-(--text-1) bg-transparent border-none outline-none w-full text-center leading-none mb-1.5 block focus:text-(--accent)"
        type="number"
        min={1}
        max={30}
        value={score}
        onChange={(e) => onScoreChange(parseInt(e.target.value) || 10)}
      />
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-(--bg-elevated) border-2 border-(--border) font-cinzel text-sm font-bold text-(--text-1) mx-auto mb-1.5">
        {modifier}
      </div>
      <div className="flex items-center justify-center gap-1 text-[10px] text-(--text-3)">
        <span className="font-semibold text-(--text-2) text-[11px]">{saveBonus}</span>
        <span className="text-[10px]">TR</span>
        <span
          className={`w-1.75 h-1.75 rounded-full border-[1.5px] cursor-pointer transition-all duration-150 ${saveProficient ? "bg-(--accent) border-(--accent)" : "border-(--border-hi)"}`}
          title="Proficiência em TR"
          onClick={(e) => { e.stopPropagation(); onSavePipClick(); }}
        />
      </div>
    </div>
  );
}
