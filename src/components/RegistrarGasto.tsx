"use client";

import { useState } from "react";
import { Button, Field, inputClass, Modal } from "./ui";
import { createGasto } from "@/lib/data";
import { hoyISO } from "@/lib/format";
import type { Categoria, Espacio, Miembro } from "@/lib/types";

export default function RegistrarGasto({
  open,
  onClose,
  miembros,
  categorias,
  espacio,
  miembroActualId,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  miembros: Miembro[];
  categorias: Categoria[];
  espacio: Espacio;
  miembroActualId: string;
  onSaved: () => void;
}) {
  const [monto, setMonto] = useState("");
  const [miembroId, setMiembroId] = useState(miembroActualId);
  const [categoriaId, setCategoriaId] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState(hoyISO());
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  function reset() {
    setMonto("");
    setMiembroId(miembroActualId);
    setCategoriaId("");
    setDescripcion("");
    setFecha(hoyISO());
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const montoNum = parseFloat(monto.replace(",", "."));
    if (!montoNum || montoNum <= 0) {
      setError("Ingresá un monto válido.");
      return;
    }
    if (!miembroId) {
      setError("Elegí quién hizo el gasto.");
      return;
    }
    if (!categoriaId) {
      setError("Elegí una categoría.");
      return;
    }
    setGuardando(true);
    try {
      await createGasto({
        monto: montoNum,
        miembro_id: miembroId,
        categoria_id: categoriaId,
        descripcion: descripcion.trim() || null,
        fecha,
        espacio,
      });
      reset();
      onSaved();
      onClose();
    } catch (err) {
      setError("No se pudo guardar. Revisá la conexión e intentá de nuevo.");
      console.error(err);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Nuevo gasto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Monto">
          <input
            className={`${inputClass} text-2xl font-bold`}
            inputMode="decimal"
            placeholder="0"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            autoFocus
          />
        </Field>

        <Field label="¿Quién gastó?">
          <div className="grid grid-cols-2 gap-2">
            {miembros.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMiembroId(m.id)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                  miembroId === m.id
                    ? "border-transparent text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
                style={
                  miembroId === m.id ? { backgroundColor: m.color } : undefined
                }
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: m.color }}
                />
                <span className="truncate">{m.nombre}</span>
              </button>
            ))}
          </div>
        </Field>

        <Field label="Categoría">
          <div className="grid grid-cols-4 gap-2">
            {categorias.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategoriaId(c.id)}
                className={`flex flex-col items-center gap-1 rounded-xl border px-1 py-2 text-xs font-medium transition ${
                  categoriaId === c.id
                    ? "border-transparent text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
                style={
                  categoriaId === c.id
                    ? { backgroundColor: c.color }
                    : undefined
                }
                title={c.nombre}
              >
                <span className="text-lg leading-none">{c.icono}</span>
                <span className="w-full truncate text-center">{c.nombre}</span>
              </button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Fecha">
            <input
              type="date"
              className={inputClass}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </Field>
          <Field label="Detalle (opcional)">
            <input
              className={inputClass}
              placeholder="Ej: Super"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Field>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex gap-2 pt-1">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" disabled={guardando} className="flex-1">
            {guardando ? "Guardando..." : "Guardar gasto"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
