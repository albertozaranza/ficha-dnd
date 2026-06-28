import { useState } from "react";
import { useCampaignStore } from "../../store/campaignStore";
import { Calc } from "../../calculations";
import { CONDITIONS } from "../../lib/constants";
import type { Attack } from "../../types";

const inputBase = "bg-transparent border-none outline-none text-(--text-1) text-[13px] w-full focus:text-(--accent)";
const sectionLabel = "text-[9px] font-bold uppercase tracking-widest text-(--text-3)";

function DeathSaves() {
  const char = useCampaignStore((s) => s.campaign.character);
  const updateCharacter = useCampaignStore((s) => s.updateCharacter);
  const { successes, failures } = char.combat.deathSaves;

  function toggle(type: "successes" | "failures", index: number) {
    updateCharacter((c) => {
      const cur = c.combat.deathSaves[type];
      c.combat.deathSaves[type] = cur === index + 1 ? index : index + 1;
    });
  }

  return (
    <div className="bg-(--bg-surface) border border-(--border) rounded-2xl px-4 py-3.5 flex items-center gap-5 mb-5 flex-wrap">
      <span className="text-[10px] font-bold uppercase tracking-widest text-(--text-3) whitespace-nowrap">Testes contra a Morte</span>
      <div className="flex items-center gap-2.5">
        <span className="text-xs font-medium text-(--green) min-w-17">Sucessos</span>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`w-5 h-5 rounded-full border-2 cursor-pointer transition-all duration-150 ${i < successes ? "bg-(--green) border-(--green)" : "border-(--border-hi)"}`}
              onClick={() => toggle("successes", i)}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-xs font-medium text-(--red) min-w-17">Fracassos</span>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`w-5 h-5 rounded-full border-2 cursor-pointer transition-all duration-150 ${i < failures ? "bg-(--red) border-(--red)" : "border-(--border-hi)"}`}
              onClick={() => toggle("failures", i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AttackRow({ atk, index }: { atk: Attack; index: number }) {
  const updateCharacter = useCampaignStore((s) => s.updateCharacter);
  return (
    <div className="grid gap-2 items-center bg-(--bg-surface) border border-(--border) rounded-xl px-3.5 py-2.5 transition-all duration-150 hover:border-(--border-hi)"
      style={{ gridTemplateColumns: "1fr 80px 120px 1fr 28px" }}>
      <input className={inputBase} value={atk.name} placeholder="Nome do ataque"
        onChange={(e) => updateCharacter((c) => { c.attacks[index].name = e.target.value; })} />
      <input className={`${inputBase} text-center font-cinzel font-bold text-[15px]`} value={atk.bonus} placeholder="+0"
        onChange={(e) => updateCharacter((c) => { c.attacks[index].bonus = e.target.value; })} />
      <input className={inputBase} value={atk.damage} placeholder="1d6+3"
        onChange={(e) => updateCharacter((c) => { c.attacks[index].damage = e.target.value; })} />
      <input className={inputBase} value={atk.type} placeholder="Tipo de dano"
        onChange={(e) => updateCharacter((c) => { c.attacks[index].type = e.target.value; })} />
      <button
        className="w-6 h-6 rounded-md border-none bg-transparent text-(--text-3) cursor-pointer text-base flex items-center justify-center transition-all duration-150 leading-none hover:bg-(--red-sub) hover:text-(--red)"
        title="Remover"
        onClick={() => updateCharacter((c) => { c.attacks.splice(index, 1); })}>×</button>
    </div>
  );
}

const tempInput = "w-14 bg-(--bg-elevated) border border-(--border) rounded-lg px-2 py-1 text-(--text-1) text-center outline-none transition-all duration-150 focus:border-(--accent)";

export function CombatView() {
  const char = useCampaignStore((s) => s.campaign.character);
  const updateCharacter = useCampaignStore((s) => s.updateCharacter);

  const [healInput, setHealInput] = useState("");
  const [dmgInput, setDmgInput] = useState("");
  const [showHeal, setShowHeal] = useState(false);
  const [showDmg, setShowDmg] = useState(false);

  const { hp, ac, speed, hitDice } = char.combat;
  const hpPct = hp.max > 0 ? Math.min(100, (hp.current / hp.max) * 100) : 0;
  const hpColor = hpPct > 50 ? "var(--green)" : hpPct > 25 ? "var(--amber)" : "var(--red)";
  const initiative = Calc.formatBonus(Calc.initiative(char));
  const activeConditions = char.combat.conditions || [];

  function applyHeal() {
    const amt = parseInt(healInput) || 0;
    updateCharacter((c) => { c.combat.hp.current = Math.min(c.combat.hp.max, c.combat.hp.current + amt); });
    setHealInput(""); setShowHeal(false);
  }

  function applyDmg() {
    const amt = parseInt(dmgInput) || 0;
    updateCharacter((c) => { c.combat.hp.current = Math.max(0, c.combat.hp.current - amt); });
    setDmgInput(""); setShowDmg(false);
  }

  function toggleCondition(cond: string) {
    updateCharacter((c) => {
      if (!c.combat.conditions) c.combat.conditions = [];
      const idx = c.combat.conditions.indexOf(cond);
      if (idx === -1) c.combat.conditions.push(cond);
      else c.combat.conditions.splice(idx, 1);
    });
  }

  const actionBtn = "px-7 py-2 rounded-xl border border-(--border) bg-(--bg-elevated) text-(--text-1) font-semibold cursor-pointer transition-all duration-150 hover:bg-(--bg-hover)";

  return (
    <section id="view-combat" className="view">
      <div className="flex items-center justify-between mb-7 pb-4 border-b border-(--border) flex-wrap gap-3">
        <h2 className="font-cinzel text-[22px] font-bold text-(--text-1) tracking-[0.02em]">Combate</h2>
      </div>

      {/* HP Hero */}
      <div className="bg-(--bg-surface) border border-(--border) rounded-[20px] p-6 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-(--text-3)">Pontos de Vida</span>
          <div className="flex items-center gap-2 text-xs text-(--text-3)">
            <span>Temporários</span>
            <input type="number" min={0} className={tempInput} placeholder="0"
              value={hp.temp || ""}
              onChange={(e) => updateCharacter((c) => { c.combat.hp.temp = parseInt(e.target.value) || 0; })} />
          </div>
        </div>
        <div className="flex items-baseline justify-center gap-1.5 mb-4">
          <input
            className="font-cinzel text-[72px] font-bold bg-transparent border-none outline-none text-center leading-none w-35"
            type="number" min={0} placeholder="0"
            value={hp.current} style={{ color: hpColor }}
            onChange={(e) => updateCharacter((c) => { c.combat.hp.current = parseInt(e.target.value) || 0; })} />
          <span className="font-cinzel text-[40px] text-(--border-hi) font-light leading-none">/</span>
          <input
            className="font-cinzel text-[40px] font-bold bg-transparent border-none outline-none text-center leading-none text-(--text-2) w-22.5"
            type="number" min={0} placeholder="0"
            value={hp.max}
            onChange={(e) => updateCharacter((c) => { c.combat.hp.max = parseInt(e.target.value) || 0; })} />
        </div>
        <div className="h-2 bg-(--bg-active) rounded-sm overflow-hidden mb-4">
          <div className="h-full rounded-sm transition-[width,background] duration-400" style={{ width: `${hpPct}%`, background: hpColor }} />
        </div>
        <div className="flex gap-2 justify-center">
          {showHeal ? (
            <div className="flex gap-1.5">
              <input autoFocus type="number" min={0} className={tempInput} placeholder="PV"
                value={healInput} onChange={(e) => setHealInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") applyHeal(); if (e.key === "Escape") setShowHeal(false); }} />
              <button className={`${actionBtn} text-(--green) border-(--green) hover:bg-(--green-sub)!`} onClick={applyHeal}>OK</button>
              <button className={actionBtn} onClick={() => setShowHeal(false)}>✕</button>
            </div>
          ) : (
            <button className={`${actionBtn} text-(--green) border-(--green) hover:bg-(--green-sub)!`} onClick={() => setShowHeal(true)}>+ Curar</button>
          )}
          {showDmg ? (
            <div className="flex gap-1.5">
              <input autoFocus type="number" min={0} className={tempInput} placeholder="Dano"
                value={dmgInput} onChange={(e) => setDmgInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") applyDmg(); if (e.key === "Escape") setShowDmg(false); }} />
              <button className={`${actionBtn} text-(--red) border-(--red) hover:bg-(--red-sub)!`} onClick={applyDmg}>OK</button>
              <button className={actionBtn} onClick={() => setShowDmg(false)}>✕</button>
            </div>
          ) : (
            <button className={`${actionBtn} text-(--red) border-(--red) hover:bg-(--red-sub)!`} onClick={() => setShowDmg(true)}>− Dano</button>
          )}
        </div>
      </div>

      {/* Combat Stats */}
      <div className="grid grid-cols-4 gap-2.5 mb-3.5 max-[768px]:grid-cols-2">
        {[
          { value: ac, label: "CA", type: "number", onChange: (v: string) => updateCharacter((c) => { c.combat.ac = parseInt(v) || 10; }), placeholder: "14" },
          { value: initiative, label: "Iniciativa", static: true },
          { value: speed, label: "Deslocamento", onChange: (v: string) => updateCharacter((c) => { c.combat.speed = v; }), placeholder: "9m" },
          { value: hitDice.total, label: "Dados de Vida", onChange: (v: string) => updateCharacter((c) => { c.combat.hitDice.total = v; }), placeholder: "1d8" },
        ].map(({ value, label, type, onChange, placeholder, static: isStatic }) => (
          <div key={label} className="bg-(--bg-surface) border border-(--border) rounded-2xl px-3 pt-4 pb-3 text-center">
            {isStatic ? (
              <div className="font-cinzel text-[32px] font-bold text-(--text-1) leading-none mb-2">{value}</div>
            ) : (
              <input
                className="font-cinzel text-[32px] font-bold text-(--text-1) bg-transparent border-none outline-none w-full text-center block leading-none mb-2 focus:text-(--accent)"
                type={type || "text"} placeholder={placeholder}
                value={value}
                onChange={(e) => onChange?.(e.target.value)} />
            )}
            <div className={sectionLabel}>{label}</div>
          </div>
        ))}
      </div>

      <DeathSaves />

      {/* Conditions */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-[13px] font-semibold text-(--text-1)">Condições</h3>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CONDITIONS.map((cond) => (
            <button
              key={cond}
              className={`px-2.5 py-1 rounded-[20px] border text-[11px] font-medium cursor-pointer transition-all duration-150 tracking-[0.02em] ${
                activeConditions.includes(cond)
                  ? "bg-(--red-sub) border-(--red) text-(--red)"
                  : "border-(--border) bg-(--bg-elevated) text-(--text-2) hover:border-(--border-hi) hover:text-(--text-1)"
              }`}
              onClick={() => toggleCondition(cond)}>
              {cond}
            </button>
          ))}
        </div>
      </div>

      {/* Attacks */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-[13px] font-semibold text-(--text-1)">Ataques</h3>
          <button
            className="inline-flex items-center gap-1 px-3 py-1.25 rounded-lg border border-dashed border-(--border-hi) bg-transparent text-(--text-2) text-xs font-medium cursor-pointer transition-all duration-150 hover:bg-(--bg-hover) hover:text-(--text-1) hover:border-(--accent) hover:border-solid"
            onClick={() => updateCharacter((c) => { c.attacks.push({ name: "", bonus: "", damage: "", type: "" }); })}>
            + Adicionar
          </button>
        </div>
        <div className="grid gap-2 px-3.5 pb-1.5 text-[9px] font-bold uppercase tracking-widest text-(--text-3)"
          style={{ gridTemplateColumns: "1fr 80px 120px 1fr 28px" }}>
          <span>Nome</span><span>Bônus</span><span>Dano</span><span>Tipo</span><span />
        </div>
        <div className="flex flex-col gap-1.5 mb-3">
          {char.attacks.map((atk, i) => <AttackRow key={i} atk={atk} index={i} />)}
        </div>
        <textarea
          className="w-full bg-(--bg-surface) border border-(--border) rounded-xl px-3.5 py-3 text-(--text-1) text-[13px] resize-y outline-none min-h-20 leading-[1.7] transition-all duration-150 focus:border-(--accent)"
          placeholder="Notas sobre ataques e magias..."
          defaultValue={char.attacksNotes}
          onChange={(e) => updateCharacter((c) => { c.attacksNotes = e.target.value; })} />
      </div>
    </section>
  );
}
