import { useCampaignStore } from "../../store/campaignStore";
import type { Appearance } from "../../types";

const APPEARANCE_FIELDS: { key: keyof Appearance; label: string; placeholder: string }[] = [
  { key: "age",    label: "Idade",   placeholder: "22 anos" },
  { key: "height", label: "Altura",  placeholder: "1,02 m" },
  { key: "weight", label: "Peso",    placeholder: "29 kg" },
  { key: "eyes",   label: "Olhos",   placeholder: "—" },
  { key: "skin",   label: "Pele",    placeholder: "—" },
  { key: "hair",   label: "Cabelos", placeholder: "—" },
];

export function CharacterView() {
  const char = useCampaignStore((s) => s.campaign.character);
  const updateCharacter = useCampaignStore((s) => s.updateCharacter);
  const portrait = char.appearance?.portrait;

  function handlePortraitClick() {
    (document.getElementById("portrait-upload") as HTMLInputElement)?.click();
  }

  return (
    <section id="view-character" className="view">
      <div className="view-header">
        <h2 className="view-title">Personagem</h2>
      </div>
      <div className="char-layout">
        <div className="char-col-left">
          <div className="portrait-card" id="portrait-area" onClick={handlePortraitClick}>
            {portrait ? (
              <img src={portrait} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} alt="Retrato" />
            ) : (
              <div className="portrait-placeholder">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Adicionar retrato</span>
              </div>
            )}
          </div>

          <div className="appearance-grid">
            {APPEARANCE_FIELDS.map(({ key, label, placeholder }) => (
              <div key={key} className="app-field">
                <input
                  className="app-input"
                  placeholder={placeholder}
                  value={(char.appearance[key] as string) || ""}
                  onChange={(e) => updateCharacter((c) => {
                    (c.appearance[key] as string) = e.target.value;
                  })}
                />
                <div className="app-label">{label}</div>
              </div>
            ))}
          </div>

          <div className="char-section">
            <div className="char-section-lbl">Aparência Física</div>
            <textarea className="notes-area" placeholder="Descrição física..."
              defaultValue={char.appearance.description}
              onChange={(e) => updateCharacter((c) => { c.appearance.description = e.target.value; })} />
          </div>
        </div>

        <div className="char-col-right">
          <div className="char-section">
            <div className="char-section-lbl">História do Personagem</div>
            <textarea className="notes-area" style={{ minHeight: 200 }} placeholder="História..."
              defaultValue={char.backstory}
              onChange={(e) => updateCharacter((c) => { c.backstory = e.target.value; })} />
          </div>
          <div className="char-section">
            <div className="char-section-lbl">Aliados e Organizações</div>
            <textarea className="notes-area" placeholder="Aliados..."
              defaultValue={char.allies}
              onChange={(e) => updateCharacter((c) => { c.allies = e.target.value; })} />
          </div>
          <div className="char-section">
            <div className="char-section-lbl">Tesouro</div>
            <textarea className="notes-area" placeholder="Itens especiais, tesouros..."
              defaultValue={char.treasure}
              onChange={(e) => updateCharacter((c) => { c.treasure = e.target.value; })} />
          </div>
        </div>
      </div>
    </section>
  );
}
