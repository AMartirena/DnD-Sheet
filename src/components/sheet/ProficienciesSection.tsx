"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { BACKGROUNDS } from "@/data/backgrounds";
import { RACES } from "@/data/races";
import { TRAIT_DESCRIPTIONS } from "@/data/races/raceTraits";
import { useCharStore } from "@/lib/store";
import { ARMOR_PROFICIENCY_OPTIONS, WEAPON_PROFICIENCY_OPTIONS } from "@/data/constants";
import { SectionTitle, FieldLabel, ProfCircle, AddRowButton, DeleteButton, TextInput } from "@/components/ui";
import type { ArmorProfType, BackgroundData, WeaponProfType } from "@/types";

function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
  minRows = 2,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={minRows}
      className="w-full overflow-hidden rounded border border-dnd-border bg-parchment-100/70 p-1.5 font-serif text-[11px] text-ink outline-none transition-colors focus:border-dnd-red resize-none"
    />
  );
}

function ProfPinGroup<T extends string>({
  options,
  values,
  onToggle,
}: {
  options: { key: T; label: string }[];
  values: Record<T, boolean>;
  onToggle: (key: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1.5">
      {options.map((option) => {
        const active = values[option.key];
        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onToggle(option.key)}
            className="flex items-center gap-1.5 rounded px-1 py-0.5 text-left hover:bg-parchment-100/50"
          >
            <ProfCircle
              level={active ? 2 : 0}
              title={option.label}
              size={12}
            />
            <span className="font-serif text-[10px] leading-none text-ink">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function buildBackgroundEntries(backgroundData: BackgroundData) {
  const bonusEntries = backgroundData.bonuses
    .split("•")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => ({
      title: entry,
      description: entry,
    }));

  return [
    ...bonusEntries,
    {
      title: backgroundData.featureName,
      description: backgroundData.featureDescription,
    },
  ];
}

function parseRaceTraits(rawTraits: string) {
  if (!rawTraits) return [];
  const cleaned = rawTraits.replace(/^[A-Z]{2}(?:[+-]\d+)?(?:\s*\/\s*[A-Z]{2}(?:[+-]\d+)?)*\s*•\s*/i, "");
  return cleaned
    .split("•")
    .map((item) => item.trim())
    .filter((item) => {
      const lower = item.toLowerCase();
      if (/^[a-z]{2,3}(?:[+-]\d+)?(?:\s*\/\s*[a-z]{2,3}(?:[+-]\d+)?)*$/i.test(item)) return false;
      if (lower.includes("deslocamento") || lower.includes("natação") || lower.includes("movimento")) return false;
      if (lower.match(/^\d+[\.,]\d*\s*m/) || lower.match(/\d+\.?\d*\s*m$/)) return false;
      return true;
    })
    .filter(Boolean);
}

function BackgroundTraitPanel({ backgroundData, customName }: {
  backgroundData: BackgroundData;
  customName: string;
}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const entries = buildBackgroundEntries(backgroundData);
  const displayName = customName || backgroundData.label;

  return (
    <div className="rounded-xl border border-dnd-border bg-parchment-200/60 px-2.5 py-2 mt-2 shadow-inset">
      <FieldLabel className="mb-1 text-[8px] text-dnd-red font-semibold tracking-[2px]">
        Antecedente
      </FieldLabel>
      <div className="text-[10px] text-ink-light mb-2">
        <span className="font-semibold text-ink">{displayName}</span>
        <span className="ml-1">[{backgroundData.source}]</span>
      </div>
      <div className="grid gap-1.5">
        {entries.map((entry, index) => (
          <button
            key={`${entry.title}-${index}`}
            type="button"
            onClick={() => setExpandedIndex(index === expandedIndex ? null : index)}
            className="rounded border border-dnd-border bg-parchment-100/80 px-2 py-1 text-left text-[10px] text-ink transition hover:border-dnd-red hover:bg-parchment-100"
          >
            {entry.title}
          </button>
        ))}
      </div>

      {expandedIndex !== null && entries[expandedIndex] && (
        <div className="mt-2 rounded border border-dnd-border bg-white/70 p-2 text-[11px] text-ink">
          <div className="mb-1 text-[8px] tracking-[2px] uppercase text-dnd-red font-semibold">Descrição</div>
          <p className="whitespace-pre-line">{entries[expandedIndex].description}</p>
        </div>
      )}
    </div>
  );
}

function RaceTraitPanel({ raceKey }: { raceKey: string }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const raceData = RACES[raceKey];
  const traits = parseRaceTraits(raceData?.traits ?? "");

  if (!raceData || traits.length === 0) return null;

  return (
    <div className="rounded-xl border border-dnd-border bg-parchment-200/60 px-2.5 py-2 mt-2 shadow-inset">
      <FieldLabel className="mb-1 text-[8px] text-dnd-red font-semibold tracking-[2px]">
        Traços Raciais
      </FieldLabel>
      <div className="text-[10px] text-ink-light mb-2">
        <span className="font-semibold text-ink">{raceData.label}</span>
        <span className="ml-1">[{raceData.source}]</span>
      </div>
      <div className="grid gap-1.5">
        {traits.map((trait, index) => (
          <button
            key={`${trait}-${index}`}
            type="button"
            onClick={() => setExpandedIndex(index === expandedIndex ? null : index)}
            className="rounded border border-dnd-border bg-parchment-100/80 px-2 py-1 text-left text-[10px] text-ink transition hover:border-dnd-red hover:bg-parchment-100"
          >
            {trait}
          </button>
        ))}
      </div>

      {expandedIndex !== null && traits[expandedIndex] && (
        <div className="mt-2 rounded border border-dnd-border bg-white/70 p-2 text-[11px] text-ink">
          <div className="mb-1 text-[8px] tracking-[2px] uppercase text-dnd-red font-semibold">Descrição</div>
          <p className="whitespace-pre-line">{TRAIT_DESCRIPTIONS[traits[expandedIndex]] || traits[expandedIndex]}</p>
        </div>
      )}
    </div>
  );
}

function SubclassTraitPanel({ classId, subclassName, className }: {
  classId: string;
  subclassName: string;
  className: string;
}) {
  const store = useCharStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const subclassTraits = store.subclassTraits.filter((trait) => trait.ownerClassId === classId);

  return (
    <div className="rounded-xl border border-dnd-border bg-parchment-200/60 px-2.5 py-2 mt-2 shadow-inset">
      <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
        <div>
          <FieldLabel className="mb-1 text-[8px] text-dnd-red font-semibold tracking-[2px]">
            Arquétipo / Subclasse
          </FieldLabel>
          <div className="text-[10px] text-ink-light">
            <span className="font-semibold text-ink">{subclassName}</span>
            {className.trim() && <span className="ml-1">• {className}</span>}
          </div>
        </div>
        <AddRowButton onClick={() => store.addSubclassTrait(classId)}>+ Adicionar</AddRowButton>
      </div>

      {subclassTraits.length === 0 ? (
        <div className="rounded border border-dashed border-dnd-border bg-parchment-100/40 px-2 py-2 text-[10px] text-ink-light">
          Adicione habilidades próprias desta subclasse para manter a descrição expansível nesta área.
        </div>
      ) : (
        <div className="grid gap-1.5">
          {subclassTraits.map((trait) => {
            const expanded = expandedId === trait.id;
            return (
              <div key={trait.id} className="rounded border border-dnd-border bg-parchment-100/80 px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : trait.id)}
                    className="flex-1 text-left text-[10px] text-ink transition hover:text-dnd-red"
                  >
                    {trait.title.trim() || "Nova habilidade de subclasse"}
                  </button>
                  <DeleteButton
                    onClick={() => {
                      if (expanded) setExpandedId(null);
                      store.removeSubclassTrait(trait.id);
                    }}
                  />
                </div>

                {expanded && (
                  <div className="mt-2 rounded border border-dnd-border bg-white/70 p-2">
                    <div className="mb-2">
                      <FieldLabel className="mb-1 text-[8px] text-dnd-red font-semibold tracking-[2px]">Nome</FieldLabel>
                      <TextInput
                        value={trait.title}
                        onChange={(e) => store.updateSubclassTrait(trait.id, { title: e.target.value })}
                        placeholder="Ex: Fúria, Canalizar Divindade, Truques de Ladrão"
                      />
                    </div>
                    <div>
                      <FieldLabel className="mb-1 text-[8px] text-dnd-red font-semibold tracking-[2px]">Descrição</FieldLabel>
                      <textarea
                        value={trait.description}
                        onChange={(e) => store.updateSubclassTrait(trait.id, { description: e.target.value })}
                        placeholder="Escreva a habilidade completa aqui."
                        rows={5}
                        className="w-full resize-y rounded border border-dnd-border bg-parchment-100/70 p-1.5 font-serif text-[11px] text-ink outline-none transition-colors focus:border-dnd-red"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ProficienciesSection() {
  const store = useCharStore();
  const backgroundData = BACKGROUNDS[store.backgroundKey];
  const subclassPanels = store.classes.filter(
    (cls) => store.subclassPanels.includes(cls.id) && cls.subclass.trim()
  );

  return (
    <div className="mb-5">
      <SectionTitle>Proficiências</SectionTitle>

      <div className="rounded-xl border border-dnd-border bg-parchment-200/60 px-2.5 py-2 shadow-inset">
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-center">
          <FieldLabel className="mb-0 text-[8px] text-dnd-red font-semibold tracking-[2px]">Armaduras</FieldLabel>
          <ProfPinGroup<ArmorProfType>
            options={ARMOR_PROFICIENCY_OPTIONS}
            values={store.proficiencies.armor}
            onToggle={store.toggleArmorProf}
          />

          <FieldLabel className="mb-0 text-[8px] text-dnd-red font-semibold tracking-[2px]">Armas</FieldLabel>
          <ProfPinGroup<WeaponProfType>
            options={WEAPON_PROFICIENCY_OPTIONS}
            values={store.proficiencies.weapons}
            onToggle={store.toggleWeaponProf}
          />
        </div>
      </div>

      <div className="rounded-xl border border-dnd-border bg-parchment-200/60 px-2.5 py-2 mt-2 shadow-inset">
        <FieldLabel className="mb-1 text-[8px] text-dnd-red font-semibold tracking-[2px]">Personalizadas</FieldLabel>
        <AutoResizeTextarea
          value={store.proficiencies.custom}
          onChange={store.setCustomProficiencies}
          placeholder="Itens personalizados"
          minRows={3}
        />
      </div>

      {backgroundData && (
        <BackgroundTraitPanel
          backgroundData={backgroundData}
          customName={store.backgroundKey === "custom" ? store.background : ""}
        />
      )}

      {store.raceKey && <RaceTraitPanel raceKey={store.raceKey} />}

      {subclassPanels.map((cls) => (
        <SubclassTraitPanel
          key={cls.id}
          classId={cls.id}
          subclassName={cls.subclass}
          className={cls.name}
        />
      ))}
    </div>
  );
}