// ─── Conditions ───────────────────────────────────────────────
const CONDITIONS = [
  "Cego", "Enfeitiçado", "Ensurdecido", "Amedrontado", "Agarrado",
  "Incapacitado", "Invisível", "Paralisado", "Petrificado", "Envenenado",
  "Caído", "Restrito", "Atordoado", "Inconsciente", "Exausto",
];

// ─── State ────────────────────────────────────────────────────
let char = Storage.load() || JSON.parse(JSON.stringify(DEFAULT_CHARACTER));
let isDark = localStorage.getItem("dnd_dark") !== "0";

// ─── Helpers ──────────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => ctx.querySelectorAll(sel);
const fmt = (v) => Calc.formatBonus(v);

const ATTR_KEYS = ["str", "dex", "con", "int", "wis", "cha"];
const ATTR_ABBR = { str: "FOR", dex: "DES", con: "CON", int: "INT", wis: "SAB", cha: "CAR" };
const ATTR_FULL = { str: "Força", dex: "Destreza", con: "Constituição", int: "Inteligência", wis: "Sabedoria", cha: "Carisma" };
const SKILL_GROUPS = {
  str: ["athletics"],
  dex: ["acrobatics", "sleightOfHand", "stealth"],
  int: ["arcana", "history", "investigation", "nature", "religion"],
  wis: ["animalHandling", "insight", "medicine", "perception", "survival"],
  cha: ["deception", "intimidation", "performance", "persuasion"],
};
const XP_THRESHOLDS = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
  85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000, Infinity];

// ─── Save feedback ────────────────────────────────────────────
function showSaved(ok) {
  const el = $("#save-indicator");
  if (!el) return;
  el.textContent = ok ? "✓ Salvo" : "⚠ Erro";
  el.classList.add("visible");
  setTimeout(() => el.classList.remove("visible"), 1800);
}

function markDirty() {
  Storage.scheduleSave(char, showSaved);
}

// ─── Navigation ───────────────────────────────────────────────
function initNav() {
  $$(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".nav-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const viewId = "view-" + btn.dataset.view;
      $$(".view").forEach((v) => v.classList.remove("active"));
      const view = $("#" + viewId);
      if (view) view.classList.add("active");
    });
  });
}

// ─── Dark Mode ────────────────────────────────────────────────
function applyTheme() {
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.classList.toggle("light", !isDark);
  const iconDark = $("#icon-dark");
  const iconLight = $("#icon-light");
  if (iconDark) iconDark.style.display = isDark ? "block" : "none";
  if (iconLight) iconLight.style.display = isDark ? "none" : "block";
}

// ─── Sidebar Hero ─────────────────────────────────────────────
function renderSidebarHero() {
  const nameEl = $("#hero-name");
  if (nameEl) {
    nameEl.value = char.meta.name;
    if (!nameEl.dataset.bound) {
      nameEl.dataset.bound = "1";
      nameEl.addEventListener("input", () => { char.meta.name = nameEl.value; updateHeroText(); markDirty(); });
    }
  }
  updateHeroText();
  updateXP();
  updateAvatar();
}

function updateHeroText() {
  const sub = $("#hero-subtitle");
  const race = $("#hero-race");
  if (sub) sub.textContent = `${char.meta.class || "—"}${char.meta.subclass ? " · " + char.meta.subclass : ""} · Nv. ${char.meta.level}`;
  if (race) race.textContent = `${char.meta.race || ""}${char.meta.subrace ? " · " + char.meta.subrace : ""}`;
}

function updateXP() {
  const lvl = char.meta.level;
  const xp = char.meta.experience || 0;
  const next = XP_THRESHOLDS[lvl] || XP_THRESHOLDS[XP_THRESHOLDS.length - 2];
  const prev = XP_THRESHOLDS[lvl - 1] || 0;
  const pct = next === Infinity ? 100 : Math.min(100, ((xp - prev) / (next - prev)) * 100);
  const fill = $("#xp-fill");
  if (fill) fill.style.width = pct + "%";
  const val = $("#xp-val");
  if (val) val.textContent = xp.toLocaleString() + " XP";
  const nextEl = $("#xp-next");
  if (nextEl) nextEl.textContent = next === Infinity ? "nível máximo" : next.toLocaleString() + " próx.";
}

