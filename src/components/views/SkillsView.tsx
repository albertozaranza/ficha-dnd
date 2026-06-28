import { useState, useMemo } from "react";
import { useCampaignStore } from "../../store/campaignStore";
import { Calc } from "../../calculations";
import { ATTR_KEYS, ATTR_ABBR, ATTR_FULL, SKILL_GROUPS } from "../../lib/constants";
import type { AttrKey } from "../../types";

const notesArea = "w-full bg-(--bg-surface) border border-(--border) rounded-xl px-3.5 py-3 text-(--text-1) text-[13px] resize-y outline-none min-h-20 leading-[1.7] transition-all duration-150 focus:border-(--accent)";

export function SkillsView() {
  const char = useCampaignStore((s) => s.campaign.character);
  const updateCharacter = useCampaignStore((s) => s.updateCharacter);
  const [search, setSearch] = useState("");

  const langsProfText = useMemo(() => {
    const langs = char.languages.join(", ");
    const profs = [
      char.proficiencies.armor?.length ? "Armaduras: " + char.proficiencies.armor.join(", ") : "",
      char.proficiencies.weapons?.length ? "Armas: " + char.proficiencies.weapons.join(", ") : "",
      char.proficiencies.tools?.length ? "Ferramentas: " + char.proficiencies.tools.join(", ") : "",
    ].filter(Boolean).join("\n");
    return [langs ? "Idiomas: " + langs : "", profs].filter(Boolean).join("\n\n");
  }, [char.languages, char.proficiencies]);

  function cycleSkill(key: string) {
    updateCharacter((c) => {
      const s = c.skills[key];
      if (!s.proficient && !s.expertise) s.proficient = true;
      else if (s.proficient && !s.expertise) s.expertise = true;
      else { s.proficient = false; s.expertise = false; }
    });
  }

  function toggleSave(attr: AttrKey) {
    updateCharacter((c) => {
      c.savingThrows[attr].proficient = !c.savingThrows[attr].proficient;
    });
  }

  const q = search.toLowerCase().trim();

  return (
    <section id="view-skills" className="view">
      <div className="flex items-center justify-between mb-7 pb-4 border-b border-(--border) flex-wrap gap-3">
        <h2 className="font-cinzel text-[22px] font-bold text-(--text-1) tracking-[0.02em]">Perícias</h2>
        <input
          className="bg-(--bg-surface) border border-(--border) rounded-xl py-1.75 px-3 text-(--text-1) text-[13px] outline-none w-45 transition-[border-color,width] duration-150 focus:border-(--accent) focus:w-55"
          type="search" placeholder="Buscar..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="text-[11px] text-(--text-3) mb-4">Clique para alternar proficiência → expertise → nenhuma</div>

      <div className="flex flex-col gap-4">
        {ATTR_KEYS.map((attr) => {
          const keys = SKILL_GROUPS[attr];
          if (!keys || keys.length === 0) return null;
          const visibleSkills = keys.filter((key) => !q || char.skills[key]?.label.toLowerCase().includes(q));
          if (visibleSkills.length === 0) return null;
          return (
            <div key={attr}>
              <div className="text-[10px] font-bold uppercase tracking-widest text-(--text-3) px-1 mb-1">
                {ATTR_ABBR[attr]} — {ATTR_FULL[attr]}
              </div>
              {visibleSkills.map((key) => {
                const skill = char.skills[key];
                if (!skill) return null;
                const bonus = Calc.skillBonus(char, key);
                const pipClass = skill.expertise
                  ? "bg-(--blue) border-(--blue)"
                  : skill.proficient
                  ? "bg-(--accent) border-(--accent)"
                  : "border-(--border-hi)";
                return (
                  <div key={key} className="flex items-center gap-2.5 px-2.5 py-1.75 rounded-lg cursor-pointer transition-all duration-150 hover:bg-(--bg-hover)" data-skill={key} onClick={() => cycleSkill(key)}>
                    <span className={`w-2.5 h-2.5 rounded-full border-[1.5px] shrink-0 transition-all duration-150 ${pipClass}`} />
                    <span className="font-cinzel text-[13px] font-bold text-(--text-1) min-w-7.5 text-right">{Calc.formatBonus(bonus)}</span>
                    <span className="text-[13px] text-(--text-2) flex-1">{skill.label}</span>
                    {skill.expertise && (
                      <span className="text-[9px] font-bold uppercase tracking-[0.06em] text-(--blue) bg-(--blue-sub) rounded-sm px-1.25 py-px">Expertise</span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-8 mb-3">
        <h3 className="text-[13px] font-semibold text-(--text-1)">Testes de Resistência</h3>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-1">
        {ATTR_KEYS.map((attr) => {
          const bonus = Calc.savingThrowBonus(char, attr);
          const prof = !!char.savingThrows[attr]?.proficient;
          return (
            <div
              key={attr}
              className={`flex items-center gap-2 px-3 py-2.25 border rounded-xl cursor-pointer transition-all duration-150 ${
                prof
                  ? "border-(--accent) bg-(--accent-sub)"
                  : "bg-(--bg-surface) border-(--border) hover:bg-(--bg-hover)"
              }`}
              onClick={() => toggleSave(attr)}
            >
              <span className={`w-2.5 h-2.5 rounded-full border-[1.5px] shrink-0 ${prof ? "bg-(--accent) border-(--accent)" : "border-(--border-hi)"}`} />
              <span className="font-cinzel font-bold min-w-6.5 text-[13px]">{Calc.formatBonus(bonus)}</span>
              <span className="text-xs text-(--text-2)">{ATTR_FULL[attr]}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-7 mb-2.5">
        <h3 className="text-[13px] font-semibold text-(--text-1)">Idiomas &amp; Proficiências</h3>
      </div>
      <textarea className={`${notesArea} min-h-30`} placeholder="Idiomas e proficiências..." value={langsProfText} readOnly />
    </section>
  );
}
