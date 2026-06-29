import { useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { useCampaignStore } from "../../../store/campaignStore";
import { useUIStore } from "../../../store/uiStore";
import { EVENT_TAGS, TAG_COLOR } from "../../../lib/constants";
import { EventTagChip } from "./EventTagChip";
import type { Session, SessionEvent, EventTag } from "../../../types";

const fieldInput = "bg-(--bg-elevated) border border-(--border) rounded-lg px-2 py-1.5 text-(--text-1) text-[13px] outline-none transition-all duration-150 focus:border-(--accent)";
const btnBase = "px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150 border";
const btnSecondary = `${btnBase} bg-(--bg-elevated) text-(--text-2) border-(--border) hover:bg-(--bg-base)`;
const btnDanger = `${btnBase} bg-(--red) text-white border-(--red) hover:opacity-90`;

interface EventsListProps { session: Session; }

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
    <div className="mt-1">
      <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-(--text-3) mb-2">Eventos</div>
      <div className="flex flex-col gap-1 mb-2">
        {(session.events ?? []).map((ev) => (
          <div key={ev.id} className="flex items-center gap-1.5 px-2 py-1.25 bg-(--bg-elevated) rounded-lg text-[13px]">
            <div className="flex gap-1 shrink-0">
              {ev.tags.map((t) => <EventTagChip key={t} tag={t} />)}
            </div>
            <span className="flex-1 text-(--text-1)">{ev.text}</span>
            <button
              className="bg-transparent border-none text-(--text-3) text-base cursor-pointer px-0.5 leading-none shrink-0 transition-all duration-150 hover:text-(--red)"
              aria-label="Remover evento"
              onClick={() => removeEvent(ev.id)}>×</button>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1.5">
        <input
          type="text"
          className={`${fieldInput} w-full`}
          placeholder="Descreva o evento..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") addEvent(); }}
        />
        <div className="flex gap-1 flex-wrap">
          {EVENT_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`add-event-tag-btn px-2.5 py-0.75 rounded-full border border-(--border) bg-(--bg-elevated) text-(--text-2) text-[11px] font-semibold cursor-pointer transition-all duration-150${selectedTags.has(tag) ? " selected" : ""}`}
              style={{ "--tag-color": TAG_COLOR[tag] } as React.CSSProperties}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <button type="button" className={`${btnSecondary} self-start text-xs`} onClick={addEvent}>
          + Adicionar
        </button>
      </div>
    </div>
  );
}

interface SessionCardProps { session: Session; }