function updateAvatar() {
  const img = $("#avatar-img");
  const initials = $("#avatar-initials");
  if (char.appearance?.portrait && img) {
    img.src = char.appearance.portrait;
    img.style.display = "block";
    if (initials) initials.style.display = "none";
  } else {
    if (img) img.style.display = "none";
    if (initials) {
      initials.style.display = "block";
      const name = char.meta.name || "?";
      const parts = name.split(" ");
      initials.textContent = parts.length > 1
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.slice(0, 2).toUpperCase();
    }
  }
}

// ─── Overview: Meta Strip ─────────────────────────────────────
function renderMeta() {
  const fields = [
    ["#meta-class",    () => char.meta.class,      (v) => { char.meta.class = v; updateHeroText(); }],
    ["#meta-subclass", () => char.meta.subclass,   (v) => { char.meta.subclass = v; updateHeroText(); }],
    ["#meta-level",    () => char.meta.level,      (v) => { char.meta.level = parseInt(v)||1; updateHeroText(); updateXP(); renderProfBonus(); renderAttributes(); renderSavingThrows(); renderSkills(); }],
    ["#meta-bg",       () => char.meta.background, (v) => { char.meta.background = v; }],
    ["#meta-align",    () => char.meta.alignment,  (v) => { char.meta.alignment = v; }],
    ["#meta-xp",       () => char.meta.experience, (v) => { char.meta.experience = parseInt(v)||0; updateXP(); }],
  ];
  for (const [sel, getter, setter] of fields) {
    const el = $(sel);
    if (!el || el.dataset.bound) continue;
    el.value = getter();
    el.dataset.bound = "1";
    el.addEventListener("input", () => { setter(el.value); markDirty(); });
  }
  // Refresh values
  [["#meta-class", () => char.meta.class],
   ["#meta-subclass", () => char.meta.subclass],
   ["#meta-level", () => char.meta.level],
   ["#meta-bg", () => char.meta.background],
   ["#meta-align", () => char.meta.alignment],
   ["#meta-xp", () => char.meta.experience]].forEach(([sel, g]) => {
    const el = $(sel);
    if (el) el.value = g();
  });
}

// ─── Prof Bonus & Inspiration ─────────────────────────────────
function renderProfBonus() {
  const el = $("#prof-bonus");
  if (el) el.textContent = fmt(Calc.proficiencyBonus(char.meta.level));
}

function renderInspiration() {
  const btn = $("#inspiration-btn");
  if (!btn) return;
  btn.classList.toggle("lit", !!char.meta.inspiration);
  if (!btn.dataset.bound) {
    btn.dataset.bound = "1";
    btn.addEventListener("click", () => {
      char.meta.inspiration = !char.meta.inspiration;
      btn.classList.toggle("lit", char.meta.inspiration);
      markDirty();
    });
  }
}

// ─── Attributes ───────────────────────────────────────────────
function renderAttributes() {
  const grid = $("#stats-grid");
  if (!grid) return;

  if (!grid.dataset.built) {
    grid.dataset.built = "1";
    grid.innerHTML = "";
    ATTR_KEYS.forEach((key) => {
      const card = document.createElement("div");
      card.className = "stat-card";
      card.dataset.attr = key;
      card.innerHTML = `
        <div class="stat-abbr">${ATTR_ABBR[key]}</div>
        <input class="stat-score-input" id="attr-score-${key}" type="number" min="1" max="30">
        <div class="stat-mod-circle" id="attr-mod-${key}">+0</div>
        <div class="stat-save-row">
          <span class="stat-save-val" id="save-val-${key}">+0</span>
          <span style="color:var(--text-3);font-size:10px">TR</span>
          <span class="save-pip-dot" id="save-pip-${key}" title="Proficiência em TR"></span>
        </div>
      `;
      grid.appendChild(card);

      const scoreEl = $(`#attr-score-${key}`);
      scoreEl.addEventListener("change", () => {
        char.attributes[key] = parseInt(scoreEl.value) || 10;
        refreshAttrCard(key);
        renderPassivePerception();
        renderQuickCombat();
        markDirty();
      });

      const pip = $(`#save-pip-${key}`);
      pip.addEventListener("click", (e) => {
        e.stopPropagation();
        char.savingThrows[key].proficient = !char.savingThrows[key].proficient;
        refreshAttrCard(key);
        markDirty();
      });
    });
  }

  ATTR_KEYS.forEach(refreshAttrCard);
}

