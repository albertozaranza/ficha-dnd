const Calc = (() => {
  function modifier(score) {
    return Math.floor((score - 10) / 2);
  }

  function proficiencyBonus(level) {
    return Math.ceil(level / 4) + 1;
  }

  function formatBonus(value) {
    return value >= 0 ? `+${value}` : `${value}`;
  }

  function skillBonus(char, skillKey) {
    const skill = char.skills[skillKey];
    if (!skill) return 0;
    const base = modifier(char.attributes[skill.attr]);
    const prof = proficiencyBonus(char.meta.level);
    if (skill.expertise) return base + prof * 2;
    if (skill.proficient) return base + prof;
    return base;
  }

  function savingThrowBonus(char, attr) {
    const base = modifier(char.attributes[attr]);
    const prof = proficiencyBonus(char.meta.level);
    return char.savingThrows[attr]?.proficient ? base + prof : base;
  }

  function passivePerception(char) {
    return 10 + skillBonus(char, "perception");
  }

  function initiative(char) {
    return modifier(char.attributes.dex);
  }

  function allModifiers(char) {
    const mods = {};
    for (const attr of ["str", "dex", "con", "int", "wis", "cha"]) {
      mods[attr] = modifier(char.attributes[attr]);
    }
    return mods;
  }

  function allSavingThrows(char) {
    const saves = {};
    for (const attr of ["str", "dex", "con", "int", "wis", "cha"]) {
      saves[attr] = savingThrowBonus(char, attr);
    }
    return saves;
  }

  function allSkills(char) {
    const result = {};
    for (const key of Object.keys(char.skills)) {
      result[key] = skillBonus(char, key);
    }
    return result;
  }

  return {
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
})();
