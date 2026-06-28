import { Storage } from "./storage";
import type { Campaign, Character } from "./types";
import { Journal } from "./journal";

// ─── Vanilla state (used by Journal only) ─────────────────────
let campaign: Campaign = Storage.load();
let char: Character = campaign.character;

// ─── DOM helper ───────────────────────────────────────────────
const $ = (sel: string): HTMLElement | null => document.querySelector(sel);

// ─── Dirty tracking for Journal auto-save ─────────────────────
function markDirty() {
  campaign.character = char;
  campaign.name = char.meta.name ? `${char.meta.name} Campaign` : campaign.name;
  Storage.scheduleSave(campaign);
}

// ─── Journal render ───────────────────────────────────────────
function renderAll() {
  Journal.render();
}

// ─── Boot: called by React App on mount ───────────────────────
export function initViewsVanilla() {
  Journal.init(campaign, markDirty);
  renderAll();
}

// ─── Toolbar actions: called from React SidebarFooter ─────────
export function saveNow(): boolean {
  campaign.character = char;
  return Storage.save(campaign);
}

export function exportNow() {
  Storage.exportJSON(campaign);
}

export async function importNow(file: File): Promise<void> {
  campaign = await Storage.importJSON(file);
  char = campaign.character;
  Storage.save(campaign);
  renderAll();
}

export function resetNow() {
  campaign = Storage.reset();
  char = campaign.character;
  Storage.save(campaign);
  renderAll();
}
