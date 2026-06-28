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
      <div className="flex items-center justify-between mb-7 pb-4 border-b border-(--border) flex-wrap gap-3">
        <h2 className="font-cinzel text-[22px] font-bold text-(--text-1) tracking-[0.02em]">Notas</h2>
        <span className="text-xs text-(--text-3)">Salvo automaticamente</span>
      </div>
      <textarea
        className="w-full min-h-[calc(100vh-160px)] bg-transparent border-none outline-none text-(--text-1) text-sm leading-[1.8] resize-none"
        placeholder="Suas notas de aventura, referências de regras, lembretes de sessão..."
        defaultValue={notes}
        onChange={handleChange}
      />
    </section>
  );
}
