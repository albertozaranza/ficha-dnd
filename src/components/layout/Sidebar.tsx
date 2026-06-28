import { SidebarHero } from "./SidebarHero";
import { SidebarNav } from "./SidebarNav";
import { SidebarFooter } from "./SidebarFooter";

interface SidebarProps {
  onSave: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
  onPrint: () => void;
}

export function Sidebar({ onSave, onExport, onImport, onReset, onPrint }: SidebarProps) {
  return (
    <aside
      id="sidebar"
      className="w-[248px] flex-shrink-0 bg-[var(--bg-surface)] border-r border-[var(--border)] flex flex-col overflow-hidden"
    >
      <SidebarHero />
      <SidebarNav />
      <SidebarFooter
        onSave={onSave}
        onExport={onExport}
        onImport={onImport}
        onReset={onReset}
        onPrint={onPrint}
      />
    </aside>
  );
}