function refreshAttrCard(key) {
  const scoreEl = $(`#attr-score-${key}`);
  const modEl = $(`#attr-mod-${key}`);
  const saveValEl = $(`#save-val-${key}`);
  const pipEl = $(`#save-pip-${key}`);
  if (!scoreEl) return;
  scoreEl.value = char.attributes[key];
  const mod = Calc.modifier(char.attributes[key]);
  const save = Calc.savingThrowBonus(char, key);
  const prof = char.savingThrows[key]?.proficient;
  if (modEl) modEl.textContent = fmt(mod);
  if (saveValEl) saveValEl.textContent = fmt(save);
  if (pipEl) pipEl.classList.toggle("proficient", !!prof);
}

// ─── Overview Quick Stats ─────────────────────────────────────
function renderQuickCombat() {
  // AC
  const acEl = $("#ov-ac");
  if (acEl && !acEl.dataset.bound) {
    acEl.dataset.bound = "1";
    acEl.addEventListener("change", () => { char.combat.ac = parseInt(acEl.value)||10; syncCombatAC(); markDirty(); });
  }
  if (acEl) acEl.value = char.combat.ac;

  // Initiative (read-only)
  const iniEl = $("#ov-init");
  if (iniEl) iniEl.textContent = fmt(Calc.initiative(char));

  // Speed
  const spdEl = $("#ov-speed");
  if (spdEl && !spdEl.dataset.bound) {
    spdEl.dataset.bound = "1";
    spdEl.addEventListener("change", () => { char.combat.speed = spdEl.value; syncCombatSpeed(); markDirty(); });
  }
  if (spdEl) spdEl.value = char.combat.speed;

  // Hit Dice
  const hdEl = $("#ov-hd");
  if (hdEl && !hdEl.dataset.bound) {
    hdEl.dataset.bound = "1";
    hdEl.addEventListener("change", () => { char.combat.hitDice.total = hdEl.value; syncCombatHD(); markDirty(); });
  }
  if (hdEl) hdEl.value = char.combat.hitDice.total;

  updateHPDisplay();
}

function updateHPDisplay() {
  const cur = char.combat.hp.current;
  const max = char.combat.hp.max;
  const pct = max > 0 ? Math.min(100, (cur / max) * 100) : 0;
  const color = pct > 50 ? "var(--green)" : pct > 25 ? "var(--amber)" : "var(--red)";

  // Overview HP display
  const ovCur = $("#ov-hp-cur");
  const ovMax = $("#ov-hp-max");
  const ovBar = $("#ov-hp-bar");
  if (ovCur) ovCur.textContent = cur;
  if (ovMax) ovMax.textContent = max;
  if (ovBar) { ovBar.style.width = pct + "%"; ovBar.style.background = color; }

  // Combat HP bar
  const combatBar = $("#hp-bar");
  if (combatBar) { combatBar.style.width = pct + "%"; combatBar.style.background = color; }
  const hpCur = $("#hp-current");
  const hpMax = $("#hp-max");
  if (hpCur) hpCur.value = cur;
  if (hpMax) hpMax.value = max;
  // Color the big HP number
  if (hpCur) hpCur.style.color = color;
  const ovCurEl = $("#ov-hp-cur");
  if (ovCurEl) ovCurEl.style.color = color;
}

function renderPassivePerception() {
  const el = $("#passive-perception");
  if (el) el.textContent = Calc.passivePerception(char);
}

// ─── Personality ──────────────────────────────────────────────
function renderPersonality() {
  const map = [
    ["#ov-traits", () => char.personality.traits, (v) => (char.personality.traits = v)],
    ["#ov-ideals", () => char.personality.ideals, (v) => (char.personality.ideals = v)],
    ["#ov-bonds",  () => char.personality.bonds,  (v) => (char.personality.bonds = v)],
    ["#ov-flaws",  () => char.personality.flaws,  (v) => (char.personality.flaws = v)],
  ];
  for (const [sel, getter, setter] of map) {
    const el = $(sel);
    if (!el) continue;
    el.value = getter();
    if (!el.dataset.bound) {
      el.dataset.bound = "1";
      el.addEventListener("input", () => { setter(el.value); markDirty(); });
    }
  }
}

