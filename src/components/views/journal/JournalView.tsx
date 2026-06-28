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

  return (
    <section id="view-journal" className="view">
      <div className="view-header">
        <h2 className="view-title">Diário de Sessões</h2>
        <input
          className="search-input"
          type="search"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="add-btn" onClick={() => setOpenModal("session")}>+ Nova Sessão</button>
      </div>

      <div className="tag-filter-bar">
        <button
          className={`filter-chip${tagFilter === "" ? " active" : ""}`}
          onClick={() => setTagFilter("")}
        >
          Todos
        </button>
        {EVENT_TAGS.map((tag) => (
          <button
            key={tag}
            className={`filter-chip${tagFilter === tag ? " active" : ""}`}
            onClick={() => setTagFilter((prev) => (prev === tag ? "" : tag))}
          >
            {tag}
          </button>
        ))}
      </div>

      <div id="journal-area">
        {filtered.length === 0 ? (
          <div className="empty-state">
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
