import { useState, useMemo } from "react";
import { useCampaignStore } from "../../store/campaignStore";
import { Calc } from "../../calculations";
import { ATTR_KEYS, ATTR_ABBR, ATTR_FULL, SKILL_GROUPS } from "../../lib/constants";
import type { AttrKey } from "../../types";

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
      <div className="view-header">
        <h2 className="view-title">Perícias</h2>
        <input className="search-input" type="search" placeholder="Buscar..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="skills-hint">Clique para alternar proficiência → expertise → nenhuma</div>

      <div className="skills-container">
        {ATTR_KEYS.map((attr) => {
          const keys = SKILL_GROUPS[attr];
          if (!keys || keys.length === 0) return null;
          const visibleSkills = keys.filter((key) => {
            if (!q) return true;
            return char.skills[key]?.label.toLowerCase().includes(q);
          });
          if (visibleSkills.length === 0) return null;
          return (
            <div key={attr} className="skill-group">
              <div className="skill-group-hdr">{ATTR_ABBR[attr]} — {ATTR_FULL[attr]}</div>
              {visibleSkills.map((key) => {
                const skill = char.skills[key];
                if (!skill) return null;
                const bonus = Calc.skillBonus(char, key);
                const pipClass = skill.expertise ? "expertise" : skill.proficient ? "prof" : "";
                return (
                  <div key={key} className="skill-row" data-skill={key} onClick={() => cycleSkill(key)}>
                    <span className={`skill-pip ${pipClass}`} />
                    <span className="skill-bonus-val">{Calc.formatBonus(bonus)}</span>
                    <span className="skill-name-txt">{skill.label}</span>
                    {skill.expertise && <span className="expertise-tag">Expertise</span>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="section-hdr" style={{ marginTop: 32, marginBottom: 12 }}>
        <h3 className="section-title">Testes de Resistência</h3>
      </div>
      <div className="saves-grid">
        {ATTR_KEYS.map((attr) => {
          const bonus = Calc.savingThrowBonus(char, attr);
          const prof = !!char.savingThrows[attr]?.proficient;
          return (
            <div key={attr} className={`save-row${prof ? " proficient" : ""}`} onClick={() => toggleSave(attr)}>
              <span className="save-pip" />
              <span className="save-bonus-val">{Calc.formatBonus(bonus)}</span>
              <span className="save-name-txt">{ATTR_FULL[attr]}</span>
            </div>
          );
        })}
      </div>

      <div className="section-hdr" style={{ marginTop: 28, marginBottom: 10 }}>
        <h3 className="section-title">Idiomas &amp; Proficiências</h3>
      </div>
      <textarea
        className="notes-area"
        style={{ minHeight: 120 }}
        placeholder="Idiomas e proficiências..."
        value={langsProfText}
        readOnly
      />
    </section>
  );
}
