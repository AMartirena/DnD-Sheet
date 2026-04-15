import type { AttrKey, ProfLevel, CharacterState, SpellcastingProfile } from "@/types";
import { SKILLS } from "@/data/constants";

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

/** Effective attribute score (AGORA = APENAS BASE) */
export const effectiveAttr = (
  state: Pick<CharacterState, "attrs">,
  key: AttrKey
): number => {
  return state.attrs[key] ?? 10;
};

/** Modifier for an attribute */
export const attrMod = (
  state: Pick<CharacterState, "attrs">,
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
  return mod + profBonus * 2;
};

/** Passive score = 10 + bonus */
export const passiveScore = (bonus: number): number => 10 + bonus;

/** Initiative */
export const initiativeTotal = (state: CharacterState): number => {
  return attrMod(state, "dex") + state.initiativeBonus;
};

/** Total CA */
export const totalCA = (
  state: Pick<CharacterState, "armors" | "attrs" | "classes">
): number => {
  const dexMod = attrMod(state, "dex");
  const equipped = state.armors.filter((a) => a.equipped);

  const shields = equipped.filter((a) => a.type.toLowerCase() === "escudo");
  const armors = equipped.filter(
    (a) => a.type.toLowerCase() !== "escudo" && a.type.toLowerCase() !== "natural"
  );

  const hasArmor = armors.length > 0;

  //  Defesa sem armadura
  const unarmoredDefense = equipped.find(a => a.type.toLowerCase() === "natural");

  if (unarmoredDefense && !hasArmor) {
    const hasMonk = state.classes.some(c => c.name.toLowerCase().includes("monge"));
    const hasBarbarian = state.classes.some(
      c => c.name.toLowerCase().includes("bárbaro") || c.name.toLowerCase().includes("barbarian")
    );

    if (unarmoredDefense.name.includes("Monge") && hasMonk) {
      return 10 + dexMod + attrMod(state, "wis");
    }

    if (unarmoredDefense.name.includes("Bárbaro") && hasBarbarian) {
      return 10 + dexMod + attrMod(state, "con");
    }
  }

  // Armadura normal
  const armorTypes = armors.map(a => a.type.toLowerCase());

  let armorType: "leve" | "média" | "pesada" | null = null;
  let maxDexBonus = 99;

  if (armorTypes.includes("pesada")) {
    armorType = "pesada";
    maxDexBonus = 0;
  } else if (armorTypes.includes("média")) {
    armorType = "média";
    const mediumArmors = armors.filter(a => a.type.toLowerCase() === "média");
    maxDexBonus = Math.min(...mediumArmors.map(a => a.maxDex ?? 2));
  } else if (armorTypes.includes("leve")) {
    armorType = "leve";
  }

  let dexBonus = dexMod;

  if (armorType === "pesada") dexBonus = 0;
  if (armorType === "média") dexBonus = Math.min(dexMod, maxDexBonus);

  const armorBonus = armors.reduce((s, a) => s + a.bonusCA, 0);
  const shieldBonus = shields.length > 0 ? 2 : 0;

  return 10 + dexBonus + armorBonus + shieldBonus;
};

/** Attack bonus */
export const attackBonus = (
  state: CharacterState,
  attribute: string,
  bonusExtra: number,
  profBonus: number
): number => {
  const ATTR_MAP: Record<string, AttrKey> = {
    FOR: "str", DES: "dex", CON: "con", INT: "int", SAB: "wis", CAR: "cha",
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

/** Spell attack bonus */
export const spellAttackBonusFn = (
  state: CharacterState,
  profBonus: number,
  abilityOverride?: SpellcastingProfile["ability"],
): number => {
  const ability = abilityOverride ?? state.spellcastingAbility;
  if (!ability) return 0;

  return profBonus + attrMod(state, ability);
};