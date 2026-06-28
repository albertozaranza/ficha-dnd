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

  return (
    <div className="modal" style={{ display: "flex" }} onClick={(e) => { if (e.target === e.currentTarget) setOpenModal(null); }}>
      <div className="modal-backdrop" />
      <div className="modal-container" style={{ maxWidth: 360 }}>
        <div className="modal-header">
          <h3 className="modal-title">Confirmar exclusão</h3>
        </div>
        <div className="modal-body">
          <p style={{ color: "var(--text-2)", margin: 0 }}>
            {sess
              ? `Tem certeza que deseja remover a sessão #${sess.number} ("${sess.title}")? Esta ação não pode ser desfeita.`
              : "Tem certeza que deseja remover esta sessão? Esta ação não pode ser desfeita."}
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setOpenModal(null)}>Cancelar</button>
          <button className="btn btn-danger" onClick={confirm}>Remover Sessão</button>
        </div>
      </div>
    </div>
  );
}
