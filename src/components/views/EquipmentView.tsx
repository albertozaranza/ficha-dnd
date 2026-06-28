import { useCampaignStore } from "../../store/campaignStore";
import type { Money } from "../../types";

const COINS: { key: keyof Money; label: string; className: string }[] = [
  { key: "cp", label: "PC", className: "cp-coin" },
  { key: "sp", label: "PP", className: "sp-coin" },
  { key: "ep", label: "PE", className: "ep-coin" },
  { key: "gp", label: "PO", className: "gp-coin" },
  { key: "pp", label: "PL", className: "pp-coin" },
];

export function EquipmentView() {
  const equipment = useCampaignStore((s) => s.campaign.character.equipment);
  const money = useCampaignStore((s) => s.campaign.character.money);
  const updateCharacter = useCampaignStore((s) => s.updateCharacter);

  function updateItem(index: number, value: string) {
    updateCharacter((c) => { c.equipment[index] = value; });
  }

  function removeItem(index: number) {
    updateCharacter((c) => { c.equipment.splice(index, 1); });
  }

  function addItem() {
    updateCharacter((c) => { c.equipment.push(""); });
  }

  function updateMoney(key: keyof Money, value: string) {
    updateCharacter((c) => { c.money[key] = parseInt(value) || 0; });
  }

  return (
    <section id="view-equipment" className="view">
      <div className="view-header">
        <h2 className="view-title">Equipamento</h2>
        <button className="add-btn" onClick={addItem}>+ Adicionar item</button>
      </div>

      <div className="money-row">
        {COINS.map(({ key, label, className }) => (
          <div key={key} className={`coin-card ${className}`}>
            <input
              type="number"
              min="0"
              className={`coin-input${key === "gp" ? " gp-color" : key === "pp" ? " pp-color" : ""}`}
              value={money[key]}
              onChange={(e) => updateMoney(key, e.target.value)}
            />
            <div className="coin-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="equipment-list">
        {equipment.map((item, i) => (
          <div key={i} className="equipment-item">
            <span className="equipment-dot" />
            <input
              className="equipment-input"
              value={item}
              placeholder="Item..."
              onChange={(e) => updateItem(i, e.target.value)}
            />
            <button className="equip-remove" title="Remover" onClick={() => removeItem(i)}>×</button>
          </div>
        ))}
      </div>
    </section>
  );
}
