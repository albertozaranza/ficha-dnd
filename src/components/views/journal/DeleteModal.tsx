import { useCampaignStore } from "../../../store/campaignStore";
import { useUIStore } from "../../../store/uiStore";

export function DeleteModal() {
  const { openModal, editingSessionId, setOpenModal } = useUIStore();
  const sessions = useCampaignStore((s) => s.campaign.sessions);
  const deleteSession = useCampaignStore((s) => s.deleteSession);

  if (openModal !== "delete" || !editingSessionId) return null;

  const sess = sessions.find((s) => s.id === editingSessionId);

  function confirm() {
    if (!editingSessionId) return;
    deleteSession(editingSessionId);
    setOpenModal(null);
  }

  const btnBase = "px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 border-none";

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) setOpenModal(null); }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative z-1001 bg-(--bg-surface) border border-(--border) rounded-2xl max-w-90 w-[90vw] flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        <div className="flex justify-between items-center p-5 border-b border-(--border)">
          <h3 className="text-lg font-semibold text-(--text-1) m-0">Confirmar exclusão</h3>
        </div>
        <div className="p-5">
          <p className="text-(--text-2) m-0">
            {sess
              ? `Tem certeza que deseja remover a sessão #${sess.number} ("${sess.title}")? Esta ação não pode ser desfeita.`
              : "Tem certeza que deseja remover esta sessão? Esta ação não pode ser desfeita."}
          </p>
        </div>
        <div className="flex gap-3 p-5 border-t border-(--border) justify-end">
          <button className={`${btnBase} bg-(--bg-elevated) text-(--text-2) border border-(--border) hover:bg-(--bg-base)`} onClick={() => setOpenModal(null)}>Cancelar</button>
          <button className={`${btnBase} bg-(--red) text-white hover:opacity-90`} onClick={confirm}>Remover Sessão</button>
        </div>
      </div>
    </div>
  );
}
