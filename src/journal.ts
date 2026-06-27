import type { Campaign, Session, SessionEvent, EventTag } from "./types";
import { Storage } from "./storage";

let campaign: Campaign | null = null;
let onDirty: (() => void) | null = null;
let searchQuery = "";
let activeTagFilter: EventTag | "" = "";
let editingSessionId: string | null = null;
let pendingDeleteId: string | null = null;
let modalEvents: SessionEvent[] = [];
let modalSelectedTags = new Set<EventTag>();

const EVENT_TAGS: EventTag[] = ["NPC", "Local", "Quest", "Combate", "Revelação"];

const TAG_COLOR: Record<EventTag, string> = {
  NPC: "#7c6af7",
  Local: "#22c55e",
  Quest: "#f59e0b",
  Combate: "#ef4444",
  Revelação: "#06b6d4",
};

function $<T extends Element = Element>(sel: string, ctx: ParentNode = document): T | null {
  return ctx.querySelector<T>(sel);
}

function escHtml(s: unknown): string {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as Record<string, string>)[c] ?? c),
  );
}

function matchesSearch(sess: Session, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return (
    sess.title?.toLowerCase().includes(q) ||
    sess.summary?.toLowerCase().includes(q) ||
    sess.participants?.some((p) => p.toLowerCase().includes(q)) ||
    sess.events?.some((e) => e.text.toLowerCase().includes(q)) ||
    false
  );
}

function matchesTagFilter(sess: Session, tag: EventTag | ""): boolean {
  if (!tag) return true;
  return sess.events?.some((e) => e.tags.includes(tag)) ?? false;
}

const saveTimers = new Map<string, number>();

// ─── Modal controls ───────────────────────────────────────────

function showSessionModal(sessionId?: string) {
  const modal = $<HTMLElement>("#modal-session");
  if (!modal) return;
  editingSessionId = sessionId ?? null;
  const titleEl = $("#modal-session-title");
  if (titleEl) titleEl.textContent = sessionId ? "Editar Sessão" : "Nova Sessão";
  prefillSessionForm(sessionId);
  modal.style.display = "flex";
}

function closeSessionModal() {
  const modal = $<HTMLElement>("#modal-session");
  if (!modal) return;
  modal.style.display = "none";
  editingSessionId = null;
  modalEvents = [];
  modalSelectedTags.clear();
  renderModalEventsList();
  resetModalTagBar();
}

function showDeleteModal(sessionId: string) {
  const modal = $<HTMLElement>("#modal-delete");
  if (!modal || !campaign) return;
  const sess = campaign.sessions.find((x) => x.id === sessionId);
  if (!sess) return;
  pendingDeleteId = sessionId;
  const textEl = $("#modal-delete-text");
  if (textEl)
    textEl.textContent = `Tem certeza que deseja remover a sessão #${sess.number} ("${sess.title}")? Esta ação não pode ser desfeita.`;
  modal.style.display = "flex";
}

function closeDeleteModal() {
  const modal = $<HTMLElement>("#modal-delete");
  if (!modal) return;
  modal.style.display = "none";
  pendingDeleteId = null;
}

function prefillSessionForm(sessionId?: string) {
  const dateEl = $<HTMLInputElement>("#session-date");
  const titleEl = $<HTMLInputElement>("#session-title");
  const summaryEl = $<HTMLTextAreaElement>("#session-summary");
  const partsEl = $<HTMLInputElement>("#session-participants");
  const xpEl = $<HTMLInputElement>("#session-xp");
  const goldEl = $<HTMLInputElement>("#session-gold");
  if (!dateEl || !titleEl || !summaryEl || !partsEl || !xpEl || !goldEl) return;

  if (sessionId && campaign) {
    const s = campaign.sessions.find((x) => x.id === sessionId);
    if (s) {
      dateEl.value = s.date;
      titleEl.value = s.title;
      summaryEl.value = s.summary;
      partsEl.value = (s.participants ?? []).join(", ");
      xpEl.value = s.xp != null ? String(s.xp) : "";
      goldEl.value = s.gold != null ? String(s.gold) : "";
      modalEvents = s.events.map((e) => ({ ...e }));
      renderModalEventsList();
      return;
    }
  }

  dateEl.value = new Date().toISOString().slice(0, 10);
  titleEl.value = campaign ? `Sessão ${(campaign.sessions.length ?? 0) + 1}` : "";
  summaryEl.value = "";
  partsEl.value = "";
  xpEl.value = "";
  goldEl.value = "";
  modalEvents = [];
  renderModalEventsList();
}

