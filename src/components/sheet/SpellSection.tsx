"use client";

import { useState } from "react";
import { useCharStore } from "@/lib/store";
import { getProfBonus, getTotalLevel, spellAttackBonusFn, spellSaveDC } from "@/lib/calc";
import { ATTR_LIST } from "@/data/constants";
import { AddRowButton, ConfirmDeleteButton, FieldLabel, NumberInput, ProfCircle, SectionTitle, SelectInput } from "@/components/ui";
import type { AttrKey, SpellEntry, SpellLevelState, SpellcastingProfile } from "@/types";

const SPELL_LEVEL_LABELS = [
  "Truques",
  "1º Nível",
  "2º Nível",
  "3º Nível",
  "4º Nível",
  "5º Nível",
  "6º Nível",
  "7º Nível",
  "8º Nível",
  "9º Nível",
];

function createSpellEntry(level: number): SpellEntry {
  return {
    id: `spell_${level}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: "",
    castingTime: "",
    range: "",
    duration: "",
    verbal: false,
    somatic: false,
    material: false,
    prepared: level === 0,
    ritual: false,
    concentration: false,
    description: "",
    notes: "",
  };
}

function autoResizeTextarea(textarea: HTMLTextAreaElement) {
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

function createSpellcastingProfile(index: number): SpellcastingProfile {
  return {
    id: `spellcasting_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    label: `Conjurador ${index + 1}`,
    ability: "",
  };
}

