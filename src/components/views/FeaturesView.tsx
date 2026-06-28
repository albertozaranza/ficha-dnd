import { useState } from "react";
import { useCampaignStore } from "../../store/campaignStore";
import type { Feature } from "../../types";

function FeatureCard({ feat, index }: { feat: Feature; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const updateCharacter = useCampaignStore((s) => s.updateCharacter);

  const srcLower = (feat.source || "").toLowerCase();
  const badgeVariant = srcLower.includes("racial") || srcLower.includes("raça")
    ? "bg-(--green-sub) text-(--green)"
    : srcLower.includes("ladino") || srcLower.includes("classe")
    ? "bg-(--blue-sub) text-(--blue)"
    : "bg-(--bg-active) text-(--text-3)";

  return (
    <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden transition-all duration-150 hover:border-(--border-hi)">
      <div
        className="flex items-center gap-2.5 px-3.5 py-3 cursor-pointer select-none"
        onClick={(e) => {
          if ((e.target as HTMLElement).tagName === "INPUT") return;
          setExpanded((v) => !v);
        }}
      >
        <span className={`text-[9px] font-bold uppercase tracking-[0.08em] px-1.75 py-0.5 rounded-[10px] whitespace-nowrap shrink-0 ${badgeVariant}`}>
          {feat.source || "Habilidade"}
        </span>
        <input
          className="flex-1 bg-transparent border-none outline-none text-sm font-semibold text-(--text-1) focus:text-(--accent)"
          value={feat.name}
          placeholder="Nome da habilidade"
          onChange={(e) => updateCharacter((c) => { c.features[index].name = e.target.value; })}
        />
        <span className={`text-sm text-(--text-3) transition-transform duration-150 shrink-0 ${expanded ? "rotate-90" : ""}`}>▶</span>
      </div>
      {expanded && (
        <div className="px-3.5 pb-3.5 border-t border-(--border)">
          <textarea
            className="w-full bg-transparent border-none outline-none text-(--text-2) text-[13px] leading-[1.7] resize-none min-h-14 mt-2.5 focus:outline-none"
            placeholder="Descrição..."
            defaultValue={feat.description}
            onChange={(e) => updateCharacter((c) => { c.features[index].description = e.target.value; })}
          />
        </div>
      )}
    </div>
  );
}

export function FeaturesView() {
  const features = useCampaignStore((s) => s.campaign.character.features);
  const updateCharacter = useCampaignStore((s) => s.updateCharacter);

  function addFeature() {
    updateCharacter((c) => {
      c.features.push({ name: "Nova Habilidade", source: "Habilidade", description: "" });
    });
  }

  return (
    <section id="view-features" className="view">
      <div className="flex items-center justify-between mb-7 pb-4 border-b border-(--border) flex-wrap gap-3">
        <h2 className="font-cinzel text-[22px] font-bold text-(--text-1) tracking-[0.02em]">Habilidades &amp; Características</h2>
        <button
          className="inline-flex items-center gap-1 px-3 py-1.25 rounded-lg border border-dashed border-(--border-hi) bg-transparent text-(--text-2) text-xs font-medium cursor-pointer transition-all duration-150 hover:bg-(--bg-hover) hover:text-(--text-1) hover:border-(--accent) hover:border-solid"
          onClick={addFeature}>
          + Adicionar
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {features.map((feat, i) => (
          <FeatureCard key={i} feat={feat} index={i} />
        ))}
      </div>
    </section>
  );
}
