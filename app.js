// ─── State ────────────────────────────────────────────────────
let char = Storage.load() || JSON.parse(JSON.stringify(DEFAULT_CHARACTER));
let darkMode = localStorage.getItem("dnd_dark") === "1";

// ─── Helpers ──────────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);

function fmt(v) { return Calc.formatBonus(v); }

function showSaved(ok) {
  const el = $("#save-indicator");
  el.textContent = ok ? "✓ Salvo" : "⚠ Erro ao salvar";
  el.classList.add("visible");
  setTimeout(() => el.classList.remove("visible"), 1800);
}

function markDirty() {
  Storage.scheduleSave(char, showSaved);
}

function bindEditable(el, getter, setter) {
  if (!el) return;
  el.value = getter();
  if (!el.dataset.bound) {
    el.dataset.bound = "1";
    el.addEventListener("input", () => {
      setter(el.value);
      markDirty();
    });
  }
}

function bindNumber(el, getter, setter, onUpdate) {
  if (!el) return;
  el.value = getter();
  if (!el.dataset.bound) {
    el.dataset.bound = "1";
    el.addEventListener("change", () => {
      const v = parseInt(el.value) || 0;
      setter(v);
      if (onUpdate) onUpdate();
      markDirty();
    });
  }
}

// ─── Tabs ─────────────────────────────────────────────────────
function initTabs() {
  const tabs = $$(".tab-btn");
  const pages = $$(".page");
  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.page;
      tabs.forEach((t) => t.classList.remove("active"));
      btn.classList.add("active");
      pages.forEach((p) => {
        p.classList.toggle("hidden", p.id !== target);
      });
    });
  });
}

// ─── Dark Mode ────────────────────────────────────────────────
function applyDark() {
  document.documentElement.classList.toggle("dark", darkMode);
  const btn = $("#btn-dark");
  if (btn) btn.textContent = darkMode ? "☀ Claro" : "☾ Escuro";
}

// ─── Page 1: Header ───────────────────────────────────────────
function renderHeader() {
  bindEditable($("#char-name"),    () => char.meta.name,        (v) => (char.meta.name = v));
  bindEditable($("#char-class"),   () => `${char.meta.class} — Nv. ${char.meta.level}`, (v) => (char.meta.class = v));
  bindEditable($("#char-bg"),      () => char.meta.background,  (v) => (char.meta.background = v));
  bindEditable($("#char-player"),  () => char.meta.player,      (v) => (char.meta.player = v));
  bindEditable($("#char-race"),    () => `${char.meta.race} — ${char.meta.subrace}`, (v) => (char.meta.race = v));
  bindEditable($("#char-align"),   () => char.meta.alignment,   (v) => (char.meta.alignment = v));
  bindEditable($("#char-xp"),      () => char.meta.experience,  (v) => (char.meta.experience = parseInt(v) || 0));
}

// ─── Page 1: Attributes ───────────────────────────────────────
const ATTRS = [
  { key: "str", label: "FORÇA" },
  { key: "dex", label: "DESTREZA" },
  { key: "con", label: "CONSTITUIÇÃO" },
  { key: "int", label: "INTELIGÊNCIA" },
  { key: "wis", label: "SABEDORIA" },
  { key: "cha", label: "CARISMA" },
];

function renderAttributes() {
  for (const { key } of ATTRS) {
    const scoreEl = $(`#attr-score-${key}`);
    const modEl = $(`#attr-mod-${key}`);
    if (!scoreEl || !modEl) continue;

    scoreEl.value = char.attributes[key];
    modEl.textContent = fmt(Calc.modifier(char.attributes[key]));

    scoreEl.addEventListener("change", () => {
      char.attributes[key] = parseInt(scoreEl.value) || 10;
      modEl.textContent = fmt(Calc.modifier(char.attributes[key]));
      renderSavingThrows();
      renderSkills();
      renderCombat();
      renderPassivePerception();
      markDirty();
    });
  }
}

// ─── Page 1: Inspiration & Prof ───────────────────────────────
function renderInspiration() {
  const box = $("#inspiration-box");
  if (!box) return;
  box.classList.toggle("lit", char.meta.inspiration);
  box.addEventListener("click", () => {
    char.meta.inspiration = !char.meta.inspiration;
    box.classList.toggle("lit", char.meta.inspiration);
    markDirty();
  });
}

function renderProfBonus() {
  const el = $("#prof-bonus");
  if (el) el.textContent = fmt(Calc.proficiencyBonus(char.meta.level));
}

