import { useCampaignStore } from "../../store/campaignStore";

export function SpellsView() {
  const char = useCampaignStore((s) => s.campaign.character);
  const updateCharacter = useCampaignStore((s) => s.updateCharacter);
  const { spellcasting } = char;

  const cantripCount = Math.max(spellcasting.cantrips.length + 2, 6);

  return (
    <section id="view-spells" className="view">
      <div className="view-header">
        <h2 className="view-title">Grimório</h2>
      </div>

      <div className="spell-stats-row">
        {(["class", "ability"] as const).map((field) => (
          <div key={field} className="sstat-card">
            <input className="sstat-value" placeholder="—"
              value={spellcasting[field]}
              onChange={(e) => updateCharacter((c) => { c.spellcasting[field] = e.target.value; })} />
            <div className="sstat-label">{field === "class" ? "Classe de Conjurador" : "Habilidade Chave"}</div>
          </div>
        ))}
        <div className="sstat-card">
          <input className="sstat-value" type="number" placeholder="—"
            value={spellcasting.saveDC || ""}
            onChange={(e) => updateCharacter((c) => { c.spellcasting.saveDC = parseInt(e.target.value) || 0; })} />
          <div className="sstat-label">CD de Resistência</div>
        </div>
        <div className="sstat-card">
          <input className="sstat-value" type="number" placeholder="—"
            value={spellcasting.attackBonus || ""}
            onChange={(e) => updateCharacter((c) => { c.spellcasting.attackBonus = parseInt(e.target.value) || 0; })} />
          <div className="sstat-label">Bônus de Ataque</div>
        </div>
      </div>

      <div className="spell-group">
        <div className="spell-group-hdr">
          <div className="spell-lvl-badge cantrip-badge">0</div>
          <span className="spell-group-title">Truques</span>
        </div>
        <div className="spell-lines">
          {Array.from({ length: cantripCount }, (_, i) => (
            <div key={i} className="spell-line">
              <input className="spell-name-input" placeholder="Truque..."
                value={spellcasting.cantrips[i] || ""}
                onChange={(e) => updateCharacter((c) => { c.spellcasting.cantrips[i] = e.target.value; })} />
            </div>
          ))}
        </div>
      </div>

      <div className="spell-levels-container">
        {Array.from({ length: 9 }, (_, lvlIdx) => {
          const lvl = lvlIdx + 1;
          const slotData = spellcasting.slots[lvl];
          if (!slotData) return null;
          const spellCount = Math.max(slotData.spells.length + 1, 8);
          return (
            <div key={lvl} className="spell-group">
              <div className="spell-group-hdr">
                <div className="spell-lvl-badge">{lvl}</div>
                <span className="spell-group-title">Nível {lvl}</span>
                <div className="spell-slots-ctrl">
                  Total:&nbsp;
                  <input className="slot-input" type="number" min={0} max={9}
                    value={slotData.total}
                    onChange={(e) => updateCharacter((c) => { c.spellcasting.slots[lvl].total = parseInt(e.target.value) || 0; })} />
                  &nbsp;Usados:&nbsp;
                  <input className="slot-input" type="number" min={0} max={9}
                    value={slotData.used}
                    onChange={(e) => updateCharacter((c) => { c.spellcasting.slots[lvl].used = parseInt(e.target.value) || 0; })} />
                </div>
              </div>
              <div className="spell-lines">
                {Array.from({ length: spellCount }, (_, i) => {
                  const spell = slotData.spells[i] || { name: "", prepared: false };
                  return (
                    <div key={i} className="spell-line">
                      <span
                        className={`spell-prep-dot${spell.prepared ? " prepared" : ""}`}
                        title="Preparada"
                        onClick={() => updateCharacter((c) => {
                          if (!c.spellcasting.slots[lvl].spells[i]) {
                            c.spellcasting.slots[lvl].spells[i] = { name: "", prepared: false };
                          }
                          c.spellcasting.slots[lvl].spells[i].prepared = !c.spellcasting.slots[lvl].spells[i].prepared;
                        })}
                      />
                      <input className="spell-name-input" placeholder="Magia..."
                        value={spell.name || ""}
                        onChange={(e) => updateCharacter((c) => {
                          if (!c.spellcasting.slots[lvl].spells[i]) {
                            c.spellcasting.slots[lvl].spells[i] = { name: "", prepared: false };
                          }
                          c.spellcasting.slots[lvl].spells[i].name = e.target.value;
                        })} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