// ─── Combat View ──────────────────────────────────────────────
function renderCombat() {
  // HP inputs
  const hpCur = $("#hp-current");
  const hpMax = $("#hp-max");
  const hpTmp = $("#hp-temp");
  if (hpCur && !hpCur.dataset.bound) {
    hpCur.dataset.bound = "1";
    hpCur.addEventListener("change", () => {
      char.combat.hp.current = parseInt(hpCur.value) || 0;
      updateHPDisplay();
      markDirty();
    });
  }
  if (hpMax && !hpMax.dataset.bound) {
    hpMax.dataset.bound = "1";
    hpMax.addEventListener("change", () => {
      char.combat.hp.max = parseInt(hpMax.value) || 0;
      updateHPDisplay();
      markDirty();
    });
  }
  if (hpTmp && !hpTmp.dataset.bound) {
    hpTmp.dataset.bound = "1";
    hpTmp.addEventListener("change", () => { char.combat.hp.temp = parseInt(hpTmp.value) || 0; markDirty(); });
  }
  if (hpTmp) hpTmp.value = char.combat.hp.temp || "";

  // Heal / Damage buttons
  const btnHeal = $("#btn-heal");
  if (btnHeal && !btnHeal.dataset.bound) {
    btnHeal.dataset.bound = "1";
    btnHeal.addEventListener("click", () => {
      const amt = parseInt(prompt("Quantos PV recuperar?") || "0") || 0;
      char.combat.hp.current = Math.min(char.combat.hp.max, char.combat.hp.current + amt);
      updateHPDisplay();
      markDirty();
    });
  }
  const btnDmg = $("#btn-damage");
  if (btnDmg && !btnDmg.dataset.bound) {
    btnDmg.dataset.bound = "1";
    btnDmg.addEventListener("click", () => {
      const amt = parseInt(prompt("Quanto de dano?") || "0") || 0;
      char.combat.hp.current = Math.max(0, char.combat.hp.current - amt);
      updateHPDisplay();
      markDirty();
    });
  }

  // Combat stat inputs
  const acEl = $("#combat-ac");
  if (acEl && !acEl.dataset.bound) {
    acEl.dataset.bound = "1";
    acEl.addEventListener("change", () => { char.combat.ac = parseInt(acEl.value)||10; syncOverviewAC(); markDirty(); });
  }
  if (acEl) acEl.value = char.combat.ac;

  const iniEl = $("#combat-ini");
  if (iniEl) iniEl.textContent = fmt(Calc.initiative(char));

  const spdEl = $("#combat-speed");
  if (spdEl && !spdEl.dataset.bound) {
    spdEl.dataset.bound = "1";
    spdEl.addEventListener("change", () => { char.combat.speed = spdEl.value; syncOverviewSpeed(); markDirty(); });
  }
  if (spdEl) spdEl.value = char.combat.speed;

  const hdEl = $("#combat-hd");
  if (hdEl && !hdEl.dataset.bound) {
    hdEl.dataset.bound = "1";
    hdEl.addEventListener("change", () => { char.combat.hitDice.total = hdEl.value; syncOverviewHD(); markDirty(); });
  }
  if (hdEl) hdEl.value = char.combat.hitDice.total;

  renderDeathSaves();
  renderConditions();
  renderAttacks();
  updateHPDisplay();
}

function renderConditions() {
  const grid = $("#conditions-grid");
  if (!grid) return;

  if (!grid.dataset.built) {
    grid.dataset.built = "1";
    grid.innerHTML = "";
    CONDITIONS.forEach((cond) => {
      const btn = document.createElement("button");
      btn.className = "condition-badge";
      btn.dataset.cond = cond;
      btn.textContent = cond;
      btn.addEventListener("click", () => {
        if (!char.combat.conditions) char.combat.conditions = [];
        const idx = char.combat.conditions.indexOf(cond);
        if (idx === -1) char.combat.conditions.push(cond);
        else char.combat.conditions.splice(idx, 1);
        btn.classList.toggle("active", char.combat.conditions.includes(cond));
        markDirty();
      });
      grid.appendChild(btn);
    });
  }

  const active = char.combat.conditions || [];
  CONDITIONS.forEach((cond) => {
    const btn = grid.querySelector(`[data-cond="${CSS.escape(cond)}"]`);
    if (btn) btn.classList.toggle("active", active.includes(cond));
  });
}

function syncCombatAC() { const el = $("#combat-ac"); if (el) el.value = char.combat.ac; }
function syncOverviewAC() { const el = $("#ov-ac"); if (el) el.value = char.combat.ac; }
function syncCombatSpeed() { const el = $("#combat-speed"); if (el) el.value = char.combat.speed; }
function syncOverviewSpeed() { const el = $("#ov-speed"); if (el) el.value = char.combat.speed; }
function syncCombatHD() { const el = $("#combat-hd"); if (el) el.value = char.combat.hitDice.total; }
function syncOverviewHD() { const el = $("#ov-hd"); if (el) el.value = char.combat.hitDice.total; }

