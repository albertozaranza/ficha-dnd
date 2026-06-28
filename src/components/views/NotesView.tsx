import { useRef, useCallback } from "react";
import { useCampaignStore } from "../../store/campaignStore";

export function NotesView() {
  const notes = useCampaignStore((s) => s.campaign.character.notes);
  const updateCharacter = useCampaignStore((s) => s.updateCharacter);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateCharacter((c) => { c.notes = value; });
    }, 1000);
  }, [updateCharacter]);

  return (
    <section id="view-notes" className="view">
      <div className="view-header">
        <h2 className="view-title">Notas</h2>
        <span className="muted-hint">Salvo automaticamente</span>
      </div>
      <textarea
        className="notes-fullpage"
        placeholder="Suas notas de aventura, referências de regras, lembretes de sessão..."
        defaultValue={notes}
        onChange={handleChange}
      />
    </section>
  );
}
