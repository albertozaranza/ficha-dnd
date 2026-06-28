import { useState } from "react";
import { useCampaignStore } from "../../store/campaignStore";
import type { Feature } from "../../types";

function FeatureCard({ feat, index }: { feat: Feature; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const updateCharacter = useCampaignStore((s) => s.updateCharacter);

  const srcLower = (feat.source || "").toLowerCase();
  const badgeClass = srcLower.includes("racial") || srcLower.includes("raça")
    ? "racial"
    : srcLower.includes("ladino") || srcLower.includes("classe")
    ? "class-src"
    : "";

  return (
    <div className={`feature-card${expanded ? " expanded" : ""}`}>
      <div
        className="feature-hdr"
        onClick={(e) => {
          if ((e.target as HTMLElement).tagName === "INPUT") return;
          setExpanded((v) => !v);
        }}
      >
        <span className={`feature-src-badge ${badgeClass}`}>{feat.source || "Habilidade"}</span>
        <input
          className="feature-name-input"
          value={feat.name}
          placeholder="Nome da habilidade"
          onChange={(e) => updateCharacter((c) => { c.features[index].name = e.target.value; })}
        />
        <span className="feature-chevron">▶</span>
      </div>
      <div className="feature-body">
        <textarea
          className="feature-desc-input"
          placeholder="Descrição..."
          defaultValue={feat.description}
          onChange={(e) => updateCharacter((c) => { c.features[index].description = e.target.value; })}
        />
      </div>
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
      <div className="view-header">
        <h2 className="view-title">Habilidades &amp; Características</h2>
        <button className="add-btn" onClick={addFeature}>+ Adicionar</button>
      </div>
      <div className="features-list">
        {features.map((feat, i) => (
          <FeatureCard key={i} feat={feat} index={i} />
        ))}
      </div>
    </section>
  );
}
