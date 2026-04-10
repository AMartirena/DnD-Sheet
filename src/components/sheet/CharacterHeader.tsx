"use client";
import { useCharStore } from "@/lib/store";
import { BACKGROUNDS, BACKGROUND_GROUPS } from "@/data/backgrounds";
import { RACES, RACE_GROUPS } from "@/data/races";
import { TextInput, FieldLabel, SelectInput } from "@/components/ui";
import type { AttrKey } from "@/types";

export function CharacterHeader() {
  const { name, playerName, raceKey, backgroundKey, background, alignment, setField, attrs, setAttr } = useCharStore();
  const raceData = RACES[raceKey];
  const handleBackgroundChange = (value: string) => {
    setField("backgroundKey", value);
    if (value && value !== "custom") {
      setField("background", BACKGROUNDS[value]?.label ?? "");
    } else if (!value) {
      setField("background", "");
    }
  };

  const handleRaceChange = (value: string) => {
    // Remove bônus da raça anterior
    if (raceKey) {
      const oldRace = RACES[raceKey as keyof typeof RACES];
      if (oldRace?.asi) {
        Object.entries(oldRace.asi).forEach(([attrId, bonus]) => {
          const numericBonus = typeof bonus === "number" ? bonus : 0;
          if (numericBonus !== 0) {
            const key = attrId as AttrKey;
            setAttr(key, Math.max(0, attrs[key] - numericBonus));
          }
        });
      }
    }

    setField("raceKey", value);

    if (value) {
      const selectedRace = RACES[value as keyof typeof RACES];
      
      // Aplica bônus racial aos atributos
      if (selectedRace?.asi) {
        Object.entries(selectedRace.asi).forEach(([attrId, bonus]) => {
          const numericBonus = typeof bonus === "number" ? bonus : 0;
          if (numericBonus !== 0) {
            const key = attrId as AttrKey;
            setAttr(key, attrs[key] + numericBonus);
          }
        });
      }

      // Aplica velocidade
      if (selectedRace?.speed !== undefined) {
        setField("speed", selectedRace.speed);
      }

      // Preenche as habilidades raciais automaticamente
      if (selectedRace?.traits) {
        setField("abilities", selectedRace.traits);
      }
    } else {
      setField("abilities", "");
    }
  };

  return (
    <div className="mb-5">
      {/* Row 1 */}
      <div className="print-header-grid mb-3 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(120px,0.9fr)]">
        <div className="col-span-2 lg:col-span-1">
          <FieldLabel>Nome do Personagem</FieldLabel>
          <TextInput value={name} onChange={(e) => setField("name", e.target.value)} placeholder="..." />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <FieldLabel>Antecedente</FieldLabel>
          <SelectInput value={backgroundKey} onChange={(e) => handleBackgroundChange(e.target.value)}>
            <option value="">— Selecionar Antecedente —</option>
            {BACKGROUND_GROUPS.map((group: { label: string; keys: string[] }) => (
              <optgroup key={group.label} label={group.label}>
                {group.keys.map((key: string) => (
                  <option key={key} value={key}>
                    {BACKGROUNDS[key]?.label ?? key} ({BACKGROUNDS[key]?.source ?? ""})
                  </option>
                ))}
              </optgroup>
            ))}
          </SelectInput>
          {backgroundKey === "custom" && (
            <TextInput
              value={background}
              onChange={(e) => setField("background", e.target.value)}
              placeholder="Nome do antecedente personalizado"
              className="mt-1"
            />
          )}
        </div>
        <div className="col-span-1">
          <FieldLabel>Alinhamento</FieldLabel>
          <SelectInput value={alignment} onChange={(e) => setField("alignment", e.target.value)}>
            <option value="">— Selecionar Alinhamento —</option>
            <option value="Leal e Bom">Leal e Bom</option>
            <option value="Neutro e Bom">Neutro e Bom</option>
            <option value="Caótico e Bom">Caótico e Bom</option>
            <option value="Leal e Neutro">Leal e Neutro</option>
            <option value="Neutro">Neutro</option>
            <option value="Caótico e Neutro">Caótico e Neutro</option>
            <option value="Leal e Mau">Leal e Mau</option>
            <option value="Neutro e Mau">Neutro e Mau</option>
            <option value="Caótico e Mau">Caótico e Mau</option>
          </SelectInput>
        </div>
     
        <div className="col-span-1">
          <FieldLabel>Jogador</FieldLabel>
          <TextInput value={playerName} onChange={(e) => setField("playerName", e.target.value)} placeholder="Seu nome" />
        </div>
      </div>

      {/* Row 2: Race */}
      <div className="print-header-race-grid grid gap-2 sm:gap-3 md:grid-cols-[minmax(220px,0.95fr)_minmax(0,1.25fr)] md:items-start">
        <div>
          <FieldLabel>Raça</FieldLabel>
          <SelectInput value={raceKey} onChange={(e) => handleRaceChange(e.target.value)}>
            <option value="">— Selecionar Raça —</option>
            {RACE_GROUPS.map((group: { label: string; keys: string[] }) => (
              <optgroup key={group.label} label={`${group.label}`}>
                {group.keys.map((k: string) => (
                  <option key={k} value={k}>
                    {RACES[k]?.label ?? k} ({RACES[k]?.source ?? ""})
                  </option>
                ))}
              </optgroup>
            ))}
          </SelectInput>
        </div>

        {raceData && (
          <div className="bg-parchment-200/60 border border-dnd-border rounded px-2.5 py-2 sm:px-3">
            <div className="text-[9px] tracking-[2px] uppercase text-dnd-red font-semibold mb-1">
              Bônus Racial — {raceData.label}
              <span className="ml-2 text-ink-light normal-case tracking-normal font-normal">[{raceData.source}]</span>
            </div>
            <div className="text-[11px] text-dnd-green font-semibold">
              {Object.entries(raceData.asi)
                .filter(([, v]) => typeof v === "number" && v !== 0)
                .map(([k, v]) => {
                  const numericValue = typeof v === "number" ? v : 0;
                  const shorts: Record<string, string> = { str:"FOR",dex:"DES",con:"CON",int:"INT",wis:"SAB",cha:"CAR" };
                  return `${shorts[k] ?? k} ${numericValue > 0 ? "+" : ""}${numericValue}`;
                })
                .join("  •  ") || "Nenhum bônus fixo"}
            </div>
            <div className="text-[10px] text-ink-light mt-0.5">{raceData.traits}</div>
          </div>
        )}
      </div>
    </div>
  );
}