// ─── Modal events ─────────────────────────────────────────────

function renderModalEventsList() {
  const list = $<HTMLElement>("#modal-events-list");
  if (!list) return;
  list.innerHTML = "";
  modalEvents.forEach((ev) => {
    const item = document.createElement("div");
    item.className = "event-item";
    const tagsHtml = ev.tags
      .map((t) => `<span class="event-tag-chip" style="background:${TAG_COLOR[t]}22;color:${TAG_COLOR[t]};border-color:${TAG_COLOR[t]}44">${escHtml(t)}</span>`)
      .join("");
    item.innerHTML = `
      <div class="event-item-tags">${tagsHtml}</div>
      <span class="event-item-text">${escHtml(ev.text)}</span>
      <button class="event-remove-btn" aria-label="Remover">×</button>
    `;
    item.querySelector(".event-remove-btn")?.addEventListener("click", () => {
      modalEvents = modalEvents.filter((e) => e.id !== ev.id);
      renderModalEventsList();
    });
    list.appendChild(item);
  });
}

function resetModalTagBar() {
  document.querySelectorAll("#modal-event-tag-bar .add-event-tag-btn").forEach((b) => b.classList.remove("selected"));
}

function initModalEvents() {
  const tagBar = $<HTMLElement>("#modal-event-tag-bar");
  if (tagBar && tagBar.childElementCount === 0) {
    EVENT_TAGS.forEach((tag) => {
      const btn = document.createElement("button");
      btn.className = "add-event-tag-btn";
      btn.textContent = tag;
      btn.type = "button";
      btn.style.setProperty("--tag-color", TAG_COLOR[tag]);
      btn.addEventListener("click", () => {
        if (modalSelectedTags.has(tag)) {
          modalSelectedTags.delete(tag);
          btn.classList.remove("selected");
        } else {
          modalSelectedTags.add(tag);
          btn.classList.add("selected");
        }
      });
      tagBar.appendChild(btn);
    });
  }

  const addBtn = $<HTMLButtonElement>("#modal-add-event-btn");
  const textInput = $<HTMLInputElement>("#modal-new-event-text");
  if (!addBtn || !textInput) return;

  const doAdd = () => {
    const text = textInput.value.trim();
    if (!text) return;
    modalEvents = [...modalEvents, { id: crypto.randomUUID(), text, tags: Array.from(modalSelectedTags) }];
    renderModalEventsList();
    textInput.value = "";
    modalSelectedTags.clear();
    resetModalTagBar();
  };

  addBtn.addEventListener("click", doAdd);
  textInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); doAdd(); } });
}

// ─── Events section ───────────────────────────────────────────