function renderDeathSaves() {
  $$(".ds-pip.success").forEach((pip, i) => {
    pip.classList.toggle("filled", i < char.combat.deathSaves.successes);
    if (!pip.dataset.bound) {
      pip.dataset.bound = "1";
      pip.addEventListener("click", () => {
        char.combat.deathSaves.successes = char.combat.deathSaves.successes === i + 1 ? i : i + 1;
        renderDeathSaves();
        markDirty();
      });
    }
  });
  $$(".ds-pip.fail").forEach((pip, i) => {
    pip.classList.toggle("filled", i < char.combat.deathSaves.failures);
    if (!pip.dataset.bound) {
      pip.dataset.bound = "1";
      pip.addEventListener("click", () => {
        char.combat.deathSaves.failures = char.combat.deathSaves.failures === i + 1 ? i : i + 1;
        renderDeathSaves();
        markDirty();
      });
    }
  });
}

function renderAttacks() {
  const list = $("#attacks-list");
  if (!list) return;
  list.innerHTML = "";
  char.attacks.forEach((atk, i) => {
    const card = document.createElement("div");
    card.className = "attack-card";
    card.innerHTML = `
      <input class="attack-input" value="${escHtml(atk.name)}" placeholder="Nome do ataque">
      <input class="attack-input bonus" value="${escHtml(atk.bonus)}" placeholder="+0">
      <input class="attack-input" value="${escHtml(atk.damage)}" placeholder="1d6+3">
      <input class="attack-input" value="${escHtml(atk.type)}" placeholder="Tipo de dano">
      <button class="attack-remove-btn" title="Remover">×</button>
    `;
    const [nameI, bonusI, dmgI, typeI] = card.querySelectorAll(".attack-input");
    nameI.addEventListener("input", () => { char.attacks[i].name = nameI.value; markDirty(); });
    bonusI.addEventListener("input", () => { char.attacks[i].bonus = bonusI.value; markDirty(); });
    dmgI.addEventListener("input", () => { char.attacks[i].damage = dmgI.value; markDirty(); });
    typeI.addEventListener("input", () => { char.attacks[i].type = typeI.value; markDirty(); });
    card.querySelector(".attack-remove-btn").addEventListener("click", () => {
      char.attacks.splice(i, 1);
      renderAttacks();
      markDirty();
    });
    list.appendChild(card);
  });

  const addBtn = $("#add-attack");
  if (addBtn && !addBtn.dataset.bound) {
    addBtn.dataset.bound = "1";
    addBtn.addEventListener("click", () => {
      char.attacks.push({ name: "", bonus: "", damage: "", type: "" });
      renderAttacks();
      markDirty();
    });
  }

  const notesEl = $("#attack-notes");
  if (notesEl) {
    notesEl.value = char.attacksNotes || "";
    if (!notesEl.dataset.bound) {
      notesEl.dataset.bound = "1";
      notesEl.addEventListener("input", () => { char.attacksNotes = notesEl.value; markDirty(); });
    }
  }
}

// ─── Skills ───────────────────────────────────────────────────
function renderSavingThrows() {
  const list = $("#saves-list");
  if (!list) return;
  list.innerHTML = "";
  ATTR_KEYS.forEach((attr) => {
    const bonus = Calc.savingThrowBonus(char, attr);
    const prof = char.savingThrows[attr]?.proficient;
    const row = document.createElement("div");
    row.className = "save-row" + (prof ? " proficient" : "");
    row.dataset.attr = attr;
    row.innerHTML = `
      <span class="save-pip"></span>
      <span class="save-bonus-val">${fmt(bonus)}</span>
      <span class="save-name-txt">${ATTR_FULL[attr]}</span>
    `;
    row.addEventListener("click", () => {
      char.savingThrows[attr].proficient = !char.savingThrows[attr].proficient;
      renderSavingThrows();
      refreshAttrCard(attr);
      markDirty();
    });
    list.appendChild(row);
  });
}

