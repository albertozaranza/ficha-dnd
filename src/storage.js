const Storage = (() => {
  const KEY = "dnd5e_character";
  let saveTimer = null;

  function deepMerge(target, source) {
    const result = { ...target };
    for (const key of Object.keys(source)) {
      if (
        source[key] !== null &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key]) &&
        typeof target[key] === "object" &&
        target[key] !== null &&
        !Array.isArray(target[key])
      ) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }

  function save(character) {
    try {
      localStorage.setItem(KEY, JSON.stringify(character));
      return true;
    } catch {
      return false;
    }
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const saved = JSON.parse(raw);
      return deepMerge(DEFAULT_CHARACTER, saved);
    } catch {
      return null;
    }
  }

  function reset() {
    localStorage.removeItem(KEY);
    return JSON.parse(JSON.stringify(DEFAULT_CHARACTER));
  }

  function scheduleSave(character, onSave) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      const ok = save(character);
      if (onSave) onSave(ok);
    }, 300);
  }

  function exportJSON(character) {
    const blob = new Blob([JSON.stringify(character, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${character.meta.name || "personagem"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          resolve(deepMerge(DEFAULT_CHARACTER, data));
        } catch {
          reject(new Error("JSON inválido"));
        }
      };
      reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
      reader.readAsText(file);
    });
  }

  return { save, load, reset, scheduleSave, exportJSON, importJSON };
})();
