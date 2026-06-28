import { useState } from "react";
import { useCampaignStore } from "../../store/campaignStore";
import { Calc } from "../../calculations";
import { CONDITIONS } from "../../lib/constants";
import type { Attack } from "../../types";

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
    <div className="death-saves-card">
      <span className="ds-title">Testes contra a Morte</span>
      <div className="ds-group">
        <span className="ds-label success-text">Sucessos</span>
        <div className="ds-pips">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`ds-pip success${i < successes ? " filled" : ""}`} onClick={() => toggle("successes", i)} />
          ))}
        </div>
      </div>
      <div className="ds-group">
        <span className="ds-label fail-text">Fracassos</span>
        <div className="ds-pips">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`ds-pip fail${i < failures ? " filled" : ""}`} onClick={() => toggle("failures", i)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AttackRow({ atk, index }: { atk: Attack; index: number }) {
  const updateCharacter = useCampaignStore((s) => s.updateCharacter);
  return (
    <div className="attack-card">
      <input className="attack-input" value={atk.name} placeholder="Nome do ataque"
        onChange={(e) => updateCharacter((c) => { c.attacks[index].name = e.target.value; })} />
      <input className="attack-input bonus" value={atk.bonus} placeholder="+0"
        onChange={(e) => updateCharacter((c) => { c.attacks[index].bonus = e.target.value; })} />
      <input className="attack-input" value={atk.damage} placeholder="1d6+3"
        onChange={(e) => updateCharacter((c) => { c.attacks[index].damage = e.target.value; })} />
      <input className="attack-input" value={atk.type} placeholder="Tipo de dano"
        onChange={(e) => updateCharacter((c) => { c.attacks[index].type = e.target.value; })} />
      <button className="attack-remove-btn" title="Remover"
        onClick={() => updateCharacter((c) => { c.attacks.splice(index, 1); })}>×</button>
    </div>
  );
}

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

  return (
    <section id="view-combat" className="view">
      <div className="view-header">
        <h2 className="view-title">Combate</h2>
      </div>

      <div className="hp-hero">
        <div className="hp-hero-top">
          <span className="hp-hero-label">Pontos de Vida</span>
          <div className="hp-temp-inline">
            <span>Temporários</span>
            <input type="number" min={0} className="hp-temp-input" placeholder="0"
              value={hp.temp || ""}
              onChange={(e) => updateCharacter((c) => { c.combat.hp.temp = parseInt(e.target.value) || 0; })} />
          </div>
        </div>
        <div className="hp-hero-numbers">
          <input className="hp-big hp-cur-color" type="number" min={0} placeholder="0"
            value={hp.current} style={{ color: hpColor }}
            onChange={(e) => updateCharacter((c) => { c.combat.hp.current = parseInt(e.target.value) || 0; })} />
          <span className="hp-slash">/</span>
          <input className="hp-big hp-max-style" type="number" min={0} placeholder="0"
            value={hp.max}
            onChange={(e) => updateCharacter((c) => { c.combat.hp.max = parseInt(e.target.value) || 0; })} />
        </div>
        <div className="hp-progress-track">
          <div className="hp-progress-fill" style={{ width: `${hpPct}%`, background: hpColor }} />
        </div>
        <div className="hp-quick-actions">
          {showHeal ? (
            <div style={{ display: "flex", gap: 6 }}>
              <input autoFocus type="number" min={0} className="hp-temp-input" placeholder="PV"
                value={healInput} onChange={(e) => setHealInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") applyHeal(); if (e.key === "Escape") setShowHeal(false); }} />
              <button className="hp-action-btn heal" onClick={applyHeal}>OK</button>
              <button className="hp-action-btn" onClick={() => setShowHeal(false)}>✕</button>
            </div>
          ) : (
            <button className="hp-action-btn heal" onClick={() => setShowHeal(true)}>+ Curar</button>
          )}
          {showDmg ? (
            <div style={{ display: "flex", gap: 6 }}>
              <input autoFocus type="number" min={0} className="hp-temp-input" placeholder="Dano"
                value={dmgInput} onChange={(e) => setDmgInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") applyDmg(); if (e.key === "Escape") setShowDmg(false); }} />
              <button className="hp-action-btn damage" onClick={applyDmg}>OK</button>
              <button className="hp-action-btn" onClick={() => setShowDmg(false)}>✕</button>
            </div>
          ) : (
            <button className="hp-action-btn damage" onClick={() => setShowDmg(true)}>− Dano</button>
          )}
        </div>
      </div>

      <div className="combat-stats-grid">
        <div className="cstat-card">
          <input className="cstat-value" type="number" min={0} max={30} placeholder="14"
            value={ac} onChange={(e) => updateCharacter((c) => { c.combat.ac = parseInt(e.target.value) || 10; })} />
          <div className="cstat-label">CA</div>
        </div>
        <div className="cstat-card">
          <div className="cstat-value cstat-static">{initiative}</div>
          <div className="cstat-label">Iniciativa</div>
        </div>
        <div className="cstat-card">
          <input className="cstat-value" placeholder="9m"
            value={speed} onChange={(e) => updateCharacter((c) => { c.combat.speed = e.target.value; })} />
          <div className="cstat-label">Deslocamento</div>
        </div>
        <div className="cstat-card">
          <input className="cstat-value" placeholder="1d8"
            value={hitDice.total} onChange={(e) => updateCharacter((c) => { c.combat.hitDice.total = e.target.value; })} />
          <div className="cstat-label">Dados de Vida</div>
        </div>
      </div>

      <DeathSaves />

      <div className="section-block">
        <div className="section-hdr">
          <h3 className="section-title">Condições</h3>
        </div>
        <div className="conditions-grid">
          {CONDITIONS.map((cond) => (
            <button key={cond} className={`condition-badge${activeConditions.includes(cond) ? " active" : ""}`}
              onClick={() => toggleCondition(cond)}>
              {cond}
            </button>
          ))}
        </div>
      </div>

      <div className="section-block">
        <div className="section-hdr">
          <h3 className="section-title">Ataques</h3>
          <button className="add-btn"
            onClick={() => updateCharacter((c) => { c.attacks.push({ name: "", bonus: "", damage: "", type: "" }); })}>
            + Adicionar
          </button>
        </div>
        <div className="attack-header-row">
          <span>Nome</span><span>Bônus</span><span>Dano</span><span>Tipo</span><span />
        </div>
        <div className="attacks-list">
          {char.attacks.map((atk, i) => <AttackRow key={i} atk={atk} index={i} />)}
        </div>
        <textarea className="notes-area" placeholder="Notas sobre ataques e magias..."
          defaultValue={char.attacksNotes}
          onChange={(e) => updateCharacter((c) => { c.attacksNotes = e.target.value; })} />
      </div>
    </section>
  );
}
