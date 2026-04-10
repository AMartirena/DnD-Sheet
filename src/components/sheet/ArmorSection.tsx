"use client";
import { useCharStore } from "@/lib/store";
import { SectionTitle, ToggleSwitch, AddRowButton, DeleteButton } from "@/components/ui";
import { ARMORS } from "@/data/armors";

export function ArmorSection() {
  const store = useCharStore();
  const currentStrength = store.attrs.str;
  const getArmorOptionValue = (armor: { name: string; type: string }) => `${armor.type}::${armor.name}`;

  // Check for classes that have Unarmored Defense
  const hasMonk = store.classes.some(c => c.name.toLowerCase().includes("monge"));
  const hasBarbarian = store.classes.some(c => c.name.toLowerCase().includes("bárbaro") || c.name.toLowerCase().includes("barbarian"));

  // Generate armor options including Unarmored Defense if applicable
  const armorOptions = [
    ...ARMORS,
    ...(hasMonk ? [{ name: "Defesa sem Armadura (Monge)", type: "Natural" as const, bonusCA: 0, maxDex: undefined, minStr: undefined, stealthDisadv: false }] : []),
    ...(hasBarbarian ? [{ name: "Defesa sem Armadura (Bárbaro)", type: "Natural" as const, bonusCA: 0, maxDex: undefined, minStr: undefined, stealthDisadv: false }] : []),
  ];

  const handleArmorSelect = (armorId: string, selectedValue: string) => {
    if (selectedValue === "Outro/Personalizado") {
      // Reset to custom
      store.updateArmor(armorId, {
        name: "",
        type: "",
        bonusCA: 0,
        maxDex: undefined,
        minStr: undefined,
        stealthDisadv: false,
      });
    } else {
      // Find the armor data and update
      const armorData = armorOptions.find((armorOption) => getArmorOptionValue(armorOption) === selectedValue);
      if (armorData) {
        const canEquipSelected = armorData.minStr === undefined || currentStrength >= armorData.minStr;
        store.updateArmor(armorId, {
          name: armorData.name,
          type: armorData.type,
          bonusCA: armorData.bonusCA,
          maxDex: armorData.maxDex,
          minStr: armorData.minStr,
          stealthDisadv: armorData.stealthDisadv,
          equipped: canEquipSelected,
        });
      }
    }
  };

  return (
    <div className="print-half-section mb-5">
      <SectionTitle>Armaduras &amp; Escudos</SectionTitle>
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-[13px]">
          <thead>
            <tr>
              {["Selecionar","Nome","Tipo","Bônus CA","Máx DEX","Notas","Equipado",""] .map((h) => (
                <th
                  key={h}
                  className="text-[9px] tracking-[2px] uppercase text-dnd-red font-semibold
                             border-b border-dnd-border pb-1 px-2 text-left bg-dnd-red/5"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {store.armors.map((armor) => {
              const matchedArmor = armorOptions.find((armorOption) => armorOption.name === armor.name && armorOption.type === armor.type);
              const isCustom = !matchedArmor;
              const lacksStrength = armor.minStr !== undefined && currentStrength < armor.minStr;
              return (
                <tr key={armor.id} className="border-b border-dnd-border/30 last:border-0 hover:bg-parchment-100/50">
                  <td className="px-2 py-1.5 w-44 align-top">
                    <select
                      value={isCustom ? "Outro/Personalizado" : getArmorOptionValue(matchedArmor)}
                      onChange={(e) => handleArmorSelect(armor.id, e.target.value)}
                      className="w-full bg-transparent border border-dnd-border rounded px-2 py-1 font-serif text-[12px]
                                 text-ink outline-none focus:border-dnd-red transition-colors"
                    >
                      <option value="Outro/Personalizado">Outro/Personalizado</option>
                      {armorOptions.map((armorData) => (
                        <option key={getArmorOptionValue(armorData)} value={getArmorOptionValue(armorData)}>
                          {armorData.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-1.5 align-top">
                    {isCustom ? (
                      <div>
                        <input
                          type="text"
                          value={armor.name}
                          placeholder="Ex: Cota de Malha"
                          onChange={(e) => store.updateArmor(armor.id, { name: e.target.value })}
                          className="w-full bg-transparent border-0 border-b border-transparent font-serif text-[13px]
                                     text-ink outline-none focus:border-dnd-border transition-colors p-0.5"
                        />
                        <div className="mt-1 flex flex-wrap gap-1 whitespace-nowrap">
                          {armor.minStr !== undefined && (
                            <span className={`rounded border px-1.5 py-0.5 text-[9px] leading-none whitespace-nowrap ${lacksStrength ? "border-dnd-red/70 text-dnd-red" : "border-dnd-border/60 text-ink-light"}`} title={`Requer FOR ${armor.minStr}`}>
                              FOR {armor.minStr}
                            </span>
                          )}
                          {armor.stealthDisadv && (
                            <span className="rounded border border-dnd-border/60 px-1.5 py-0.5 text-[9px] leading-none text-ink-light whitespace-nowrap" title="Desvantagem em Furtividade">
                              Furt -
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="font-serif text-[13px] leading-tight text-ink whitespace-nowrap">{armor.name}</span>
                        <div className="mt-1 flex flex-wrap gap-1 whitespace-nowrap">
                          {armor.minStr !== undefined && (
                            <span className={`rounded border px-1.5 py-0.5 text-[9px] leading-none whitespace-nowrap ${lacksStrength ? "border-dnd-red/70 text-dnd-red" : "border-dnd-border/60 text-ink-light"}`} title={`Requer FOR ${armor.minStr}`}>
                              FOR {armor.minStr}
                            </span>
                          )}
                          {armor.stealthDisadv && (
                            <span className="rounded border border-dnd-border/60 px-1.5 py-0.5 text-[9px] leading-none text-ink-light whitespace-nowrap" title="Desvantagem em Furtividade">
                              Furt -
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-1.5 w-28 align-top">
                    {isCustom ? (
                      <input
                        type="text"
                        value={armor.type}
                        placeholder="Leve / Média / Pesada / Escudo"
                        onChange={(e) => store.updateArmor(armor.id, { type: e.target.value })}
                        className="w-full bg-transparent border-0 border-b border-transparent font-serif text-[13px]
                                   text-ink outline-none focus:border-dnd-border transition-colors p-0.5"
                      />
                    ) : (
                      <span className="font-serif text-[13px] text-ink whitespace-nowrap">{armor.type}</span>
                    )}
                  </td>
                  <td className="px-2 py-1.5 text-center w-16 align-top whitespace-nowrap">
                    {isCustom ? (
                      <input
                        type="number"
                        value={armor.bonusCA}
                        min={0}
                        max={30}
                        onChange={(e) => store.updateArmor(armor.id, { bonusCA: parseInt(e.target.value) || 0 })}
                        className="w-12 bg-transparent border-b border-dnd-border font-display text-[16px] text-ink
                                   text-center outline-none focus:border-dnd-red
                                   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    ) : (
                      <span className="font-display text-[16px] text-ink">{armor.bonusCA}</span>
                    )}
                  </td>
                  <td className="px-2 py-1.5 text-center w-16 align-top whitespace-nowrap">
                    {armor.type.toLowerCase() === "média" ? (
                      armor.maxDex !== undefined ? (
                        <span className="font-display text-[16px] text-ink">+{armor.maxDex}</span>
                      ) : (
                        <span className="text-ink/50">-</span>
                      )
                    ) : (
                      <span className="text-ink/50">-</span>
                    )}
                  </td>
                  <td className="px-2 py-1.5 w-24 align-top text-[10px] text-ink-light whitespace-nowrap">
                    {isCustom ? (
                      <div className="flex flex-col gap-1 whitespace-nowrap">
                        <input
                          type="number"
                          value={armor.minStr ?? ""}
                          placeholder="FOR"
                          min={0}
                          onChange={(e) => store.updateArmor(armor.id, { minStr: e.target.value ? parseInt(e.target.value) || 0 : undefined })}
                          className="w-16 bg-transparent border-b border-transparent font-serif text-[11px] text-ink outline-none focus:border-dnd-border p-0.5"
                        />
                        <label className="flex items-center gap-1 text-[10px] text-ink-light whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={Boolean(armor.stealthDisadv)}
                            onChange={(e) => store.updateArmor(armor.id, { stealthDisadv: e.target.checked })}
                            className="accent-[#7a5c2e]"
                          />
                          Furt -
                        </label>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1 whitespace-nowrap">
                        {armor.minStr !== undefined && <span className="whitespace-nowrap">FOR {armor.minStr}</span>}
                        {armor.stealthDisadv && <span className="whitespace-nowrap">Furt -</span>}
                        {armor.minStr === undefined && !armor.stealthDisadv && <span className="text-ink/50">-</span>}
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-1.5 text-center min-w-fit align-top">
                    <ToggleSwitch
                      checked={armor.equipped}
                      onChange={(v) => {
                        if (!v) {
                          store.updateArmor(armor.id, { equipped: false });
                          return;
                        }
                        if (lacksStrength) return;
                        store.updateArmor(armor.id, { equipped: true });
                      }}
                    />
                    {lacksStrength && (
                      <div className="mt-1 text-[9px] leading-none text-dnd-red">FOR baixa</div>
                    )}
                  </td>
                  <td className="px-1 py-1.5 w-8">
                    <DeleteButton onClick={() => store.removeArmor(armor.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <AddRowButton onClick={store.addArmor}>+ Adicionar Armadura / Escudo</AddRowButton>
    </div>
  );
}
