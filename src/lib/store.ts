import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createDefaultCharacterState, normalizeCharacterState } from "@/lib/character-state";
import type {
  CharacterState, AttrKey, ArmorProfType, ProfLevel,
  ArmorEntry, AttackEntry, CharClass,
  WeaponProfType, CoinType, CurrencyState, TraitEntry, ConsumableAbilityEntry,
} from "@/types";

const COIN_VALUES_CP: Record<CoinType, number> = {
  cp: 1,
  sp: 10,
  ep: 50,
  gp: 100,
  pp: 1000,
};

const COIN_ORDER_ASC: CoinType[] = ["cp", "sp", "ep", "gp", "pp"];

const BREAK_DOWN_MAP: Partial<Record<CoinType, { lower: CoinType; factor: number }>> = {
  pp: { lower: "gp", factor: 10 },
  gp: { lower: "sp", factor: 10 },
  ep: { lower: "sp", factor: 5 },
  sp: { lower: "cp", factor: 10 },
};

function toCopperValue(coins: CurrencyState): number {
  return (
    coins.cp * COIN_VALUES_CP.cp
    + coins.sp * COIN_VALUES_CP.sp
    + coins.ep * COIN_VALUES_CP.ep
    + coins.gp * COIN_VALUES_CP.gp
    + coins.pp * COIN_VALUES_CP.pp
  );
}

function spendWithConversion(coins: CurrencyState, key: CoinType, amount: number): CurrencyState | null {
  if (amount <= 0) return coins;

  const result: CurrencyState = { ...coins };
  const targetIndex = COIN_ORDER_ASC.indexOf(key);
  let remainingCp = amount * COIN_VALUES_CP[key];

  if (remainingCp > toCopperValue(result)) {
    return null;
  }

  const spendFromSelectedOrLower = () => {
    for (let index = targetIndex; index >= 0 && remainingCp > 0; index -= 1) {
      const coin = COIN_ORDER_ASC[index];
      const coinValue = COIN_VALUES_CP[coin];
      const usableCoins = Math.min(result[coin], Math.floor(remainingCp / coinValue));

      if (usableCoins > 0) {
        result[coin] -= usableCoins;
        remainingCp -= usableCoins * coinValue;
      }
    }
  };

  const breakHigherCoin = () => {
    for (let index = COIN_ORDER_ASC.length - 1; index > targetIndex; index -= 1) {
      const higherCoin = COIN_ORDER_ASC[index];
      const breakRule = BREAK_DOWN_MAP[higherCoin];

      if (result[higherCoin] > 0 && breakRule) {
        result[higherCoin] -= 1;
        result[breakRule.lower] += breakRule.factor;
        return true;
      }
    }

    return false;
  };

  spendFromSelectedOrLower();

  while (remainingCp > 0) {
    if (!breakHigherCoin()) {
      return null;
    }

    spendFromSelectedOrLower();
  }

  return result;
}

// ─── Default state ──────────────────────────────────────────────────────────
const DEFAULT_STATE: CharacterState = createDefaultCharacterState();

// ─── Store interface ────────────────────────────────────────────────────────
interface Store extends CharacterState {
  // Identity
  setField: <K extends keyof CharacterState>(key: K, value: CharacterState[K]) => void;

  // Attributes
  setAttr: (key: AttrKey, value: number) => void;

  // Saving throws
  toggleSaveProf: (key: AttrKey) => void;

  // Skills
  cycleSkillProf: (index: number) => void;

  // Classes
  addClass: () => void;
  updateClass: (id: string, patch: Partial<CharClass>) => void;
  removeClass: (id: string) => void;
  addSubclassPanel: (classId: string) => void;
  addSubclassTrait: (classId: string, title?: string) => void;
  updateSubclassTrait: (id: string, patch: Partial<TraitEntry>) => void;
  removeSubclassTrait: (id: string) => void;

  // Armor
  addArmor: () => void;
  updateArmor: (id: string, patch: Partial<ArmorEntry>) => void;
  removeArmor: (id: string) => void;