function renderSkills() {
  const container = $("#skills-container");
  if (!container) return;
  container.innerHTML = "";
  ATTR_KEYS.forEach((attr) => {
    const keys = SKILL_GROUPS[attr];
    if (!keys || keys.length === 0) return;
    const group = document.createElement("div");
    group.className = "skill-group";
    group.innerHTML = `<div class="skill-group-hdr">${ATTR_ABBR[attr]} — ${ATTR_FULL[attr]}</div>`;
    keys.forEach((key) => {
      const skill = char.skills[key];
      if (!skill) return;
      const bonus = Calc.skillBonus(char, key);
      const row = document.createElement("div");
      row.className = "skill-row";
      row.dataset.skill = key;
      let pipClass = "";
      if (skill.expertise) pipClass = "expertise";
      else if (skill.proficient) pipClass = "prof";
      row.innerHTML = `
        <span class="skill-pip ${pipClass}"></span>
        <span class="skill-bonus-val">${fmt(bonus)}</span>
        <span class="skill-name-txt">${skill.label}</span>
        ${skill.expertise ? '<span class="expertise-tag">Expertise</span>' : ""}
      `;
      row.addEventListener("click", () => {
        if (!skill.proficient && !skill.expertise) skill.proficient = true;
        else if (skill.proficient && !skill.expertise) skill.expertise = true;
        else { skill.proficient = false; skill.expertise = false; }
        renderSkills();
        markDirty();
      });
      group.appendChild(row);
    });
    container.appendChild(group);
  });

  // Search
  const searchEl = $("#skill-search");
  if (searchEl && !searchEl.dataset.bound) {
    searchEl.dataset.bound = "1";
    searchEl.addEventListener("input", () => filterSkills(searchEl.value));
  }
}

function filterSkills(query) {
  const q = query.toLowerCase().trim();
  $$(".skill-row").forEach((row) => {
    const name = row.querySelector(".skill-name-txt")?.textContent?.toLowerCase() || "";
    row.classList.toggle("hidden-row", !!q && !name.includes(q));
  });
}

function renderLanguagesProf() {
  const el = $("#langs-text");
  if (!el) return;
  const langs = char.languages.join(", ");
  const profs = [
    char.proficiencies.armor?.length ? "Armaduras: " + char.proficiencies.armor.join(", ") : "",
    char.proficiencies.weapons?.length ? "Armas: " + char.proficiencies.weapons.join(", ") : "",
    char.proficiencies.tools?.length ? "Ferramentas: " + char.proficiencies.tools.join(", ") : "",
  ].filter(Boolean).join("\n");
  el.value = [langs ? "Idiomas: " + langs : "", profs].filter(Boolean).join("\n\n");
  if (!el.dataset.bound) {
    el.dataset.bound = "1";
    el.addEventListener("input", () => { char._langsProf = el.value; markDirty(); });
  }
}

// ─── Equipment ────────────────────────────────────────────────
function renderEquipment() {
  const list = $("#equipment-list");
  if (!list) return;
  list.innerHTML = "";
  char.equipment.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "equipment-item";
    div.innerHTML = `
      <span class="equipment-dot"></span>
      <input class="equipment-input" value="${escHtml(item)}" placeholder="Item...">
      <button class="equip-remove" title="Remover">×</button>
    `;
    const inp = div.querySelector(".equipment-input");
    inp.addEventListener("input", () => { char.equipment[i] = inp.value; markDirty(); });
    div.querySelector(".equip-remove").addEventListener("click", () => {
      char.equipment.splice(i, 1);
      renderEquipment();
      markDirty();
    });
    list.appendChild(div);
  });

  const addBtn = $("#add-equipment");
  if (addBtn && !addBtn.dataset.bound) {
    addBtn.dataset.bound = "1";
    addBtn.addEventListener("click", () => {
      char.equipment.push("");
      renderEquipment();
      markDirty();
    });
  }

  renderMoney();
}

function renderMoney() {
  for (const coin of ["cp", "sp", "ep", "gp", "pp"]) {
    const el = $(`#money-${coin}`);
    if (!el) continue;
    el.value = char.money[coin];
    if (!el.dataset.bound) {
      el.dataset.bound = "1";
      el.addEventListener("change", () => { char.money[coin] = parseInt(el.value) || 0; markDirty(); });
    }
  }
}

// ─── Features ─────────────────────────────────────────────────
function renderFeatures() {
  const list = $("#features-list");
  if (!list) return;
  list.innerHTML = "";
  char.features.forEach((feat, i) => {
    const card = document.createElement("div");
    card.className = "feature-card";
    const srcLower = (feat.source || "").toLowerCase();
    const badgeClass = srcLower.includes("racial") || srcLower.includes("raça") ? "racial"
      : srcLower.includes("ladino") || srcLower.includes("classe") ? "class-src" : "";
    card.innerHTML = `
      <div class="feature-hdr">
        <span class="feature-src-badge ${badgeClass}">${feat.source || "Habilidade"}</span>
        <input class="feature-name-input" value="${escHtml(feat.name)}" placeholder="Nome da habilidade">
        <span class="feature-chevron">▶</span>
      </div>
      <div class="feature-body">
        <textarea class="feature-desc-input" placeholder="Descrição...">${escHtml(feat.description)}</textarea>
      </div>
    `;
    const hdr = card.querySelector(".feature-hdr");
    hdr.addEventListener("click", (e) => {
      if (e.target.tagName === "INPUT") return;
      card.classList.toggle("expanded");
    });
    const nameEl = card.querySelector(".feature-name-input");
    nameEl.addEventListener("input", () => { char.features[i].name = nameEl.value; markDirty(); });
    const descEl = card.querySelector(".feature-desc-input");
    descEl.addEventListener("input", () => { char.features[i].description = descEl.value; markDirty(); });
    list.appendChild(card);
  });

  const addBtn = $("#add-feature");
  if (addBtn && !addBtn.dataset.bound) {
    addBtn.dataset.bound = "1";
    addBtn.addEventListener("click", () => {
      char.features.push({ name: "Nova Habilidade", source: "Habilidade", description: "" });
      renderFeatures();
      markDirty();
    });
  }
}

