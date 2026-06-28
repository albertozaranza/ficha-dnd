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

const notesArea = "w-full bg-(--bg-surface) border border-(--border) rounded-xl px-3.5 py-3 text-(--text-1) text-[13px] resize-y outline-none min-h-20 leading-[1.7] transition-all duration-150 focus:border-(--accent)";
const sectionLbl = "text-[10px] font-bold uppercase tracking-widest text-(--text-3) mb-2";

export function CharacterView() {
  const char = useCampaignStore((s) => s.campaign.character);
  const updateCharacter = useCampaignStore((s) => s.updateCharacter);
  const portrait = char.appearance?.portrait;

  function handlePortraitClick() {
    (document.getElementById("portrait-upload") as HTMLInputElement)?.click();
  }

  return (
    <section id="view-character" className="view">
      <div className="flex items-center justify-between mb-7 pb-4 border-b border-(--border) flex-wrap gap-3">
        <h2 className="font-cinzel text-[22px] font-bold text-(--text-1) tracking-[0.02em]">Personagem</h2>
      </div>

      <div className="grid gap-6 max-[768px]:grid-cols-1" style={{ gridTemplateColumns: "260px 1fr" }}>
        {/* Coluna esquerda */}
        <div>
          <div
            className="h-55 bg-(--bg-surface) border-2 border-dashed border-(--border-hi) rounded-[20px] flex items-center justify-center cursor-pointer mb-3.5 overflow-hidden transition-all duration-150 hover:border-(--accent)"
            id="portrait-area"
            onClick={handlePortraitClick}
          >
            {portrait ? (
              <img src={portrait} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} alt="Retrato" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-(--text-3) text-xs">
                <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Adicionar retrato</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-1.5 mb-3.5">
            {APPEARANCE_FIELDS.map(({ key, label, placeholder }) => (
              <div key={key} className="bg-(--bg-surface) border border-(--border) rounded-xl px-2.5 py-2 transition-all duration-150 focus-within:border-(--border-hi)">
                <input
                  className="bg-transparent border-none outline-none text-(--text-1) text-xs font-medium w-full block"
                  placeholder={placeholder}
                  value={(char.appearance[key] as string) || ""}
                  onChange={(e) => updateCharacter((c) => { (c.appearance[key] as string) = e.target.value; })}
                />
                <div className="text-[9px] font-bold uppercase tracking-widest text-(--text-3) mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <div className={sectionLbl}>Aparência Física</div>
            <textarea className={notesArea} placeholder="Descrição física..."
              defaultValue={char.appearance.description}
              onChange={(e) => updateCharacter((c) => { c.appearance.description = e.target.value; })} />
          </div>
        </div>

        {/* Coluna direita */}
        <div>
          <div className="mb-4">
            <div className={sectionLbl}>História do Personagem</div>
            <textarea className={`${notesArea} min-h-50`} placeholder="História..."
              defaultValue={char.backstory}
              onChange={(e) => updateCharacter((c) => { c.backstory = e.target.value; })} />
          </div>
          <div className="mb-4">
            <div className={sectionLbl}>Aliados e Organizações</div>
            <textarea className={notesArea} placeholder="Aliados..."
              defaultValue={char.allies}
              onChange={(e) => updateCharacter((c) => { c.allies = e.target.value; })} />
          </div>
          <div className="mb-4">
            <div className={sectionLbl}>Tesouro</div>
            <textarea className={notesArea} placeholder="Itens especiais, tesouros..."
              defaultValue={char.treasure}
              onChange={(e) => updateCharacter((c) => { c.treasure = e.target.value; })} />
          </div>
        </div>
      </div>
    </section>
  );
}