  // Attacks
  addAttack: () => void;
  updateAttack: (id: string, patch: Partial<AttackEntry>) => void;
  removeAttack: (id: string) => void;
  addBonusAction: () => void;
  updateBonusAction: (id: string, patch: Partial<TraitEntry>) => void;
  removeBonusAction: (id: string) => void;
  addReaction: () => void;
  updateReaction: (id: string, patch: Partial<TraitEntry>) => void;
  removeReaction: (id: string) => void;
  addConsumableAbility: () => void;
  updateConsumableAbility: (id: string, patch: Partial<ConsumableAbilityEntry>) => void;
  removeConsumableAbility: (id: string) => void;

  // Proficiencies
  toggleArmorProf: (key: ArmorProfType) => void;
  toggleWeaponProf: (key: WeaponProfType) => void;
  setCustomProficiencies: (value: string) => void;

  // Currency
  setCoin: (key: CoinType, value: number) => void;
  adjustCoin: (key: CoinType, delta: number) => void;
  spendCoin: (key: CoinType, amount: number) => boolean;

  // Death saves
  toggleDeathSave: (type: "successes" | "failures", index: 0 | 1 | 2) => void;

  // Reset
  longRest: () => void;
  resetSheet: () => void;
  replaceSheet: (state: CharacterState) => void;
}

let _counter = 100;
const uid = (prefix: string) => `${prefix}_${++_counter}_${Date.now()}`;

