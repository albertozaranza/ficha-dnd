import type { AttrKey, Character } from "./types";

function modifier(score: number): number {
    return Math.floor((score - 10) / 2);
  }

function proficiencyBonus(level: number): number {
    return Math.ceil(level / 4) + 1;
  }

function formatBonus(value: number): string {
    return value >= 0 ? `+${value}` : `${value}`;
  }

function skillBonus(char: Character, skillKey: string): number {
    const skill = char.skills[skillKey];
    if (!skill) return 0;
    const base = modifier(char.attributes[skill.attr]);
    const prof = proficiencyBonus(char.meta.level);
    if (skill.expertise) return base + prof * 2;
    if (skill.proficient) return base + prof;
    return base;
  }

function savingThrowBonus(char: Character, attr: AttrKey): number {
    const base = modifier(char.attributes[attr]);
    const prof = proficiencyBonus(char.meta.level);
    return char.savingThrows[attr]?.proficient ? base + prof : base;
  }

function passivePerception(char: Character): number {
    return 10 + skillBonus(char, "perception");
  }

function initiative(char: Character): number {
    return modifier(char.attributes.dex);
  }

function allModifiers(char: Character): Record<AttrKey, number> {
    const mods = {} as Record<AttrKey, number>;
    for (const attr of ["str", "dex", "con", "int", "wis", "cha"] as AttrKey[]) {
      mods[attr] = modifier(char.attributes[attr]);
    }
    return mods;
  }

function allSavingThrows(char: Character): Record<AttrKey, number> {
    const saves = {} as Record<AttrKey, number>;
    for (const attr of ["str", "dex", "con", "int", "wis", "cha"] as AttrKey[]) {
      saves[attr] = savingThrowBonus(char, attr);
    }
    return saves;
  }

function allSkills(char: Character): Record<string, number> {
    const result: Record<string, number> = {};
    for (const key of Object.keys(char.skills)) {
      result[key] = skillBonus(char, key);
    }
    return result;
  }

export const Calc = {
    modifier,
    proficiencyBonus,
    formatBonus,
    skillBonus,
    savingThrowBonus,
    passivePerception,
    initiative,
    allModifiers,
    allSavingThrows,
    allSkills,
  };
