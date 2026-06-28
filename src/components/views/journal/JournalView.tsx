import { useState, useMemo } from "react";
import { useCampaignStore } from "../../../store/campaignStore";
import { useUIStore } from "../../../store/uiStore";
import { EVENT_TAGS } from "../../../lib/constants";
import { SessionCard } from "./SessionCard";
import { SessionModal } from "./SessionModal";
import { DeleteModal } from "./DeleteModal";
import type { EventTag } from "../../../types";

function matchesSearch(sess: import("../../../types").Session, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return (
    sess.title?.toLowerCase().includes(q) ||
    sess.summary?.toLowerCase().includes(q) ||
    (sess.participants ?? []).some((p) => p.toLowerCase().includes(q)) ||
    (sess.events ?? []).some((e) => e.text.toLowerCase().includes(q))
  );
}

function matchesTagFilter(sess: import("../../../types").Session, tag: EventTag | ""): boolean {
  if (!tag) return true;
  return (sess.events ?? []).some((e) => e.tags.includes(tag));
}

export function JournalView() {
  const sessions = useCampaignStore((s) => s.campaign.sessions);
  const { setOpenModal } = useUIStore();
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<EventTag | "">("");

  const filtered = useMemo(() =>
    sessions
      .filter((s) => matchesSearch(s, search) && matchesTagFilter(s, tagFilter))
      .sort((a, b) => b.number - a.number),
    [sessions, search, tagFilter]
  );

  const chipBase = "px-3 py-1 rounded-full border text-xs font-medium cursor-pointer transition-all duration-150";

  return (
    <section id="view-journal" className="view">
      <div className="flex items-center justify-between mb-7 pb-4 border-b border-(--border) flex-wrap gap-3">
        <h2 className="font-cinzel text-[22px] font-bold text-(--text-1) tracking-[0.02em]">Diário de Sessões</h2>
        <div className="flex items-center gap-2">
          <input
            className="bg-(--bg-surface) border border-(--border) rounded-xl py-1.75 px-3 text-(--text-1) text-[13px] outline-none w-45 transition-[border-color,width] duration-150 focus:border-(--accent) focus:w-55"
            type="search" placeholder="Buscar..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
          <button
            className="inline-flex items-center gap-1 px-3 py-1.25 rounded-lg border border-dashed border-(--border-hi) bg-transparent text-(--text-2) text-xs font-medium cursor-pointer transition-all duration-150 hover:bg-(--bg-hover) hover:text-(--text-1) hover:border-(--accent) hover:border-solid"
            onClick={() => setOpenModal("session")}>
            + Nova Sessão
          </button>
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap pb-3.5">
        <button
          className={`${chipBase} ${tagFilter === "" ? "bg-(--accent) border-(--accent) text-white" : "border-(--border) bg-(--bg-elevated) text-(--text-2) hover:border-(--border-hi) hover:text-(--text-1)"}`}
          onClick={() => setTagFilter("")}
        >
          Todos
        </button>
        {EVENT_TAGS.map((tag) => (
          <button
            key={tag}
            className={`${chipBase} ${tagFilter === tag ? "bg-(--accent) border-(--accent) text-white" : "border-(--border) bg-(--bg-elevated) text-(--text-2) hover:border-(--border-hi) hover:text-(--text-1)"}`}
            onClick={() => setTagFilter((prev) => (prev === tag ? "" : tag))}
          >
            {tag}
          </button>
        ))}
      </div>

      <div id="journal-area">
        {filtered.length === 0 ? (
          <div className="text-(--text-3) p-4.5 bg-(--bg-elevated) rounded-xl text-center">
            {search || tagFilter
              ? `Nenhuma sessão encontrada${tagFilter ? ` com tag "${tagFilter}"` : ""}${search ? ` para "${search}"` : ""}.`
              : "Nenhuma sessão registrada. Comece agora."}
          </div>
        ) : (
          filtered.map((sess) => <SessionCard key={sess.id} session={sess} />)
        )}
      </div>

      <SessionModal />
      <DeleteModal />
    </section>
  );
}
