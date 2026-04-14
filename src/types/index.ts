// ─── Core attribute keys ───────────────────────────────────────────────────
export type AttrKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

// ─── Proficiency level for skills ──────────────────────────────────────────
export type ProfLevel = 0 | 1 | 2 | 3; // none | half | full | expert

// ─── Character class entry (supports multiclass) ──────────────────────────
export interface CharClass {
  id: string;
  name: string;
  subclass: string;
  level: number;
  hitDie: string; // e.g. "d10"
}

// ─── Armor / shield entry ─────────────────────────────────────────────────
export interface ArmorEntry {
  id: string;
  name: string;
  type: string;
  bonusCA: number;
  maxDex?: number; // Maximum DEX bonus for medium armor
  minStr?: number;
  stealthDisadv?: boolean;
  equipped: boolean;
}

// ─── Attack entry ─────────────────────────────────────────────────────────
export type DamageType =
  | "Cortante" | "Perfurante" | "Contundente"
  | "Fogo" | "Gelo" | "Raio" | "Ácido" | "Veneno"
  | "Necrótico" | "Radiante" | "Psíquico" | "Trovão" | "Força";

export type AttackAttr = "FOR" | "DES" | "CON" | "INT" | "SAB" | "CAR" | "Feitiço";

export type ArmorProfType = "leves" | "medias" | "pesadas" | "escudos";
export type WeaponProfType = "simples" | "marciais";

export interface AttackEntry {
  id: string;
  name: string;
  attribute: AttackAttr;
  bonusExtra: number;
  damage: string;
  damageType: DamageType;
  range: string;
  properties: string;
  notes: string;
}

// ─── Racial ASI map ───────────────────────────────────────────────────────
export type RacialASI = Partial<Record<AttrKey, number>>;

export interface RaceData {
  label: string;
  asi: RacialASI;
  speed?: number;
  traits: string;
  source: string;
}

export interface BackgroundData {
  label: string;
  source: string;
  bonuses: string;
  featureName: string;
  featureDescription: string;
}

// ─── Death saves ──────────────────────────────────────────────────────────
export interface DeathSaves {
  successes: [boolean, boolean, boolean];
  failures:  [boolean, boolean, boolean];
}

export interface ProficienciesState {
  armor: Record<ArmorProfType, boolean>;
  weapons: Record<WeaponProfType, boolean>;
  custom: string;
}

export type CoinType = "cp" | "sp" | "ep" | "gp" | "pp";

export interface CurrencyState {
  cp: number;
  sp: number;
  ep: number;
  gp: number;
  pp: number;
}

export interface TraitEntry {
  id: string;
  ownerClassId?: string;
  title: string;
  description: string;
}

export interface ConsumableAbilityEntry {
  id: string;
  title: string;
  description: string;
  totalUses: number;
  currentUses: number;
}

export interface SpellEntry {
  id: string;
  name: string;
  castingTime: string;
  range: string;
  duration: string;
  verbal: boolean;
  somatic: boolean;
  material: boolean;
  prepared: boolean;
  ritual: boolean;
  concentration: boolean;
  description: string;
  notes: string;
}

export interface SpellLevelState {
  level: number;
  slotsTotal: number;
  slotsUsed: number;
  spells: SpellEntry[];
}

export interface SpellcastingProfile {
  id: string;
  label: string;
  ability: AttrKey | "";
}

// ─── Full character state ─────────────────────────────────────────────────
export interface CharacterState {
  // Identity
  name: string;
  playerName: string;
  raceKey: string;
  backgroundKey: string;
  background: string;
  alignment: string;
  spellNotes?: string;


  // Classes
  classes: CharClass[];

  // Attributes (base scores set by player, racial bonus added on top)
  attrs: Record<AttrKey, number>;

  // Saving throw proficiencies
  savingThrowProfs: Record<AttrKey, boolean>;

  // Skill proficiencies
  skillProfs: Record<number, ProfLevel>;

  // Combat
  hpMax: number;
  hpCurrent: number;
  hpTemp: number;
  isConcentrating: boolean;
  hitDiceCurrent: string;
  speed: number;
  initiativeBonus: number; // manual override on top of DEX mod
  deathSaves: DeathSaves;

  // Armor
  armors: ArmorEntry[];

  // Attacks
  attacks: AttackEntry[];

  // Proficiencies
  proficiencies: ProficienciesState;

  // Currency
  coins: CurrencyState;

  // Notes
  features: string;
  equipment: string;
  abilities: string;
  inventory: string;
  generalNotes: string;
  bonusActions: TraitEntry[];
  reactions: TraitEntry[];
  consumableAbilities: ConsumableAbilityEntry[];
  racialAbilities: TraitEntry[];
  racialNotes: string;
  subclassPanels: string[];
  subclassTraits: TraitEntry[];
  spellcastingAbility: AttrKey | "";
  spellSaveDC: number; // calculated
  spellAttackBonus: number; // calculated
  spellcastingProfiles: SpellcastingProfile[];
  spellbook: SpellLevelState[];
}
