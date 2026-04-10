// ─── Official D&D 5e armors from SRD ──────────────────────────────────────

export interface ArmorData {
  name: string;
  type: "Leve" | "Média" | "Pesada" | "Escudo";
  bonusCA: number;
  maxDex?: number; // Only for medium armor
  minStr?: number; // Only for heavy armor
  cost?: string;
  weight?: string;
  stealthDisadv?: boolean; // Whether the armor gives disadvantage on Stealth checks  
}

export const ARMORS: ArmorData[] = [
  // Light Armor
  { name: "Armadura Acolchoada", type: "Leve", bonusCA: 1, cost: "5 po", weight: "4 kg", stealthDisadv: true },
  { name: "Armadura de Couro", type: "Leve", bonusCA: 1, cost: "10 po", weight: "5 kg" },
  { name: "Couro Batido", type: "Leve", bonusCA: 2, cost: "45 po", weight: "6,5 kg" },

  // Medium Armor
  { name: "Gibão de Peles", type: "Média", bonusCA: 2, maxDex: 2, cost: "10 po", weight: "6 kg" },
  { name: "Camisão de Malha", type: "Média", bonusCA: 3, maxDex: 2, cost: "50 po", weight: "10 kg" },
  { name: "Brunea", type: "Média", bonusCA: 4, maxDex: 2, stealthDisadv: true,  cost: "50 po", weight: "22,5 kg" },
  { name: "Peitoral", type: "Média", bonusCA: 4, maxDex: 2, cost: "400 po", weight: "10 kg" },
  { name: "Meia Armadura", type: "Média", bonusCA: 5, maxDex: 2, cost: "750 po", weight: "20 kg" },

  // Heavy Armor
  { name: "Cota de Anéis", type: "Pesada", bonusCA: 4, stealthDisadv: true,  cost: "30 po", weight: "20 kg" },
  { name: "Cota de Malha", type: "Pesada", bonusCA: 6, minStr: 13, stealthDisadv: true,  cost: "75 po", weight: "27,5 kg" },
  { name: "Cota de Talas", type: "Pesada", bonusCA: 7, minStr: 15, stealthDisadv: true,  cost: "200 po", weight: "30 kg" },
  { name: "Armadura de Placas", type: "Pesada", bonusCA: 8, minStr: 15, stealthDisadv: true,  cost: "1500 po", weight: "32,5 kg" },

  // Shields
  { name: "Escudo", type: "Escudo", bonusCA: 2, cost: "10 po", weight: "3 kg" },
];