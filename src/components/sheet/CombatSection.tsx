"use client";
import { useCharStore } from "@/lib/store";
import { getTotalLevel, getHitDiceSummary, getProfBonus, totalCA, initiativeTotal, fmtMod } from "@/lib/calc";
import { SectionTitle, NumberInput, DeathDot, ToggleSwitch } from "@/components/ui";

export function CombatSection() {
  // Seletores para garantir atualização ao mudar DEX, raça ou bônus de iniciativa
  const dex = useCharStore((s) => s.attrs.dex);
  const raceKey = useCharStore((s) => s.raceKey);
  const initiativeBonus = useCharStore((s) => s.initiativeBonus);
  const store = useCharStore();
  const totalLevel = getTotalLevel(store);
  const hitDiceSummary = getHitDiceSummary(store);
  const prof = getProfBonus(totalLevel);
  const ca = totalCA(store);
  // Recalcula iniciativa sempre que DEX, raça ou bônus mudarem
  const initiative = initiativeTotal({ ...store, attrs: { ...store.attrs, dex }, raceKey, initiativeBonus });

  return (
    <div className="mb-5">
      <SectionTitle>Classe de Armadura, PV &amp; Defesa</SectionTitle>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">

        {/* CA + Hit Dice */}
        <div className="bg-parchment-200/60 border border-dnd-border rounded p-2.5 shadow-inset sm:p-3">
          <div className="text-[9px] tracking-[2px] uppercase text-dnd-red font-semibold mb-2">Classe de Armadura</div>
          <div className="text-center mb-3">
            <div
              className="mx-auto mb-2 flex h-16 w-16 flex-col items-center justify-center rounded-full border-2 border-dnd-gold sm:h-20 sm:w-20"
              style={{ background: "linear-gradient(135deg,#2c1810,#5a2010)", boxShadow: "0 0 12px rgba(139,105,20,.5)" }}
            >
              <span className="font-display text-[24px] leading-none text-parchment-200 sm:text-[30px]">{ca}</span>
              <span className="text-[8px] tracking-[2px] uppercase text-parchment-400">CA</span>
            </div>
            <div className="text-[10px] text-ink-light">Base 10 + armaduras equipadas</div>
          </div>

          <div className="border-t border-dnd-border/30 pt-2.5 sm:pt-3">
            <div className="text-[9px] tracking-[2px] uppercase text-dnd-red font-semibold mb-2">Dados de Vida</div>
            <div className="grid grid-cols-2 gap-1.5 mb-3 items-center">
              <span className="text-[10px] text-ink-light whitespace-nowrap">Total</span>
              <div className="min-w-0 border-b border-dnd-border bg-transparent py-1 text-center font-serif text-[11px] text-ink whitespace-nowrap">
                {hitDiceSummary}
              </div>
              <span className="text-[10px] text-ink-light whitespace-nowrap">Atual</span>
              <input
                type="text"
                value={store.hitDiceCurrent}
                onChange={(e) => store.setField("hitDiceCurrent", e.target.value)}
                placeholder="Ex: 1d10 + 2d8"
                className="min-w-0 w-full bg-transparent border-b border-dnd-border px-1 py-1 font-serif text-[11px] text-ink outline-none"
              />
            </div>

            <div className="text-[9px] tracking-[2px] uppercase text-dnd-red font-semibold mb-2">Testes de Morte</div>
            {(["successes","failures"] as const).map((type) => (
              <div key={type} className="mb-1.5 flex items-center gap-1.5">
                <span className="w-10 text-[9px] uppercase tracking-wide text-ink-light sm:w-12 sm:text-[10px]">
                  {type === "successes" ? "Sucesso" : "Falha"}
                </span>
                <div className="flex gap-1.5">
                  {([0,1,2] as const).map((i) => (
                    <DeathDot
                      key={i}
                      checked={store.deathSaves[type][i]}
                      type={type === "successes" ? "success" : "fail"}
                      onClick={() => store.toggleDeathSave(type, i)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HP */}
        <div className="bg-parchment-200/60 border border-dnd-border rounded p-2.5 shadow-inset sm:p-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="text-[9px] tracking-[2px] uppercase text-dnd-red font-semibold">Pontos de Vida</div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-[2px] text-ink-light">Concentração</span>
              <ToggleSwitch
                checked={store.isConcentrating}
                onChange={(checked) => store.setField("isConcentrating", checked)}
              />
            </div>
          </div>
          {[
            { label: "Máx",   field: "hpMax" as const,     size: "text-2xl" },
            { label: "Atual", field: "hpCurrent" as const,  size: "text-2xl" },
            { label: "Temp",  field: "hpTemp" as const,     size: "text-xl" },
          ].map(({ label, field, size }) => (
            <div key={field} className="mb-2 flex items-center gap-1.5">
              <span className="w-8 text-[10px] text-ink-light">{label}</span>
              <NumberInput
                value={store[field]}
                onChange={(e) => store.setField(field, parseInt(e.target.value) || 0)}
                className={`w-16 sm:w-20 ${size}`}
              />
            </div>
          ))}

          {/* HP Controls */}
          <div className="mt-3 pt-2 border-t border-dnd-border/30">
            <div className="text-[9px] tracking-[2px] uppercase text-dnd-red font-semibold mb-2">Controle de PV</div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[64px_auto_auto] sm:items-center">
              <input
                type="number"
                placeholder="Valor"
                className="w-full bg-transparent border-b border-dnd-border font-serif text-[12px] text-ink text-center outline-none"
                id="hp-change-value"
              />
              <button
                onClick={() => {
                  const input = document.getElementById('hp-change-value') as HTMLInputElement;
                  const value = parseInt(input.value) || 0;
                  if (value > 0) {
                    store.setField('hpCurrent', Math.min(store.hpCurrent + value, store.hpMax));
                    input.value = '';
                  }
                }}
                className="px-2 py-1 bg-dnd-green/20 border border-dnd-green rounded text-[10px] font-semibold text-dnd-green hover:bg-dnd-green/30 transition-colors"
              >
                + Curar
              </button>
              <button
                onClick={() => {
                  const input = document.getElementById('hp-change-value') as HTMLInputElement;
                  const value = parseInt(input.value) || 0;
                  if (value > 0) {
                    const tempLeft = Math.max(store.hpTemp - value, 0);
                    const overflow = Math.max(value - store.hpTemp, 0);
                    const newHp = Math.max(store.hpCurrent - overflow, 0);
                    store.setField('hpTemp', tempLeft);
                    store.setField('hpCurrent', newHp);
                    input.value = '';
                  }
                }}
                className="px-2 py-1 bg-dnd-red/20 border border-dnd-red rounded text-[10px] font-semibold text-dnd-red hover:bg-dnd-red/30 transition-colors"
              >
                - Dano
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Initiative / Speed summary */}
      {/* <div className="flex gap-3 mt-3 text-center">
        <div className="bg-parchment-200/60 border border-dnd-border rounded px-4 py-1.5">
          <span className="font-display text-2xl text-ink">{fmtMod(initiative)}</span>
          <div className="text-[8px] tracking-[2px] uppercase text-dnd-red font-semibold">Iniciativa</div>
        </div>
        <div className="bg-parchment-200/60 border border-dnd-border rounded px-4 py-1.5">
          <span className="font-display text-2xl text-ink">{store.speed}</span>
          <div className="text-[8px] tracking-[2px] uppercase text-dnd-red font-semibold">Deslocamento</div>
        </div>
        <div className="bg-parchment-200/60 border border-dnd-border rounded px-4 py-1.5">
          <span className="font-display text-2xl text-ink">{fmtMod(prof)}</span>
          <div className="text-[8px] tracking-[2px] uppercase text-dnd-red font-semibold">Proficiência</div>
        </div>
      </div>     */}

      
    </div>
  );
}