import type { AttrKey } from "../types";

export const CONDITIONS = [
  "Cego", "Enfeitiçado", "Ensurdecido", "Amedrontado", "Agarrado",
  "Incapacitado", "Invisível", "Paralisado", "Petrificado", "Envenenado",
  "Caído", "Restrito", "Atordoado", "Inconsciente", "Exausto",
] as const;

export type Condition = typeof CONDITIONS[number];

export const ATTR_KEYS: AttrKey[] = ["str", "dex", "con", "int", "wis", "cha"];

export const ATTR_ABBR: Record<AttrKey, string> = {
  str: "FOR", dex: "DES", con: "CON", int: "INT", wis: "SAB", cha: "CAR",
};

export const ATTR_FULL: Record<AttrKey, string> = {
  str: "Força", dex: "Destreza", con: "Constituição",
  int: "Inteligência", wis: "Sabedoria", cha: "Carisma",
};

export const SKILL_GROUPS: Record<AttrKey, string[]> = {
  str: ["athletics"],
  dex: ["acrobatics", "sleightOfHand", "stealth"],
  con: [],
  int: ["arcana", "history", "investigation", "nature", "religion"],
  wis: ["animalHandling", "insight", "medicine", "perception", "survival"],
  cha: ["deception", "intimidation", "performance", "persuasion"],
};

export const XP_THRESHOLDS = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
  85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000, Infinity,
];

export type NavItem = {
  id: string;
  label: string;
  icon: string;
};

export const NAV_ITEMS: NavItem[] = [
  { id: "overview",   label: "Visão Geral",  icon: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>' },
  { id: "combat",     label: "Combate",       icon: '<path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6 2 2-6 6-2-2z"/><path d="M3 21l3.75-3.75"/>' },
  { id: "skills",     label: "Perícias",      icon: '<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/>' },
  { id: "equipment",  label: "Equipamento",   icon: '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>' },
  { id: "features",   label: "Habilidades",   icon: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>' },
  { id: "spells",     label: "Magias",        icon: '<path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z"/>' },
  { id: "character",  label: "Personagem",    icon: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
  { id: "notes",      label: "Notas",         icon: '<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>' },
  { id: "journal",    label: "Diário",        icon: '<path d="M3 5h14v14H3z"/><path d="M7 9h6"/>' },
];

export const EVENT_TAGS = ["NPC", "Local", "Quest", "Combate", "Revelação"] as const;
export type EventTag = typeof EVENT_TAGS[number];

export const TAG_COLOR: Record<EventTag, string> = {
  NPC:       "#7c6af7",
  Local:     "#22c55e",
  Quest:     "#f59e0b",
  Combate:   "#ef4444",
  Revelação: "#06b6d4",
};