function renderEventsSection(sess: Session, container: HTMLElement) {
  container.innerHTML = "";

  // Existing events
  const list = document.createElement("div");
  list.className = "events-list";
  (sess.events ?? []).forEach((ev) => {
    const item = document.createElement("div");
    item.className = "event-item";
    const tagsHtml = ev.tags
      .map((t) => `<span class="event-tag-chip" style="background:${TAG_COLOR[t]}22;color:${TAG_COLOR[t]};border-color:${TAG_COLOR[t]}44">${escHtml(t)}</span>`)
      .join("");
    item.innerHTML = `
      <div class="event-item-tags">${tagsHtml}</div>
      <span class="event-item-text">${escHtml(ev.text)}</span>
      <button class="event-remove-btn" aria-label="Remover evento">×</button>
    `;
    item.querySelector(".event-remove-btn")?.addEventListener("click", () => {
      removeEvent(sess.id, ev.id);
    });
    list.appendChild(item);
  });
  container.appendChild(list);

  // Add event row
  const addRow = document.createElement("div");
  addRow.className = "add-event-row";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "add-event-input";
  input.placeholder = "Descreva o evento...";

  const tagBar = document.createElement("div");
  tagBar.className = "add-event-tag-bar";
  const selectedTags = new Set<EventTag>();
  EVENT_TAGS.forEach((tag) => {
    const btn = document.createElement("button");
    btn.className = "add-event-tag-btn";
    btn.textContent = tag;
    btn.style.setProperty("--tag-color", TAG_COLOR[tag]);
    btn.addEventListener("click", () => {
      if (selectedTags.has(tag)) {
        selectedTags.delete(tag);
        btn.classList.remove("selected");
      } else {
        selectedTags.add(tag);
        btn.classList.add("selected");
      }
    });
    tagBar.appendChild(btn);
  });

  const confirmBtn = document.createElement("button");
  confirmBtn.className = "btn btn-secondary add-event-confirm-btn";
  confirmBtn.textContent = "+ Adicionar";
  confirmBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;
    addEvent(sess.id, text, Array.from(selectedTags));
    input.value = "";
    selectedTags.clear();
    tagBar.querySelectorAll(".add-event-tag-btn").forEach((b) => b.classList.remove("selected"));
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") confirmBtn.click();
  });

  addRow.appendChild(input);
  addRow.appendChild(tagBar);
  addRow.appendChild(confirmBtn);
  container.appendChild(addRow);
}

function addEvent(sessionId: string, text: string, tags: EventTag[]) {
  if (!campaign) return;
  const sess = campaign.sessions.find((x) => x.id === sessionId);
  if (!sess) return;
  const ev: SessionEvent = { id: crypto.randomUUID(), text, tags };
  sess.events = [...(sess.events ?? []), ev];
  sess.updatedAt = new Date().toISOString();
  Storage.save(campaign);
  onDirty?.();

  // Re-render events section in-place
  const card = document.querySelector<HTMLElement>(`.session-card[data-session-id="${sessionId}"]`);
  const evContainer = card?.querySelector<HTMLElement>(".session-events-container");
  if (evContainer) renderEventsSection(sess, evContainer);
}

function removeEvent(sessionId: string, eventId: string) {
  if (!campaign) return;
  const sess = campaign.sessions.find((x) => x.id === sessionId);
  if (!sess) return;
  sess.events = sess.events.filter((e) => e.id !== eventId);
  sess.updatedAt = new Date().toISOString();
  Storage.save(campaign);
  onDirty?.();

  const card = document.querySelector<HTMLElement>(`.session-card[data-session-id="${sessionId}"]`);
  const evContainer = card?.querySelector<HTMLElement>(".session-events-container");
  if (evContainer) renderEventsSection(sess, evContainer);
}

// ─── Session card ─────────────────────────────────────────────

