export type AttrKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

export interface Skill {
  attr: AttrKey;
  proficient: boolean;
  expertise: boolean;
  label: string;
  abbr: string;
}

export interface CharacterMeta {
  name: string;
  class: string;
  subclass: string;
  level: number;
  background: string;
  player: string;
  race: string;
  subrace: string;
  alignment: string;
  experience: number;
  inspiration: boolean;
}

export interface Appearance {
  age: string;
  height: string;
  weight: string;
  eyes: string;
  skin: string;
  hair: string;
  description: string;
  portrait: string;
}

export interface HP {
  max: number;
  current: number;
  temp: number;
}

export interface HitDice {
  total: string;
  remaining: string;
}

export interface DeathSaves {
  successes: number;
  failures: number;
}

export interface Combat {
  ac: number;
  speed: string;
  hp: HP;
  hitDice: HitDice;
  deathSaves: DeathSaves;
  conditions: string[];
}

export interface Attack {
  name: string;
  bonus: string;
  damage: string;
  type: string;
}

export interface Money {
  cp: number;
  sp: number;
  ep: number;
  gp: number;
  pp: number;
}

export interface Proficiencies {
  armor: string[];
  weapons: string[];
  tools: string[];
}

export interface Personality {
  traits: string;
  ideals: string;
  bonds: string;
  flaws: string;
}

export interface Feature {
  name: string;
  source: string;
  description: string;
}

export interface Spell {
  name: string;
  prepared: boolean;
}

export interface SpellSlot {
  total: number;
  used: number;
  spells: Spell[];
}

export interface Spellcasting {
  class: string;
  ability: string;
  saveDC: number;
  attackBonus: number;
  cantrips: string[];
  slots: Record<number, SpellSlot>;
}

export interface Character {
  meta: CharacterMeta;
  appearance: Appearance;
  attributes: Record<AttrKey, number>;
  savingThrows: Record<AttrKey, { proficient: boolean }>;
  skills: Record<string, Skill>;
  combat: Combat;
  attacks: Attack[];
  attacksNotes: string;
  equipment: string[];
  money: Money;
  languages: string[];
  proficiencies: Proficiencies;
  personality: Personality;
  features: Feature[];
  backstory: string;
  allies: string;
  treasure: string;
  spellcasting: Spellcasting;
  notes: string;
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
  date: string;
  title: string;
  summary: string;
  participants: string[];
  events: SessionEvent[];
  xp?: number;
  gold?: number;
  createdAt: string;
  updatedAt: string;
}

export interface NPC {
  id: string;
  name: string;
  race: string;
  occupation: string;
  factionId: string;
  status: "ally" | "neutral" | "enemy" | "dead" | "missing" | "suspect";
  relationship: string;
  lastLocation: string;
  history: string;
  secrets: string;
  notes: string;
  sessionIds: string[];
  portrait: string;
  tags: string[];
}

export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  type: "main" | "side";
  status: "active" | "completed" | "failed" | "abandoned";
  priority: "high" | "medium" | "low";
  description: string;
  objectives: QuestObjective[];
  rewards: string;
  deadline: string;
  sessionIds: string[];
  npcIds: string[];
  tags: string[];
}

export interface Campaign {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  character: Character;
  sessions: Session[];
  npcs: NPC[];
  quests: Quest[];
  monsters: unknown[];
  locations: unknown[];
  factions: unknown[];
  artifacts: unknown[];
}