export function SpellSection() {
  const store = useCharStore();
  const [expandedSpellIds, setExpandedSpellIds] = useState<string[]>([]);
  const [expandedSlotLevels, setExpandedSlotLevels] = useState<number[]>([]);
  const prof = getProfBonus(getTotalLevel(store));

  const updateSpellbook = (updater: (spellbook: SpellLevelState[]) => SpellLevelState[]) => {
    store.setField("spellbook", updater(store.spellbook));
  };

  const updateSpellcastingProfiles = (updater: (profiles: SpellcastingProfile[]) => SpellcastingProfile[]) => {
    store.setField("spellcastingProfiles", updater(store.spellcastingProfiles));
  };

  const updateSpellLevel = (level: number, patch: Partial<SpellLevelState>) => {
    updateSpellbook((spellbook) =>
      spellbook.map((entry) =>
        entry.level === level
          ? {
              ...entry,
              ...patch,
              slotsTotal: Math.max(0, patch.slotsTotal ?? entry.slotsTotal),
              slotsUsed: Math.max(0, Math.min(patch.slotsUsed ?? entry.slotsUsed, patch.slotsTotal ?? entry.slotsTotal)),
            }
          : entry,
      ),
    );
  };

  const addSpell = (level: number) => {
    updateSpellbook((spellbook) =>
      spellbook.map((entry) =>
        entry.level === level
          ? { ...entry, spells: [...entry.spells, createSpellEntry(level)] }
          : entry,
      ),
    );
  };

  const updateSpell = (level: number, spellId: string, patch: Partial<SpellEntry>) => {
    updateSpellbook((spellbook) =>
      spellbook.map((entry) =>
        entry.level === level
          ? {
              ...entry,
              spells: entry.spells.map((spell) => (spell.id === spellId ? { ...spell, ...patch } : spell)),
            }
          : entry,
      ),
    );
  };

  const removeSpell = (level: number, spellId: string) => {
    setExpandedSpellIds((current) => current.filter((id) => id !== spellId));
    updateSpellbook((spellbook) =>
      spellbook.map((entry) =>
        entry.level === level
          ? { ...entry, spells: entry.spells.filter((spell) => spell.id !== spellId) }
          : entry,
      ),
    );
  };

  const toggleSpellExpansion = (spellId: string) => {
    setExpandedSpellIds((current) =>
      current.includes(spellId)
        ? current.filter((id) => id !== spellId)
        : [...current, spellId],
    );
  };

  const toggleSlotLevelExpansion = (level: number) => {
    setExpandedSlotLevels((current) =>
      current.includes(level)
        ? current.filter((entryLevel) => entryLevel !== level)
        : [...current, level],
    );
  };

  const addSpellcastingProfile = () => {
    updateSpellcastingProfiles((profiles) => [...profiles, createSpellcastingProfile(profiles.length)]);
  };

  const updateSpellcastingProfile = (profileId: string, patch: Partial<SpellcastingProfile>) => {
    updateSpellcastingProfiles((profiles) =>
      profiles.map((profile) => (profile.id === profileId ? { ...profile, ...patch } : profile)),
    );
  };

  const removeSpellcastingProfile = (profileId: string) => {
    updateSpellcastingProfiles((profiles) => {
      if (profiles.length <= 1) {
        return profiles.map((profile) =>
          profile.id === profileId ? { ...profile, label: profile.label || "Conjurador 1", ability: "" } : profile,
        );
      }

      return profiles.filter((profile) => profile.id !== profileId);
    });
  };

  return (
    <div className="print-full-section mb-5">
      <SectionTitle>Magias &amp; Espaços de Magia</SectionTitle>

      <div className="mb-4 rounded-xl border border-dnd-border bg-parchment-200/60 p-2.5 shadow-inset sm:p-3">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-[9px] font-semibold uppercase tracking-[2px] text-dnd-red">CDs de Magia</div>
          <AddRowButton onClick={addSpellcastingProfile}>+ Adicionar Conjurador</AddRowButton>
        </div>

        <div className="space-y-2">
          {store.spellcastingProfiles.map((profile, index) => {
            const dc = spellSaveDC(store, prof, profile.ability);
            const spellAttackBonus = spellAttackBonusFn(store, prof, profile.ability);

            return (
              <div key={profile.id} className="rounded border border-dnd-border bg-parchment-100/60 p-2">
                <div className="space-y-2">
                  <div className="flex items-end gap-2">
                    <div className="min-w-0 flex-1">
                      <FieldLabel>Classe Conjuradora</FieldLabel>
                      <input
                        type="text"
                        value={profile.label}
                        onChange={(e) => updateSpellcastingProfile(profile.id, { label: e.target.value })}
                        placeholder={`Conjurador ${index + 1}`}
                        className="w-full rounded border border-dnd-border bg-parchment-200/50 px-2 py-1 font-serif text-[12px] text-ink outline-none transition-colors focus:border-dnd-red"
                      />
                    </div>

                    <div>
                      <FieldLabel>Atributo</FieldLabel>
                      <SelectInput
                        value={profile.ability}
                        onChange={(e) => updateSpellcastingProfile(profile.id, { ability: e.target.value as AttrKey | "" })}
                        className="min-w-[88px]"
                      >
                        <option value="">— Nenhum —</option>
                        {ATTR_LIST.map((attr) => (
                          <option key={attr.id} value={attr.id}>
                            {attr.short}
                          </option>
                        ))}
                      </SelectInput>
                    </div>

                    <div className="flex justify-end pb-1">
                      <ConfirmDeleteButton onConfirm={() => removeSpellcastingProfile(profile.id)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded border border-dnd-border bg-parchment-100/60 px-2 py-2 text-center">
                      <div className="font-display text-[20px] leading-none text-ink sm:text-[24px]">{dc}</div>
                      <div className="mt-1 text-[8px] uppercase tracking-[2px] text-dnd-red">CD</div>
                    </div>

                    <div className="rounded border border-dnd-border bg-parchment-100/60 px-2 py-2 text-center">
                      <div className="font-display text-[20px] leading-none text-ink sm:text-[24px]">{spellAttackBonus >= 0 ? `+${spellAttackBonus}` : spellAttackBonus}</div>
                      <div className="mt-1 text-[8px] uppercase tracking-[2px] text-dnd-red">Ataque</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-[11px] text-ink-light">
          Organize truques e magias por nível, marque preparo e acompanhe os espaços gastos de cada círculo.
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-dnd-border bg-parchment-200/60 p-2.5 shadow-inset sm:p-3">
        <div className="mb-2 text-[9px] font-semibold uppercase tracking-[2px] text-dnd-red">Espaços de Magia</div>
        <div className="grid gap-1 sm:grid-cols-2 xl:grid-cols-3">
          {store.spellbook
            .filter((levelEntry) => levelEntry.level > 0)
            .map((levelEntry) => {
              const isExpanded = expandedSlotLevels.includes(levelEntry.level);

              return (
                <div key={`slots-${levelEntry.level}`} className="rounded border border-dnd-border bg-parchment-100/50">
                  <button
                    type="button"
                    onClick={() => toggleSlotLevelExpansion(levelEntry.level)}
                    className="flex w-full items-center gap-2 px-2 py-1.5 text-left transition-colors hover:bg-parchment-100/70"
                  >
                    <span className="font-serif text-[11px] text-ink flex-1 truncate">{SPELL_LEVEL_LABELS[levelEntry.level]}</span>
                    <span className="font-display text-[12px] text-ink w-12 text-right">{levelEntry.slotsUsed}/{levelEntry.slotsTotal}</span>
                    <span className="text-[9px] uppercase tracking-[2px] text-dnd-red">{isExpanded ? "Ocultar" : "Abrir"}</span>
                  </button>

                  {isExpanded && (
                    <div className="grid grid-cols-2 gap-2 border-t border-dnd-border/70 px-2 py-2">
                      <div>
                        <FieldLabel>Total</FieldLabel>
                        <NumberInput
                          value={levelEntry.slotsTotal}
                          onChange={(e) => {
                            const slotsTotal = Math.max(0, parseInt(e.target.value, 10) || 0);
                            updateSpellLevel(levelEntry.level, {
                              slotsTotal,
                              slotsUsed: Math.min(levelEntry.slotsUsed, slotsTotal),
                            });
                          }}
                          className="w-full text-base"
                        />
                      </div>

                      <div>
                        <FieldLabel>Gastos</FieldLabel>
                        <NumberInput
                          value={levelEntry.slotsUsed}
                          onChange={(e) => {
                            const slotsUsed = Math.max(0, parseInt(e.target.value, 10) || 0);
                            updateSpellLevel(levelEntry.level, {
                              slotsUsed: Math.min(slotsUsed, levelEntry.slotsTotal),
                            });
                          }}
                          className="w-full text-base"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      <div className="space-y-3">
        {store.spellbook
          .filter((levelEntry) => levelEntry.level === 0 || levelEntry.slotsTotal > 0)
          .map((levelEntry) => {
          const isCantrip = levelEntry.level === 0;
          return (
            <div key={levelEntry.level} className="rounded-xl border border-dnd-border bg-parchment-200/60 p-2.5 shadow-inset sm:p-3">
              <div className="mb-3">
                <div>
                  <div className="text-[9px] uppercase tracking-[2px] text-dnd-red font-semibold">{SPELL_LEVEL_LABELS[levelEntry.level]}</div>
                  <div className="text-[11px] text-ink-light">
                    {isCantrip ? "Magias de uso livre, sem gastar espaço." : "Lista de magias conhecidas ou preparadas desse círculo."}
                  </div>
                </div>
              </div>

              {levelEntry.spells.length === 0 ? (
                <div className="rounded border border-dashed border-dnd-border bg-parchment-100/40 px-3 py-3 text-[12px] text-ink-light">
                  Nenhuma magia adicionada nesse nível ainda.
                </div>
              ) : (
                <div className="space-y-2">
                  {levelEntry.spells.map((spell) => (
                    <div key={spell.id} className="rounded border border-dnd-border bg-parchment-100/60 p-2">
                      <div className="flex items-start gap-2">
                        <button
                          type="button"
                          onClick={() => toggleSpellExpansion(spell.id)}
                          className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded px-1 py-1 text-left transition-colors hover:bg-parchment-200/50"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="truncate font-serif text-[14px] text-ink">
                              {spell.name.trim() || (isCantrip ? "Novo truque" : "Nova magia")}
                            </div>
                          </div>

                          <div className="shrink-0 text-[9px] uppercase tracking-[2px] text-dnd-red">
                            {expandedSpellIds.includes(spell.id) ? "Ocultar" : "Abrir"}
                          </div>
                        </button>

                        <ConfirmDeleteButton onConfirm={() => removeSpell(levelEntry.level, spell.id)} />
                      </div>

                      {expandedSpellIds.includes(spell.id) && (
                        <div className="mt-3 space-y-2 border-t border-dnd-border/70 pt-3">
                          <div>
                            <FieldLabel>{isCantrip ? "Nome do Truque" : "Nome da Magia"}</FieldLabel>
                            <input
                              type="text"
                              value={spell.name}
                              onChange={(e) => updateSpell(levelEntry.level, spell.id, { name: e.target.value })}
                              placeholder={isCantrip ? "Nome do truque" : "Nome da magia"}
                              className="w-full rounded border border-dnd-border bg-parchment-200/50 px-2 py-1 font-serif text-[12px] text-ink outline-none transition-colors focus:border-dnd-red"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <FieldLabel>Tempo de Conjuração</FieldLabel>
                              <input
                                type="text"
                                value={spell.castingTime}
                                onChange={(e) => updateSpell(levelEntry.level, spell.id, { castingTime: e.target.value })}
                                placeholder="1 ação, 1 bônus, reação..."
                                className="w-full rounded border border-dnd-border bg-parchment-200/50 px-2 py-1 font-serif text-[12px] text-ink outline-none transition-colors focus:border-dnd-red"
                              />
                            </div>

                            <div>
                              <FieldLabel>Alcance</FieldLabel>
                              <input
                                type="text"
                                value={spell.range}
                                onChange={(e) => updateSpell(levelEntry.level, spell.id, { range: e.target.value })}
                                placeholder="Toque, 18m, pessoal, 36m..."
                                className="w-full rounded border border-dnd-border bg-parchment-200/50 px-2 py-1 font-serif text-[12px] text-ink outline-none transition-colors focus:border-dnd-red"
                              />
                            </div>

                            <div className="col-span-2">
                              <FieldLabel>Duração</FieldLabel>
                              <input
                                type="text"
                                value={spell.duration}
                                onChange={(e) => updateSpell(levelEntry.level, spell.id, { duration: e.target.value })}
                                placeholder="Instantânea, 1 minuto, até dissipada..."
                                className="w-full rounded border border-dnd-border bg-parchment-200/50 px-2 py-1 font-serif text-[12px] text-ink outline-none transition-colors focus:border-dnd-red"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-ink sm:flex sm:flex-wrap sm:gap-3">
                            <button
                              type="button"
                              onClick={() => updateSpell(levelEntry.level, spell.id, { prepared: !spell.prepared })}
                              className="flex items-center gap-1.5"
                              title="Alternar preparo"
                            >
                              <ProfCircle level={spell.prepared ? 2 : 0} size={15} />
                              <span>{isCantrip ? "Conhecida" : "Preparada"}</span>
                            </button>

                            <label className="flex items-center gap-1.5">
                              <input
                                type="checkbox"
                                checked={spell.ritual}
                                onChange={(e) => updateSpell(levelEntry.level, spell.id, { ritual: e.target.checked })}
                              />
                              <span>Ritual</span>
                            </label>

                            <label className="flex items-center gap-1.5">
                              <input
                                type="checkbox"
                                checked={spell.concentration}
                                onChange={(e) => updateSpell(levelEntry.level, spell.id, { concentration: e.target.checked })}
                              />
                              <span>Concentração</span>
                            </label>

                            <label className="flex items-center gap-1.5">
                              <input
                                type="checkbox"
                                checked={spell.verbal}
                                onChange={(e) => updateSpell(levelEntry.level, spell.id, { verbal: e.target.checked })}
                              />
                              <span>Verbal</span>
                            </label>

                            <label className="flex items-center gap-1.5">
                              <input
                                type="checkbox"
                                checked={spell.somatic}
                                onChange={(e) => updateSpell(levelEntry.level, spell.id, { somatic: e.target.checked })}
                              />
                              <span>Somático</span>
                            </label>

                            <label className="flex items-center gap-1.5">
                              <input
                                type="checkbox"
                                checked={spell.material}
                                onChange={(e) => updateSpell(levelEntry.level, spell.id, { material: e.target.checked })}
                              />
                              <span>Material</span>
                            </label>
                          </div>

                          <div>
                            <FieldLabel>Descrição da Magia</FieldLabel>
                            <textarea
                              ref={(element) => {
                                if (element) {
                                  autoResizeTextarea(element);
                                }
                              }}
                              value={spell.description}
                              onChange={(e) => {
                                autoResizeTextarea(e.target);
                                updateSpell(levelEntry.level, spell.id, { description: e.target.value });
                              }}
                              placeholder="Descrição completa da magia, efeito, componentes, duração e observações de uso."
                              rows={1}
                              className="w-full overflow-hidden resize-none rounded border border-dnd-border bg-parchment-200/50 p-2 font-serif text-[12px] text-ink outline-none transition-colors focus:border-dnd-red"
                            />
                          </div>

                          <div>
                            <FieldLabel>Notas Rápidas</FieldLabel>
                            <textarea
                              value={spell.notes}
                              onChange={(e) => updateSpell(levelEntry.level, spell.id, { notes: e.target.value })}
                              placeholder="Notas rápidas de mesa: alvo favorito, combinação, origem ou material gasto."
                              rows={2}
                              className="w-full resize-y rounded border border-dnd-border bg-parchment-200/50 p-2 font-serif text-[12px] text-ink outline-none transition-colors focus:border-dnd-red"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <AddRowButton onClick={() => addSpell(levelEntry.level)}>
                {isCantrip ? "+ Adicionar Truque" : "+ Adicionar Magia"}
              </AddRowButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}