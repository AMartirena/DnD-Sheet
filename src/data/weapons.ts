// ─── Official D&D 5e weapons from SRD ──────────────────────────────────────

export interface WeaponData {
  name: string;
  category: "Simples" | "Marciais";
  type: "Corpo a corpo" | "À distância";
  damage: string; // e.g. "1d6"
  damageType: "Cortante" | "Perfurante" | "Contundente";
  properties: string; // e.g. "Acuidade, Arremesso (20/60)"
  cost?: string;
  weight?: string;
}

export const WEAPONS: WeaponData[] = [
  // Simple Melee Weapons
  { name: "Clava", category: "Simples", type: "Corpo a corpo", damage: "1d4", damageType: "Contundente", properties: "Leve", cost: "1 pp", weight: "1 kg" },
  { name: "Adaga", category: "Simples", type: "Corpo a corpo", damage: "1d4", damageType: "Perfurante", properties: "Acuidade, Arremesso (20/60), Leve", cost: "2 po", weight: "0,5 kg" },
  { name: "Grande Clava", category: "Simples", type: "Corpo a corpo", damage: "1d8", damageType: "Contundente", properties: "Pesada, Alcance, Duas Mãos", cost: "2 pp", weight: "5 kg" },
  { name: "Machadinha", category: "Simples", type: "Corpo a corpo", damage: "1d6", damageType: "Cortante", properties: "Arremesso (20/60), Leve", cost: "5 po", weight: "1 kg" },
  { name: "Javali", category: "Simples", type: "Corpo a corpo", damage: "1d6", damageType: "Perfurante", properties: "Arremesso (20/60)", cost: "5 pp", weight: "1 kg" },
  { name: "Lança", category: "Simples", type: "Corpo a corpo", damage: "1d6", damageType: "Perfurante", properties: "Arremesso (20/60), Versátil (1d8)", cost: "1 po", weight: "1,5 kg" },
  { name: "Maça", category: "Simples", type: "Corpo a corpo", damage: "1d6", damageType: "Contundente", properties: "", cost: "5 po", weight: "2 kg" },
  { name: "Bordão", category: "Simples", type: "Corpo a corpo", damage: "1d6", damageType: "Contundente", properties: "Versátil (1d8)", cost: "2 pp", weight: "2 kg" },

  // Simple Ranged Weapons
  { name: "Arco Curto", category: "Simples", type: "À distância", damage: "1d6", damageType: "Perfurante", properties: "Alcance (24/96), Duas Mãos", cost: "25 po", weight: "1 kg" },
  { name: "Besta Leve", category: "Simples", type: "À distância", damage: "1d8", damageType: "Perfurante", properties: "Alcance (24/96), Carregamento, Duas Mãos", cost: "25 po", weight: "2,5 kg" },
  { name: "Dardo", category: "Simples", type: "À distância", damage: "1d4", damageType: "Perfurante", properties: "Arremesso (20/60), Acuidade", cost: "5 pc", weight: "0,1 kg" },
  { name: "Funda", category: "Simples", type: "À distância", damage: "1d4", damageType: "Contundente", properties: "Alcance (6/18)", cost: "1 pp", weight: "0 kg" },

  // Martial Melee Weapons
  { name: "Machado Grande", category: "Marciais", type: "Corpo a corpo", damage: "1d12", damageType: "Cortante", properties: "Pesada, Alcance, Duas Mãos", cost: "30 po", weight: "3,5 kg" },
  { name: "Machado de Batalha", category: "Marciais", type: "Corpo a corpo", damage: "1d8", damageType: "Cortante", properties: "Versátil (1d10)", cost: "10 po", weight: "2 kg" },
  { name: "Mangual", category: "Marciais", type: "Corpo a corpo", damage: "1d8", damageType: "Contundente", properties: "", cost: "10 po", weight: "1 kg" },
  { name: "Cimitarra", category: "Marciais", type: "Corpo a corpo", damage: "1d6", damageType: "Cortante", properties: "Acuidade, Leve", cost: "25 po", weight: "1,5 kg" },
  { name: "Espada Curta", category: "Marciais", type: "Corpo a corpo", damage: "1d6", damageType: "Perfurante", properties: "Acuidade, Leve", cost: "10 po", weight: "1 kg" },
  { name: "Espada Longa", category: "Marciais", type: "Corpo a corpo", damage: "1d8", damageType: "Cortante", properties: "Versátil (1d10)", cost: "15 po", weight: "1,5 kg" },
  { name: "Espada Grande", category: "Marciais", type: "Corpo a corpo", damage: "2d6", damageType: "Cortante", properties: "Pesada, Duas Mãos", cost: "50 po", weight: "3 kg" },
  { name: "Glaive", category: "Marciais", type: "Corpo a corpo", damage: "1d10", damageType: "Cortante", properties: "Pesada, Alcance, Duas Mãos", cost: "20 po", weight: "3 kg" },
  { name: "Halberd", category: "Marciais", type: "Corpo a corpo", damage: "1d10", damageType: "Cortante", properties: "Pesada, Alcance, Duas Mãos", cost: "20 po", weight: "3 kg" },
  { name: "Lança de Montaria", category: "Marciais", type: "Corpo a corpo", damage: "1d12", damageType: "Perfurante", properties: "Alcance, Especial", cost: "10 po", weight: "3 kg" },
  { name: "Maça Estrela", category: "Marciais", type: "Corpo a corpo", damage: "1d6", damageType: "Perfurante", properties: "", cost: "5 po", weight: "1 kg" },
  { name: "Martelo de Guerra", category: "Marciais", type: "Corpo a corpo", damage: "1d8", damageType: "Contundente", properties: "Versátil (1d10)", cost: "15 po", weight: "1 kg" },
  { name: "Martelo Grande", category: "Marciais", type: "Corpo a corpo", damage: "2d6", damageType: "Contundente", properties: "Pesada, Duas Mãos", cost: "10 po", weight: "5 kg" },
  { name: "Picareta de Guerra", category: "Marciais", type: "Corpo a corpo", damage: "1d8", damageType: "Perfurante", properties: "", cost: "5 po", weight: "1 kg" },
  { name: "Rapieira", category: "Marciais", type: "Corpo a corpo", damage: "1d8", damageType: "Perfurante", properties: "Acuidade", cost: "25 po", weight: "1 kg" },
  { name: "Cetro", category: "Marciais", type: "Corpo a corpo", damage: "1d6", damageType: "Contundente", properties: "Versátil (1d8)", cost: "2 po", weight: "2 kg" },
  { name: "Tridente", category: "Marciais", type: "Corpo a corpo", damage: "1d6", damageType: "Perfurante", properties: "Arremesso (20/60), Versátil (1d8)", cost: "5 po", weight: "2 kg" },
  { name: "Chicote", category: "Marciais", type: "Corpo a corpo", damage: "1d4", damageType: "Cortante", properties: "Acuidade, Alcance", cost: "2 po", weight: "1,5 kg" },

  // Martial Ranged Weapons
  { name: "Besta de Mão", category: "Marciais", type: "À distância", damage: "1d6", damageType: "Perfurante", properties: "Acuidade, Leve, Carregamento, Alcance (6/18)", cost: "75 po", weight: "1,5 kg" },
  { name: "Besta Pesada", category: "Marciais", type: "À distância", damage: "1d10", damageType: "Perfurante", properties: "Pesada, Carregamento, Duas Mãos, Alcance (30/120)", cost: "50 po", weight: "4,5 kg" },
  { name: "Besta de Repetição", category: "Marciais", type: "À distância", damage: "1d6", damageType: "Perfurante", properties: "Carregamento (6), Duas Mãos, Alcance (24/96)", cost: "250 po", weight: "4,5 kg" },
  { name: "Arco Longo", category: "Marciais", type: "À distância", damage: "1d8", damageType: "Perfurante", properties: "Pesada, Duas Mãos, Alcance (45/180)", cost: "50 po", weight: "1 kg" },
  { name: "Besta Leve", category: "Marciais", type: "À distância", damage: "1d8", damageType: "Perfurante", properties: "Carregamento, Duas Mãos, Alcance (24/96)", cost: "25 po", weight: "2,5 kg" },
  { name: "Rede", category: "Marciais", type: "À distância", damage: "0", damageType: "Contundente", properties: "Arremesso (1,5/4,5), Especial", cost: "1 po", weight: "1,5 kg" },
];