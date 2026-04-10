"use client";
import { useState } from "react";
import { useCharStore } from "@/lib/store";
import { SectionTitle, FieldLabel, NumberInput, SelectInput } from "@/components/ui";
import type { CoinType } from "@/types";

function TextArea({ value, onChange, placeholder, rows = 5 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-parchment-200/60 border border-dnd-border rounded p-2 font-serif text-[13px]
                 text-ink outline-none focus:border-dnd-red transition-colors resize-y"
    />
  );
}

export function NotesSection() {
  const store = useCharStore();
  const [coinType, setCoinType] = useState<CoinType>("gp");
  const [coinChange, setCoinChange] = useState(0);
  const totalGoldValue = (
    store.coins.cp / 100
    + store.coins.sp / 10
    + store.coins.ep / 2
    + store.coins.gp
    + store.coins.pp * 10
  );
  const coinMeta: Array<{ key: CoinType; label: string }> = [
    { key: "cp", label: "Cobre (cp)" },
    { key: "sp", label: "Prata (sp)" },
    { key: "ep", label: "Electrum (ep)" },
    { key: "gp", label: "Ouro (gp)" },
    { key: "pp", label: "Platina (pp)" },
  ];

  const applyCoinChange = (direction: 1 | -1) => {
    if (coinChange <= 0) return;

    if (direction === 1) {
      store.adjustCoin(coinType, coinChange);
    } else {
      store.spendCoin(coinType, coinChange);
    }

    setCoinChange(0);
  };

  return (
    <div className="print-full-section mb-5">
      <SectionTitle>Traços, Anotações &amp; Equipamentos</SectionTitle>

      <div className="bg-parchment-200/60 border border-dnd-border rounded p-3 mb-4">
        <div className="text-[9px] tracking-[2px] uppercase text-dnd-red font-semibold mb-2">Habilidades Raciais &amp; Anotações</div>
        <TextArea
          value={store.abilities}
          onChange={(v) => store.setField("abilities", v)}
          placeholder="Use este campo para adicionar observações ou habilidades extras além das raciais automáticas."
          rows={6}
        />
      </div>

      <div className="bg-parchment-200/60 border border-dnd-border rounded p-3 mb-4">
        <div className="text-[9px] tracking-[2px] uppercase text-dnd-red font-semibold mb-2">Inventário</div>
        <TextArea
          value={store.inventory}
          onChange={(v) => store.setField("inventory", v)}
          placeholder="Kits do antecedente, ferramentas, consumíveis e outros itens carregados que não entram como equipamento principal."
          rows={5}
        />
      </div>

      <div className="bg-parchment-200/60 border border-dnd-border rounded p-3 mb-4">
        <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
          <div>
            <div className="text-[9px] tracking-[2px] uppercase text-dnd-red font-semibold">Dinheiro</div>
            <div className="text-[10px] text-ink-light mt-1">Conversão automática ao remover valores.</div>
          </div>
          <div className="text-right">
            <div className="text-[8px] tracking-[2px] uppercase text-dnd-red font-semibold">Valor Total</div>
            <div className="font-display text-2xl text-ink leading-none">{totalGoldValue.toFixed(2)}</div>
            <div className="text-[10px] text-ink-light">em gp</div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 max-sm:grid-cols-2 mb-3">
          {coinMeta.map(({ key, label }) => (
            <div key={key}>
              <FieldLabel>{label}</FieldLabel>
              <NumberInput
                value={store.coins[key]}
                onChange={(e) => store.setCoin(key, parseInt(e.target.value, 10) || 0)}
                className="w-full text-xl"
              />
            </div>
          ))}
        </div>

        <div className="mt-3 pt-2 border-t border-dnd-border/30">
          <div className="text-[9px] tracking-[2px] uppercase text-dnd-red font-semibold mb-2">Controle de Moedas</div>
          <div className="flex items-end gap-2 flex-wrap">
            <div className="w-[140px]">
              <FieldLabel>Tipo</FieldLabel>
              <SelectInput value={coinType} onChange={(e) => setCoinType(e.target.value as CoinType)}>
                {coinMeta.map(({ key, label }) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </SelectInput>
            </div>
            <div className="w-20">
              <FieldLabel>Valor</FieldLabel>
              <NumberInput
                value={coinChange || ""}
                onChange={(e) => setCoinChange(parseInt(e.target.value, 10) || 0)}
                className="w-full text-lg"
              />
            </div>
            <button
              type="button"
              onClick={() => applyCoinChange(1)}
              className="px-2 py-1 bg-dnd-green/20 border border-dnd-green rounded text-[10px] font-semibold text-dnd-green hover:bg-dnd-green/30 transition-colors"
            >
              + Adicionar
            </button>
            <button
              type="button"
              onClick={() => applyCoinChange(-1)}
              className="px-2 py-1 bg-dnd-red/20 border border-dnd-red rounded text-[10px] font-semibold text-dnd-red hover:bg-dnd-red/30 transition-colors"
            >
              - Remover
            </button>
          </div>
        </div>
      </div>

      {/* Three columns */}
      <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1">
        <div>
          <FieldLabel className="mb-1 text-dnd-red font-semibold tracking-[2px]">Traços &amp; Características</FieldLabel>
          <TextArea
            value={store.features}
            onChange={(v) => store.setField("features", v)}
            placeholder="Habilidades raciais, de classe, talentos..."
            rows={8}
          />
        </div>
        <div>
          <FieldLabel className="mb-1 text-dnd-red font-semibold tracking-[2px]">Equipamentos &amp; Tesouro</FieldLabel>
          <TextArea
            value={store.equipment}
            onChange={(v) => store.setField("equipment", v)}
            placeholder="Itens, moedas, poções..."
            rows={8}
          />
        </div>
        <div>
          <FieldLabel className="mb-1 text-dnd-red font-semibold tracking-[2px]">Notas Gerais</FieldLabel>
          <TextArea
            value={store.generalNotes}
            onChange={(v) => store.setField("generalNotes", v)}
            placeholder="Anotações soltas de sessão, objetivos, ganchos ou lembretes do personagem..."
            rows={8}
          />
        </div>
      </div>
    </div>
  );
}
