"use client";
import { useCharStore } from "@/lib/store";
import { getTotalLevel } from "@/lib/calc";
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
          <div key={cls.id} className="flex gap-2 items-start bg-parchment-200/60 border border-dnd-border rounded px-3 py-2">
            {/* Class name with preset dropdown */}
            <div className="flex-1 min-w-[160px]">
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
                  disabled={!cls.subclass.trim() || hasSubclassPanel(cls.id)}
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
            <div className="min-w-[70px]">
              <FieldLabel>Dado de Vida</FieldLabel>
              <SelectInput
                value={cls.hitDie}
                onChange={(e) => store.updateClass(cls.id, { hitDie: e.target.value })}
                className="w-20"
              >
                {["d4","d6","d8","d10","d12"].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </SelectInput>
            </div>

            {/* Level */}
            <div className="flex flex-col items-center">
              <FieldLabel className="text-center">Nv.</FieldLabel>
              <NumberInput
                value={cls.level}
                min={1}
                max={20}
                onChange={(e) => store.updateClass(cls.id, { level: parseInt(e.target.value) || 1 })}
                className="w-12 text-xl"
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

            {i > 0 && <DeleteButton onClick={() => store.removeClass(cls.id)} />}
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
          <NumberInput
            value={store.initiativeBonus}
            onChange={(e) => store.setField("initiativeBonus", parseInt(e.target.value) || 0)}
            className="w-16 text-2xl"
          />
          <span className="text-[8px] tracking-[2px] uppercase text-dnd-red font-semibold mt-1">
            Bônus Iniciativa
          </span>
        </div>
      </div>
    </div>
  );
}
