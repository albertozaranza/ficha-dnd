import { useState, useRef, useCallback } from "react";
import { useCampaignStore } from "../../../store/campaignStore";
import { useUIStore } from "../../../store/uiStore";
import { EVENT_TAGS, TAG_COLOR } from "../../../lib/constants";
import { EventTagChip } from "./EventTagChip";
import type { Session, SessionEvent, EventTag } from "../../../types";

interface EventsListProps {
  session: Session;
}

function EventsList({ session }: EventsListProps) {
  const updateSession = useCampaignStore((s) => s.updateSession);
  const [newText, setNewText] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<EventTag>>(new Set());

  function toggleTag(tag: EventTag) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }

  function addEvent() {
    const text = newText.trim();
    if (!text) return;
    const ev: SessionEvent = { id: crypto.randomUUID(), text, tags: Array.from(selectedTags) };
    updateSession(session.id, (s) => { s.events = [...(s.events ?? []), ev]; });
    setNewText("");
    setSelectedTags(new Set());
  }

  function removeEvent(eventId: string) {
    updateSession(session.id, (s) => { s.events = s.events.filter((e) => e.id !== eventId); });
  }

  return (
    <div className="events-section">
      <div className="events-section-label">Eventos</div>
      <div className="events-list">
        {(session.events ?? []).map((ev) => (
          <div key={ev.id} className="event-item">
            <div className="event-item-tags">
              {ev.tags.map((t) => <EventTagChip key={t} tag={t} />)}
            </div>
            <span className="event-item-text">{ev.text}</span>
            <button className="event-remove-btn" aria-label="Remover evento" onClick={() => removeEvent(ev.id)}>×</button>
          </div>
        ))}
      </div>
      <div className="add-event-row">
        <input
          type="text"
          className="add-event-input"
          placeholder="Descreva o evento..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") addEvent(); }}
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
  );
}

interface SessionCardProps {
  session: Session;
}

export function SessionCard({ session }: SessionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const updateSession = useCampaignStore((s) => s.updateSession);
  const { setOpenModal } = useUIStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleUpdate = useCallback((updater: (s: Session) => void) => {
    updater(session);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateSession(session.id, updater);
    }, 1000);
  }, [session, updateSession]);

  const tagCounts = (session.events ?? []).reduce<Partial<Record<EventTag, number>>>((acc, ev) => {
    ev.tags.forEach((t) => { acc[t] = (acc[t] ?? 0) + 1; });
    return acc;
  }, {});

  return (
    <div className="session-card">
      <div className="session-card-header" onClick={() => setExpanded((v) => !v)}>
        <span className="session-number">#{session.number}</span>
        <span className="session-date-label">
          {new Date(session.date + "T12:00:00").toLocaleDateString("pt-BR")}
        </span>
        <span className="session-card-title">{session.title}</span>
        <div className="session-card-meta">
          {session.xp != null && <span className="session-badge badge-xp">+{session.xp} XP</span>}
          {session.gold != null && <span className="session-badge badge-gold">+{session.gold} ouro</span>}
          {(Object.entries(tagCounts) as [EventTag, number][]).map(([t, n]) => (
            <EventTagChip key={t} tag={t} small count={n} />
          ))}
        </div>
        <svg
          className="session-expand-icon"
          width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {expanded && (
        <div className="session-card-details">
          <div className="session-inline-fields">
            <input
              className="session-date-input"
              type="date"
              defaultValue={session.date?.slice(0, 10) ?? ""}
              onChange={(e) => scheduleUpdate((s) => { s.date = e.target.value; })}
            />
            <input
              className="session-title-input"
              placeholder="Título"
              defaultValue={session.title}
              onChange={(e) => scheduleUpdate((s) => { s.title = e.target.value; })}
            />
            <input
              className="session-xp-input"
              type="number"
              placeholder="XP"
              defaultValue={session.xp ?? ""}
              onChange={(e) => scheduleUpdate((s) => { s.xp = e.target.value ? parseInt(e.target.value) : undefined; })}
            />
            <input
              className="session-gold-input"
              type="number"
              placeholder="Ouro"
              defaultValue={session.gold ?? ""}
              onChange={(e) => scheduleUpdate((s) => { s.gold = e.target.value ? parseInt(e.target.value) : undefined; })}
            />
          </div>
          <textarea
            className="session-summary-input"
            placeholder="Resumo..."
            defaultValue={session.summary}
            onChange={(e) => scheduleUpdate((s) => { s.summary = e.target.value; })}
          />
          <div className="session-participants-row">
            <input
              className="session-participants-input"
              placeholder="Participantes (separados por vírgula)"
              defaultValue={(session.participants ?? []).join(", ")}
              onChange={(e) => scheduleUpdate((s) => {
                s.participants = e.target.value.split(",").map((p) => p.trim()).filter(Boolean);
              })}
            />
            <button
              className="session-edit-btn btn btn-secondary"
              onClick={(e) => { e.stopPropagation(); setOpenModal("session", session.id); }}
            >
              Editar
            </button>
            <button
              className="session-del-btn btn btn-danger"
              onClick={(e) => { e.stopPropagation(); setOpenModal("delete", session.id); }}
            >
              Excluir
            </button>
          </div>
          <EventsList session={session} />
        </div>
      )}
    </div>
  );
}
