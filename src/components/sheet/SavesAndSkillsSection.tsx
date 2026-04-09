"use client";
import { useCharStore } from "@/lib/store";
import { ATTR_LIST, SKILLS, PASSIVE_SKILLS } from "@/data/constants";
import { getTotalLevel, getProfBonus, savingThrowBonus, skillBonus, fmtMod } from "@/lib/calc";
import { SectionTitle, ProfCircle, ProficiencyLegend } from "@/components/ui";
import type { AttrKey } from "@/types";

export function SavesAndSkillsSection() {
  const store = useCharStore();
  const prof = getProfBonus(getTotalLevel(store));

  return (
    <div className="mb-5">
      <SectionTitle>Salvaguardas &amp; Perícias</SectionTitle>

      <div className="grid grid-cols-2 gap-5 max-sm:grid-cols-1">
        {/* ── Saving Throws ─────────────────────────────────── */}
        <div>
          <div className="text-[9px] tracking-[2px] uppercase text-dnd-red font-semibold mb-2">
            Salvaguardas
          </div>
          <div className="space-y-0.5">
            {ATTR_LIST.map((a) => {
              const bonus = savingThrowBonus(store, a.id, prof);
              return (
                <div
                  key={a.id}
                  className="flex items-center gap-2 py-1 border-b border-dnd-border/20 hover:bg-parchment-100/40"
                >
                  <ProfCircle
                    level={store.savingThrowProfs[a.id] ? 2 : 0}
                    onClick={() => store.toggleSaveProf(a.id)}
                    title={`Clique para ${store.savingThrowProfs[a.id] ? "remover" : "adicionar"} proficiência`}
                  />
                  <span className="font-serif text-[12px] text-ink flex-1">{a.name}</span>
                  <span className="font-display text-[14px] text-ink w-8 text-right">{fmtMod(bonus)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Skills ────────────────────────────────────────── */}
        <div>
          <div className="text-[9px] tracking-[2px] uppercase text-dnd-red font-semibold mb-2">Perícias</div>

          <ProficiencyLegend className="mb-2" />

          <div className="space-y-0.5">
            {SKILLS.map((skill, i) => {
              const attrShort = ATTR_LIST.find((a) => a.id === skill.attr)?.short ?? "";
              const bonus = skillBonus(store, i, prof);
              const lvl = (store.skillProfs[i] ?? 0) as 0 | 1 | 2 | 3;
              return (
                <div
                  key={skill.name}
                  className="flex items-center gap-2 py-0.5 border-b border-dnd-border/20 hover:bg-parchment-100/40"
                >
                  <ProfCircle level={lvl} onClick={() => store.cycleSkillProf(i)} />
                  <span className="font-serif text-[12px] text-ink flex-1">{skill.name}</span>
                  <span className="text-[9px] text-ink-muted uppercase tracking-wide">{attrShort}</span>
                  <span className="font-display text-[14px] text-ink w-8 text-right">{fmtMod(bonus)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Passive Scores ───────────────────────────────────── */}
      <div className="flex gap-3 mt-4 flex-wrap">
        {PASSIVE_SKILLS.map(({ label, skillName }) => {
          const i = SKILLS.findIndex((s) => s.name === skillName);
          const bonus = i >= 0 ? skillBonus(store, i, prof) : 0;
          return (
            <div key={label} className="bg-parchment-200/60 border border-dnd-border rounded px-4 py-2 text-center shadow-inset">
              <span className="font-display text-[20px] text-ink block leading-none">{10 + bonus}</span>
              <span className="text-[8px] tracking-[2px] uppercase text-dnd-red font-semibold mt-1 block">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