// ─── Page 1: Saving Throws ────────────────────────────────────
const ATTR_LABELS = { str: "Força", dex: "Destreza", con: "Constituição", int: "Inteligência", wis: "Sabedoria", cha: "Carisma" };

function renderSavingThrows() {
  for (const attr of Object.keys(ATTR_LABELS)) {
    const row = $(`#save-row-${attr}`);
    if (!row) continue;
    const bonus = Calc.savingThrowBonus(char, attr);
    const proficient = char.savingThrows[attr]?.proficient;
    const pip = $(".prof-indicator", row);
    const val = $(".skill-bonus", row);
    if (pip) { pip.classList.toggle("filled", proficient); }
    if (val) val.textContent = fmt(bonus);
    row.onclick = () => {
      char.savingThrows[attr].proficient = !char.savingThrows[attr].proficient;
      renderSavingThrows();
      markDirty();
    };
  }
}

// ─── Page 1: Skills ───────────────────────────────────────────
function renderSkills() {
  for (const key of Object.keys(char.skills)) {
    const row = $(`#skill-row-${key}`);
    if (!row) continue;
    const skill = char.skills[key];
    const bonus = Calc.skillBonus(char, key);
    const pip = $(".prof-indicator", row);
    const val = $(".skill-bonus", row);
    if (pip) {
      pip.classList.remove("filled", "half");
      if (skill.expertise) pip.classList.add("filled");
      else if (skill.proficient) pip.classList.add("half");
    }
    if (val) val.textContent = fmt(bonus);
    row.onclick = () => {
      if (!skill.proficient && !skill.expertise) {
        skill.proficient = true;
      } else if (skill.proficient && !skill.expertise) {
        skill.expertise = true;
      } else {
        skill.proficient = false;
        skill.expertise = false;
      }
      renderSkills();
      markDirty();
    };
  }
}

// ─── Page 1: Combat ───────────────────────────────────────────
function renderCombat() {
  const acEl = $("#combat-ac");
  const iniEl = $("#combat-ini");
  const spdEl = $("#combat-spd");
  if (acEl) { acEl.value = char.combat.ac; if (!acEl.dataset.bound) { acEl.dataset.bound="1"; acEl.addEventListener("change", () => { char.combat.ac = parseInt(acEl.value) || 10; markDirty(); }); } }
  if (iniEl) iniEl.textContent = fmt(Calc.initiative(char));
  if (spdEl) { spdEl.value = char.combat.speed; if (!spdEl.dataset.bound) { spdEl.dataset.bound="1"; spdEl.addEventListener("change", () => { char.combat.speed = spdEl.value; markDirty(); }); } }

  const hpMaxEl = $("#hp-max");
  const hpCurEl = $("#hp-current");
  const hpTmpEl = $("#hp-temp");
  if (hpMaxEl) { hpMaxEl.value = char.combat.hp.max; if (!hpMaxEl.dataset.bound) { hpMaxEl.dataset.bound="1"; hpMaxEl.addEventListener("change", () => { char.combat.hp.max = parseInt(hpMaxEl.value)||0; markDirty(); }); } }
  if (hpCurEl) { hpCurEl.value = char.combat.hp.current; if (!hpCurEl.dataset.bound) { hpCurEl.dataset.bound="1"; hpCurEl.addEventListener("change", () => { char.combat.hp.current = parseInt(hpCurEl.value)||0; markDirty(); }); } }
  if (hpTmpEl) { hpTmpEl.value = char.combat.hp.temp||""; if (!hpTmpEl.dataset.bound) { hpTmpEl.dataset.bound="1"; hpTmpEl.addEventListener("change", () => { char.combat.hp.temp = parseInt(hpTmpEl.value)||0; markDirty(); }); } }

  renderHitDice();
  renderDeathSaves();
}

function renderHitDice() {
  const totalEl = $("#hit-dice-total");
  const remEl = $("#hit-dice-rem");
  if (totalEl) { totalEl.value = char.combat.hitDice.total; if (!totalEl.dataset.bound) { totalEl.dataset.bound="1"; totalEl.addEventListener("change", () => { char.combat.hitDice.total = totalEl.value; markDirty(); }); } }
  if (remEl) { remEl.value = char.combat.hitDice.remaining; if (!remEl.dataset.bound) { remEl.dataset.bound="1"; remEl.addEventListener("change", () => { char.combat.hitDice.remaining = remEl.value; markDirty(); }); } }
}

