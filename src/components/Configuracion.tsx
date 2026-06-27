"use client";

import { useState } from "react";
import { Button, Card, inputClass, SectionTitle } from "./ui";
import {
  createCategoria,
  createMiembro,
  deleteCategoria,
  deleteMiembro,
  updateCategoria,
  updateMiembro,
} from "@/lib/data";
import type { Categoria, Miembro } from "@/lib/types";

const PALETA = [
  "#6366f1",
  "#ec4899",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6",
  "#06b6d4",
  "#64748b",
];

export default function Configuracion({
  miembros,
  categorias,
  onChanged,
}: {
  miembros: Miembro[];
  categorias: Categoria[];
  onChanged: () => void;
}) {
  return (
    <div className="space-y-5">
      <MiembrosConfig miembros={miembros} onChanged={onChanged} />
      <CategoriasConfig categorias={categorias} onChanged={onChanged} />
    </div>
  );
}

function MiembrosConfig({
  miembros,
  onChanged,
}: {
  miembros: Miembro[];
  onChanged: () => void;
}) {
  const [nuevoNombre, setNuevoNombre] = useState("");

  async function guardarNombre(m: Miembro, nombre: string) {
    const limpio = nombre.trim();
    if (!limpio || limpio === m.nombre) return;
    await updateMiembro(m.id, { nombre: limpio });
    onChanged();
  }

  async function cambiarColor(m: Miembro, color: string) {
    await updateMiembro(m.id, { color });
    onChanged();
  }

  async function agregar() {
    const limpio = nuevoNombre.trim();
    if (!limpio) return;
    await createMiembro(limpio, PALETA[miembros.length % PALETA.length], miembros.length + 1);
    setNuevoNombre("");
    onChanged();
  }

  async function eliminar(m: Miembro) {
    if (!confirm(`¿Eliminar a "${m.nombre}"? Sus gastos quedarán sin miembro.`))
      return;
    await deleteMiembro(m.id);
    onChanged();
  }

  return (
    <Card>
      <SectionTitle>Miembros de la familia</SectionTitle>
      <ul className="space-y-3">
        {miembros.map((m) => (
          <li key={m.id} className="flex items-center gap-2">
            <ColorPicker
              value={m.color}
              onChange={(c) => cambiarColor(m, c)}
            />
            <input
              defaultValue={m.nombre}
              className={`${inputClass} flex-1 py-2`}
              onBlur={(e) => guardarNombre(m, e.target.value)}
            />
            <button
              onClick={() => eliminar(m)}
              className="rounded-full p-2 text-slate-300 hover:bg-red-50 hover:text-red-500"
              aria-label="Eliminar miembro"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 7h12M9 7V5h6v2m-7 0v12a1 1 0 001 1h6a1 1 0 001-1V7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-2">
        <input
          className={`${inputClass} flex-1 py-2`}
          placeholder="Agregar miembro..."
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && agregar()}
        />
        <Button onClick={agregar}>Agregar</Button>
      </div>
    </Card>
  );
}

function CategoriasConfig({
  categorias,
  onChanged,
}: {
  categorias: Categoria[];
  onChanged: () => void;
}) {
  const [nombre, setNombre] = useState("");
  const [icono, setIcono] = useState("💰");

  async function agregar() {
    const limpio = nombre.trim();
    if (!limpio) return;
    await createCategoria(
      limpio,
      icono.trim() || "💰",
      PALETA[categorias.length % PALETA.length],
      categorias.length + 1
    );
    setNombre("");
    setIcono("💰");
    onChanged();
  }

  async function guardarNombre(c: Categoria, nuevo: string) {
    const limpio = nuevo.trim();
    if (!limpio || limpio === c.nombre) return;
    await updateCategoria(c.id, { nombre: limpio });
    onChanged();
  }

  async function guardarIcono(c: Categoria, nuevo: string) {
    const limpio = nuevo.trim() || "💰";
    if (limpio === c.icono) return;
    await updateCategoria(c.id, { icono: limpio });
    onChanged();
  }

  async function cambiarColor(c: Categoria, color: string) {
    await updateCategoria(c.id, { color });
    onChanged();
  }

  async function eliminar(c: Categoria) {
    if (
      !confirm(
        `¿Eliminar la categoría "${c.nombre}"? Sus gastos quedarán sin categoría.`
      )
    )
      return;
    await deleteCategoria(c.id);
    onChanged();
  }

  return (
    <Card>
      <SectionTitle>Categorías</SectionTitle>
      <ul className="space-y-3">
        {categorias.map((c) => (
          <li key={c.id} className="flex items-center gap-2">
            <ColorPicker value={c.color} onChange={(col) => cambiarColor(c, col)} />
            <input
              defaultValue={c.icono}
              className={`${inputClass} w-14 px-2 py-2 text-center text-lg`}
              maxLength={2}
              onBlur={(e) => guardarIcono(c, e.target.value)}
            />
            <input
              defaultValue={c.nombre}
              className={`${inputClass} flex-1 py-2`}
              onBlur={(e) => guardarNombre(c, e.target.value)}
            />
            <button
              onClick={() => eliminar(c)}
              className="rounded-full p-2 text-slate-300 hover:bg-red-50 hover:text-red-500"
              aria-label="Eliminar categoría"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 7h12M9 7V5h6v2m-7 0v12a1 1 0 001 1h6a1 1 0 001-1V7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-2">
        <input
          className={`${inputClass} w-14 px-2 py-2 text-center text-lg`}
          maxLength={2}
          value={icono}
          onChange={(e) => setIcono(e.target.value)}
        />
        <input
          className={`${inputClass} flex-1 py-2`}
          placeholder="Nueva categoría..."
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && agregar()}
        />
        <Button onClick={agregar}>Agregar</Button>
      </div>
    </Card>
  );
}

function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (c: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="h-8 w-8 shrink-0 rounded-full ring-2 ring-white ring-offset-1 ring-offset-slate-200"
        style={{ backgroundColor: value }}
        aria-label="Cambiar color"
      />
      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-10 z-20 grid grid-cols-3 gap-1 rounded-xl bg-white p-2 shadow-lg ring-1 ring-slate-200">
            {PALETA.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                }}
                className="h-7 w-7 rounded-full"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
