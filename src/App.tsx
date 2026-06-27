import { useEffect } from "react";
import { useAutoSave } from "./hooks/useAutoSave";
import { useUIStore } from "./store/uiStore";
import { useCampaignStore } from "./store/campaignStore";
import { Storage } from "./storage";
import { Sidebar } from "./components/layout/Sidebar";
import {
  initViewsVanilla,
  initKeyboardVanilla,
  saveNow,
  exportNow,
  importNow,
  resetNow,
  renderAll,
} from "./main";

export default function App() {
  const activeView = useUIStore((s) => s.activeView);
  const isDark = useUIStore((s) => s.isDark);
  const setSaveStatus = useUIStore((s) => s.setSaveStatus);
  const importCampaign = useCampaignStore((s) => s.importCampaign);
  const resetCampaign = useCampaignStore((s) => s.resetCampaign);

  useAutoSave();

  // Apply theme on mount and when toggled
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("light", !isDark);
  }, [isDark]);

  // Switch active view by toggling CSS classes on vanilla view sections
  useEffect(() => {
    document.querySelectorAll<HTMLElement>(".view").forEach((v) =>
      v.classList.remove("active")
    );
    document.getElementById(`view-${activeView}`)?.classList.add("active");
  }, [activeView]);

  // Boot vanilla view rendering once on mount
  useEffect(() => {
    initViewsVanilla();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const navViews: Record<string, string> = {
      c: "combat",
      n: "notes",
      o: "overview",
    };

    function onKey(e: KeyboardEvent) {
      if ((e.target as HTMLElement).matches("input, textarea, select")) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "s" || e.key === "S") {
        const ok = saveNow();
        setSaveStatus(ok ? "saved" : "error");
        setTimeout(() => setSaveStatus("idle"), 1800);
        return;
      }

      const view = navViews[e.key.toLowerCase()];
      if (view) useUIStore.getState().setActiveView(view);
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setSaveStatus]);

  // Toolbar action handlers passed to sidebar footer
  function handleSave() {
    const ok = saveNow();
    setSaveStatus(ok ? "saved" : "error");
    setTimeout(() => setSaveStatus("idle"), 1800);
  }

  function handleExport() {
    exportNow();
  }

  async function handleImport(file: File) {
    await importNow(file);
    const loaded = Storage.load();
    importCampaign(loaded);
    renderAll();
  }

  function handleReset() {
    if (!confirm("Resetar para os dados originais? Todas as alterações serão perdidas.")) return;
    resetNow();
    const loaded = Storage.load();
    resetCampaign();
    importCampaign(loaded);
  }

  return (
    <Sidebar
      onSave={handleSave}
      onExport={handleExport}
      onImport={handleImport}
      onReset={handleReset}
      onPrint={() => window.print()}
    />
  );
}