function renderDeathSaves() {
  const sPips = $$(".death-pip.success");
  const fPips = $$(".death-pip.fail");
  sPips.forEach((pip, i) => {
    pip.classList.toggle("filled", i < char.combat.deathSaves.successes);
    pip.onclick = () => {
      char.combat.deathSaves.successes = (char.combat.deathSaves.successes === i + 1) ? i : i + 1;
      renderDeathSaves();
      markDirty();
    };
  });
  fPips.forEach((pip, i) => {
    pip.classList.toggle("fail-filled", i < char.combat.deathSaves.failures);
    pip.onclick = () => {
      char.combat.deathSaves.failures = (char.combat.deathSaves.failures === i + 1) ? i : i + 1;
      renderDeathSaves();
      markDirty();
    };
  });
}

// ─── Page 1: Passive Perception ───────────────────────────────
function renderPassivePerception() {
  const el = $("#passive-perception");
  if (el) el.textContent = Calc.passivePerception(char);
}

// ─── Page 1: Attacks ──────────────────────────────────────────
function renderAttacks() {
  const tbody = $("#attacks-tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  char.attacks.forEach((atk, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input value="${atk.name}" placeholder="Nome"></td>
      <td><input value="${atk.bonus}" placeholder="Bônus" style="width:40px;text-align:center"></td>
      <td><input value="${atk.damage}" placeholder="Dano"></td>
      <td><input value="${atk.type}" placeholder="Tipo"></td>
    `;
    const inputs = tr.querySelectorAll("input");
    inputs[0].addEventListener("input", () => { char.attacks[i].name = inputs[0].value; markDirty(); });
    inputs[1].addEventListener("input", () => { char.attacks[i].bonus = inputs[1].value; markDirty(); });
    inputs[2].addEventListener("input", () => { char.attacks[i].damage = inputs[2].value; markDirty(); });
    inputs[3].addEventListener("input", () => { char.attacks[i].type = inputs[3].value; markDirty(); });
    tbody.appendChild(tr);
  });

  const addBtn = $("#add-attack");
  if (addBtn) {
    addBtn.onclick = () => {
      char.attacks.push({ name: "", bonus: "", damage: "", type: "" });
      renderAttacks();
      markDirty();
    };
  }

  const notesEl = $("#attack-notes");
  if (notesEl) {
    notesEl.value = char.attacksNotes || "";
    notesEl.addEventListener("input", () => { char.attacksNotes = notesEl.value; markDirty(); });
  }
}

// ─── Page 1: Equipment ────────────────────────────────────────
function renderEquipment() {
  const list = $("#equipment-list");
  if (!list) return;
  list.innerHTML = "";
  char.equipment.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<input value="${item}" placeholder="Item">`;
    const inp = li.querySelector("input");
    inp.addEventListener("input", () => { char.equipment[i] = inp.value; markDirty(); });
    list.appendChild(li);
  });

  const addBtn = $("#add-equipment");
  if (addBtn) {
    addBtn.onclick = () => {
      char.equipment.push("");
      renderEquipment();
      markDirty();
    };
  }

  renderMoney();
}

function renderMoney() {
  const coins = ["cp", "sp", "ep", "gp", "pp"];
  for (const coin of coins) {
    const el = $(`#money-${coin}`);
    if (!el) continue;
    el.value = char.money[coin];
    el.addEventListener("change", () => { char.money[coin] = parseInt(el.value) || 0; markDirty(); });
  }
}

// ─── Page 1: Personality ──────────────────────────────────────
function renderPersonality() {
  const fields = [
    ["#traits-text",  () => char.personality.traits, (v) => (char.personality.traits = v)],
    ["#ideals-text",  () => char.personality.ideals,  (v) => (char.personality.ideals = v)],
    ["#bonds-text",   () => char.personality.bonds,   (v) => (char.personality.bonds = v)],
    ["#flaws-text",   () => char.personality.flaws,   (v) => (char.personality.flaws = v)],
  ];
  for (const [sel, getter, setter] of fields) {
    const el = $(sel);
    if (!el) continue;
    el.value = getter();
    el.addEventListener("input", () => { setter(el.value); markDirty(); });
  }
}

