"use client";
import { CharacterHeader }      from "./CharacterHeader";
import { ClassesSection }       from "./ClassesSection";
import { AttributesSection }    from "./AttributesSection";
import { CombatSection }        from "./CombatSection";
import { ProficienciesSection } from "./ProficienciesSection";
import { ArmorSection }         from "./ArmorSection";
import { AttacksSection }       from "./AttacksSection";
import { NotesSection }         from "./NotesSection";
import { SpellSection }         from "./SpellSection";
import { Divider }              from "@/components/ui";
import { useCharStore }         from "@/lib/store";

export function CharacterSheet() {
  const resetSheet = useCharStore((s) => s.resetSheet);

  return (
    <div
      className="print-sheet mx-auto w-full max-w-[960px] overflow-hidden rounded-sm border-[3px] border-dnd-border p-2.5 sm:p-5 md:p-7"
      style={{
        background: "linear-gradient(160deg,#f9f0d0 0%,#f4e8c1 40%,#ecddb0 100%)",
        boxShadow: "0 0 0 6px #5a3e2b, 0 0 0 9px #d4bc7a, 0 20px 60px rgba(0,0,0,0.8)",
      }}
    >
      {/* Sheet header */}
      <div className="mb-4 border-b-[3px] border-double border-dnd-border pb-3 text-center sm:mb-5 sm:pb-4">
        <div className="font-display text-[9px] tracking-[3px] uppercase text-dnd-red sm:text-[11px] sm:tracking-[4px] mb-0.5">
          Dungeons &amp; Dragons
        </div>
        <div className="font-display text-[20px] text-ink tracking-wide sm:text-[24px] md:text-[26px]">
          Ficha de Personagem — 5ª Edição
        </div>
        <div className="mt-1 text-[10px] tracking-[5px] text-dnd-gold opacity-70 sm:text-[12px] sm:tracking-[8px]">— ✦ ✦ ✦ —</div>
        <div className="print-hidden mt-3 flex flex-wrap justify-center gap-2 sm:absolute sm:right-0 sm:top-0 sm:mt-0 sm:justify-end">
          <button
            onClick={() => { if (confirm("Resetar ficha? Todos os dados serão apagados.")) resetSheet(); }}
            className="inline-flex rounded border border-dnd-border/50 px-2 py-1 text-[9px] uppercase tracking-wide text-ink-muted transition-colors hover:border-dnd-red hover:text-dnd-red"
          >
            ↺ Resetar
          </button>
        </div>
      </div>

      <CharacterHeader />
      <Divider />
      <div className="sheet-main-grid grid gap-4 sm:gap-5 md:gap-8 lg:grid-cols-[minmax(240px,280px)_minmax(0,1fr)] lg:items-start lg:gap-10">
        <div className="sheet-sidebar-column space-y-4 sm:space-y-5">
          <AttributesSection />
          <ProficienciesSection />
        </div>

        <div className="sheet-content-column print-content-grid space-y-4 sm:space-y-5">
          <ClassesSection />
          <Divider />
          <CombatSection />
          <Divider />
          <ArmorSection />
          <Divider />
          <AttacksSection />
          <Divider />
          <NotesSection />
        </div>
      </div>

      <Divider />
      <SpellSection />

      {/* Footer */}
      <div className="print-hidden mt-4 text-center font-serif text-[9px] italic tracking-wide text-ink-muted sm:text-[10px]">
        D&amp;D 5ª Edição — Ficha Digital Interativa • Dados salvos automaticamente no navegador
      </div>
    </div>
  );
}
