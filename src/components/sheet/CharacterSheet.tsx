"use client";
import { CharacterHeader }      from "./CharacterHeader";
import { ClassesSection }       from "./ClassesSection";
import { AttributesSection }    from "./AttributesSection";
import { CombatSection }        from "./CombatSection";
import { ProficienciesSection } from "./ProficienciesSection";
import { ArmorSection }         from "./ArmorSection";
import { AttacksSection }       from "./AttacksSection";
import { NotesSection }         from "./NotesSection";
import { Divider }              from "@/components/ui";
import { useCharStore }         from "@/lib/store";

export function CharacterSheet() {
  const resetSheet = useCharStore((s) => s.resetSheet);

  return (
    <div
      className="max-w-[960px] mx-auto rounded-sm border-[3px] border-dnd-border p-7"
      style={{
        background: "linear-gradient(160deg,#f9f0d0 0%,#f4e8c1 40%,#ecddb0 100%)",
        boxShadow: "0 0 0 6px #5a3e2b, 0 0 0 9px #d4bc7a, 0 20px 60px rgba(0,0,0,0.8)",
      }}
    >
      {/* Sheet header */}
      <div className="text-center border-b-[3px] border-double border-dnd-border pb-4 mb-5 relative">
        <div className="font-display text-[11px] tracking-[4px] uppercase text-dnd-red mb-0.5">
          Dungeons &amp; Dragons
        </div>
        <div className="font-display text-[26px] text-ink tracking-wide">
          Ficha de Personagem — 5ª Edição
        </div>
        <div className="text-dnd-gold text-[12px] tracking-[8px] mt-1 opacity-70">— ✦ ✦ ✦ —</div>
        {/* Reset button */}
        <button
          onClick={() => { if (confirm("Resetar ficha? Todos os dados serão apagados.")) resetSheet(); }}
          className="absolute top-0 right-0 text-[9px] tracking-wide uppercase text-ink-muted border border-dnd-border/50
                     rounded px-2 py-1 hover:border-dnd-red hover:text-dnd-red transition-colors"
        >
          ↺ Resetar
        </button>
      </div>

      <CharacterHeader />
      <Divider />
      <div className="grid gap-10 lg:grid-cols-[minmax(240px,280px)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-5">
          <AttributesSection />
          <ProficienciesSection />
        </div>

        <div className="space-y-5">
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

      {/* Footer */}
      <div className="text-center text-[10px] text-ink-muted font-serif italic tracking-wide mt-4">
        D&amp;D 5ª Edição — Ficha Digital Interativa • Dados salvos automaticamente no navegador
      </div>
    </div>
  );
}
