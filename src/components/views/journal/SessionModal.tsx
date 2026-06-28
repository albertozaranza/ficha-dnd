import { useState, useEffect } from "react";
import { useCampaignStore } from "../../../store/campaignStore";
import { useUIStore } from "../../../store/uiStore";
import { EVENT_TAGS, TAG_COLOR } from "../../../lib/constants";
import { EventTagChip } from "./EventTagChip";
import type { SessionEvent, EventTag } from "../../../types";

export function SessionModal() {
  const { openModal, editingSessionId, setOpenModal } = useUIStore();
  const sessions = useCampaignStore((s) => s.campaign.sessions);
  const addSession = useCampaignStore((s) => s.addSession);
  const updateSession = useCampaignStore((s) => s.updateSession);

  const editing = editingSessionId ? sessions.find((s) => s.id === editingSessionId) : null;

  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [participants, setParticipants] = useState("");
  const [xp, setXp] = useState("");
  const [gold, setGold] = useState("");
  const [events, setEvents] = useState<SessionEvent[]>([]);
  const [newEventText, setNewEventText] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<EventTag>>(new Set());

  useEffect(() => {
    if (openModal !== "session") return;
    if (editing) {
      setDate(editing.date ?? "");
      setTitle(editing.title ?? "");
      setSummary(editing.summary ?? "");
      setParticipants((editing.participants ?? []).join(", "));
      setXp(editing.xp != null ? String(editing.xp) : "");
      setGold(editing.gold != null ? String(editing.gold) : "");
      setEvents(editing.events.map((e) => ({ ...e })));
    } else {
      setDate(new Date().toISOString().slice(0, 10));
      setTitle(`Sessão ${sessions.length + 1}`);
      setSummary("");
      setParticipants("");
      setXp("");
      setGold("");
      setEvents([]);
    }
    setNewEventText("");
    setSelectedTags(new Set());
  }, [openModal, editingSessionId]);

  if (openModal !== "session") return null;

  function toggleTag(tag: EventTag) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }

  function addEvent() {
    const text = newEventText.trim();
    if (!text) return;
    setEvents((prev) => [...prev, { id: crypto.randomUUID(), text, tags: Array.from(selectedTags) }]);
    setNewEventText("");
    setSelectedTags(new Set());
  }

  function removeEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  function save() {
    const now = new Date().toISOString();
    const parts = participants.split(",").map((s) => s.trim()).filter(Boolean);

    if (editing) {
      updateSession(editing.id, (s) => {
        s.date = date;
        s.title = title;
        s.summary = summary;
        s.participants = parts;
        s.events = events;
        s.xp = xp ? parseInt(xp) : undefined;
        s.gold = gold ? parseInt(gold) : undefined;
      });
    } else {
      const number = sessions.length ? Math.max(...sessions.map((s) => s.number)) + 1 : 1;
      addSession({
        id: crypto.randomUUID(),
        number,
        date,
        title,
        summary,
        participants: parts,
        events,
        xp: xp ? parseInt(xp) : undefined,
        gold: gold ? parseInt(gold) : undefined,
        createdAt: now,
        updatedAt: now,
      });
    }
    setOpenModal(null);
  }

  function close() {
    setOpenModal(null);
  }

  return (
    <div className="modal" style={{ display: "flex" }} onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="modal-backdrop" />
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title">{editing ? "Editar Sessão" : "Nova Sessão"}</h3>
          <button className="modal-close" onClick={close}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Data</label>
            <input type="date" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Título</label>
            <input type="text" className="form-input" placeholder="Título da sessão" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">XP</label>
              <input type="number" className="form-input" placeholder="0" value={xp} onChange={(e) => setXp(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Ouro</label>
              <input type="number" className="form-input" placeholder="0" value={gold} onChange={(e) => setGold(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Resumo</label>
            <textarea className="form-input" style={{ height: 120, resize: "none" }} placeholder="O que aconteceu nesta sessão..." value={summary} onChange={(e) => setSummary(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Participantes</label>
            <input type="text" className="form-input" placeholder="Nomes separados por vírgula" value={participants} onChange={(e) => setParticipants(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Eventos</label>
            <div className="modal-events-list">
              {events.map((ev) => (
                <div key={ev.id} className="event-item">
                  <div className="event-item-tags">
                    {ev.tags.map((t) => <EventTagChip key={t} tag={t} />)}
                  </div>
                  <span className="event-item-text">{ev.text}</span>
                  <button className="event-remove-btn" aria-label="Remover" onClick={() => removeEvent(ev.id)}>×</button>
                </div>
              ))}
            </div>
            <div className="add-event-row" style={{ marginTop: 6 }}>
              <input
                type="text"
                className="add-event-input"
                placeholder="Descreva o evento..."
                value={newEventText}
                onChange={(e) => setNewEventText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addEvent(); } }}
              />
              <div className="add-event-tag-bar">
                {EVENT_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`add-event-tag-btn${selectedTags.has(tag) ? " selected" : ""}`}
                    style={{ "--tag-color": TAG_COLOR[tag] } as React.CSSProperties}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <button type="button" className="btn btn-secondary add-event-confirm-btn" onClick={addEvent}>
                + Adicionar
              </button>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={close}>Cancelar</button>
          <button className="btn btn-primary" onClick={save}>Salvar Sessão</button>
        </div>
      </div>
    </div>
  );
}
