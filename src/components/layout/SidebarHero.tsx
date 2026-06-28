import { useMemo } from "react";
import { useCampaignStore } from "../../store/campaignStore";
import { XpBar } from "./XpBar";

export function SidebarHero() {
  const char = useCampaignStore((s) => s.campaign.character);
  const updateCharacter = useCampaignStore((s) => s.updateCharacter);

  const initials = useMemo(() => {
    const name = char.meta.name || "?";
    const parts = name.split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  }, [char.meta.name]);

  const subtitle = [
    char.meta.class || "—",
    char.meta.subclass ? " · " + char.meta.subclass : "",
    " · Nv. ",
    char.meta.level,
  ].join("");

  const race = [char.meta.race || "", char.meta.subrace ? " · " + char.meta.subrace : ""].join("");

  return (
    <>
      <div className="sidebar-hero flex items-center gap-2.5 p-4 border-b border-(--border) shrink-0">
        <div
          className="char-avatar w-12 h-12 rounded-xl bg-(--accent-sub) border-2 border-(--accent) flex items-center justify-center cursor-pointer shrink-0 overflow-hidden font-cinzel font-bold text-base text-(--accent) hover:shadow-[0_0_0_3px_var(--accent-sub)] transition-shadow duration-150"
          id="char-avatar"
          title="Trocar retrato"
          onClick={() => (document.getElementById("portrait-upload") as HTMLInputElement)?.click()}
        >
          {char.appearance?.portrait ? (
            <img
              src={char.appearance.portrait}
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }}
              alt="Retrato"
            />
          ) : (
            <span id="avatar-initials">{initials}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <input
            className="w-full bg-transparent border-none outline-none text-sm font-bold text-(--text-1) p-0 leading-[1.3] focus:text-(--accent)"
            placeholder="Nome do Personagem"
            value={char.meta.name}
            onChange={(e) => updateCharacter((c) => { c.meta.name = e.target.value; })}
          />
          <div className="text-[11px] text-(--text-2) mt-0.5">{subtitle}</div>
          <div className="text-[11px] text-(--text-3)">{race}</div>
        </div>
      </div>
      <XpBar level={char.meta.level} xp={char.meta.experience} />
    </>
  );
}