function makeSessionCard(sess: Session): HTMLElement {
  const div = document.createElement("div");
  div.className = "session-card";
  div.dataset.sessionId = sess.id;

  const rewardBadges = [
    sess.xp != null ? `<span class="session-badge badge-xp">+${sess.xp} XP</span>` : "",
    sess.gold != null ? `<span class="session-badge badge-gold">+${sess.gold} ouro</span>` : "",
  ].join("");

  const eventTagCounts: Partial<Record<EventTag, number>> = {};
  (sess.events ?? []).forEach((ev) => {
    ev.tags.forEach((t) => {
      eventTagCounts[t] = (eventTagCounts[t] ?? 0) + 1;
    });
  });
  const tagSummary = (Object.entries(eventTagCounts) as [EventTag, number][])
    .map(([t, n]) => `<span class="event-tag-chip sm" style="background:${TAG_COLOR[t]}22;color:${TAG_COLOR[t]};border-color:${TAG_COLOR[t]}44">${escHtml(t)} ${n}</span>`)
    .join("");

  div.innerHTML = `
    <div class="session-card-header">
      <span class="session-number">#${sess.number}</span>
      <span class="session-date-label">${new Date(sess.date + "T12:00:00").toLocaleDateString("pt-BR")}</span>
      <span class="session-card-title">${escHtml(sess.title)}</span>
      <div class="session-card-meta">${rewardBadges}${tagSummary}</div>
      <svg class="session-expand-icon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </div>
    <div class="session-card-details" style="display:none;">
      <div class="session-inline-fields">
        <input class="session-date-input" type="date" value="${escHtml(sess.date?.slice(0, 10) ?? "")}" data-id="${escHtml(sess.id)}" style="width:140px;">
        <input class="session-title-input" value="${escHtml(sess.title)}" placeholder="Título" data-id="${escHtml(sess.id)}" style="flex:1;">
        <input class="session-xp-input" type="number" value="${escHtml(sess.xp ?? "")}" placeholder="XP" data-id="${escHtml(sess.id)}" style="width:80px;">
        <input class="session-gold-input" type="number" value="${escHtml(sess.gold ?? "")}" placeholder="Ouro" data-id="${escHtml(sess.id)}" style="width:90px;">
      </div>
      <textarea class="session-summary-input" placeholder="Resumo..." data-id="${escHtml(sess.id)}">${escHtml(sess.summary)}</textarea>
      <div class="session-participants-row">
        <input class="session-participants-input" value="${escHtml((sess.participants ?? []).join(", "))}" placeholder="Participantes (separados por vírgula)" data-id="${escHtml(sess.id)}" style="flex:1;">
        <button class="session-edit-btn btn btn-secondary" data-id="${escHtml(sess.id)}">Editar</button>
        <button class="session-del-btn btn btn-danger" data-id="${escHtml(sess.id)}">Excluir</button>
      </div>
      <div class="events-section">
        <div class="events-section-label">Eventos</div>
        <div class="session-events-container"></div>
      </div>
    </div>
  `;

  // Expand/collapse
  const header = div.querySelector<HTMLElement>(".session-card-header");
  const details = div.querySelector<HTMLElement>(".session-card-details");
  const icon = div.querySelector<SVGElement>(".session-expand-icon");
  if (header && details && icon) {
    header.addEventListener("click", () => {
      const isOpen = details.style.display !== "none";
      details.style.display = isOpen ? "none" : "block";
      icon.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
      if (!isOpen) {
        const evContainer = div.querySelector<HTMLElement>(".session-events-container");
        if (evContainer) renderEventsSection(sess, evContainer);
      }
    });
  }

  // Inline field auto-save
  function scheduleSave(id: string) {
    const existing = saveTimers.get(id);
    if (existing) clearTimeout(existing);
    saveTimers.set(id, window.setTimeout(() => {
      persistSessionFields(id);
      saveTimers.delete(id);
    }, 1000));
  }

  const dateI = div.querySelector<HTMLInputElement>(".session-date-input");
  const titleI = div.querySelector<HTMLInputElement>(".session-title-input");
  const xpI = div.querySelector<HTMLInputElement>(".session-xp-input");
  const goldI = div.querySelector<HTMLInputElement>(".session-gold-input");
  const sumI = div.querySelector<HTMLTextAreaElement>(".session-summary-input");
  const partsI = div.querySelector<HTMLInputElement>(".session-participants-input");

  [dateI, titleI, xpI, goldI, sumI, partsI].forEach((el) => {
    if (!el) return;
    el.addEventListener("input", () => {
      const id = el.dataset.id as string;
      syncFieldToMemory(id, el);
      scheduleSave(id);
    });
    el.addEventListener("blur", () => {
      const id = el.dataset.id as string;
      const timer = saveTimers.get(id);
      if (timer) { clearTimeout(timer); saveTimers.delete(id); }
      persistSessionFields(id);
    });
  });

  const editBtn = div.querySelector<HTMLButtonElement>(".session-edit-btn");
  const delBtn = div.querySelector<HTMLButtonElement>(".session-del-btn");
  if (editBtn) editBtn.addEventListener("click", (e) => { e.stopPropagation(); showSessionModal(editBtn.dataset.id); });
  if (delBtn) delBtn.addEventListener("click", (e) => { e.stopPropagation(); if (delBtn.dataset.id) showDeleteModal(delBtn.dataset.id); });

  return div;
}

