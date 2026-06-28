import { useState, useEffect } from "react";
import { useCampaignStore } from "../../../store/campaignStore";
import { useUIStore } from "../../../store/uiStore";
import { EVENT_TAGS, TAG_COLOR } from "../../../lib/constants";
import { EventTagChip } from "./EventTagChip";
import type { SessionEvent, EventTag } from "../../../types";

const formInput = "w-full bg-(--bg-elevated) border border-(--border) rounded-lg px-3 py-2.5 text-(--text-1) text-sm transition-all duration-150 outline-none focus:border-(--accent) placeholder:text-(--text-3)";
const fieldInput = "bg-(--bg-elevated) border border-(--border) rounded-lg px-2 py-1.5 text-(--text-1) text-[13px] outline-none transition-all duration-150 focus:border-(--accent)";
const btnBase = "px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 border-none";

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
      setSummary(""); setParticipants(""); setXp(""); setGold(""); setEvents([]);
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

  function save() {
    const now = new Date().toISOString();
    const parts = participants.split(",").map((s) => s.trim()).filter(Boolean);
    if (editing) {
      updateSession(editing.id, (s) => {
        s.date = date; s.title = title; s.summary = summary;
        s.participants = parts; s.events = events;
        s.xp = xp ? parseInt(xp) : undefined;
        s.gold = gold ? parseInt(gold) : undefined;
      });
    } else {
      const number = sessions.length ? Math.max(...sessions.map((s) => s.number)) + 1 : 1;
      addSession({ id: crypto.randomUUID(), number, date, title, summary, participants: parts, events,
        xp: xp ? parseInt(xp) : undefined, gold: gold ? parseInt(gold) : undefined, createdAt: now, updatedAt: now });
    }
    setOpenModal(null);
  }

  function close() { setOpenModal(null); }

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative z-1001 bg-(--bg-surface) border border-(--border) rounded-2xl max-w-120 w-[90vw] max-h-[90vh] flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        <div className="flex justify-between items-center p-5 border-b border-(--border)">
          <h3 className="text-lg font-semibold text-(--text-1) m-0">{editing ? "Editar Sessão" : "Nova Sessão"}</h3>
          <button className="bg-transparent border-none text-(--text-3) text-2xl cursor-pointer p-0 w-8 h-8 flex items-center justify-center transition-all duration-150 hover:text-(--text-2)" onClick={close}>×</button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          <div className="mb-4">
            <label className="block text-[13px] font-medium text-(--text-2) mb-1.5">Data</label>
            <input type="date" className={formInput} value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block text-[13px] font-medium text-(--text-2) mb-1.5">Título</label>
            <input type="text" className={formInput} placeholder="Título da sessão" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-[13px] font-medium text-(--text-2) mb-1.5">XP</label>
              <input type="number" className={formInput} placeholder="0" value={xp} onChange={(e) => setXp(e.target.value)} />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-(--text-2) mb-1.5">Ouro</label>
              <input type="number" className={formInput} placeholder="0" value={gold} onChange={(e) => setGold(e.target.value)} />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-[13px] font-medium text-(--text-2) mb-1.5">Resumo</label>
            <textarea className={`${formInput} h-30 resize-none`} placeholder="O que aconteceu nesta sessão..." value={summary} onChange={(e) => setSummary(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block text-[13px] font-medium text-(--text-2) mb-1.5">Participantes</label>
            <input type="text" className={formInput} placeholder="Nomes separados por vírgula" value={participants} onChange={(e) => setParticipants(e.target.value)} />
          </div>
          <div className="mb-4">
            <label className="block text-[13px] font-medium text-(--text-2) mb-1.5">Eventos</label>
            <div className="flex flex-col gap-1 mb-1">
              {events.map((ev) => (
                <div key={ev.id} className="flex items-center gap-1.5 px-2 py-1.25 bg-(--bg-elevated) rounded-lg text-[13px]">
                  <div className="flex gap-1 shrink-0">{ev.tags.map((t) => <EventTagChip key={t} tag={t} />)}</div>
                  <span className="flex-1 text-(--text-1)">{ev.text}</span>
                  <button className="bg-transparent border-none text-(--text-3) text-base cursor-pointer px-0.5 leading-none shrink-0 transition-all duration-150 hover:text-(--red)" aria-label="Remover" onClick={() => setEvents((prev) => prev.filter((e) => e.id !== ev.id))}>×</button>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5 mt-1.5">
              <input type="text" className={`${fieldInput} w-full`} placeholder="Descreva o evento..."
                value={newEventText} onChange={(e) => setNewEventText(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addEvent(); } }} />
              <div className="flex gap-1 flex-wrap">
                {EVENT_TAGS.map((tag) => (
                  <button key={tag} type="button"
                    className={`add-event-tag-btn px-2.5 py-0.75 rounded-full border border-(--border) bg-(--bg-elevated) text-(--text-2) text-[11px] font-semibold cursor-pointer transition-all duration-150${selectedTags.has(tag) ? " selected" : ""}`}
                    style={{ "--tag-color": TAG_COLOR[tag] } as React.CSSProperties}
                    onClick={() => toggleTag(tag)}>
                    {tag}
                  </button>
                ))}
              </div>
              <button type="button" className="self-start px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150 bg-(--bg-elevated) text-(--text-2) border border-(--border) hover:bg-(--bg-base)" onClick={addEvent}>
                + Adicionar
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-3 p-5 border-t border-(--border) justify-end">
          <button className={`${btnBase} bg-(--bg-elevated) text-(--text-2) border border-(--border) hover:bg-(--bg-base)`} onClick={close}>Cancelar</button>
          <button className={`${btnBase} bg-(--accent) text-white hover:opacity-90`} onClick={save}>Salvar Sessão</button>
        </div>
      </div>
    </div>
  );
}