// ─── Page 1: Languages & Proficiencies ────────────────────────
function renderLanguagesProf() {
  const el = $("#langs-prof-text");
  if (!el) return;
  const langStr = char.languages.join("\n");
  const profStr = [
    char.proficiencies.armor.length ? "Armaduras: " + char.proficiencies.armor.join(", ") : "",
    char.proficiencies.weapons.length ? "Armas: " + char.proficiencies.weapons.join(", ") : "",
    char.proficiencies.tools.length ? "Ferramentas: " + char.proficiencies.tools.join(", ") : "",
  ].filter(Boolean).join("\n");
  el.value = [langStr, profStr].filter(Boolean).join("\n\n");
  el.addEventListener("input", () => {
    char._langsProf = el.value;
    markDirty();
  });
}

// ─── Page 2: Appearance ───────────────────────────────────────
function renderAppearance() {
  const fields = [
    ["#app-age",    () => char.appearance.age,    (v) => (char.appearance.age = v)],
    ["#app-height", () => char.appearance.height, (v) => (char.appearance.height = v)],
    ["#app-weight", () => char.appearance.weight, (v) => (char.appearance.weight = v)],
    ["#app-eyes",   () => char.appearance.eyes,   (v) => (char.appearance.eyes = v)],
    ["#app-skin",   () => char.appearance.skin,   (v) => (char.appearance.skin = v)],
    ["#app-hair",   () => char.appearance.hair,   (v) => (char.appearance.hair = v)],
    ["#app-desc",   () => char.appearance.description, (v) => (char.appearance.description = v)],
    ["#char-name-p2", () => char.meta.name, (v) => (char.meta.name = v)],
  ];
  for (const [sel, getter, setter] of fields) {
    const el = $(sel);
    if (!el) continue;
    el.value = getter();
    el.addEventListener("input", () => { setter(el.value); markDirty(); });
  }
}

// ─── Page 2: Backstory / Allies / Treasure ────────────────────
function renderBackstory() {
  const fields = [
    ["#backstory-text", () => char.backstory,    (v) => (char.backstory = v)],
    ["#allies-text",    () => char.allies,        (v) => (char.allies = v)],
    ["#treasure-text",  () => char.treasure,      (v) => (char.treasure = v)],
  ];
  for (const [sel, getter, setter] of fields) {
    const el = $(sel);
    if (!el) continue;
    el.value = getter();
    el.addEventListener("input", () => { setter(el.value); markDirty(); });
  }
}

// ─── Page 2: Features ────────────────────────────────────────
function renderFeatures() {
  const container = $("#features-container");
  if (!container) return;
  container.innerHTML = "";
  char.features.forEach((feat, i) => {
    const div = document.createElement("div");
    div.className = "feature-entry";
    div.innerHTML = `
      <div style="display:flex;gap:4px;align-items:baseline;margin-bottom:2px">
        <input class="feature-name" value="${feat.name}" placeholder="Nome" style="background:transparent;border:none;border-bottom:1px solid var(--border-light);outline:none;font-family:'Cinzel',serif;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--ink);flex:1">
        <span style="font-size:8px;color:var(--border-light);font-style:italic">${feat.source || ""}</span>
      </div>
      <textarea class="feature-desc editable-area" style="min-height:36px" placeholder="Descrição...">${feat.description}</textarea>
    `;
    const nameEl = div.querySelector(".feature-name");
    const descEl = div.querySelector(".feature-desc");
    nameEl.addEventListener("input", () => { char.features[i].name = nameEl.value; markDirty(); });
    descEl.addEventListener("input", () => { char.features[i].description = descEl.value; markDirty(); });
    container.appendChild(div);
  });

  const addBtn = $("#add-feature");
  if (addBtn) {
    addBtn.onclick = () => {
      char.features.push({ name: "", source: "", description: "" });
      renderFeatures();
      markDirty();
    };
  }
}

// ─── Page 3: Spells ───────────────────────────────────────────
function renderSpells() {
  const classEl = $("#spell-class");
  const abilEl = $("#spell-ability");
  const dcEl = $("#spell-dc");
  const atkEl = $("#spell-atk");
  if (classEl) { classEl.value = char.spellcasting.class; classEl.addEventListener("input", () => { char.spellcasting.class = classEl.value; markDirty(); }); }
  if (abilEl)  { abilEl.value = char.spellcasting.ability; abilEl.addEventListener("input", () => { char.spellcasting.ability = abilEl.value; markDirty(); }); }
  if (dcEl)    { dcEl.value = char.spellcasting.saveDC; dcEl.addEventListener("change", () => { char.spellcasting.saveDC = parseInt(dcEl.value) || 0; markDirty(); }); }
  if (atkEl)   { atkEl.value = char.spellcasting.attackBonus; atkEl.addEventListener("change", () => { char.spellcasting.attackBonus = parseInt(atkEl.value) || 0; markDirty(); }); }

  renderCantrips();
  for (let lvl = 1; lvl <= 9; lvl++) renderSpellLevel(lvl);
}

