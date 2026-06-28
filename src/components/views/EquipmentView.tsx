import { useCampaignStore } from "../../store/campaignStore";
import type { Money } from "../../types";

const COINS: { key: keyof Money; label: string; color?: string }[] = [
  { key: "cp", label: "PC" },
  { key: "sp", label: "PP" },
  { key: "ep", label: "PE" },
  { key: "gp", label: "PO", color: "text-(--amber)!" },
  { key: "pp", label: "PL", color: "text-(--purple)!" },
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
      <div className="flex items-center justify-between mb-7 pb-4 border-b border-(--border) flex-wrap gap-3">
        <h2 className="font-cinzel text-[22px] font-bold text-(--text-1) tracking-[0.02em]">Equipamento</h2>
        <button
          className="inline-flex items-center gap-1 px-3 py-1.25 rounded-lg border border-dashed border-(--border-hi) bg-transparent text-(--text-2) text-xs font-medium cursor-pointer transition-all duration-150 hover:bg-(--bg-hover) hover:text-(--text-1) hover:border-(--accent) hover:border-solid"
          onClick={addItem}>
          + Adicionar item
        </button>
      </div>

      {/* Moedas */}
      <div className="flex gap-2.5 mb-6">
        {COINS.map(({ key, label, color }) => (
          <div key={key} className="flex-1 bg-(--bg-surface) border border-(--border) rounded-2xl pt-3.5 px-2 pb-2.5 text-center">
            <input
              type="number"
              min="0"
              className={`font-cinzel text-[22px] font-bold bg-transparent border-none outline-none w-full text-center text-(--text-1) block mb-1 focus:text-(--accent) ${color ?? ""}`}
              value={money[key]}
              onChange={(e) => updateMoney(key, e.target.value)}
            />
            <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-(--text-3)">{label}</div>
          </div>
        ))}
      </div>

      {/* Itens */}
      <div className="flex flex-col gap-1.5">
        {equipment.map((item, i) => (
          <div key={i} className="group flex items-center gap-2.5 px-3.5 py-2.5 bg-(--bg-surface) border border-(--border) rounded-xl transition-all duration-150 hover:border-(--border-hi)">
            <span className="w-1.5 h-1.5 rounded-full bg-(--border-hi) shrink-0" />
            <input
              className="flex-1 bg-transparent border-none outline-none text-(--text-1) text-[13px] focus:text-(--accent)"
              value={item}
              placeholder="Item..."
              onChange={(e) => updateItem(i, e.target.value)}
            />
            <button
              className="flex items-center justify-center w-5.5 h-5.5 rounded-[5px] border-none bg-transparent text-(--text-3) cursor-pointer text-[15px] opacity-0 group-hover:opacity-100 transition-all duration-150 hover:bg-(--red-sub) hover:text-(--red)"
              title="Remover"
              onClick={() => removeItem(i)}>×</button>
          </div>
        ))}
      </div>
    </section>
  );
}
