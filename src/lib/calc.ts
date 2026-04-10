import type { AttrKey, ProfLevel, CharacterState, SpellcastingProfile } from "@/types";
import { SKILLS } from "@/data/constants";
import { RACES } from "@/data/races";

/** Ability modifier from score */
export const getMod = (score: number): number => Math.floor((score - 10) / 2);

/** Format modifier as string, e.g. "+3" or "-1" */
export const fmtMod = (mod: number): string => (mod >= 0 ? "+" : "") + mod;

/** Total character level across all classes */
export const getTotalLevel = (state: Pick<CharacterState, "classes">): number =>
  Math.max(1, state.classes.reduce((s, c) => s + c.level, 0));

/** Hit dice summary for multiclass characters */
export const getHitDiceSummary = (state: Pick<CharacterState, "classes">): string => {
  const counts = state.classes.reduce<Record<string, number>>((acc, cls) => {
    const die = cls.hitDie ?? "d8";
    const level = Math.max(0, cls.level);
    if (level <= 0) return acc;
    acc[die] = (acc[die] ?? 0) + level;
    return acc;
  }, {});

  const order = ["d4", "d6", "d8", "d10", "d12"];
  return Object.entries(counts)
    .sort(([a], [b]) => order.indexOf(a) - order.indexOf(b))
    .map(([die, count]) => `${count}${die}`)
    .join(" + ");
};

/** Proficiency bonus from total level */
export const getProfBonus = (totalLevel: number): number =>
  Math.ceil(totalLevel / 4) + 1;

/** Effective attribute score (base + racial bonus) */
export const effectiveAttr = (
  state: Pick<CharacterState, "attrs" | "raceKey">,
  key: AttrKey
): number => {
  const racial = RACES[state.raceKey]?.asi?.[key] ?? 0;
  return (state.attrs[key] ?? 10) + racial;
};

/** Modifier for an attribute, including racial bonus */
export const attrMod = (
  state: Pick<CharacterState, "attrs" | "raceKey">,
  key: AttrKey
): number => getMod(effectiveAttr(state, key));

/** Saving throw bonus */
export const savingThrowBonus = (
  state: CharacterState,
  key: AttrKey,
  profBonus: number
): number => {
  const mod = attrMod(state, key);
  return mod + (state.savingThrowProfs[key] ? profBonus : 0);
};

/** Skill bonus */
export const skillBonus = (
  state: CharacterState,
  skillIndex: number,
  profBonus: number
): number => {
  const skill = SKILLS[skillIndex];
  if (!skill) return 0;
  const mod = attrMod(state, skill.attr);
  const lvl: ProfLevel = state.skillProfs[skillIndex] ?? 0;
  if (lvl === 0) return mod;
  if (lvl === 1) return mod + Math.floor(profBonus / 2);
  if (lvl === 2) return mod + profBonus;
  return mod + profBonus * 2; // expert
};

/** Passive score = 10 + bonus */
export const passiveScore = (bonus: number): number => 10 + bonus;

/** Initiative = DEX mod (player can add manual bonus on top) */
export const initiativeTotal = (state: CharacterState): number => {
  const racial = RACES[state.raceKey]?.asi?.dex ?? 0;
  const dexMod = getMod((state.attrs.dex ?? 10) + racial);
  return dexMod + state.initiativeBonus;
};

/** Total CA = 10 + DEX mod (limited by armor type) + equipped armor/shield bonuses */
export const totalCA = (state: Pick<CharacterState, "armors" | "attrs" | "raceKey" | "classes">): number => {
  const dexMod = attrMod(state, "dex");
  const equipped = state.armors.filter((a) => a.equipped);

  // Check for Unarmored Defense
  const unarmoredDefense = equipped.find(a => a.type.toLowerCase() === "natural");
  if (unarmoredDefense) {
    const hasMonk = state.classes.some(c => c.name.toLowerCase().includes("monge"));
    const hasBarbarian = state.classes.some(c => c.name.toLowerCase().includes("bárbaro") || c.name.toLowerCase().includes("barbarian"));

    if (unarmoredDefense.name.includes("Monge") && hasMonk) {
      const wisMod = attrMod(state, "wis");
      return 10 + dexMod + wisMod;
    } else if (unarmoredDefense.name.includes("Bárbaro") && hasBarbarian) {
      const conMod = attrMod(state, "con");
      return 10 + dexMod + conMod;
    }
  }

  // Normal armor calculation
  const shields = equipped.filter((a) => a.type.toLowerCase() === "escudo");
  const armors = equipped.filter((a) => a.type.toLowerCase() !== "escudo" && a.type.toLowerCase() !== "natural");

  // Determine the most restrictive armor type and max dex
  const armorTypes = armors.map(a => a.type.toLowerCase());
  let armorType: "leve" | "média" | "pesada" | null = null;
  let maxDexBonus = 99; // Unlimited
  if (armorTypes.includes("pesada")) {
    armorType = "pesada";
    maxDexBonus = 0;
  } else if (armorTypes.includes("média")) {
    armorType = "média";
    // Find the lowest maxDex among equipped medium armors
    const mediumArmors = armors.filter(a => a.type.toLowerCase() === "média");
    maxDexBonus = Math.min(...mediumArmors.map(a => a.maxDex ?? 2));
  } else if (armorTypes.includes("leve")) {
    armorType = "leve";
  }

  // Calculate DEX bonus based on armor type
  let dexBonus = dexMod;
  if (armorType === "pesada") {
    dexBonus = 0;
  } else if (armorType === "média") {
    dexBonus = Math.min(dexMod, maxDexBonus);
  }
  // For light or no armor, dexBonus = dexMod

  // Sum armor bonuses + shield bonuses (shields give +2 each)
  const armorBonus = armors.reduce((s, a) => s + a.bonusCA, 0);
  const shieldBonus = shields.length * 2;

  return 10 + dexBonus + armorBonus + shieldBonus;
};

/** Attack bonus for an attack entry */
export const attackBonus = (
  state: CharacterState,
  attribute: string,
  bonusExtra: number,
  profBonus: number
): number => {
  const ATTR_MAP: Record<string, AttrKey> = {
    FOR:"str", DES:"dex", CON:"con", INT:"int", SAB:"wis", CAR:"cha",
  };
  if (attribute === "Feitiço") return bonusExtra;
  const key = ATTR_MAP[attribute];
  if (!key) return bonusExtra;
  return attrMod(state, key) + profBonus + bonusExtra;
};

/** Spellcasting DC */
export const spellSaveDC = (
  state: CharacterState,
  profBonus: number,
  abilityOverride?: SpellcastingProfile["ability"],
): number => {
  const ability = abilityOverride ?? state.spellcastingAbility;
  if (!ability) return 0;
  return 8 + profBonus + attrMod(state, ability);
};

/** Spellcasting attack bonus */
export const spellAttackBonusFn = (
  state: CharacterState,
  profBonus: number,
  abilityOverride?: SpellcastingProfile["ability"],
): number => {
  const ability = abilityOverride ?? state.spellcastingAbility;
  if (!ability) return 0;
  return profBonus + attrMod(state, ability);
};
