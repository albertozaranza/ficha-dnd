# Data Model

## Campaign (container top-level)

```typescript
interface Campaign {
  id: string;
  name: string;
  createdAt: string;    // ISO 8601
  updatedAt: string;
  character: Character;
  sessions: Session[];
  npcs: NPC[];
  quests: Quest[];
  monsters: Monster[];
  locations: Location[];
  factions: Faction[];
  artifacts: Artifact[];
}
```

---

## Character (V1)

```typescript
interface Character {
  meta: CharacterMeta;
  appearance: Appearance;
  attributes: Attributes;
  savingThrows: Record<AttrKey, { proficient: boolean }>;
  skills: Record<SkillKey, Skill>;
  combat: Combat;
  attacks: Attack[];
  attacksNotes: string;
  equipment: EquipmentItem[];
  money: Money;
  features: Feature[];
  spellcasting: Spellcasting;
  personality: Personality;
  backstory: string;
  allies: string;
  treasure: string;
  conditions: Condition[];
  notes: string;
}

type AttrKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

interface CharacterMeta {
  name: string;
  class: string;
  subclass: string;
  level: number;
  background: string;
  player: string;
  race: string;
  alignment: string;
  experience: number;
  inspiration: boolean;
}

interface Combat {
  ac: number;
  speed: string;
  hp: { max: number; current: number; temp: number };
  hitDice: { total: string; remaining: string };
  deathSaves: { successes: number; failures: number };
}

interface Condition {
  name: string;
  source: string;
  duration: string;
}
```

---

## Session / Journal (V2)

```typescript
interface Session {
  id: string;
  number: number;
  date: string;           // ISO 8601
  title: string;
  summary: string;
  participants: string[];
  events: string[];
  npcsEncountered: string[];   // NPC ids
  locationsVisited: string[];  // Location ids
  questsUpdated: string[];     // Quest ids
  monstersEncountered: string[]; // Monster ids
  xpGained: number;
  goldGained: number;
  tags: string[];
}
```

---

## NPC (V2)

```typescript
type NPCStatus = 'ally' | 'neutral' | 'enemy' | 'dead' | 'missing' | 'suspect';

interface NPC {
  id: string;
  name: string;
  race: string;
  occupation: string;
  factionId: string;
  status: NPCStatus;
  relationship: string;
  lastLocation: string;
  history: string;
  secrets: string;
  notes: string;
  sessionIds: string[];
  portrait: string;
  tags: string[];
}
```

---

## Quest (V2)

```typescript
type QuestType   = 'main' | 'side';
type QuestStatus = 'active' | 'completed' | 'failed' | 'abandoned';
type QuestPriority = 'high' | 'medium' | 'low';

interface Quest {
  id: string;
  title: string;
  type: QuestType;
  status: QuestStatus;
  priority: QuestPriority;
  description: string;
  objectives: QuestObjective[];
  rewards: string;
  deadline: string;
  sessionIds: string[];
  npcIds: string[];
  tags: string[];
}

interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
}
```

---

## Monster / Bestiary (V3)

```typescript
interface Monster {
  id: string;
  name: string;
  image: string;
  firstSeenSessionId: string;
  lastSeenSessionId: string;
  sessionIds: string[];
  stats: {
    hpMin: number;
    hpMax: number;
    acEstimate: number;
    attackBonus: number;
    damageEstimate: string;
  };
  knowledge: {
    resistances: string[];
    immunities: string[];
    vulnerabilities: string[];
  };
  behavior: {
    strategy: string;
    abilities: string[];
    patterns: string;
  };
  confidence: {
    hp: number;          // 0-100
    ac: number;
    attacks: number;
    resistances: number;
  };
  notes: string;
}
```

---

## Location (V4)

```typescript
type LocationType = 'city' | 'town' | 'castle' | 'dungeon' | 'region' | 'other';

interface Location {
  id: string;
  name: string;
  type: LocationType;
  description: string;
  npcIds: string[];
  questIds: string[];
  events: string[];
  notes: string;
  tags: string[];
}
```

---

## Faction (V4)

```typescript
type FactionType = 'guild' | 'cult' | 'organization' | 'kingdom';
type FactionRelationship = 'ally' | 'neutral' | 'enemy' | 'unknown';

interface Faction {
  id: string;
  name: string;
  type: FactionType;
  description: string;
  goals: string;
  npcIds: string[];
  relationship: FactionRelationship;
  notes: string;
}
```

---

## Artifact (V4)

```typescript
type ArtifactType = 'magic-item' | 'relic' | 'key-object';

interface Artifact {
  id: string;
  name: string;
  type: ArtifactType;
  description: string;
  currentLocation: string;
  history: string;
  sessionIds: string[];
  notes: string;
}
```

---

## Regras

- IDs: `crypto.randomUUID()`
- Datas: sempre ISO 8601
- Referências entre entidades: sempre por `id` (string), nunca por objeto embutido
- Storage key: `dnd-campaign` (Campaign serializada em JSON)
