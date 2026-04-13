"use client";
import { useCharStore } from "@/lib/store";
import { getTotalLevel, getMod } from "@/lib/calc";
import { RACES } from "@/data/races";
import { CLASS_PRESETS } from "@/data/constants";
import { SectionTitle, TextInput, NumberInput, SelectInput, StatPill, AddRowButton, DeleteButton, FieldLabel } from "@/components/ui";

export function ClassesSection() {
  const store = useCharStore();
  const totalLevel = getTotalLevel(store);
  const hasSubclassPanel = (classId: string) => store.subclassPanels.includes(classId);

  return (
    <div className="mb-5">
      <SectionTitle>Classe(s) &amp; Nível</SectionTitle>

      <div className="space-y-2 mb-3">
        {store.classes.map((cls, i) => (
          <div key={cls.id} className="grid gap-2 bg-parchment-200/60 border border-dnd-border rounded px-2 py-2 sm:px-3 sm:grid-cols-[minmax(0,1fr)_80px_52px_auto_auto] sm:items-start">
            {/* Class name with preset dropdown */}
            <div className="min-w-0">
              <FieldLabel>{i === 0 ? "Classe Principal" : "Multiclasse"}</FieldLabel>
              <div className="flex gap-1">
                <TextInput
                  value={cls.name}
                  onChange={(e) => store.updateClass(cls.id, { name: e.target.value })}
                  placeholder={i === 0 ? "Ex: Guerreiro ou Outro/Personalizado" : "Ex: Ladino ou Outro/Personalizado"}
                  list={`class-presets-${cls.id}`}
                  className="flex-1"
                />
                <datalist id={`class-presets-${cls.id}`}>
                  <option value="Outro/Personalizado" />
                  {Object.keys(CLASS_PRESETS).map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              <div className="mt-1 flex gap-1">
                <TextInput
                  value={cls.subclass}
                  onChange={(e) => store.updateClass(cls.id, { subclass: e.target.value })}
                  placeholder="Arquétipo / Subclasse"
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => {
                    const subclassName = cls.subclass.trim();
                    if (!subclassName || hasSubclassPanel(cls.id)) return;
                    store.addSubclassPanel(cls.id);
                  }}
                  disabled={!String(cls.subclass || '').trim() || hasSubclassPanel(cls.id)}
                  className="shrink-0 rounded border border-dnd-red/50 px-2 py-1 text-[9px] uppercase tracking-[1.5px] text-dnd-red transition-colors hover:bg-dnd-red/10 disabled:cursor-not-allowed disabled:opacity-50"
                  title={hasSubclassPanel(cls.id)
                    ? "Esta subclasse já possui um painel próprio"
                    : "Criar painel próprio para esta subclasse"
                  }
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Hit die */}
            <div className="min-w-0">
              <FieldLabel>Dado de Vida</FieldLabel>
              <SelectInput
                value={cls.hitDie}
                onChange={(e) => store.updateClass(cls.id, { hitDie: e.target.value })}
                className="w-full sm:w-20"
              >
                {["d4","d6","d8","d10","d12"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </SelectInput>
            </div>

            {/* Level */}
            <div className="flex flex-col items-start sm:items-center">
              <FieldLabel className="text-left sm:text-center">Nv.</FieldLabel>
              <NumberInput
                value={cls.level}
                min={1}
                max={20}
                onChange={(e) => store.updateClass(cls.id, { level: parseInt(e.target.value) || 1 })}
                className="w-14 sm:w-12 text-xl"
              />
            </div>

            <button
              type="button"
              disabled={!CLASS_PRESETS[cls.name]}
              className="text-[9px] tracking-wide uppercase text-dnd-gold border border-dnd-gold/50 rounded px-2 py-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dnd-gold/10"
              onClick={() => {
                const preset = CLASS_PRESETS[cls.name];
                if (!preset) return;
                store.updateClass(cls.id, { hitDie: preset.hitDie });
                // apply saving throws for primary class
                if (i === 0) {
                  const newSaves = { ...store.savingThrowProfs };
                  (Object.keys(newSaves) as (keyof typeof newSaves)[]).forEach((k) => newSaves[k] = false);
                  preset.savingThrows.forEach((k) => (newSaves[k] = true));
                  store.setField("savingThrowProfs", newSaves);
                }
              }}
              title={CLASS_PRESETS[cls.name]
                ? "Aplicar dados e salvaguardas padrão desta classe"
                : "Escolha uma classe da lista para habilitar o Auto"
              }
            >
              ✦ Auto
            </button>

            <div className="flex items-start justify-end sm:pt-5">
              {i > 0 && <DeleteButton onClick={() => store.removeClass(cls.id)} />}
            </div>
          </div>
        ))}
      </div>

      <AddRowButton onClick={store.addClass}>+ Adicionar Multiclasse</AddRowButton>

      {/* Summary pills */}
      <div className="flex gap-3 flex-wrap mt-4 justify-center">
        <StatPill value={totalLevel} label="Nível Total" size="lg" />
        <div className="flex flex-col items-center bg-parchment-200/60 border border-dnd-border rounded px-4 py-2 shadow-inset">
          <NumberInput
            value={store.speed}
            onChange={(e) => store.setField("speed", parseFloat(e.target.value) || 9)}
            className="w-16 text-2xl"
          />
          <span className="text-[8px] tracking-[2px] uppercase text-dnd-red font-semibold mt-1">
            Deslocamento (m)
          </span>
        </div>
        <div className="flex flex-col items-center bg-parchment-200/60 border border-dnd-border rounded px-4 py-2 shadow-inset">
          {(() => {
            // Cálculo automático: mod DEX + bônus racial
            const racial = RACES[store.raceKey]?.asi?.dex ?? 0;
            const dexMod = getMod((store.attrs.dex ?? 10) + racial);
            const autoValue = dexMod;
            const manual = store.initiativeBonus;
            const isAuto = manual === 0 || manual === null || manual === undefined;
            return (
              <>
                <NumberInput
                  value={isAuto ? autoValue : manual}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (isNaN(val) || val === autoValue) {
                      store.setField("initiativeBonus", 0); // volta para automático
                    } else {
                      store.setField("initiativeBonus", val);
                    }
                  }}
                  className="w-16 text-2xl"
                />
                <span className="text-[8px] tracking-[2px] uppercase text-dnd-red font-semibold mt-1">
                  Bônus Iniciativa
                </span>
                {!isAuto && (
                  <button
                    type="button"
                    className="mt-1 text-xs text-dnd-red underline hover:text-dnd-gold"
                    onClick={() => store.setField("initiativeBonus", 0)}
                  >
                    Resetar para automático
                  </button>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