export function SessionCard({ session }: SessionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editingSummary, setEditingSummary] = useState(false);
  const updateSession = useCampaignStore((s) => s.updateSession);
  const { setOpenModal } = useUIStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleUpdate = useCallback((updater: (s: Session) => void) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { updateSession(session.id, updater); }, 1000);
  }, [session, updateSession]);

  const tagCounts = (session.events ?? []).reduce<Partial<Record<EventTag, number>>>((acc, ev) => {
    ev.tags.forEach((t) => { acc[t] = (acc[t] ?? 0) + 1; });
    return acc;
  }, {});

  return (
    <div className="bg-(--bg-surface) border border-(--border) rounded-xl p-3 mb-2.5 transition-all duration-150 hover:border-(--border-hi)">
      <div className="flex gap-2 items-center cursor-pointer select-none pb-2" onClick={() => setExpanded((v) => !v)}>
        <span className="font-bold min-w-8">#{session.number}</span>
        <span className="text-(--text-3) text-xs min-w-22.5">
          {new Date(session.date + "T12:00:00").toLocaleDateString("pt-BR")}
        </span>
        <span className="flex-1 font-semibold">{session.title}</span>
        <div className="flex gap-1 items-center flex-wrap">
          {session.xp != null && <span className="text-[11px] px-1.75 py-0.5 rounded-full font-semibold bg-[#7c6af722] text-[#7c6af7]">+{session.xp} XP</span>}
          {session.gold != null && <span className="text-[11px] px-1.75 py-0.5 rounded-full font-semibold bg-[#f59e0b22] text-[#f59e0b]">+{session.gold} ouro</span>}
          {(Object.entries(tagCounts) as [EventTag, number][]).map(([t, n]) => (
            <EventTagChip key={t} tag={t} small count={n} />
          ))}
        </div>
        <svg
          className="opacity-60 shrink-0"
          width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {expanded && (
        <div className="border-t border-(--border) pt-2.5">
          <div className="flex gap-2 mb-2 flex-wrap">
            <input className={`${fieldInput} w-35`} type="date"
              defaultValue={session.date?.slice(0, 10) ?? ""}
              onChange={(e) => scheduleUpdate((s) => { s.date = e.target.value; })} />
            <input className={`${fieldInput} flex-1`} placeholder="Título"
              defaultValue={session.title}
              onChange={(e) => scheduleUpdate((s) => { s.title = e.target.value; })} />
            <input className={`${fieldInput} w-20`} type="number" placeholder="XP"
              defaultValue={session.xp ?? ""}
              onChange={(e) => scheduleUpdate((s) => { s.xp = e.target.value ? parseInt(e.target.value) : undefined; })} />
            <input className={`${fieldInput} w-22.5`} type="number" placeholder="Ouro"
              defaultValue={session.gold ?? ""}
              onChange={(e) => scheduleUpdate((s) => { s.gold = e.target.value ? parseInt(e.target.value) : undefined; })} />
          </div>
          {editingSummary ? (
            <textarea
              autoFocus
              className={`${fieldInput} w-full h-36 resize-none mb-2`}
              placeholder="Resumo... (suporta markdown)"
              defaultValue={session.summary}
              onChange={(e) => scheduleUpdate((s) => { s.summary = e.target.value; })}
              onBlur={() => setEditingSummary(false)}
            />
          ) : (
            <div
              className="w-full min-h-9 mb-2 px-2 py-1.5 rounded-lg border border-(--border) bg-(--bg-elevated) text-[13px] text-(--text-2) cursor-text transition-all duration-150 hover:border-(--accent) prose-sm"
              onClick={() => setEditingSummary(true)}
              title="Clique para editar"
            >
              {session.summary ? (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="m-0 mb-1 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="text-(--text-1) font-semibold">{children}</strong>,
                    em: ({ children }) => <em className="text-(--text-2)">{children}</em>,
                    ul: ({ children }) => <ul className="list-disc pl-4 my-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-4 my-1">{children}</ol>,
                    li: ({ children }) => <li className="mb-0.5">{children}</li>,
                    h1: ({ children }) => <h1 className="text-base font-bold text-(--text-1) mt-1 mb-0.5">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-[13px] font-bold text-(--text-1) mt-1 mb-0.5">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-[13px] font-semibold text-(--text-1) mt-1 mb-0.5">{children}</h3>,
                    code: ({ children }) => <code className="bg-(--bg-base) px-1 py-0.5 rounded text-[12px] font-mono text-(--accent)">{children}</code>,
                    blockquote: ({ children }) => <blockquote className="border-l-2 border-(--accent) pl-2 my-1 text-(--text-3) italic">{children}</blockquote>,
                    hr: () => <hr className="border-(--border) my-1" />,
                  }}
                >
                  {session.summary}
                </ReactMarkdown>
              ) : (
                <span className="text-(--text-3) italic">Resumo... (clique para editar)</span>
              )}
            </div>
          )}
          <div className="flex gap-2 items-center mb-3">
            <input
              className={`${fieldInput} flex-1`}
              placeholder="Participantes (separados por vírgula)"
              defaultValue={(session.participants ?? []).join(", ")}
              onChange={(e) => scheduleUpdate((s) => {
                s.participants = e.target.value.split(",").map((p) => p.trim()).filter(Boolean);
              })}
            />
            <button className={btnSecondary} onClick={(e) => { e.stopPropagation(); setOpenModal("session", session.id); }}>
              Editar
            </button>
            <button className={btnDanger} onClick={(e) => { e.stopPropagation(); setOpenModal("delete", session.id); }}>
              Excluir
            </button>
          </div>
          <EventsList session={session} />
        </div>
      )}
    </div>
  );
}
