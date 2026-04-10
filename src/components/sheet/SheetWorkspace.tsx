"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CharacterSheet } from "@/components/sheet/CharacterSheet";
import { createDefaultCharacterState, extractCharacterState, normalizeCharacterState } from "@/lib/character-state";
import { useCharStore } from "@/lib/store";
import type { CharacterState } from "@/types";

type UserView = {
  id: string;
  email: string;
  name: string | null;
};

type SheetSummary = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

type SheetRecord = SheetSummary & {
  data: CharacterState;
};

export function SheetWorkspace({
  user,
  initialSheets,
  initialActiveSheet,
}: {
  user: UserView;
  initialSheets: SheetSummary[];
  initialActiveSheet: SheetRecord | null;
}) {
  const router = useRouter();
  const replaceSheet = useCharStore((state) => state.replaceSheet);
  const resetSheet = useCharStore((state) => state.resetSheet);
  const [sheets, setSheets] = useState<SheetSummary[]>(initialSheets);
  const [activeSheetId, setActiveSheetId] = useState<string | null>(initialActiveSheet?.id ?? null);
  const [loadingSheetId, setLoadingSheetId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (initialActiveSheet?.data) {
      replaceSheet(normalizeCharacterState(initialActiveSheet.data));
    } else {
      resetSheet();
    }
  }, [initialActiveSheet, replaceSheet, resetSheet]);

  const activeSheet = useMemo(
    () => sheets.find((sheet) => sheet.id === activeSheetId) ?? null,
    [activeSheetId, sheets],
  );

  const orderSheets = (items: SheetSummary[]) =>
    [...items].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));

  const createSheetRecord = async (name: string, data?: CharacterState) => {
    const response = await fetch("/api/sheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data ? { name, data } : { name }),
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(result?.error ?? "Nao foi possivel criar a ficha.");
    }

    return result.sheet as SheetSummary;
  };

  const loadSheet = async (sheetId: string) => {
    setLoadingSheetId(sheetId);
    setMessage("");

    const response = await fetch(`/api/sheets/${sheetId}`);
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(result?.error ?? "Nao foi possivel carregar a ficha.");
      setLoadingSheetId(null);
      return;
    }

    replaceSheet(normalizeCharacterState(result.sheet.data));
    setActiveSheetId(result.sheet.id);
    setLoadingSheetId(null);
  };

  const createSheet = async () => {
    setWorking(true);
    const name = window.prompt("Nome da nova ficha:", `Nova Ficha ${sheets.length + 1}`)?.trim();

    if (!name) {
      setWorking(false);
      return;
    }

    try {
      const createdSheet = await createSheetRecord(name);
      const nextSheets = orderSheets([createdSheet, ...sheets]);
      setSheets(nextSheets);
      setActiveSheetId(createdSheet.id);
      replaceSheet(createDefaultCharacterState());
      setMessage("Nova ficha criada.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nao foi possivel criar a ficha.");
    } finally {
      setWorking(false);
    }
  };

  const renameSheet = async () => {
    if (!activeSheetId || !activeSheet) {
      setMessage("Selecione uma ficha para renomear.");
      return;
    }

    setWorking(true);
    const nextName = window.prompt("Novo nome da ficha:", activeSheet.name)?.trim();

    if (!nextName || nextName === activeSheet.name) {
      setWorking(false);
      return;
    }

    const response = await fetch(`/api/sheets/${activeSheetId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nextName }),
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(result?.error ?? "Nao foi possivel renomear a ficha.");
      setWorking(false);
      return;
    }

    setSheets((current) =>
      orderSheets(
        current.map((sheet) =>
          sheet.id === activeSheetId
            ? { ...sheet, name: result.sheet.name, updatedAt: result.sheet.updatedAt }
            : sheet,
        ),
      ),
    );
    setMessage("Ficha renomeada.");
    setWorking(false);
  };

  const duplicateSheet = async () => {
    if (!activeSheet) {
      setMessage("Selecione uma ficha para duplicar.");
      return;
    }

    setWorking(true);
    const duplicateName = window.prompt("Nome da copia:", `${activeSheet.name} (Copia)`)?.trim();

    if (!duplicateName) {
      setWorking(false);
      return;
    }

    const snapshot = extractCharacterState(useCharStore.getState());
    const createResponse = await fetch("/api/sheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: duplicateName }),
    });
    const createdResult = await createResponse.json().catch(() => null);

    if (!createResponse.ok) {
      setMessage(createdResult?.error ?? "Nao foi possivel duplicar a ficha.");
      setWorking(false);
      return;
    }

    const duplicateId = createdResult.sheet.id as string;
    const saveResponse = await fetch(`/api/sheets/${duplicateId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: duplicateName,
        data: snapshot,
      }),
    });
    const savedResult = await saveResponse.json().catch(() => null);

    if (!saveResponse.ok) {
      setMessage(savedResult?.error ?? "Nao foi possivel concluir a duplicacao.");
      setWorking(false);
      return;
    }

    const duplicatedSheet: SheetSummary = {
      id: duplicateId,
      name: savedResult.sheet.name,
      createdAt: createdResult.sheet.createdAt,
      updatedAt: savedResult.sheet.updatedAt,
    };

    setSheets((current) => orderSheets([duplicatedSheet, ...current]));
    setActiveSheetId(duplicateId);
    replaceSheet(snapshot);
    setMessage("Ficha duplicada.");
    setWorking(false);
  };

  const saveSheet = async () => {
    setSaving(true);
    setMessage("");

    const snapshot = extractCharacterState(useCharStore.getState());
    const nextName = snapshot.name.trim() || activeSheet?.name || `Ficha ${sheets.length + 1}`;

    if (!activeSheetId) {
      try {
        const createdSheet = await createSheetRecord(nextName, snapshot);
        setSheets((current) => orderSheets([createdSheet, ...current]));
        setActiveSheetId(createdSheet.id);
        setMessage("Ficha salva com sucesso.");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Nao foi possivel salvar a ficha.");
      } finally {
        setSaving(false);
      }
      return;
    }

    const response = await fetch(`/api/sheets/${activeSheetId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nextName,
        data: snapshot,
      }),
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(result?.error ?? "Nao foi possivel salvar a ficha.");
      setSaving(false);
      return;
    }

    setSheets((current) =>
      current
        .map((sheet) => (sheet.id === activeSheetId ? { ...sheet, name: result.sheet.name, updatedAt: result.sheet.updatedAt } : sheet))
        .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)),
    );

    setMessage("Ficha salva com sucesso.");
    setSaving(false);
  };

  const deleteSheet = async () => {
    if (!activeSheetId || !activeSheet) {
      return;
    }

    const confirmed = window.confirm(`Excluir a ficha \"${activeSheet.name}\"?`);
    if (!confirmed) return;

    const response = await fetch(`/api/sheets/${activeSheetId}`, { method: "DELETE" });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(result?.error ?? "Nao foi possivel excluir a ficha.");
      return;
    }

    const remainingSheets = sheets.filter((sheet) => sheet.id !== activeSheetId);
    setSheets(remainingSheets);

    if (remainingSheets.length > 0) {
      void loadSheet(remainingSheets[0].id);
    } else {
      setActiveSheetId(null);
      resetSheet();
    }

    setMessage("Ficha excluida.");
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  };

  const exportPdf = () => {
    window.print();
  };

  return (
    <main className="workspace-shell min-h-screen px-4 py-6">
      <div className="mx-auto max-w-[1280px]">
        <div className="workspace-toolbar mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dnd-border bg-parchment-200/70 px-4 py-3 shadow-inset">
          <div>
            <div className="font-display text-[18px] text-ink">Fichas Salvas</div>
            <div className="text-[12px] text-ink-light">
              {user.name ? `${user.name} • ${user.email}` : user.email}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={createSheet} className="rounded border border-dnd-red/50 px-3 py-2 text-[11px] uppercase tracking-[2px] text-dnd-red hover:bg-dnd-red/10 transition-colors">
              Nova Ficha
            </button>
            <button onClick={renameSheet} disabled={!activeSheetId || working || saving} className="rounded border border-dnd-border px-3 py-2 text-[11px] uppercase tracking-[2px] text-ink hover:bg-parchment-100/70 transition-colors disabled:opacity-60">
              Renomear
            </button>
            <button onClick={duplicateSheet} disabled={!activeSheetId || working || saving} className="rounded border border-dnd-gold px-3 py-2 text-[11px] uppercase tracking-[2px] text-dnd-gold hover:bg-parchment-100/70 transition-colors disabled:opacity-60">
              Duplicar
            </button>
            <button onClick={exportPdf} disabled={working || saving} className="rounded border border-dnd-gold px-3 py-2 text-[11px] uppercase tracking-[2px] text-ink hover:bg-parchment-100/70 transition-colors disabled:opacity-60">
              Exportar PDF
            </button>
            <button onClick={saveSheet} disabled={saving} className="rounded border border-dnd-green px-3 py-2 text-[11px] uppercase tracking-[2px] text-dnd-green hover:bg-dnd-green/10 transition-colors disabled:opacity-60">
              {saving ? "Salvando..." : "Salvar"}
            </button>
            <button onClick={deleteSheet} disabled={!activeSheetId || working || saving} className="rounded border border-dnd-red/50 px-3 py-2 text-[11px] uppercase tracking-[2px] text-dnd-red hover:bg-dnd-red/10 transition-colors disabled:opacity-60">
              Excluir
            </button>
            <button onClick={logout} disabled={working || saving} className="rounded border border-dnd-border px-3 py-2 text-[11px] uppercase tracking-[2px] text-ink hover:bg-parchment-100/70 transition-colors disabled:opacity-60">
              Sair
            </button>
          </div>
        </div>

        {message && (
          <div className="workspace-message mb-4 rounded border border-dnd-border bg-parchment-200/70 px-3 py-2 text-[12px] text-ink-light shadow-inset">
            {message}
          </div>
        )}

        <div className="workspace-layout grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="workspace-sidebar rounded-xl border border-dnd-border bg-parchment-200/70 p-3 shadow-inset h-fit">
            <div className="text-[9px] tracking-[2px] uppercase text-dnd-red font-semibold mb-2">Suas Fichas</div>

            {sheets.length === 0 ? (
              <div className="rounded border border-dashed border-dnd-border bg-parchment-100/40 px-3 py-3 text-[12px] text-ink-light">
                Nenhuma ficha salva ainda. Clique em Nova Ficha para começar.
              </div>
            ) : (
              <div className="space-y-2">
                {sheets.map((sheet) => {
                  const active = sheet.id === activeSheetId;
                  return (
                    <button
                      key={sheet.id}
                      type="button"
                      onClick={() => void loadSheet(sheet.id)}
                      className={`w-full rounded border px-3 py-2 text-left transition-colors ${
                        active
                          ? "border-dnd-red bg-dnd-red/10"
                          : "border-dnd-border bg-parchment-100/60 hover:bg-parchment-100"
                      }`}
                    >
                      <div className="font-serif text-[13px] text-ink">{sheet.name}</div>
                      <div className="text-[10px] text-ink-light mt-1">
                        {loadingSheetId === sheet.id ? "Carregando..." : `Atualizada em ${new Date(sheet.updatedAt).toLocaleString("pt-BR")}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </aside>

          <div className="workspace-sheet-area">
            <CharacterSheet />
          </div>
        </div>
      </div>
    </main>
  );
}