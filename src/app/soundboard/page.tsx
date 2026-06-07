"use client";
import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SoundButton {
  id: string;
  name: string;
  url: string;
  category: string;
  color: string;
  volume: number;
  loop: boolean;
  order: number;
}

type AudioState = "idle" | "loading" | "playing" | "paused" | "error";

interface ActiveAudio {
  audio: HTMLAudioElement;
  state: AudioState;
}

// ─── Color palette ────────────────────────────────────────────────────────────
const COLORS = [
  { label: "Âmbar", value: "#b45309" },
  { label: "Vermelho", value: "#b91c1c" },
  { label: "Esmeralda", value: "#047857" },
  { label: "Azul", value: "#1d4ed8" },
  { label: "Violeta", value: "#6d28d9" },
  { label: "Rosa", value: "#be185d" },
  { label: "Ciano", value: "#0e7490" },
  { label: "Ardósia", value: "#334155" },
];

const DEFAULT_CATEGORIES = ["geral", "música", "ambiente", "efeito", "combate", "tensão"];

// ─── Modal ────────────────────────────────────────────────────────────────────
function SoundModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Partial<SoundButton>;
  onSave: (data: Omit<SoundButton, "id" | "order">) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [category, setCategory] = useState(initial?.category ?? "geral");
  const [customCategory, setCustomCategory] = useState("");
  const [color, setColor] = useState(initial?.color ?? COLORS[0].value);
  const [volume, setVolume] = useState(initial?.volume ?? 1.0);
  const [loop, setLoop] = useState(initial?.loop ?? false);
  const [error, setError] = useState("");

  const effectiveCategory = category === "__custom__" ? customCategory : category;

  function handleSubmit() {
    if (!name.trim()) return setError("Nome é obrigatório.");
    if (!url.trim()) return setError("URL é obrigatória.");
    try { new URL(url); } catch { return setError("URL inválida."); }
    if (!effectiveCategory.trim()) return setError("Categoria é obrigatória.");
    onSave({ name: name.trim(), url: url.trim(), category: effectiveCategory.trim(), color, volume, loop });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="w-full max-w-md rounded-2xl border border-stone-700 bg-stone-900 p-6 shadow-2xl"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        <h2 className="mb-5 text-lg font-semibold tracking-widest text-amber-400 uppercase">
          {initial?.id ? "Editar Som" : "Novo Som"}
        </h2>

        {error && (
          <p className="mb-3 rounded bg-red-900/40 px-3 py-2 text-sm text-red-300">{error}</p>
        )}

        <div className="flex flex-col gap-3">
          {/* Name */}
          <div>
            <label className="mb-1 block text-xs tracking-widest text-stone-400 uppercase">Nome</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Chuva na Taverna"
              className="w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
            />
          </div>

          {/* URL */}
          <div>
            <label className="mb-1 block text-xs tracking-widest text-stone-400 uppercase">URL do áudio</label>
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://exemplo.com/som.mp3"
              className="w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
            />
            <p className="mt-1 text-[10px] text-stone-500">
              Links diretos de .mp3, .ogg, .wav ou streams compatíveis com o navegador.
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-xs tracking-widest text-stone-400 uppercase">Categoria</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
            >
              {DEFAULT_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="__custom__">+ personalizada…</option>
            </select>
            {category === "__custom__" && (
              <input
                value={customCategory}
                onChange={e => setCustomCategory(e.target.value)}
                placeholder="Nome da categoria"
                className="mt-2 w-full rounded-lg border border-stone-700 bg-stone-800 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500"
              />
            )}
          </div>

          {/* Color */}
          <div>
            <label className="mb-1 block text-xs tracking-widest text-stone-400 uppercase">Cor do botão</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  title={c.label}
                  className="h-7 w-7 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    background: c.value,
                    borderColor: color === c.value ? "#fbbf24" : "transparent",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Volume */}
          <div>
            <label className="mb-1 flex items-center justify-between text-xs tracking-widest text-stone-400 uppercase">
              <span>Volume</span>
              <span className="font-mono text-amber-400">{Math.round(volume * 100)}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={e => setVolume(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Loop */}
          <label className="flex cursor-pointer items-center gap-3">
            <div
              onClick={() => setLoop(l => !l)}
              className={`relative h-5 w-9 rounded-full border transition-colors ${loop ? "border-amber-500 bg-amber-500/30" : "border-stone-600 bg-stone-700"}`}
            >
              <span
                className={`absolute top-0.5 h-4 w-4 rounded-full transition-transform ${loop ? "translate-x-4 bg-amber-400" : "translate-x-0.5 bg-stone-400"}`}
              />
            </div>
            <span className="text-sm text-stone-300">Repetir (loop)</span>
          </label>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-stone-700 py-2 text-sm text-stone-400 transition hover:border-stone-500 hover:text-stone-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-lg py-2 text-sm font-semibold text-stone-900 transition hover:brightness-110"
            style={{ background: color }}
          >
            {initial?.id ? "Salvar" : "Criar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sound Button Card ────────────────────────────────────────────────────────
function SoundCard({
  button,
  audioState,
  onPlay,
  onStop,
  onEdit,
  onDelete,
  onVolumeChange,
}: {
  button: SoundButton;
  audioState: AudioState;
  onPlay: () => void;
  onStop: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onVolumeChange: (v: number) => void;
}) {
  const isPlaying = audioState === "playing";
  const isLoading = audioState === "loading";
  const isError = audioState === "error";

  return (
    <div
      className="group relative flex flex-col gap-2 rounded-2xl border p-4 transition-all duration-200"
      style={{
        borderColor: isPlaying ? button.color : "rgba(255,255,255,0.08)",
        background: isPlaying
          ? `linear-gradient(135deg, ${button.color}22, ${button.color}08)`
          : "rgba(28,25,23,0.7)",
        boxShadow: isPlaying ? `0 0 20px ${button.color}40` : "none",
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-stone-100" title={button.name}>
            {button.name}
          </p>
          <span
            className="mt-0.5 inline-block rounded px-1.5 py-0.5 text-[9px] tracking-widest uppercase"
            style={{ background: `${button.color}33`, color: button.color }}
          >
            {button.category}
          </span>
        </div>

        {/* Edit / Delete — shown on hover */}
        <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={onEdit}
            className="rounded p-1 text-stone-500 hover:text-amber-400 transition-colors"
            title="Editar"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="rounded p-1 text-stone-500 hover:text-red-400 transition-colors"
            title="Excluir"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Play button */}
      <button
        onClick={isPlaying ? onStop : onPlay}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-stone-900 transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
        style={{ background: button.color }}
      >
        {isLoading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-stone-900/40 border-t-stone-900" />
        ) : isPlaying ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
            Parar
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Tocar
          </>
        )}
      </button>

      {isError && (
        <p className="text-center text-[10px] text-red-400">Erro ao carregar áudio</p>
      )}

      {/* Volume mini-slider — visible when playing */}
      {isPlaying && (
        <div className="flex items-center gap-2">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-stone-400">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={button.volume}
            onChange={e => onVolumeChange(Number(e.target.value))}
            className="flex-1 accent-amber-500"
          />
          {button.loop && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400" title="Loop ativo">
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SoundboardPage() {
  const [buttons, setButtons] = useState<SoundButton[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingButton, setEditingButton] = useState<SoundButton | null>(null);
  const [activeAudios, setActiveAudios] = useState<Record<string, ActiveAudio>>({});
  const [filterCategory, setFilterCategory] = useState("todas");
  const [search, setSearch] = useState("");

  const audiosRef = useRef<Record<string, ActiveAudio>>({});

  // Sync ref with state
  useEffect(() => {
    audiosRef.current = activeAudios;
  }, [activeAudios]);

  // Load buttons
  useEffect(() => {
    fetch("/api/soundboard")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setButtons(data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(audiosRef.current).forEach(({ audio }) => {
        audio.pause();
        audio.src = "";
      });
    };
  }, []);

  const setAudioState = useCallback((id: string, state: AudioState, audio?: HTMLAudioElement) => {
    setActiveAudios(prev => {
      if (state === "idle") {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      const existing = prev[id];
      return {
        ...prev,
        [id]: { audio: audio ?? existing?.audio!, state },
      };
    });
  }, []);

  function handlePlay(button: SoundButton) {
    const existing = activeAudios[button.id];
    if (existing) {
      existing.audio.pause();
      existing.audio.src = "";
      setAudioState(button.id, "idle");
      return;
    }

    const audio = new Audio();
    audio.volume = button.volume;
    audio.loop = button.loop;
    audio.crossOrigin = "anonymous";

    setAudioState(button.id, "loading", audio);

    audio.addEventListener("canplaythrough", () => {
      audio.play().then(() => setAudioState(button.id, "playing"))
        .catch(() => setAudioState(button.id, "error"));
    }, { once: true });

    audio.addEventListener("ended", () => {
      if (!button.loop) setAudioState(button.id, "idle");
    });

    audio.addEventListener("error", () => setAudioState(button.id, "error"));

    audio.src = button.url;
    audio.load();
  }

  function handleStop(id: string) {
    const existing = activeAudios[id];
    if (existing) {
      existing.audio.pause();
      existing.audio.src = "";
    }
    setAudioState(id, "idle");
  }

  function handleStopAll() {
    Object.entries(activeAudios).forEach(([, { audio }]) => {
      audio.pause();
      audio.src = "";
    });
    setActiveAudios({});
  }

  function handleVolumeChange(button: SoundButton, v: number) {
    const active = activeAudios[button.id];
    if (active) active.audio.volume = v;
    handleApiUpdate(button.id, { volume: v });
    setButtons(prev => prev.map(b => b.id === button.id ? { ...b, volume: v } : b));
  }

  async function handleApiUpdate(id: string, data: Partial<SoundButton>) {
    await fetch(`/api/soundboard/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  async function handleCreate(data: Omit<SoundButton, "id" | "order">) {
    const res = await fetch("/api/soundboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const created = await res.json();
      setButtons(prev => [...prev, created]);
    }
    setShowModal(false);
  }

  async function handleEdit(data: Omit<SoundButton, "id" | "order">) {
    if (!editingButton) return;
    const res = await fetch(`/api/soundboard/${editingButton.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      setButtons(prev => prev.map(b => b.id === updated.id ? updated : b));
    }
    setEditingButton(null);
  }

  async function handleDelete(id: string) {
    handleStop(id);
    await fetch(`/api/soundboard/${id}`, { method: "DELETE" });
    setButtons(prev => prev.filter(b => b.id !== id));
  }

  // Derived
  const categories = ["todas", ...Array.from(new Set(buttons.map(b => b.category)))];
  const filtered = buttons.filter(b => {
    const matchCat = filterCategory === "todas" || b.category === filterCategory;
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
  const playingCount = Object.keys(activeAudios).length;

  return (
    <div
      className="min-h-screen bg-stone-950 text-stone-100"
      style={{ fontFamily: "'Cinzel', serif" }}
    >
      {/* Header */}
      <div className="border-b border-stone-800 bg-stone-950/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎵</span>
            <div>
              <h1 className="text-lg font-bold tracking-widest text-amber-400 uppercase">Soundboard</h1>
              <p className="text-[10px] tracking-widest text-stone-500 uppercase">Painel de Áudio para RPG</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {playingCount > 0 && (
              <button
                onClick={handleStopAll}
                className="flex items-center gap-1.5 rounded-lg border border-red-800 bg-red-900/30 px-3 py-1.5 text-xs text-red-300 hover:bg-red-900/50 transition"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
                Parar tudo ({playingCount})
              </button>
            )}
            <a
              href="/"
              className="rounded-lg border border-stone-700 px-3 py-1.5 text-xs text-stone-400 hover:text-stone-200 transition"
            >
              ← Ficha
            </a>
            <button
              onClick={() => setShowModal(true)}
              className="rounded-lg bg-amber-600 px-4 py-1.5 text-xs font-bold tracking-widest text-stone-900 uppercase hover:bg-amber-500 transition"
            >
              + Adicionar Som
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar som..."
            className="rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-stone-100 outline-none focus:border-amber-500 w-48"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className="rounded-full px-3 py-1 text-xs capitalize transition"
                style={
                  filterCategory === cat
                    ? { background: "#b45309", color: "#1c1917" }
                    : { background: "rgba(255,255,255,0.05)", color: "#a8a29e" }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-stone-500 text-sm">
            Carregando sons…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <span className="text-5xl opacity-20">🔇</span>
            <p className="text-sm text-stone-500">
              {buttons.length === 0 ? "Nenhum som ainda. Clique em '+ Adicionar Som' para começar." : "Nenhum som encontrado com esses filtros."}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map(button => (
              <SoundCard
                key={button.id}
                button={button}
                audioState={activeAudios[button.id]?.state ?? "idle"}
                onPlay={() => handlePlay(button)}
                onStop={() => handleStop(button.id)}
                onEdit={() => setEditingButton(button)}
                onDelete={() => handleDelete(button.id)}
                onVolumeChange={v => handleVolumeChange(button, v)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <SoundModal onSave={handleCreate} onClose={() => setShowModal(false)} />
      )}
      {editingButton && (
        <SoundModal initial={editingButton} onSave={handleEdit} onClose={() => setEditingButton(null)} />
      )}
    </div>
  );
}
