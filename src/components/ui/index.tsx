"use client";
import { cn } from "@/lib/utils";
import React from "react";

// ─── SectionTitle ─────────────────────────────────────────────────────────
export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center border-t border-b border-dnd-border py-1 mb-4 bg-dnd-red/5">
      <span className="font-display text-[10px] tracking-[3px] uppercase text-dnd-red font-semibold">
        {children}
      </span>
    </div>
  );
}

// ─── FieldLabel ───────────────────────────────────────────────────────────
export function FieldLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block text-[9px] tracking-[2px] uppercase text-ink-light font-serif mb-0.5", className)}>
      {children}
    </label>
  );
}

// ─── TextInput ────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}
export function TextInput({ className, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={cn(
        "w-full bg-parchment-200/60 border-0 border-b border-dnd-border",
        "font-serif text-[14px] text-ink px-1.5 py-1 outline-none",
        "focus:border-dnd-red focus:bg-parchment-100/90 transition-colors",
        className
      )}
    />
  );
}

// ─── NumberInput ──────────────────────────────────────────────────────────
export function NumberInput({ className, ...props }: InputProps) {
  return (
    <input
      type="number"
      {...props}
      className={cn(
        "bg-parchment-200/60 border-0 border-b border-dnd-border",
        "font-display text-ink px-1 py-0.5 outline-none text-center",
        "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
        "focus:border-dnd-red transition-colors",
        className
      )}
    />
  );
}

// ─── SelectInput ──────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  children: React.ReactNode;
}
export function SelectInput({ className, children, ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={cn(
        "w-full bg-parchment-200/60 border-0 border-b border-dnd-border",
        "font-serif text-[13px] text-ink px-1.5 py-1 outline-none",
        "focus:border-dnd-red transition-colors cursor-pointer",
        className
      )}
    >
      {children}
    </select>
  );
}

// ─── StatPill ─────────────────────────────────────────────────────────────
export function StatPill({
  value, label, size = "md",
}: {
  value: React.ReactNode; label: string; size?: "sm" | "md" | "lg";
}) {
  return (
    <div className="flex flex-col items-center bg-parchment-200/60 border border-dnd-border rounded px-4 py-2 shadow-inset">
      <span className={cn(
        "font-display text-ink leading-none",
        size === "sm" && "text-xl",
        size === "md" && "text-2xl",
        size === "lg" && "text-3xl",
      )}>
        {value}
      </span>
      <span className="text-[8px] tracking-[2px] uppercase text-dnd-red font-semibold mt-1 text-center">
        {label}
      </span>
    </div>
  );
}

// ─── ProfCircle ───────────────────────────────────────────────────────────
type ProfStyle = "none" | "half" | "full" | "expert";
const profStyles: Record<ProfStyle, string> = {
  none:   "bg-parchment-200 border-dnd-border",
  half:   "border-dnd-green",
  full:   "bg-ink border-ink",
  expert: "bg-dnd-goldLight border-dnd-gold",
};

export function ProfCircle({
  level, onClick, title, size = 14,
}: {
  level: 0 | 1 | 2 | 3;
  onClick?: () => void;
  title?: string;
  size?: number;
}) {
  const key: ProfStyle = (["none","half","full","expert"] as const)[level];
  return (
    <button
      type="button"
      title={title ?? "Clique para alternar proficiência"}
      onClick={onClick}
      style={{ width: size, height: size, minWidth: size }}
      className={cn(
        "rounded-full border-[1.5px] cursor-pointer transition-colors flex-shrink-0",
        profStyles[key],
        key === "half" && "bg-gradient-to-r from-dnd-green/60 via-dnd-green/60 to-parchment-200",
      )}
    />
  );
}

export function ProficiencyLegend({ className }: { className?: string }) {
  const items: Array<{ label: string; level: 0 | 1 | 2 | 3 }> = [
    { label: "Nenhum", level: 0 },
    { label: "Metade", level: 1 },
    { label: "Prof.", level: 2 },
    { label: "Esp.2×", level: 3 },
  ];

  return (
    <div className={cn(
      "flex flex-wrap gap-x-4 gap-y-1.5 items-center rounded border border-dnd-border bg-parchment-200/80 shadow-inset px-3 py-2",
      className,
    )}>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5 text-[10px] text-ink">
          <ProfCircle level={item.level} size={15} />
          <span className="font-serif whitespace-nowrap">{item.label}</span>
        </span>
      ))}
    </div>
  );
}

// ─── ToggleSwitch ─────────────────────────────────────────────────────────
export function ToggleSwitch({
  checked, onChange,
}: {
  checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-10 h-[20px] rounded-full border-[1.5px] transition-colors cursor-pointer",
        checked
          ? "bg-dnd-green/25 border-dnd-green"
          : "bg-parchment-500 border-dnd-border"
      )}
    >
      <span
        className={cn(
          "absolute top-[2px] w-[13px] h-[13px] rounded-full transition-transform",
          checked ? "translate-x-[5px] bg-dnd-green" : "translate-x-[-14px] bg-ink-light"
        )}
      />
    </button>
  );
}

// ─── DeathDot ─────────────────────────────────────────────────────────────
export function DeathDot({
  checked, type, onClick,
}: {
  checked: boolean; type: "success" | "fail"; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-4 h-4 rounded-full border-[1.5px] border-dnd-border transition-colors",
        checked && type === "success" && "bg-dnd-green border-dnd-green",
        checked && type === "fail"    && "bg-dnd-red border-dnd-red",
        !checked && "bg-parchment-200"
      )}
    />
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────
export function Divider() {
  return (
    <div className="print-hidden text-center text-dnd-gold text-xs tracking-[6px] my-5 opacity-70">
      — ✦ —
    </div>
  );
}

// ─── AddRowButton ─────────────────────────────────────────────────────────
export function AddRowButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2 border border-dashed border-dnd-border text-ink-light text-[12px] font-serif
                 px-3 py-1 rounded cursor-pointer tracking-wide hover:border-dnd-red hover:text-dnd-red
                 hover:bg-dnd-red/5 transition-colors"
    >
      {children}
    </button>
  );
}

// ─── DeleteButton ─────────────────────────────────────────────────────────
export function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-dnd-border hover:text-dnd-red transition-colors px-1 text-sm leading-none"
      title="Remover"
    >
      ✕
    </button>
  );
}
