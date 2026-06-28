import { Storage } from "./storage";

// ─── Toolbar actions: called from React SidebarFooter ─────────
export function saveNow(): boolean {
  return Storage.save(Storage.load());
}

export function exportNow() {
  Storage.exportJSON(Storage.load());
}

export async function importNow(file: File): Promise<void> {
  const campaign = await Storage.importJSON(file);
  Storage.save(campaign);
}

export function resetNow() {
  Storage.reset();
}
