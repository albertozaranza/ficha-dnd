import { useCampaignStore } from "../../store/campaignStore";
import { Calc } from "../../calculations";
import { ATTR_KEYS, ATTR_FULL } from "../../lib/constants";
import { StatCard } from "../ui/StatCard";
import type { AttrKey } from "../../types";

type MetaField = {
  label: string;
  placeholder: string;
  type?: string;
  style?: React.CSSProperties;
  getValue: (m: import("../../types").CharacterMeta) => string | number;
  setValue: (c: import("../../types").Character, v: string) => void;
};

const META_FIELDS: MetaField[] = [
  { label: "Classe",      placeholder: "Ladino",        getValue: (m) => m.class,      setValue: (c, v) => { c.meta.class = v; } },
  { label: "Subclasse",   placeholder: "Arcano",        getValue: (m) => m.subclass,   setValue: (c, v) => { c.meta.subclass = v; } },
  { label: "Nível",       placeholder: "1",  type: "number", style: { maxWidth: 64 }, getValue: (m) => m.level, setValue: (c, v) => { c.meta.level = parseInt(v) || 1; } },
  { label: "Antecedente", placeholder: "Criminoso",     getValue: (m) => m.background, setValue: (c, v) => { c.meta.background = v; } },
  { label: "Tendência",   placeholder: "Caótico Neutro", getValue: (m) => m.alignment, setValue: (c, v) => { c.meta.alignment = v; } },
  { label: "Experiência", placeholder: "0", type: "number", style: { maxWidth: 96 }, getValue: (m) => m.experience, setValue: (c, v) => { c.meta.experience = parseInt(v) || 0; } },
];

const PERSONALITY_FIELDS: { key: keyof import("../../types").Personality; label: string; placeholder: string }[] = [
  { key: "traits", label: "Traços de Personalidade", placeholder: "Traços..." },
  { key: "ideals", label: "Ideais",                  placeholder: "Ideais..." },
  { key: "bonds",  label: "Ligações",                placeholder: "Ligações..." },
  { key: "flaws",  label: "Defeitos",                placeholder: "Defeitos..." },
];

export function OverviewView() {
  const char = useCampaignStore((s) => s.campaign.character);
  const updateCharacter = useCampaignStore((s) => s.updateCharacter);

  const profBonus = Calc.proficiencyBonus(char.meta.level);
  const passivePerception = Calc.passivePerception(char);
  const initiative = Calc.formatBonus(Calc.initiative(char));
  const hpPct = char.combat.hp.max > 0 ? Math.min(100, (char.combat.hp.current / char.combat.hp.max) * 100) : 0;
  const hpColor = hpPct > 50 ? "var(--green)" : hpPct > 25 ? "var(--amber)" : "var(--red)";

  return (
    <section id="view-overview" className="view active">
      <div className="view-header">
        <h2 className="view-title">Visão Geral</h2>
        <div className="badge-row">
          <span className="badge accent">Prof {Calc.formatBonus(profBonus)}</span>
          <button
            className={`badge inspiration-badge${char.meta.inspiration ? " lit" : ""}`}
            title="Clique para alternar inspiração"
            onClick={() => updateCharacter((c) => { c.meta.inspiration = !c.meta.inspiration; })}
          >
            Inspiração
          </button>
          <span className="badge">
            Percepção Passiva: <strong>{passivePerception}</strong>
          </span>
        </div>
      </div>

      <div className="meta-strip">
        {META_FIELDS.map((f, i) => (
          <>
            {i > 0 && <div key={`div-${i}`} className="meta-divider" />}
            <div key={f.label} className="meta-item" style={f.style}>
              <input
                className="meta-input"
                type={f.type || "text"}
                placeholder={f.placeholder}
                value={f.getValue(char.meta) ?? ""}
                onChange={(e) => updateCharacter((c) => f.setValue(c, e.target.value))}
                style={f.type === "number" ? { textAlign: "center" } : undefined}
              />
              <span className="meta-label">{f.label}</span>
            </div>
          </>
        ))}
      </div>

      <div className="stats-grid">
        {ATTR_KEYS.map((key) => (
          <StatCard
            key={key}
            attrKey={key}
            score={char.attributes[key]}
            modifier={Calc.formatBonus(Calc.modifier(char.attributes[key]))}
            saveBonus={Calc.formatBonus(Calc.savingThrowBonus(char, key))}
            saveProficient={!!char.savingThrows[key]?.proficient}
            onScoreChange={(v) => updateCharacter((c) => { c.attributes[key as AttrKey] = v; })}
            onSavePipClick={() => updateCharacter((c) => { c.savingThrows[key as AttrKey].proficient = !c.savingThrows[key as AttrKey].proficient; })}
          />
        ))}
      </div>

      <div className="quick-stats-row">
        <div className="quick-card">
          <input
            className="quick-value"
            type="number"
            min={0}
            max={30}
            placeholder="14"
            value={char.combat.ac}
            onChange={(e) => updateCharacter((c) => { c.combat.ac = parseInt(e.target.value) || 10; })}
          />
          <div className="quick-label">Classe de Armadura</div>
        </div>
        <div className="quick-card hp-quick-card">
          <div className="hp-quick-nums">
            <span className="hp-quick-cur" style={{ color: hpColor }}>{char.combat.hp.current}</span>
            <span className="hp-quick-sep">/</span>
            <span className="hp-quick-max">{char.combat.hp.max}</span>
          </div>
          <div className="hp-bar-track">
            <div className="hp-bar-fill" style={{ width: `${hpPct}%`, background: hpColor }} />
          </div>
          <div className="quick-label">Pontos de Vida <span style={{ fontSize: 10, opacity: 0.6 }}>(editar em Combate)</span></div>
        </div>
        <div className="quick-card">
          <div className="quick-value-static">{initiative}</div>
          <div className="quick-label">Iniciativa</div>
        </div>
        <div className="quick-card">
          <input
            className="quick-value"
            placeholder="9m"
            value={char.combat.speed}
            onChange={(e) => updateCharacter((c) => { c.combat.speed = e.target.value; })}
          />
          <div className="quick-label">Deslocamento</div>
        </div>
        <div className="quick-card">
          <input
            className="quick-value"
            placeholder="1d8"
            value={char.combat.hitDice.total}
            onChange={(e) => updateCharacter((c) => { c.combat.hitDice.total = e.target.value; })}
          />
          <div className="quick-label">Dados de Vida</div>
        </div>
      </div>

      <div className="personality-grid">
        {PERSONALITY_FIELDS.map((f) => (
          <div key={f.key} className="personality-card">
            <div className="pcard-label">{f.label}</div>
            <textarea
              className="pcard-text"
              placeholder={f.placeholder}
              defaultValue={char.personality[f.key]}
              onChange={(e) => updateCharacter((c) => { c.personality[f.key] = e.target.value; })}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
