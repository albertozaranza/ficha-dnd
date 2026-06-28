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
      {/* Header */}
      <div className="flex items-center justify-between mb-7 pb-4 border-b border-(--border) flex-wrap gap-3">
        <h2 className="font-cinzel text-[22px] font-bold text-(--text-1) tracking-[0.02em]">Visão Geral</h2>
        <div className="flex gap-2 items-center flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[20px] text-xs font-medium bg-(--accent-sub) text-(--accent) border border-(--accent) whitespace-nowrap">
            Prof {Calc.formatBonus(profBonus)}
          </span>
          <button
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-[20px] text-xs font-medium border cursor-pointer transition-all duration-150 whitespace-nowrap ${
              char.meta.inspiration
                ? "bg-(--amber-sub) text-(--amber) border-(--amber)"
                : "bg-(--bg-elevated) text-(--text-2) border-(--border)"
            }`}
            title="Clique para alternar inspiração"
            onClick={() => updateCharacter((c) => { c.meta.inspiration = !c.meta.inspiration; })}
          >
            Inspiração
          </button>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[20px] text-xs font-medium bg-(--bg-elevated) text-(--text-2) border border-(--border) whitespace-nowrap">
            Percepção Passiva: <strong>{passivePerception}</strong>
          </span>
        </div>
      </div>

      {/* Meta Strip */}
      <div className="flex bg-(--bg-surface) border border-(--border) rounded-xl mb-6 overflow-hidden">
        {META_FIELDS.map((f, i) => (
          <>
            {i > 0 && <div key={`div-${i}`} className="w-px bg-(--border) shrink-0" />}
            <div key={f.label} className="flex flex-col px-3.5 py-2.5 flex-1 min-w-0" style={f.style}>
              <input
                className="bg-transparent border-none outline-none text-(--text-1) text-[13px] font-medium p-0 w-full min-w-0 focus:text-(--accent)"
                type={f.type || "text"}
                placeholder={f.placeholder}
                value={f.getValue(char.meta) ?? ""}
                onChange={(e) => updateCharacter((c) => f.setValue(c, e.target.value))}
                style={f.type === "number" ? { textAlign: "center" } : undefined}
              />
              <span className="text-[9px] font-bold text-(--text-3) uppercase tracking-widest mt-0.75 whitespace-nowrap">{f.label}</span>
            </div>
          </>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-6 gap-2.5 mb-5 max-[1024px]:grid-cols-3">
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

      {/* Quick Stats */}
      <div className="grid gap-2.5 mb-5 max-[1024px]:grid-cols-3" style={{ gridTemplateColumns: "100px 1fr 100px 110px 110px" }}>
        <div className="bg-(--bg-surface) border border-(--border) rounded-2xl px-3 pt-4 pb-3 text-center">
          <input
            className="font-cinzel text-[28px] font-bold text-(--text-1) bg-transparent border-none outline-none w-full text-center block leading-none focus:text-(--accent)"
            type="number" min={0} max={30} placeholder="14"
            value={char.combat.ac}
            onChange={(e) => updateCharacter((c) => { c.combat.ac = parseInt(e.target.value) || 10; })}
          />
          <div className="text-[9px] font-bold uppercase tracking-widest text-(--text-3) mt-2">Classe de Armadura</div>
        </div>

        <div className="bg-(--bg-surface) border border-(--border) rounded-2xl px-4 pt-3.5 pb-3 text-center">
          <div className="flex items-baseline justify-center gap-0.5 mb-2">
            <span className="font-cinzel text-[30px] font-bold leading-none" style={{ color: hpColor }}>{char.combat.hp.current}</span>
            <span className="font-cinzel text-xl text-(--border-hi) mx-0.5">/</span>
            <span className="font-cinzel text-lg font-semibold text-(--text-2) leading-none">{char.combat.hp.max}</span>
          </div>
          <div className="h-1 bg-(--bg-active) rounded-sm overflow-hidden">
            <div className="h-full rounded-sm transition-[width,background] duration-400" style={{ width: `${hpPct}%`, background: hpColor }} />
          </div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-(--text-3) mt-2">
            Pontos de Vida <span className="text-[10px] opacity-60">(editar em Combate)</span>
          </div>
        </div>

        <div className="bg-(--bg-surface) border border-(--border) rounded-2xl px-3 pt-4 pb-3 text-center">
          <div className="font-cinzel text-[28px] font-bold text-(--text-1) leading-none">{initiative}</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-(--text-3) mt-2">Iniciativa</div>
        </div>

        <div className="bg-(--bg-surface) border border-(--border) rounded-2xl px-3 pt-4 pb-3 text-center">
          <input
            className="font-cinzel text-[28px] font-bold text-(--text-1) bg-transparent border-none outline-none w-full text-center block leading-none focus:text-(--accent)"
            placeholder="9m"
            value={char.combat.speed}
            onChange={(e) => updateCharacter((c) => { c.combat.speed = e.target.value; })}
          />
          <div className="text-[9px] font-bold uppercase tracking-widest text-(--text-3) mt-2">Deslocamento</div>
        </div>

        <div className="bg-(--bg-surface) border border-(--border) rounded-2xl px-3 pt-4 pb-3 text-center">
          <input
            className="font-cinzel text-[28px] font-bold text-(--text-1) bg-transparent border-none outline-none w-full text-center block leading-none focus:text-(--accent)"
            placeholder="1d8"
            value={char.combat.hitDice.total}
            onChange={(e) => updateCharacter((c) => { c.combat.hitDice.total = e.target.value; })}
          />
          <div className="text-[9px] font-bold uppercase tracking-widest text-(--text-3) mt-2">Dados de Vida</div>
        </div>
      </div>

      {/* Personality */}
      <div className="grid grid-cols-4 gap-2.5 max-[1024px]:grid-cols-2">
        {PERSONALITY_FIELDS.map((f) => (
          <div key={f.key} className="bg-(--bg-surface) border border-(--border) rounded-xl p-3 transition-all duration-150 focus-within:border-(--border-hi)">
            <div className="text-[9px] font-bold uppercase tracking-widest text-(--text-3) mb-2">{f.label}</div>
            <textarea
              className="w-full bg-transparent border-none outline-none text-(--text-1) text-xs resize-none min-h-20 leading-relaxed"
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
