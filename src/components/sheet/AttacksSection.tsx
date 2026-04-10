"use client";
import { useState } from "react";
import { useCharStore } from "@/lib/store";
import { getTotalLevel, getProfBonus, attackBonus, fmtMod } from "@/lib/calc";
import { DAMAGE_TYPES, ATTACK_ATTRS } from "@/data/constants";
import { WEAPONS } from "@/data/weapons";
import { SectionTitle, AddRowButton, DeleteButton, FieldLabel, TextInput } from "@/components/ui";
import type { AttackAttr, DamageType, TraitEntry } from "@/types";

function CombatOptionPanel({
  title,
  helper,
  emptyText,
  addLabel,
  entries,
  expandedId,
  onExpandedChange,
  onAdd,
  onUpdate,
  onRemove,
}: {
  title: string;
  helper: string;
  emptyText: string;
  addLabel: string;
  entries: TraitEntry[];
  expandedId: string | null;
  onExpandedChange: (id: string | null) => void;
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<TraitEntry>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-dnd-border bg-parchment-200/60 px-2.5 py-2 shadow-inset">
      <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
        <div>
          <FieldLabel className="mb-1 text-[8px] text-dnd-red font-semibold tracking-[2px]">
            {title}
          </FieldLabel>
          <div className="text-[10px] text-ink-light">{helper}</div>
        </div>
        <AddRowButton onClick={onAdd}>{addLabel}</AddRowButton>
      </div>

      {entries.length === 0 ? (
        <div className="rounded border border-dashed border-dnd-border bg-parchment-100/40 px-2 py-2 text-[10px] text-ink-light">
          {emptyText}
        </div>
      ) : (
        <div className="grid gap-1.5">
          {entries.map((entry) => {
            const expanded = expandedId === entry.id;
            return (
              <div key={entry.id} className="rounded border border-dnd-border bg-parchment-100/80 px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onExpandedChange(expanded ? null : entry.id)}
                    className="flex-1 text-left text-[10px] text-ink transition hover:text-dnd-red"
                  >
                    {entry.title.trim() || `Nova ${title.toLowerCase()}`}
                  </button>
                  <DeleteButton
                    onClick={() => {
                      if (expanded) onExpandedChange(null);
                      onRemove(entry.id);
                    }}
                  />
                </div>

                {expanded && (
                  <div className="mt-2 rounded border border-dnd-border bg-white/70 p-2">
                    <div className="mb-2">
                      <FieldLabel className="mb-1 text-[8px] text-dnd-red font-semibold tracking-[2px]">Nome</FieldLabel>
                      <TextInput
                        value={entry.title}
                        onChange={(e) => onUpdate(entry.id, { title: e.target.value })}
                        placeholder="Ex: Palavra Curativa, Escudo, Ataque de Oportunidade"
                      />
                    </div>
                    <div>
                      <FieldLabel className="mb-1 text-[8px] text-dnd-red font-semibold tracking-[2px]">Descrição</FieldLabel>
                      <textarea
                        value={entry.description}
                        onChange={(e) => onUpdate(entry.id, { description: e.target.value })}
                        placeholder={`Escreva a descrição completa de ${title.toLowerCase()}.`}
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

export function AttacksSection() {
  const store = useCharStore();
  const [expandedBonusActionId, setExpandedBonusActionId] = useState<string | null>(null);
  const [expandedReactionId, setExpandedReactionId] = useState<string | null>(null);
  const prof = getProfBonus(getTotalLevel(store));

  const handleWeaponSelect = (attackId: string, selectedName: string) => {
    if (selectedName === "Outro/Personalizado") {
      // Reset to custom
      store.updateAttack(attackId, {
        name: "",
        damage: "",
        damageType: "Cortante" as DamageType,
        properties: "",
        range: "",
      });
    } else {
      // Find the official weapon and update
      const weaponData = WEAPONS.find(w => w.name === selectedName);
      if (weaponData) {
        // Determine range based on weapon type
        let range = "";
        if (weaponData.type === "À distância") {
          if (weaponData.properties.includes("Alcance")) {
            // Extract range from properties, e.g., "Alcance (24/96)" -> "24m/96m"
            const rangeMatch = weaponData.properties.match(/Alcance \((\d+)\/(\d+)\)/);
            if (rangeMatch) {
              range = `${rangeMatch[1]}m/${rangeMatch[2]}m`;
            }
          } else if (weaponData.properties.includes("Arremesso")) {
            const throwMatch = weaponData.properties.match(/Arremesso \((\d+)\/(\d+)\)/);
            if (throwMatch) {
              range = `${throwMatch[1]}m/${throwMatch[2]}m`;
            }
          }
        } else {
          range = "Corpo a corpo (1,5m)";
        }

        store.updateAttack(attackId, {
          name: weaponData.name,
          damage: weaponData.damage,
          damageType: weaponData.damageType,
          properties: weaponData.properties,
          range: range,
        });
      }
    }
  };

  return (
    <div className="print-half-section mb-5">
      <SectionTitle>Ataques &amp; Equipamentos de Combate</SectionTitle>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr>
              {["Selecionar","Dano","Tipo","Alcance","Propriedades","Notas",""].map((h) => (
                <th
                  key={h}
                  className="text-[9px] tracking-[2px] uppercase text-dnd-red font-semibold
                             border-b border-dnd-border pb-1 px-1.5 text-left bg-dnd-red/5"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {store.attacks.map((atk) => {
              const bonus = attackBonus(store, atk.attribute, atk.bonusExtra, prof);
              const isCustom = !WEAPONS.some(w => w.name === atk.name);
              return (
                <tr key={atk.id} className="border-b border-dnd-border/30 last:border-0 hover:bg-parchment-100/50">
                  {/* Weapon Select */}
                  <td className="px-1.5 py-1.5 w-48">
                    <select
                      value={isCustom ? "Outro/Personalizado" : atk.name}
                      onChange={(e) => handleWeaponSelect(atk.id, e.target.value)}
                      className="w-full bg-transparent border border-dnd-border rounded px-2 py-1 font-serif text-[10px]
                                 text-ink outline-none focus:border-dnd-red transition-colors"
                    >
                      <option value="Outro/Personalizado">Outro/Personalizado</option>
                      <optgroup label="Armas Simples - Corpo a Corpo">
                        {WEAPONS.filter(w => w.category === "Simples" && w.type === "Corpo a corpo").map((weapon) => (
                          <option key={weapon.name} value={weapon.name}>
                            {weapon.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Armas Simples - À Distância">
                        {WEAPONS.filter(w => w.category === "Simples" && w.type === "À distância").map((weapon) => (
                          <option key={weapon.name} value={weapon.name}>
                            {weapon.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Armas Marciais - Corpo a Corpo">
                        {WEAPONS.filter(w => w.category === "Marciais" && w.type === "Corpo a corpo").map((weapon) => (
                          <option key={weapon.name} value={weapon.name}>
                            {weapon.name}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Armas Marciais - À Distância">
                        {WEAPONS.filter(w => w.category === "Marciais" && w.type === "À distância").map((weapon) => (
                          <option key={weapon.name} value={weapon.name}>
                            {weapon.name}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </td>

                  {/* Damage */}
                  <td className="px-1.5 py-1.5 w-16">
                    {isCustom ? (
                      <input
                        type="text"
                        value={atk.damage}
                        placeholder="1d8"
                        onChange={(e) => store.updateAttack(atk.id, { damage: e.target.value })}
                        className="w-full bg-transparent border-b border-transparent font-serif text-[12px]
                                   text-ink outline-none focus:border-dnd-border p-0.5"
                      />
                    ) : (
                      <span className="font-serif text-[12px] text-ink">{atk.damage}</span>
                    )}
                  </td>

                  {/* Damage type */}
                  <td className="px-1.5 py-1.5 w-28">
                    {isCustom ? (
                      <select
                        value={atk.damageType}
                        onChange={(e) => store.updateAttack(atk.id, { damageType: e.target.value as DamageType })}
                        className="bg-transparent border-b border-dnd-border font-serif text-[11px] text-ink outline-none w-full"
                      >
                        {DAMAGE_TYPES.map((d) => <option key={d}>{d}</option>)}
                      </select>
                    ) : (
                      <span className="font-serif text-[11px] text-ink">{atk.damageType}</span>
                    )}
                  </td>

                  {/* Range */}
                  <td className="px-1.5 py-1.5 min-w-[90px]">
                    {isCustom ? (
                      <input
                        type="text"
                        value={atk.range}
                        placeholder="1,5m / 24m/96m"
                        onChange={(e) => store.updateAttack(atk.id, { range: e.target.value })}
                        className="w-full bg-transparent border-b border-transparent font-serif text-[12px]
                                   text-ink outline-none focus:border-dnd-border p-0.5"
                      />
                    ) : (
                      <span className="font-serif text-[12px] text-ink">{atk.range}</span>
                    )}
                  </td>

                  {/* Properties */}
                  <td className="px-1.5 py-1.5 min-w-[90px]">
                    {isCustom ? (
                      <input
                        type="text"
                        value={atk.properties}
                        placeholder="Versátil, Acuidade..."
                        onChange={(e) => store.updateAttack(atk.id, { properties: e.target.value })}
                        className="w-full bg-transparent border-b border-transparent font-serif text-[12px]
                                   text-ink outline-none focus:border-dnd-border p-0.5"
                      />
                    ) : (
                      <span className="font-serif text-[12px] text-ink">{atk.properties}</span>
                    )}
                  </td>
                  <td className="px-1.5 py-1.5 min-w-[80px]">
                    <input
                      type="text"
                      value={atk.notes}
                      placeholder="Observações..."
                      onChange={(e) => store.updateAttack(atk.id, { notes: e.target.value })}
                      className="w-full bg-transparent border-b border-transparent font-serif text-[11px]
                                 text-ink-light outline-none focus:border-dnd-border p-0.5"
                    />
                  </td>

                  <td className="px-1 py-1.5 w-6">
                    <DeleteButton onClick={() => store.removeAttack(atk.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <AddRowButton onClick={store.addAttack}>+ Adicionar Ataque</AddRowButton>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <CombatOptionPanel
          title="Ação Bônus"
          helper="Registre ações bônus com nome clicável e descrição expansível."
          emptyText="Adicione ações bônus do personagem para consultar e editar rapidamente."
          addLabel="+ Adicionar"
          entries={store.bonusActions}
          expandedId={expandedBonusActionId}
          onExpandedChange={setExpandedBonusActionId}
          onAdd={store.addBonusAction}
          onUpdate={store.updateBonusAction}
          onRemove={store.removeBonusAction}
        />

        <CombatOptionPanel
          title="Reação"
          helper="Registre reações com nome clicável e descrição expansível."
          emptyText="Adicione reações do personagem para consultar e editar rapidamente."
          addLabel="+ Adicionar"
          entries={store.reactions}
          expandedId={expandedReactionId}
          onExpandedChange={setExpandedReactionId}
          onAdd={store.addReaction}
          onUpdate={store.updateReaction}
          onRemove={store.removeReaction}
        />
      </div>
    </div>
  );
}
