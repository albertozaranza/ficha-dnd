import { DEFAULT_CHARACTER } from "./character-data";
import type { Campaign, Character } from "./types";

const CAMPAIGN_KEY = "dnd5e_campaign";
const LEGACY_CHARACTER_KEY = "dnd5e_character";
let saveTimer: number | undefined;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function deepMerge<T extends Record<string, any>>(target: T, source: Record<string, any>): T {
  const result: Record<string, any> = { ...target };
  for (const key of Object.keys(source || {})) {
    if (
      source[key] !== null &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      typeof target[key] === "object" &&
      target[key] !== null &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result as T;
}

function normalizeCharacter(data?: Record<string, any>): Character {
  return deepMerge(clone(DEFAULT_CHARACTER), data || {});
}

function nowIso(): string {
  return new Date().toISOString();
}

function newId(): string {
  return crypto.randomUUID?.() || `campaign-${Date.now()}`;
}

function createCampaign(character = clone(DEFAULT_CHARACTER)): Campaign {
  const now = nowIso();
  return {
    id: newId(),
    name: character.meta?.name ? `${character.meta.name} Campaign` : "Nova campanha",
    createdAt: now,
    updatedAt: now,
    character,
    sessions: [],
    npcs: [],
    quests: [],
    monsters: [],
    locations: [],
    factions: [],
    artifacts: [],
  };
}

function normalizeCampaign(data?: Record<string, any>): Campaign {
  const base = createCampaign();
  if (!data) return base;
  const campaign = deepMerge(base, data);
  campaign.character = normalizeCharacter(data.character || data);
  campaign.sessions ||= [];
  campaign.npcs ||= [];
  campaign.quests ||= [];
  campaign.monsters ||= [];
  campaign.locations ||= [];
  campaign.factions ||= [];
  campaign.artifacts ||= [];
  return campaign;
}

function save(campaign: Campaign): boolean {
  try {
    localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(campaign));
    return true;
  } catch {
    return false;
  }
}

function load(): Campaign {
  try {
    const rawCampaign = localStorage.getItem(CAMPAIGN_KEY);
    if (rawCampaign) {
      return normalizeCampaign(JSON.parse(rawCampaign));
    }

    const rawLegacyCharacter = localStorage.getItem(LEGACY_CHARACTER_KEY);
    if (rawLegacyCharacter) {
      const campaign = createCampaign(normalizeCharacter(JSON.parse(rawLegacyCharacter)));
      save(campaign);
      return campaign;
    }
  } catch {
    return createCampaign();
  }

  return createCampaign();
}

function reset(): Campaign {
  localStorage.removeItem(CAMPAIGN_KEY);
  return createCampaign();
}

function scheduleSave(campaign: Campaign, onSave?: (ok: boolean) => void): void {
  clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    const ok = save(campaign);
    onSave?.(ok);
  }, 300);
}

function exportJSON(campaign: Campaign): void {
  const blob = new Blob([JSON.stringify(campaign, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${campaign.name || campaign.character.meta.name || "campanha"}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importJSON(file: File): Promise<Campaign> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(String(e.target?.result || "{}"));
        resolve(normalizeCampaign(data));
      } catch {
        reject(new Error("JSON inválido"));
      }
    };
    reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
    reader.readAsText(file);
  });
}

export const Storage = {
  save,
  load,
  reset,
  scheduleSave,
  exportJSON,
  importJSON,
};