function renderCantrips() {
  const container = $("#cantrips-list");
  if (!container) return;
  container.innerHTML = "";
  const count = Math.max(char.spellcasting.cantrips.length, 8);
  for (let i = 0; i < count; i++) {
    const div = document.createElement("div");
    div.className = "spell-line";
    const spell = char.spellcasting.cantrips[i] || "";
    div.innerHTML = `<input value="${spell}" placeholder="Truque...">`;
    const inp = div.querySelector("input");
    inp.addEventListener("input", () => {
      char.spellcasting.cantrips[i] = inp.value;
      markDirty();
    });
    container.appendChild(div);
  }
}

function renderSpellLevel(lvl) {
  const slotData = char.spellcasting.slots[lvl];
  const totalEl = $(`#spell-total-${lvl}`);
  const usedEl = $(`#spell-used-${lvl}`);
  if (totalEl) {
    totalEl.value = slotData.total;
    totalEl.addEventListener("change", () => { slotData.total = parseInt(totalEl.value) || 0; markDirty(); });
  }
  if (usedEl) {
    usedEl.value = slotData.used;
    usedEl.addEventListener("change", () => { slotData.used = parseInt(usedEl.value) || 0; markDirty(); });
  }

  const container = $(`#spells-lvl-${lvl}`);
  if (!container) return;
  container.innerHTML = "";
  const count = Math.max(slotData.spells.length, 13);
  for (let i = 0; i < count; i++) {
    const spell = slotData.spells[i] || { name: "", prepared: false };
    const div = document.createElement("div");
    div.className = "spell-line";
    div.innerHTML = `
      <span class="spell-prepared-pip${spell.prepared ? " prepared" : ""}" title="Preparada"></span>
      <input value="${spell.name || ""}" placeholder="Magia...">
    `;
    const pip = div.querySelector(".spell-prepared-pip");
    const inp = div.querySelector("input");
    pip.addEventListener("click", () => {
      if (!slotData.spells[i]) slotData.spells[i] = { name: "", prepared: false };
      slotData.spells[i].prepared = !slotData.spells[i].prepared;
      pip.classList.toggle("prepared", slotData.spells[i].prepared);
      markDirty();
    });
    inp.addEventListener("input", () => {
      if (!slotData.spells[i]) slotData.spells[i] = { name: "", prepared: false };
      slotData.spells[i].name = inp.value;
      markDirty();
    });
    container.appendChild(div);
  }
}

// ─── Toolbar Actions ──────────────────────────────────────────
function initToolbar() {
  $("#btn-dark")?.addEventListener("click", () => {
    darkMode = !darkMode;
    localStorage.setItem("dnd_dark", darkMode ? "1" : "0");
    applyDark();
  });

  $("#btn-save")?.addEventListener("click", () => {
    const ok = Storage.save(char);
    showSaved(ok);
  });

  $("#btn-export")?.addEventListener("click", () => Storage.exportJSON(char));

  $("#btn-import")?.addEventListener("click", () => $("#import-file")?.click());

  $("#import-file")?.addEventListener("change", async (e) => {
    if (!e.target.files[0]) return;
    try {
      char = await Storage.importJSON(e.target.files[0]);
      Storage.save(char);
      renderAll();
      showSaved(true);
    } catch {
      alert("Erro ao importar o arquivo.");
    }
  });

  $("#btn-reset")?.addEventListener("click", () => {
    if (confirm("Resetar personagem para os dados originais? Isso apagará todas as alterações.")) {
      char = Storage.reset();
      char = JSON.parse(JSON.stringify(DEFAULT_CHARACTER));
      Storage.save(char);
      renderAll();
      showSaved(true);
    }
  });

  $("#btn-print")?.addEventListener("click", () => window.print());
}

// ─── Render All ───────────────────────────────────────────────
function renderAll() {
  renderHeader();
  renderAttributes();
  renderInspiration();
  renderProfBonus();
  renderSavingThrows();
  renderSkills();
  renderCombat();
  renderPassivePerception();
  renderAttacks();
  renderEquipment();
  renderPersonality();
  renderLanguagesProf();
  renderAppearance();
  renderBackstory();
  renderFeatures();
  renderSpells();
}

// ─── Boot ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  applyDark();
  initTabs();
  initToolbar();
  renderAll();
});
