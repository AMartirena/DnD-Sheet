import type { BackgroundData } from "@/types";
import { acolyte } from "./acolyte";
import { anthropologist } from "./anthropologist";
import { archaeologist } from "./archaeologist";
import { astralDrifter } from "./astralDrifter";
import { athlete } from "./athlete";
import { celebrityAdventurersScion } from "./celebrityAdventurersScion";
import { charlatan } from "./charlatan";
import { cityWatch } from "./cityWatch";
import { clanCrafter } from "./clanCrafter";
import { cloisteredScholar } from "./cloisteredScholar";
import { criminal } from "./criminal";
import { courtier } from "./courtier";
import { custom } from "./custom";
import { entertainer } from "./entertainer";
import { failedMerchant } from "./failedMerchant";
import { factionAgent } from "./factionAgent";
import { farTraveler } from "./farTraveler";
import { feylost } from "./feylost";
import { fisher } from "./fisher";
import { folk_hero } from "./folk_hero";
import { gambler } from "./gambler";
import { giantFoundling } from "./giantFoundling";
import { guild_artisan } from "./guild_artisan";
import { hauntedOne } from "./hauntedOne";
import { hermit } from "./hermit";
import { houseAgent } from "./houseAgent";
import { inheritor } from "./inheritor";
import { investigator } from "./investigator";
import { knightOfTheOrder } from "./knightOfTheOrder";
import { marine } from "./marine";
import { mercenaryVeteran } from "./mercenaryVeteran";
import { noble } from "./noble";
import { outlander } from "./outlander";
import { pirate } from "./pirate";
import { rewarded } from "./rewarded";
import { ruined } from "./ruined";
import { runeCarver } from "./runeCarver";
import { sage } from "./sage";
import { sailor } from "./sailor";
import { shipwright } from "./shipwright";
import { smuggler } from "./smuggler";
import { soldier } from "./soldier";
import { urbanBountyHunter } from "./urbanBountyHunter";
import { urchin } from "./urchin";
import { uthgardtTribeMember } from "./uthgardtTribeMember";
import { waterdhavianNoble } from "./waterdhavianNoble";
import { witchlightHand } from "./witchlightHand";

export const BACKGROUNDS: Record<string, BackgroundData> = {
  acolyte,
  anthropologist,
  archaeologist,
  astralDrifter,
  athlete,
  celebrityAdventurersScion,
  charlatan,
  cityWatch,
  clanCrafter,
  cloisteredScholar,
  criminal,
  courtier,
  entertainer,
  failedMerchant,
  factionAgent,
  farTraveler,
  feylost,
  fisher,
  folk_hero,
  gambler,
  giantFoundling,
  guild_artisan,
  hauntedOne,
  hermit,
  houseAgent,
  inheritor,
  investigator,
  knightOfTheOrder,
  marine,
  mercenaryVeteran,
  noble,
  outlander,
  pirate,
  rewarded,
  ruined,
  runeCarver,
  sage,
  sailor,
  shipwright,
  smuggler,
  soldier,
  urchin,
  urbanBountyHunter,
  uthgardtTribeMember,
  waterdhavianNoble,
  witchlightHand,
  custom,
};

export const BACKGROUND_GROUPS: { label: string; keys: string[] }[] = [
  {
    label: "PHB — Livro do Jogador",
    keys: [
      "acolyte",
      "charlatan",
      "criminal",
      "entertainer",
      "folk_hero",
      "guild_artisan",
      "hermit",
      "noble",
      "outlander",
      "pirate",
      "sage",
      "sailor",
      "soldier",
      "urchin",
    ],
  },
  {
    label: "SCAG — Sword Coast Adventurer's Guide",
    keys: [
      "cityWatch",
      "clanCrafter",
      "cloisteredScholar",
      "courtier",
      "factionAgent",
      "farTraveler",
      "inheritor",
      "knightOfTheOrder",
      "mercenaryVeteran",
      "urbanBountyHunter",
      "uthgardtTribeMember",
      "waterdhavianNoble",
    ],
  },
  {
    label: "ToA — Tomb of Annihilation",
    keys: ["anthropologist", "archaeologist"],
  },
  {
    label: "MOoT — Mythic Odysseys of Theros",
    keys: ["athlete"],
  },
  {
    label: "TWBtW — The Wild Beyond the Witchlight",
    keys: ["feylost", "witchlightHand"],
  },
  {
    label: "GoS — Ghosts of Saltmarsh",
    keys: ["fisher", "marine", "shipwright", "smuggler"],
  },
  {
    label: "BGG — Bigby Presents: Glory of the Giants",
    keys: ["giantFoundling", "runeCarver"],
  },
  {
    label: "CoS — Curse of Strahd",
    keys: ["hauntedOne"],
  },
  {
    label: "VRGR — Van Richten's Guide to Ravenloft",
    keys: ["investigator"],
  },
  {
    label: "SJ:AiS — Spelljammer: Adventures in Space",
    keys: ["astralDrifter", "rewarded", "ruined"],
  },
  {
    label: "AI — Acquisitions Incorporated",
    keys: ["celebrityAdventurersScion", "failedMerchant", "gambler"],
  },
  {
    label: "ERB — Eberron: Rising from the Last War",
    keys: ["houseAgent"],
  },
  {
    label: "Personalizado",
    keys: ["custom"],
  },
];