// ─── Spells ───────────────────────────────────────────────────
function renderSpells() {
  const fields = [
    ["#spell-class",   () => char.spellcasting.class,        (v) => (char.spellcasting.class = v)],
    ["#spell-ability", () => char.spellcasting.ability,      (v) => (char.spellcasting.ability = v)],
    ["#spell-dc",      () => char.spellcasting.saveDC || "", (v) => (char.spellcasting.saveDC = parseInt(v)||0)],
    ["#spell-atk",     () => char.spellcasting.attackBonus || "", (v) => (char.spellcasting.attackBonus = parseInt(v)||0)],
  ];
  for (const [sel, getter, setter] of fields) {
    const el = $(sel);
    if (!el) continue;
    el.value = getter();
    if (!el.dataset.bound) {
      el.dataset.bound = "1";
      el.addEventListener("input", () => { setter(el.value); markDirty(); });
    }
  }
  renderCantrips();
  renderSpellLevels();
}

function renderCantrips() {
  const container = $("#cantrips-list");
  if (!container) return;
  container.innerHTML = "";
  const count = Math.max(char.spellcasting.cantrips.length + 2, 6);
  for (let i = 0; i < count; i++) {
    const spell = char.spellcasting.cantrips[i] || "";
    const line = document.createElement("div");
    line.className = "spell-line";
    line.innerHTML = `<input class="spell-name-input" value="${escHtml(spell)}" placeholder="Truque...">`;
    const inp = line.querySelector("input");
    inp.addEventListener("input", () => {
      char.spellcasting.cantrips[i] = inp.value;
      markDirty();
    });
    container.appendChild(line);
  }
}

function renderSpellLevels() {
  const container = $("#spell-levels-container");
  if (!container) return;
  container.innerHTML = "";
  for (let lvl = 1; lvl <= 9; lvl++) {
    const slotData = char.spellcasting.slots[lvl];
    const group = document.createElement("div");
    group.className = "spell-group";
    group.innerHTML = `
      <div class="spell-group-hdr">
        <div class="spell-lvl-badge">${lvl}</div>
        <span class="spell-group-title">Nível ${lvl}</span>
        <div class="spell-slots-ctrl">
          Total: <input class="slot-input" id="spell-total-${lvl}" type="number" min="0" max="9" value="${slotData.total}">
          Usados: <input class="slot-input" id="spell-used-${lvl}" type="number" min="0" max="9" value="${slotData.used}">
        </div>
      </div>
      <div class="spell-lines" id="spells-lvl-${lvl}"></div>
    `;
    container.appendChild(group);

    $(`#spell-total-${lvl}`).addEventListener("change", (e) => {
      slotData.total = parseInt(e.target.value) || 0; markDirty();
    });
    $(`#spell-used-${lvl}`).addEventListener("change", (e) => {
      slotData.used = parseInt(e.target.value) || 0; markDirty();
    });

    const lines = $(`#spells-lvl-${lvl}`);
    const count = Math.max(slotData.spells.length + 1, 8);
    for (let i = 0; i < count; i++) {
      const spell = slotData.spells[i] || { name: "", prepared: false };
      const line = document.createElement("div");
      line.className = "spell-line";
      line.innerHTML = `
        <span class="spell-prep-dot ${spell.prepared ? "prepared" : ""}" title="Preparada"></span>
        <input class="spell-name-input" value="${escHtml(spell.name || "")}" placeholder="Magia...">
      `;
      const pip = line.querySelector(".spell-prep-dot");
      const inp = line.querySelector("input");
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
      lines.appendChild(line);
    }
  }
}

