import type { AttrKey, AttackAttr, ArmorProfType, DamageType, WeaponProfType } from "@/types";

export const ATTR_LIST: { id: AttrKey; name: string; short: string }[] = [
  { id: "str", name: "",         short: "FOR" },
  { id: "dex", name: "",      short: "DES" },
  { id: "con", name: "",  short: "CON" },
  { id: "int", name: "",  short: "INT" },
  { id: "wis", name: "",     short: "SAB" },
  { id: "cha", name: "",       short: "CAR" },
];

export const ATTR_SHORT_TO_KEY: Record<string, AttrKey> = {
  FOR: "str", DES: "dex", CON: "con", INT: "int", SAB: "wis", CAR: "cha",
};

export const SKILLS: { name: string; attr: AttrKey }[] = [
  { name: "Acrobacia",         attr: "dex" },
  { name: "Adestrar Animais",  attr: "wis" },
  { name: "Arcanismo",         attr: "int" },
  { name: "Atletismo",         attr: "str" },
  { name: "Atuação",           attr: "cha" },
  { name: "Enganação",         attr: "cha" },
  { name: "Furtividade",       attr: "dex" },
  { name: "História",          attr: "int" },
  { name: "Intimidação",       attr: "cha" },
  { name: "Intuição",          attr: "wis" },
  { name: "Investigação",      attr: "int" },
  { name: "Medicina",          attr: "wis" },
  { name: "Natureza",          attr: "int" },
  { name: "Percepção",         attr: "wis" },
  { name: "Persuasão",         attr: "cha" },
  { name: "Prestidigitação",   attr: "dex" },
  { name: "Religião",          attr: "int" },
  { name: "Sobrevivência",     attr: "wis" },
];

export const PASSIVE_SKILLS = [
  { label: "Percepção Passiva",    skillName: "Percepção" },
  { label: "Intuição Passiva",     skillName: "Intuição" },
  { label: "Investigação Passiva", skillName: "Investigação" },
];

export const DAMAGE_TYPES: DamageType[] = [
  "Cortante","Perfurante","Contundente",
  "Fogo","Gelo","Raio","Ácido","Veneno",
  "Necrótico","Radiante","Psíquico","Trovão","Força",
];

export const ATTACK_ATTRS: AttackAttr[] = [
  "FOR","DES","CON","INT","SAB","CAR","Feitiço",
];

export const HIT_DICE: string[] = ["d4","d6","d8","d10","d12","d20"];

export const ARMOR_PROFICIENCY_OPTIONS: { key: ArmorProfType; label: string }[] = [
  { key: "leves", label: "Leves" },
  { key: "medias", label: "Médias" },
  { key: "pesadas", label: "Pesadas" },
  { key: "escudos", label: "Escudos" },
];

export const WEAPON_PROFICIENCY_OPTIONS: { key: WeaponProfType; label: string }[] = [
  { key: "simples", label: "Armas Simples" },
  { key: "marciais", label: "Armas Marciais" },
];

export const CLASS_PRESETS: Record<string, { hitDie: string; savingThrows: AttrKey[] }> = {
  "Bárbaro":     { hitDie: "d12", savingThrows: ["str","con"] },
  "Bardo":       { hitDie: "d8",  savingThrows: ["dex","cha"] },
  "Bruxo":       { hitDie: "d8",  savingThrows: ["wis","cha"] },
  "Clérigo":     { hitDie: "d8",  savingThrows: ["wis","cha"] },
  "Druida":      { hitDie: "d8",  savingThrows: ["int","wis"] },
  "Feiticeiro":  { hitDie: "d6",  savingThrows: ["con","cha"] },
  "Guerreiro":   { hitDie: "d10", savingThrows: ["str","con"] },
  "Ladino":      { hitDie: "d8",  savingThrows: ["dex","int"] },
  "Mago":        { hitDie: "d6",  savingThrows: ["int","wis"] },
  "Monge":       { hitDie: "d8",  savingThrows: ["str","dex"] },
  "Paladino":    { hitDie: "d10", savingThrows: ["wis","cha"] },
  "Patrulheiro": { hitDie: "d10", savingThrows: ["str","dex"] },
  "Artificer":   { hitDie: "d8",  savingThrows: ["con","int"] },
};


