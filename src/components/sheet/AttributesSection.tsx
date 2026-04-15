"use client";
import { useCharStore } from "@/lib/store";
import { ATTR_LIST, SKILLS, PASSIVE_SKILLS } from "@/data/constants";
import { getTotalLevel, getProfBonus, getMod, fmtMod } from "@/lib/calc";
import { SectionTitle, ProfCircle, ProficiencyLegend } from "@/components/ui";
import type { AttrKey } from "@/types";
import { RACES } from "@/data/races";

export function AttributesSection() {
  const store = useCharStore();
  const prof = getProfBonus(getTotalLevel(store));
  const orderedAttrs: AttrKey[] = ["str", "dex", "con", "int", "wis", "cha"];
  const attrMap = Object.fromEntries(ATTR_LIST.map((attr) => [attr.id, attr])) as Record<AttrKey, (typeof ATTR_LIST)[number]>;

  const renderAttributeCard = (attrId: AttrKey) => {
    const attr = attrMap[attrId];
    const base = store.attrs[attr.id];
    const racialBonus = RACES[store.raceKey]?.asi?.[attr.id] ?? 0;
    const mod = getMod(base);
    const saveBonus = mod + (store.savingThrowProfs[attr.id] ? prof : 0);
    const attrSkills = SKILLS.map((skill, index) => ({ skill, index }))
      .filter(({ skill }) => skill.attr === attr.id);

    return (
      <div className="flex flex-col gap-1 break-inside-avoid">
        <div className="bg-parchment-200/60 border border-dnd-border rounded-xl p-2 shadow-inset text-center">
          <div className="text-[7px] tracking-[2px] uppercase text-dnd-red font-semibold">
            {attr.short}
          </div>
          <div className="text-[9px] uppercase text-ink-light tracking-[1px] mb-1">
            {attr.name}
          </div>

          {/* Círculo editável — valor base; badge mostra bônus racial */}
          <div className="relative inline-block">
            <input
              type="number"
              value={base}
              min={0}
              max={30}
              onChange={(e) => store.setAttr(attr.id, parseInt(e.target.value) || 0)}
              className="w-12 h-12 rounded-full border-2 border-dnd-border bg-parchment-200 font-display text-[18px]
                         text-ink text-center outline-none focus:border-dnd-red transition-colors
                         [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              title={racialBonus !== 0 ? `Base: ${base} + Racial: ${racialBonus}` : `Base: ${base}`}
            />
            {racialBonus !== 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-dnd-red text-white text-[7px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none pointer-events-none">
                +{racialBonus}
              </span>
            )}
          </div>

          <div className="mt-1">
            <div className="font-display text-[18px] text-ink font-bold leading-none">{fmtMod(mod)}</div>
            <div className="text-[7px] tracking-[1px] uppercase text-ink-light mt-0.5">Mod</div>
          </div>
        </div>

        <div className="bg-parchment-200/60 border border-dnd-border rounded-xl px-2 py-1 shadow-inset">
          <div className="text-[7px] tracking-[2px] uppercase text-dnd-red font-semibold mb-0.5">Salvaguarda</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ProfCircle
                level={store.savingThrowProfs[attr.id] ? 2 : 0}
                onClick={() => store.toggleSaveProf(attr.id)}
                title={`Clique para ${store.savingThrowProfs[attr.id] ? "remover" : "adicionar"} proficiência`}
              />
              <span className="font-serif text-[10px] text-ink">{attr.name || attr.short}</span>
            </div>
            <span className="font-display text-[13px] text-ink">{fmtMod(saveBonus)}</span>
          </div>
        </div>

        {attrSkills.length > 0 && (
          <div className="bg-parchment-200/60 border border-dnd-border rounded-xl px-2 py-1 shadow-inset">
            <div className="text-[7px] tracking-[2px] uppercase text-dnd-red font-semibold mb-0.5">Perícias</div>
            <div className="flex flex-col gap-0.5">
              {attrSkills.map(({ skill, index }) => {
                const lvlForBonus = (store.skillProfs[index] ?? 0) as 0 | 1 | 2 | 3;
                const profPart = lvlForBonus === 0 ? 0 : lvlForBonus === 1 ? Math.floor(prof / 2) : lvlForBonus === 2 ? prof : prof * 2;
                const bonus = mod + profPart;
                const level = lvlForBonus;
                return (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between rounded px-1 py-0.5 hover:bg-parchment-100/40"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <ProfCircle
                        level={level}
                        onClick={() => store.cycleSkillProf(index)}
                        title={`Clique para alternar proficiência em ${skill.name}`}
                      />
                      <span className="font-serif text-[10px] text-ink leading-tight">{skill.name}</span>
                    </div>
                    <span className="font-display text-[12px] text-ink">{fmtMod(bonus)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mb-5">
      <SectionTitle>Atributos, Salvaguardas &amp; Perícias</SectionTitle>

      <ProficiencyLegend className="mb-3" />

      <div className="print-attributes-grid mb-4 grid grid-cols-2 gap-2">
        <div className="col-span-2 mx-auto w-full max-w-[150px] bg-parchment-200/60 border border-dnd-border rounded-xl px-2 py-2 shadow-inset text-center">
          <div className="text-[7px] tracking-[2px] uppercase text-dnd-red font-semibold">Prof</div>
          <div className="font-display text-[20px] text-ink leading-none mt-1">{fmtMod(prof)}</div>
          <div className="text-[7px] tracking-[1px] uppercase text-ink-light mt-1">Bônus</div>
        </div>

        {orderedAttrs.map((attrId) => (
          <div key={attrId} className="mx-auto w-full max-w-[150px] min-w-0">
            {renderAttributeCard(attrId)}
          </div>
        ))}
      </div>

      {/* Passivas */}
      <div className="print-passive-grid grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
        {PASSIVE_SKILLS.map(({ label, skillName }) => {
          const index = SKILLS.findIndex((s) => s.name === skillName);
          const skill = index >= 0 ? SKILLS[index] : null;
          const passiveMod = skill ? getMod(store.attrs[skill.attr]) : 0;
          const passiveProf = index >= 0 ? (store.skillProfs[index] ?? 0) as 0 | 1 | 2 | 3 : 0;
          const passiveProfPart = passiveProf === 0 ? 0 : passiveProf === 1 ? Math.floor(prof / 2) : passiveProf === 2 ? prof : prof * 2;
          const bonus = passiveMod + passiveProfPart;
          return (
            <div key={label} className="bg-parchment-200/60 border border-dnd-border rounded px-3 py-2 text-center shadow-inset sm:px-4">
              <span className="font-display text-[20px] text-ink block leading-none">{10 + bonus}</span>
              <span className="text-[8px] tracking-[2px] uppercase text-dnd-red font-semibold mt-1 block">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}