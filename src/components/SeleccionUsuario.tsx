"use client";

import type { Miembro } from "@/lib/types";

export default function SeleccionUsuario({
  miembros,
  onSelect,
}: {
  miembros: Miembro[];
  onSelect: (m: Miembro) => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-6">
      <div className="mb-10 text-center">
        <div className="mb-3 text-5xl">💸</div>
        <h1 className="text-2xl font-bold text-white">Gastos en Familia</h1>
        <p className="mt-2 text-slate-400">¿Quién sos?</p>
      </div>

      <div className="grid w-full max-w-sm grid-cols-2 gap-4">
        {miembros.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelect(m)}
            className="flex flex-col items-center gap-3 rounded-2xl bg-slate-800 p-6 ring-1 ring-slate-700 transition hover:bg-slate-700 active:scale-95"
          >
            <span
              className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white"
              style={{ backgroundColor: m.color }}
            >
              {m.nombre.charAt(0).toUpperCase()}
            </span>
            <span className="font-semibold text-white">{m.nombre}</span>
          </button>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-slate-500">
        Podés cambiar de usuario cuando quieras desde la app.
      </p>
    </div>
  );
}
