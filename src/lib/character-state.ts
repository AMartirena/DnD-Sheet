import type {
  CharacterState,
  AttrKey,
  ConsumableAbilityEntry,
  CoinType,
  SpellEntry,
  SpellcastingProfile,
  SpellLevelState,
} from "@/types";

const DEFAULT_ATTRS: Record<AttrKey, number> = {
  str: 0,
  dex: 0,
  con: 0,
  int: 0,
  wis: 0,
  cha: 0,
};

const DEFAULT_COINS: Record<CoinType, number> = {
  cp: 0,
  sp: 0,
  ep: 0,
  gp: 0,
  pp: 0,
};

function createDefaultSpellbook(): SpellLevelState[] {
  return Array.from({ length: 10 }, (_, level) => ({
    level,
    slotsTotal: 0,
    slotsUsed: 0,
    spells: [],
  }));
}

function createSpellcastingProfile(index: number, ability: AttrKey | "" = "", label = ""): SpellcastingProfile {
  return {
    id: `spellcasting_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    label: label || `Conjurador ${index + 1}`,
    ability,
  };
}

function createDefaultSpellcastingProfiles(): SpellcastingProfile[] {
  return [createSpellcastingProfile(0)];
}

function normalizeSpellcastingProfile(input: unknown, index: number): SpellcastingProfile {
  const data = (input && typeof input === "object" ? input : {}) as Partial<SpellcastingProfile>;

  return {
    id: data.id ?? `spellcasting_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    label: data.label?.trim() ? data.label : `Conjurador ${index + 1}`,
    ability: data.ability ?? "",
  };
}

function normalizeSpellEntry(input: unknown): SpellEntry {
  const data = (input && typeof input === "object" ? input : {}) as Partial<SpellEntry>;

  return {
    id: data.id ?? `spell_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: data.name ?? "",
    castingTime: data.castingTime ?? "",
    range: data.range ?? "",
    duration: data.duration ?? "",
    verbal: data.verbal ?? false,
    somatic: data.somatic ?? false,
    material: data.material ?? false,
    prepared: data.prepared ?? false,
    ritual: data.ritual ?? false,
    concentration: data.concentration ?? false,
    description: data.description ?? "",
    notes: data.notes ?? "",
  };
}

function normalizeConsumableAbility(input: unknown): ConsumableAbilityEntry {
  const data = (input && typeof input === "object" ? input : {}) as Partial<ConsumableAbilityEntry>;
  const totalUses = Math.max(0, data.totalUses ?? 0);

  return {
    id: data.id ?? `resource_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title: data.title ?? "",
    description: data.description ?? "",
    totalUses,
    currentUses: Math.max(0, Math.min(data.currentUses ?? totalUses, totalUses)),
  };
}

export function createDefaultCharacterState(): CharacterState {
  return {
    name: "",
    playerName: "",
    raceKey: "",
    backgroundKey: "",
    background: "",
    alignment: "",
    classes: [{ id: "cls_1", name: "", subclass: "", level: 1, hitDie: "d8" }],
    attrs: { ...DEFAULT_ATTRS },
    savingThrowProfs: { str: false, dex: false, con: false, int: false, wis: false, cha: false },
    skillProfs: {},
    hpMax: 0,
    hpCurrent: 0,
    hpTemp: 0,
    hitDiceCurrent: "",
    speed: 9,
    initiativeBonus: 0,
    deathSaves: {
      successes: [false, false, false],
      failures: [false, false, false],
    },
    armors: [
      { id: "arm_1", name: "Armadura de Couro", type: "Leve", bonusCA: 2, stealthDisadv: false, equipped: false },
  
    ],
    attacks: [
      {
        id: "atk_1",
        name: "Espada Longa",
        attribute: "FOR",
        bonusExtra: 0,
        damage: "1d8",
        damageType: "Cortante",
        range: "Corpo a corpo (1,5m)",
        properties: "Versátil (1d10)",
        notes: "",
      },
    ],
    proficiencies: {
      armor: { leves: false, medias: false, pesadas: false, escudos: false },
      weapons: { simples: false, marciais: false },
      custom: "",
    },
    coins: { ...DEFAULT_COINS },
    features: "",
    equipment: "",
    abilities: "",
    inventory: "",
    generalNotes: "",
    bonusActions: [],
    reactions: [],
    consumableAbilities: [],
    subclassPanels: [],
    subclassTraits: [],
    spellcastingAbility: "",
    spellSaveDC: 0,
    spellAttackBonus: 0,
    spellcastingProfiles: createDefaultSpellcastingProfiles(),
    spellbook: createDefaultSpellbook(),
  };
}

export function normalizeCharacterState(input: unknown): CharacterState {
  const fallback = createDefaultCharacterState();
  const data = (input && typeof input === "object" ? input : {}) as Partial<CharacterState>;

  return {
    ...fallback,
    ...data,
    classes: Array.isArray(data.classes) && data.classes.length > 0 ? data.classes : fallback.classes,
    attrs: { ...fallback.attrs, ...(data.attrs ?? {}) },
    savingThrowProfs: { ...fallback.savingThrowProfs, ...(data.savingThrowProfs ?? {}) },
    skillProfs: { ...fallback.skillProfs, ...(data.skillProfs ?? {}) },
    deathSaves: {
      successes: data.deathSaves?.successes ?? fallback.deathSaves.successes,
      failures: data.deathSaves?.failures ?? fallback.deathSaves.failures,
    },
    armors: Array.isArray(data.armors) ? data.armors : fallback.armors,
    attacks: Array.isArray(data.attacks) ? data.attacks : fallback.attacks,
    proficiencies: {
      armor: { ...fallback.proficiencies.armor, ...(data.proficiencies?.armor ?? {}) },
      weapons: { ...fallback.proficiencies.weapons, ...(data.proficiencies?.weapons ?? {}) },
      custom: data.proficiencies?.custom ?? fallback.proficiencies.custom,
    },
    coins: { ...fallback.coins, ...(data.coins ?? {}) },
    bonusActions: Array.isArray(data.bonusActions) ? data.bonusActions : fallback.bonusActions,
    reactions: Array.isArray(data.reactions) ? data.reactions : fallback.reactions,
    consumableAbilities: Array.isArray(data.consumableAbilities)
      ? data.consumableAbilities.map(normalizeConsumableAbility)
      : fallback.consumableAbilities,
    subclassPanels: Array.isArray(data.subclassPanels) ? data.subclassPanels : fallback.subclassPanels,
    subclassTraits: Array.isArray(data.subclassTraits) ? data.subclassTraits : fallback.subclassTraits,
    spellcastingProfiles: Array.isArray(data.spellcastingProfiles) && data.spellcastingProfiles.length > 0
      ? data.spellcastingProfiles.map(normalizeSpellcastingProfile)
      : [normalizeSpellcastingProfile({ ability: data.spellcastingAbility ?? "" }, 0)],
    spellbook: Array.isArray(data.spellbook)
      ? createDefaultSpellbook().map((defaultLevel, index) => {
          const currentLevel = data.spellbook?.[index];
          return {
            ...defaultLevel,
            ...currentLevel,
            level: defaultLevel.level,
            spells: Array.isArray(currentLevel?.spells)
              ? currentLevel.spells.map(normalizeSpellEntry)
              : defaultLevel.spells,
          };
        })
      : fallback.spellbook,
  };
}

export function extractCharacterState(state: CharacterState): CharacterState {
  return normalizeCharacterState(JSON.parse(JSON.stringify(state)));
}