import { useRef } from "react";
import { useUIStore } from "../../store/uiStore";

interface SidebarFooterProps {
  onSave: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
  onPrint: () => void;
}

export function SidebarFooter({ onSave, onExport, onImport, onReset, onPrint }: SidebarFooterProps) {
  const isDark = useUIStore((s) => s.isDark);
  const toggleDark = useUIStore((s) => s.toggleDark);
  const saveStatus = useUIStore((s) => s.saveStatus);
  const importRef = useRef<HTMLInputElement>(null);

  const saveLabel = saveStatus === "saved" ? "✓ Salvo" : saveStatus === "error" ? "⚠ Erro" : "";
  const indicatorVisible = saveStatus === "saved" || saveStatus === "error";

  const actionBtn = "flex items-center justify-center w-7 h-7 rounded-lg border border-(--border) bg-transparent text-(--text-2) cursor-pointer transition-all duration-150 hover:bg-(--bg-hover) hover:text-(--text-1) hover:border-(--border-hi)";

  return (
    <div className="sidebar-footer p-4 border-t border-(--border) flex flex-col gap-2 shrink-0">
      <div className="flex gap-1 flex-wrap">
        <button className={actionBtn} title="Salvar" onClick={onSave}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
        </button>

        <button className={actionBtn} title="Exportar JSON" onClick={onExport}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>

        <button className={actionBtn} title="Importar JSON" onClick={() => importRef.current?.click()}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </button>
        <input
          ref={importRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImport(file);
            e.target.value = "";
          }}
        />

        <button className={actionBtn} title="Imprimir" onClick={onPrint}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
        </button>

        <button className={actionBtn} title="Alternar tema" onClick={toggleDark}>
          {isDark ? (
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          ) : (
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          )}
        </button>

        <button
          className={`${actionBtn} hover:bg-(--red-sub)! hover:text-(--red)! hover:border-(--red)!`}
          title="Resetar personagem"
          onClick={onReset}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
          </svg>
        </button>
      </div>

      <span className={`text-[11px] text-(--green) h-3.5 transition-opacity duration-400 ${indicatorVisible ? "opacity-100" : "opacity-0"}`}>
        {saveLabel}
      </span>
    </div>
  );
}
