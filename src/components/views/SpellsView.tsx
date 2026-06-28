import { useCampaignStore } from "../../store/campaignStore";

const slotInput = "w-8.5 bg-(--bg-active) border border-(--border) rounded-md px-1 py-0.5 text-center text-(--text-1) outline-none text-xs font-semibold focus:border-(--purple)";

export function SpellsView() {
  const char = useCampaignStore((s) => s.campaign.character);
  const updateCharacter = useCampaignStore((s) => s.updateCharacter);
  const { spellcasting } = char;

  const cantripCount = Math.max(spellcasting.cantrips.length + 2, 6);

  return (
    <section id="view-spells" className="view">
      <div className="flex items-center justify-between mb-7 pb-4 border-b border-(--border) flex-wrap gap-3">
        <h2 className="font-cinzel text-[22px] font-bold text-(--text-1) tracking-[0.02em]">Grimório</h2>
      </div>

      {/* Spell stats */}
      <div className="grid grid-cols-4 gap-2.5 mb-5 max-[768px]:grid-cols-2">
        {(["class", "ability"] as const).map((field) => (
          <div key={field} className="bg-(--bg-surface) border border-(--border) rounded-xl p-3 text-center">
            <input
              className="font-cinzel text-xl font-bold bg-transparent border-none outline-none w-full text-center text-(--purple) block mb-1 focus:opacity-80"
              placeholder="—"
              value={spellcasting[field]}
              onChange={(e) => updateCharacter((c) => { c.spellcasting[field] = e.target.value; })} />
            <div className="text-[9px] font-bold uppercase tracking-widest text-(--text-3)">
              {field === "class" ? "Classe de Conjurador" : "Habilidade Chave"}
            </div>
          </div>
        ))}
        <div className="bg-(--bg-surface) border border-(--border) rounded-xl p-3 text-center">
          <input
            className="font-cinzel text-xl font-bold bg-transparent border-none outline-none w-full text-center text-(--purple) block mb-1 focus:opacity-80"
            type="number" placeholder="—"
            value={spellcasting.saveDC || ""}
            onChange={(e) => updateCharacter((c) => { c.spellcasting.saveDC = parseInt(e.target.value) || 0; })} />
          <div className="text-[9px] font-bold uppercase tracking-widest text-(--text-3)">CD de Resistência</div>
        </div>
        <div className="bg-(--bg-surface) border border-(--border) rounded-xl p-3 text-center">
          <input
            className="font-cinzel text-xl font-bold bg-transparent border-none outline-none w-full text-center text-(--purple) block mb-1 focus:opacity-80"
            type="number" placeholder="—"
            value={spellcasting.attackBonus || ""}
            onChange={(e) => updateCharacter((c) => { c.spellcasting.attackBonus = parseInt(e.target.value) || 0; })} />
          <div className="text-[9px] font-bold uppercase tracking-widest text-(--text-3)">Bônus de Ataque</div>
        </div>
      </div>

      {/* Cantrips */}
      <div className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-(--border) bg-(--bg-elevated)">
          <div className="w-6.5 h-6.5 rounded-full bg-(--bg-active) text-(--text-2) border border-(--border-hi) flex items-center justify-center font-cinzel font-bold text-xs shrink-0">0</div>
          <span className="text-[13px] font-semibold text-(--text-1) flex-1">Truques</span>
        </div>
        <div className="px-2 py-1.5">
          {Array.from({ length: cantripCount }, (_, i) => (
            <div key={i} className="flex items-center gap-2 px-1.5 py-1.25 rounded-lg transition-all duration-150 hover:bg-(--bg-hover)">
              <input
                className="flex-1 bg-transparent border-none border-b border-transparent outline-none text-(--text-1) text-[13px] pb-px placeholder:text-(--text-3) focus:border-b focus:border-(--purple)"
                placeholder="Truque..."
                value={spellcasting.cantrips[i] || ""}
                onChange={(e) => updateCharacter((c) => { c.spellcasting.cantrips[i] = e.target.value; })} />
            </div>
          ))}
        </div>
      </div>

      {/* Spell levels */}
      <div className="flex flex-col gap-2.5 mt-2.5">
        {Array.from({ length: 9 }, (_, lvlIdx) => {
          const lvl = lvlIdx + 1;
          const slotData = spellcasting.slots[lvl];
          if (!slotData) return null;
          const spellCount = Math.max(slotData.spells.length + 1, 8);
          return (
            <div key={lvl} className="bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-(--border) bg-(--bg-elevated)">
                <div className="w-6.5 h-6.5 rounded-full bg-(--purple) text-white flex items-center justify-center font-cinzel font-bold text-xs shrink-0">{lvl}</div>
                <span className="text-[13px] font-semibold text-(--text-1) flex-1">Nível {lvl}</span>
                <div className="ml-auto flex items-center gap-1.5 text-[11px] text-(--text-3)">
                  Total:&nbsp;<input className={slotInput} type="number" min={0} max={9}
                    value={slotData.total}
                    onChange={(e) => updateCharacter((c) => { c.spellcasting.slots[lvl].total = parseInt(e.target.value) || 0; })} />
                  &nbsp;Usados:&nbsp;<input className={slotInput} type="number" min={0} max={9}
                    value={slotData.used}
                    onChange={(e) => updateCharacter((c) => { c.spellcasting.slots[lvl].used = parseInt(e.target.value) || 0; })} />
                </div>
              </div>
              <div className="px-2 py-1.5">
                {Array.from({ length: spellCount }, (_, i) => {
                  const spell = slotData.spells[i] || { name: "", prepared: false };
                  return (
                    <div key={i} className="flex items-center gap-2 px-1.5 py-1.25 rounded-lg transition-all duration-150 hover:bg-(--bg-hover)">
                      <span
                        className={`w-2.5 h-2.5 rounded-full border-[1.5px] shrink-0 cursor-pointer transition-all duration-150 ${spell.prepared ? "bg-(--purple) border-(--purple)" : "border-(--border-hi)"}`}
                        title="Preparada"
                        onClick={() => updateCharacter((c) => {
                          if (!c.spellcasting.slots[lvl].spells[i]) c.spellcasting.slots[lvl].spells[i] = { name: "", prepared: false };
                          c.spellcasting.slots[lvl].spells[i].prepared = !c.spellcasting.slots[lvl].spells[i].prepared;
                        })}
                      />
                      <input
                        className="flex-1 bg-transparent border-none border-b border-transparent outline-none text-(--text-1) text-[13px] pb-px placeholder:text-(--text-3) focus:border-b focus:border-(--purple)"
                        placeholder="Magia..."
                        value={spell.name || ""}
                        onChange={(e) => updateCharacter((c) => {
                          if (!c.spellcasting.slots[lvl].spells[i]) c.spellcasting.slots[lvl].spells[i] = { name: "", prepared: false };
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