function syncFieldToMemory(id: string, el: HTMLInputElement | HTMLTextAreaElement) {
  if (!campaign) return;
  const sess = campaign.sessions.find((x) => x.id === id);
  if (!sess) return;
  const cls = el.classList;
  if (cls.contains("session-date-input")) sess.date = el.value;
  else if (cls.contains("session-title-input")) sess.title = el.value;
  else if (cls.contains("session-xp-input")) sess.xp = el.value ? parseInt(el.value) : undefined;
  else if (cls.contains("session-gold-input")) sess.gold = el.value ? parseInt(el.value) : undefined;
  else if (cls.contains("session-summary-input")) sess.summary = el.value;
  else if (cls.contains("session-participants-input"))
    sess.participants = el.value.split(",").map((s) => s.trim()).filter(Boolean);
  sess.updatedAt = new Date().toISOString();
}

function persistSessionFields(id: string) {
  if (!campaign) return;
  const sess = campaign.sessions.find((x) => x.id === id);
  if (!sess) return;
  sess.updatedAt = new Date().toISOString();
  Storage.save(campaign);
  onDirty?.();
}

// ─── Render list ──────────────────────────────────────────────

function renderSessions() {
  if (!campaign) return;
  const list = $("#sessions-list");
  if (!list) return;
  list.innerHTML = "";

  const filtered = campaign.sessions
    .filter((s) => matchesSearch(s, searchQuery) && matchesTagFilter(s, activeTagFilter))
    .sort((a, b) => b.number - a.number);

  if (filtered.length === 0) {
    list.innerHTML = searchQuery || activeTagFilter
      ? `<div class="empty-state">Nenhuma sessão encontrada${activeTagFilter ? ` com tag "${activeTagFilter}"` : ""}${searchQuery ? ` para "${escHtml(searchQuery)}"` : ""}.</div>`
      : '<div class="empty-state">Nenhuma sessão registrada. Comece agora.</div>';
    return;
  }

  filtered.forEach((s) => list.appendChild(makeSessionCard(s)));
}

// ─── Save form (modal) ────────────────────────────────────────