export const useCharStore = create<Store>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,

      setField: (key, value) => set({ [key]: value } as Partial<CharacterState>),

      setAttr: (key, value) =>
        set((s) => ({ attrs: { ...s.attrs, [key]: value } })),

      toggleSaveProf: (key) =>
        set((s) => ({
          savingThrowProfs: { ...s.savingThrowProfs, [key]: !s.savingThrowProfs[key] },
        })),

      cycleSkillProf: (index) =>
        set((s) => ({
          skillProfs: { ...s.skillProfs, [index]: (((s.skillProfs[index] ?? 0) + 1) % 4) as ProfLevel },
        })),

      addClass: () =>
        set((s) => ({
          classes: [
            ...s.classes,
            { id: uid("cls"), name: "", subclass: "", level: 1, hitDie: "d8" },
          ],
        })),

      updateClass: (id, patch) =>
        set((s) => ({
          classes: s.classes.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),

      removeClass: (id) =>
        set((s) => ({
          classes: s.classes.filter((c) => c.id !== id),
          subclassPanels: s.subclassPanels.filter((panelId) => panelId !== id),
          subclassTraits: s.subclassTraits.filter((trait) => trait.ownerClassId !== id),
        })),

      addSubclassPanel: (classId) =>
        set((s) => ({
          subclassPanels: s.subclassPanels.includes(classId)
            ? s.subclassPanels
            : [...s.subclassPanels, classId],
        })),

      addSubclassTrait: (classId, title = "") =>
        set((s) => ({
          subclassTraits: [
            ...s.subclassTraits,
            { id: uid("subtrait"), ownerClassId: classId, title, description: "" },
          ],
        })),

      updateSubclassTrait: (id, patch) =>
        set((s) => ({
          subclassTraits: s.subclassTraits.map((trait) => (trait.id === id ? { ...trait, ...patch } : trait)),
        })),

      removeSubclassTrait: (id) =>
        set((s) => ({
          subclassTraits: s.subclassTraits.filter((trait) => trait.id !== id),
        })),

      addArmor: () =>
        set((s) => ({
          armors: [
            ...s.armors,
            { id: uid("arm"), name: "", type: "", bonusCA: 0, minStr: undefined, stealthDisadv: false, equipped: false },
          ],
        })),

      updateArmor: (id, patch) =>
        set((s) => ({
          armors: s.armors.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),

      removeArmor: (id) =>
        set((s) => ({ armors: s.armors.filter((a) => a.id !== id) })),

      addAttack: () =>
        set((s) => ({
          attacks: [
            ...s.attacks,
            {
              id: uid("atk"), name: "", attribute: "FOR", bonusExtra: 0,
              damage: "1d6", damageType: "Cortante", range: "1,5m",
              properties: "", notes: "",
            },
          ],
        })),

      updateAttack: (id, patch) =>
        set((s) => ({
          attacks: s.attacks.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        })),

      removeAttack: (id) =>
        set((s) => ({ attacks: s.attacks.filter((a) => a.id !== id) })),

      addBonusAction: () =>
        set((s) => ({
          bonusActions: [
            ...s.bonusActions,
            { id: uid("bonusaction"), title: "", description: "" },
          ],
        })),

      updateBonusAction: (id, patch) =>
        set((s) => ({
          bonusActions: s.bonusActions.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
        })),

      removeBonusAction: (id) =>
        set((s) => ({
          bonusActions: s.bonusActions.filter((entry) => entry.id !== id),
        })),

      addReaction: () =>
        set((s) => ({
          reactions: [
            ...s.reactions,
            { id: uid("reaction"), title: "", description: "" },
          ],
        })),

      updateReaction: (id, patch) =>
        set((s) => ({
          reactions: s.reactions.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
        })),

      removeReaction: (id) =>
        set((s) => ({
          reactions: s.reactions.filter((entry) => entry.id !== id),
        })),

      addConsumableAbility: () =>
        set((s) => ({
          consumableAbilities: [
            ...s.consumableAbilities,
            { id: uid("resource"), title: "", description: "", totalUses: 1, currentUses: 1 },
          ],
        })),

      updateConsumableAbility: (id, patch) =>
        set((s) => ({
          consumableAbilities: s.consumableAbilities.map((entry) => {
            if (entry.id !== id) return entry;

            const nextTotalUses = Math.max(0, patch.totalUses ?? entry.totalUses);
            const nextCurrentRaw = patch.currentUses ?? entry.currentUses;

            return {
              ...entry,
              ...patch,
              totalUses: nextTotalUses,
              currentUses: Math.max(0, Math.min(nextCurrentRaw, nextTotalUses)),
            };
          }),
        })),

      removeConsumableAbility: (id) =>
        set((s) => ({
          consumableAbilities: s.consumableAbilities.filter((entry) => entry.id !== id),
        })),

      toggleArmorProf: (key) =>
        set((s) => ({
          proficiencies: {
            ...s.proficiencies,
            armor: { ...s.proficiencies.armor, [key]: !s.proficiencies.armor[key] },
          },
        })),

      toggleWeaponProf: (key) =>
        set((s) => ({
          proficiencies: {
            ...s.proficiencies,
            weapons: { ...s.proficiencies.weapons, [key]: !s.proficiencies.weapons[key] },
          },
        })),

      setCustomProficiencies: (value) =>
        set((s) => ({
          proficiencies: {
            ...s.proficiencies,
            custom: value,
          },
        })),

      setCoin: (key, value) =>
        set((s) => ({
          coins: { ...s.coins, [key]: Math.max(0, value) },
        })),

      adjustCoin: (key, delta) =>
        set((s) => ({
          coins: { ...s.coins, [key]: Math.max(0, s.coins[key] + delta) },
        })),

      spendCoin: (key, amount) => {
        if (amount <= 0) return true;

        let success = false;

        set((s) => {
          const nextCoins = spendWithConversion(s.coins, key, amount);

          if (!nextCoins) {
            return {};
          }

          success = true;
          return {
            coins: nextCoins,
          };
        });

        return success;
      },

      toggleDeathSave: (type, index) =>
        set((s) => {
          const arr = [...s.deathSaves[type]] as [boolean, boolean, boolean];
          arr[index] = !arr[index];
          return { deathSaves: { ...s.deathSaves, [type]: arr } };
        }),

      longRest: () =>
        set((s) => ({
          hpCurrent: s.hpMax,
          hpTemp: 0,
          deathSaves: {
            successes: [false, false, false],
            failures: [false, false, false],
          },
          consumableAbilities: s.consumableAbilities.map((entry) => ({
            ...entry,
            currentUses: entry.totalUses,
          })),
          spellbook: s.spellbook.map((levelEntry) => ({
            ...levelEntry,
            slotsUsed: 0,
          })),
        })),

      resetSheet: () => set(createDefaultCharacterState()),

      replaceSheet: (state) => set(normalizeCharacterState(state)),
    }),
    { name: "dnd-sheet-storage" }
  )
);
