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
      <div className="sidebar-hero">
        <div
          className="char-avatar"
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
        <div className="sidebar-char-info">
          <input
            className="hero-name-input"
            placeholder="Nome do Personagem"
            value={char.meta.name}
            onChange={(e) => updateCharacter((c) => { c.meta.name = e.target.value; })}
          />
          <div className="hero-subtitle">{subtitle}</div>
          <div className="hero-race">{race}</div>
        </div>
      </div>
      <XpBar level={char.meta.level} xp={char.meta.experience} />
    </>
  );
}