function saveForm() {
  if (!campaign) return;
  const dateEl = $<HTMLInputElement>("#session-date");
  const titleEl = $<HTMLInputElement>("#session-title");
  const summaryEl = $<HTMLTextAreaElement>("#session-summary");
  const partsEl = $<HTMLInputElement>("#session-participants");
  const xpEl = $<HTMLInputElement>("#session-xp");
  const goldEl = $<HTMLInputElement>("#session-gold");
  if (!dateEl || !titleEl || !summaryEl || !partsEl || !xpEl || !goldEl) return;

  const now = new Date().toISOString();
  const participants = partsEl.value.split(",").map((s) => s.trim()).filter(Boolean);

  if (editingSessionId) {
    const sess = campaign.sessions.find((x) => x.id === editingSessionId);
    if (sess) {
      sess.date = dateEl.value;
      sess.title = titleEl.value;
      sess.summary = summaryEl.value;
      sess.participants = participants;
      sess.events = [...modalEvents];
      sess.xp = xpEl.value ? parseInt(xpEl.value) : undefined;
      sess.gold = goldEl.value ? parseInt(goldEl.value) : undefined;
      sess.updatedAt = now;
    }
  } else {
    const number = campaign.sessions.length
      ? Math.max(...campaign.sessions.map((x) => x.number)) + 1
      : 1;
    const newSession: Session = {
      id: crypto.randomUUID(),
      number,
      date: dateEl.value,
      title: titleEl.value,
      summary: summaryEl.value,
      participants,
      events: [...modalEvents],
      xp: xpEl.value ? parseInt(xpEl.value) : undefined,
      gold: goldEl.value ? parseInt(goldEl.value) : undefined,
      createdAt: now,
      updatedAt: now,
    };
    campaign.sessions.push(newSession);
  }

  Storage.save(campaign);
  onDirty?.();
  closeSessionModal();
  renderSessions();
}

// ─── Delete ───────────────────────────────────────────────────

function confirmDelete() {
  if (!pendingDeleteId || !campaign) return;
  campaign.sessions = campaign.sessions.filter((x) => x.id !== pendingDeleteId);
  Storage.save(campaign);
  onDirty?.();
  closeDeleteModal();
  renderSessions();
}

// ─── Tag filter bar ───────────────────────────────────────────

function initTagFilters() {
  const bar = document.querySelector<HTMLElement>("#journal-tag-filters");
  if (!bar) return;
  bar.querySelectorAll<HTMLButtonElement>(".filter-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      bar.querySelectorAll(".filter-chip").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeTagFilter = (btn.dataset.tag ?? "") as EventTag | "";
      renderSessions();
    });
  });
}

// ─── Public API ───────────────────────────────────────────────

export const Journal = {
  init(camp: Campaign, markDirty: () => void) {
    campaign = camp;
    onDirty = markDirty;

    // Migrate legacy sessions without events array
    campaign.sessions.forEach((s) => {
      if (!Array.isArray(s.events)) s.events = [];
    });

    const newBtn = $<HTMLElement>("#btn-new-session");
    const sessionSaveBtn = $<HTMLElement>("#session-save");
    const sessionCancelBtn = $<HTMLElement>("#session-cancel");
    const sessionCloseBtn = $<HTMLElement>("#modal-session-close");
    const sessionModal = $<HTMLElement>("#modal-session");
    const deleteModal = $<HTMLElement>("#modal-delete");
    const deleteConfirmBtn = $<HTMLElement>("#modal-delete-confirm");
    const deleteCancelBtn = $<HTMLElement>("#modal-delete-cancel");
    const searchI = $<HTMLInputElement>("#journal-search");

    if (newBtn) newBtn.addEventListener("click", () => showSessionModal());
    if (sessionSaveBtn) sessionSaveBtn.addEventListener("click", () => saveForm());
    if (sessionCancelBtn) sessionCancelBtn.addEventListener("click", () => closeSessionModal());
    if (sessionCloseBtn) sessionCloseBtn.addEventListener("click", () => closeSessionModal());
    if (sessionModal) sessionModal.addEventListener("click", (e) => { if (e.target === sessionModal) closeSessionModal(); });
    if (deleteConfirmBtn) deleteConfirmBtn.addEventListener("click", () => confirmDelete());
    if (deleteCancelBtn) deleteCancelBtn.addEventListener("click", () => closeDeleteModal());
    if (deleteModal) deleteModal.addEventListener("click", (e) => { if (e.target === deleteModal) closeDeleteModal(); });
    if (searchI) searchI.addEventListener("input", () => { searchQuery = searchI.value; renderSessions(); });

    initTagFilters();
    initModalEvents();
    renderSessions();
  },

  render() {
    renderSessions();
  },
};
