export type AttrKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

export interface Skill {
  attr: AttrKey;
  proficient: boolean;
  expertise: boolean;
  label: string;
  abbr: string;
}

export interface Character {
  meta: Record<string, any>;
  appearance: Record<string, any>;
  attributes: Record<AttrKey, number>;
  savingThrows: Record<AttrKey, { proficient: boolean }>;
  skills: Record<string, Skill>;
  combat: Record<string, any>;
  attacks: Array<Record<string, any>>;
  attacksNotes: string;
  equipment: string[];
  money: Record<string, number>;
  languages: string[];
  proficiencies: Record<string, string[]>;
  personality: Record<string, string>;
  features: Array<Record<string, any>>;
  backstory: string;
  allies: string;
  treasure: string;
  spellcasting: Record<string, any>;
  notes?: string;
  [key: string]: any;
}

export interface Campaign {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  character: Character;
  sessions: Session[];
  npcs: any[];
  quests: any[];
  monsters: any[];
  locations: any[];
  factions: any[];
  artifacts: any[];
}

export type EventTag = "NPC" | "Local" | "Quest" | "Combate" | "Revelação";

export interface SessionEvent {
  id: string;
  text: string;
  tags: EventTag[];
}

export interface Session {
  id: string;
  number: number;
  date: string; // ISO
  title: string;
  summary: string;
  participants: string[];
  events: SessionEvent[];
  xp?: number;
  gold?: number;
  createdAt: string;
  updatedAt: string;
}