// ─── Character View ───────────────────────────────────────────
function renderCharacter() {
  const fields = [
    ["#app-age",    () => char.appearance.age,         (v) => (char.appearance.age = v)],
    ["#app-height", () => char.appearance.height,      (v) => (char.appearance.height = v)],
    ["#app-weight", () => char.appearance.weight,      (v) => (char.appearance.weight = v)],
    ["#app-eyes",   () => char.appearance.eyes,        (v) => (char.appearance.eyes = v)],
    ["#app-skin",   () => char.appearance.skin,        (v) => (char.appearance.skin = v)],
    ["#app-hair",   () => char.appearance.hair,        (v) => (char.appearance.hair = v)],
    ["#app-desc",   () => char.appearance.description, (v) => (char.appearance.description = v)],
    ["#backstory-text", () => char.backstory,          (v) => (char.backstory = v)],
    ["#allies-text",    () => char.allies,             (v) => (char.allies = v)],
    ["#treasure-text",  () => char.treasure,           (v) => (char.treasure = v)],
  ];
  for (const [sel, getter, setter] of fields) {
    const el = $(sel);
    if (!el) continue;
    el.value = getter() || "";
    if (!el.dataset.bound) {
      el.dataset.bound = "1";
      el.addEventListener("input", () => { setter(el.value); markDirty(); });
    }
  }
  // Portrait
  const img = $("#portrait-img");
  const placeholder = $("#portrait-placeholder");
  if (char.appearance?.portrait && img) {
    img.src = char.appearance.portrait;
    img.style.display = "block";
    if (placeholder) placeholder.style.display = "none";
  }
}

// ─── Notes ────────────────────────────────────────────────────
function renderNotes() {
  const el = $("#notes-editor");
  if (!el) return;
  el.value = char.notes || "";
  if (!el.dataset.bound) {
    el.dataset.bound = "1";
    el.addEventListener("input", () => { char.notes = el.value; markDirty(); });
  }
}

// ─── Portrait upload ──────────────────────────────────────────
function initPortraitUpload() {
  const input = $("#portrait-upload");
  if (!input) return;
  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      char.appearance = char.appearance || {};
      char.appearance.portrait = ev.target.result;
      updateAvatar();
      // Update character view portrait
      const img = $("#portrait-img");
      const placeholder = $("#portrait-placeholder");
      if (img) { img.src = ev.target.result; img.style.display = "block"; }
      if (placeholder) placeholder.style.display = "none";
      markDirty();
    };
    reader.readAsDataURL(file);
  });
}

// ─── Toolbar ─────────────────────────────────────────────────
function initToolbar() {
  $("#btn-dark")?.addEventListener("click", () => {
    isDark = !isDark;
    localStorage.setItem("dnd_dark", isDark ? "1" : "0");
    applyTheme();
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
    if (confirm("Resetar para os dados originais? Todas as alterações serão perdidas.")) {
      char = JSON.parse(JSON.stringify(DEFAULT_CHARACTER));
      Storage.save(char);
      renderAll();
      showSaved(true);
    }
  });
  $("#btn-print")?.addEventListener("click", () => window.print());
}

// ─── Utility ─────────────────────────────────────────────────
function escHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ─── Keyboard Shortcuts ───────────────────────────────────────
function initKeyboard() {
  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea, select")) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const navViews = { c: "combat", n: "notes", o: "overview", s: null };
    if (e.key === "s" || e.key === "S") {
      Storage.save(char);
      showSaved(true);
      return;
    }
    const view = navViews[e.key.toLowerCase()];
    if (view) {
      const btn = document.querySelector(`.nav-btn[data-view="${view}"]`);
      if (btn) btn.click();
    }
  });
}

// ─── Render All ───────────────────────────────────────────────
function renderAll() {
  // Reset bound state so fields re-bind on next render
  document.querySelectorAll("[data-bound]").forEach((el) => delete el.dataset.bound);
  // Reset built state for stats grid
  const grid = $("#stats-grid");
  if (grid) delete grid.dataset.built;

  renderSidebarHero();
  renderMeta();
  renderProfBonus();
  renderInspiration();
  renderAttributes();
  renderPassivePerception();
  renderQuickCombat();
  renderPersonality();
  renderCombat();
  renderSavingThrows();
  renderSkills();
  renderLanguagesProf();
  renderEquipment();
  renderFeatures();
  renderSpells();
  renderCharacter();
  renderNotes();
}

// ─── Boot ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  initNav();
  initToolbar();
  initPortraitUpload();
  initKeyboard();
  renderAll();
});
