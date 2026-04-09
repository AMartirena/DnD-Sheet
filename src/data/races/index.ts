import type { RaceData } from "@/types";
import { aasimar } from "./aasimar";
import { aarakocra } from "./aarakocra";
import { bugbear } from "./bugbear";
import { changeling } from "./changeling";
import { custom } from "./custom";
import { dragonborn } from "./dragonborn";
import { dwarf_hill } from "./dwarf_hill";
import { dwarf_mountain } from "./dwarf_mountain";
import { elf_drow } from "./elf_drow";
import { elf_high } from "./elf_high";
import { elf_wood } from "./elf_wood";
import { firbolg } from "./firbolg";
import { genasi_air } from "./genasi_air";
import { genasi_earth } from "./genasi_earth";
import { genasi_fire } from "./genasi_fire";
import { genasi_water } from "./genasi_water";
import { githyanki } from "./githyanki";
import { githzerai } from "./githzerai";
import { goblin } from "./goblin";
import { gnome_forest } from "./gnome_forest";
import { gnome_rock } from "./gnome_rock";
import { goliath } from "./goliath";
import { half_elf } from "./half_elf";
import { half_orc } from "./half_orc";
import { halfling_lightfoot } from "./halfling_lightfoot";
import { halfling_stout } from "./halfling_stout";
import { hobgoblin } from "./hobgoblin";
import { human } from "./human";
import { human_v } from "./human_v";
import { kenku } from "./kenku";
import { kobold } from "./kobold";
import { lizardfolk } from "./lizardfolk";
import { orc } from "./orc";
import { shifter } from "./shifter";
import { tabaxi } from "./tabaxi";
import { tiefling } from "./tiefling";
import { tortle } from "./tortle";
import { triton } from "./triton";
import { yuan_ti } from "./yuan_ti";

export const RACES: Record<string, RaceData> = {
  human,
  human_v,
  dwarf_hill,
  dwarf_mountain,
  elf_high,
  elf_wood,
  elf_drow,
  halfling_lightfoot,
  halfling_stout,
  half_elf,
  half_orc,
  dragonborn,
  gnome_rock,
  gnome_forest,
  tiefling,
  aasimar,
  firbolg,
  goliath,
  kenku,
  lizardfolk,
  tabaxi,
  triton,
  bugbear,
  goblin,
  hobgoblin,
  kobold,
  orc,
  yuan_ti,
  aarakocra,
  genasi_air,
  genasi_earth,
  genasi_fire,
  genasi_water,
  githyanki,
  githzerai,
  tortle,
  changeling,
  shifter,
  custom,
};

export const RACE_GROUPS: { label: string; keys: string[] }[] = [
  {
    label: "PHB — Livro do Jogador",
    keys: [
      "human", "human_v", "dwarf_hill", "dwarf_mountain",
      "elf_high", "elf_wood", "elf_drow",
      "halfling_lightfoot", "halfling_stout",
      "half_elf", "half_orc", "dragonborn",
      "gnome_rock", "gnome_forest", "tiefling",
    ],
  },
  {
    label: "Volo's Guide / Xanathar's",
    keys: [
      "aasimar", "firbolg", "goliath", "kenku", "lizardfolk",
      "tabaxi", "triton", "bugbear", "goblin", "hobgoblin",
      "kobold", "orc", "yuan_ti",
    ],
  },
  {
    label: "Monsters of the Multiverse / Mordenkainen",
    keys: [
      "aarakocra", "genasi_air", "genasi_earth", "genasi_fire", "genasi_water",
      "githyanki", "githzerai", "tortle", "changeling", "shifter",
    ],
  },
  {
    label: "Personalizado",
    keys: ["custom"],
  },
];

export {
  aasimar,
  aarakocra,
  bugbear,
  changeling,
  custom,
  dragonborn,
  dwarf_hill,
  dwarf_mountain,
  elf_drow,
  elf_high,
  elf_wood,
  firbolg,
  genasi_air,
  genasi_earth,
  genasi_fire,
  genasi_water,
  githyanki,
  githzerai,
  goblin,
  gnome_forest,
  gnome_rock,
  goliath,
  half_elf,
  half_orc,
  halfling_lightfoot,
  halfling_stout,
  hobgoblin,
  human,
  human_v,
  kenku,
  kobold,
  lizardfolk,
  orc,
  shifter,
  tabaxi,
  tiefling,
  tortle,
  triton,
  yuan_ti,
};