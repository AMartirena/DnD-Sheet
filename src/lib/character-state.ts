import type {
  CharacterState,
  AttrKey,
  CoinType,
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
      { id: "arm_2", name: "Escudo", type: "Escudo", bonusCA: 2, stealthDisadv: false, equipped: false },
      { id: "arm_3", name: "Cota de Malha", type: "Média", bonusCA: 4, maxDex: 2, stealthDisadv: false, equipped: false },
      { id: "arm_4", name: "Armadura de Placas", type: "Pesada", bonusCA: 8, minStr: 15, stealthDisadv: true, equipped: false },
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
    bonusActions: [],
    reactions: [],
    subclassPanels: [],
    subclassTraits: [],
    spellcastingAbility: "",
    spellSaveDC: 0,
    spellAttackBonus: 0,
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
    subclassPanels: Array.isArray(data.subclassPanels) ? data.subclassPanels : fallback.subclassPanels,
    subclassTraits: Array.isArray(data.subclassTraits) ? data.subclassTraits : fallback.subclassTraits,
  };
}

export function extractCharacterState(state: CharacterState): CharacterState {
  return normalizeCharacterState(JSON.parse(JSON.stringify(state)));
}