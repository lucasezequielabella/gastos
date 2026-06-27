"use client";

import { useMemo, useState } from "react";
import { Card } from "./ui";
import { formatMoney } from "@/lib/format";
import { deleteGasto } from "@/lib/data";
import type { Categoria, GastoConRelaciones, Miembro } from "@/lib/types";

export default function ListaGastos({
  gastos,
  miembros,
  categorias,
  onChanged,
}: {
  gastos: GastoConRelaciones[];
  miembros: Miembro[];
  categorias: Categoria[];
  onChanged: () => void;
}) {
  const [filtroMiembro, setFiltroMiembro] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [eliminando, setEliminando] = useState<string | null>(null);

  const filtrados = useMemo(() => {
    return gastos.filter((g) => {
      if (filtroMiembro && g.miembro_id !== filtroMiembro) return false;
      if (filtroCategoria && g.categoria_id !== filtroCategoria) return false;
      return true;
    });
  }, [gastos, filtroMiembro, filtroCategoria]);

  const total = filtrados.reduce((acc, g) => acc + Number(g.monto), 0);

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este gasto?")) return;
    setEliminando(id);
    try {
      await deleteGasto(id);
      onChanged();
    } catch (err) {
      alert("No se pudo eliminar el gasto.");
      console.error(err);
    } finally {
      setEliminando(null);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="!p-3">
        <div className="flex flex-wrap gap-2">
          <select
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
            value={filtroMiembro}
            onChange={(e) => setFiltroMiembro(e.target.value)}
          >
            <option value="">Todos los miembros</option>
            {miembros.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icono} {c.nombre}
              </option>
            ))}
          </select>
          <span className="ml-auto self-center text-sm font-semibold text-slate-600">
            {formatMoney(total)}
          </span>
        </div>
      </Card>

      {filtrados.length === 0 ? (
        <Card>
          <p className="py-8 text-center text-slate-400">
            No hay gastos para mostrar.
          </p>
        </Card>
      ) : (
        <Card className="!p-0">
          <ul className="divide-y divide-slate-100">
            {filtrados.map((g) => (
              <li
                key={g.id}
                className="flex items-center gap-3 px-4 py-3"
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg"
                  style={{
                    backgroundColor: (g.categoria?.color ?? "#64748b") + "22",
                  }}
                >
                  {g.categoria?.icono ?? "💰"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-800">
                    {g.categoria?.nombre ?? "Sin categoría"}
                    {g.descripcion ? (
                      <span className="font-normal text-slate-400">
                        {" "}
                        · {g.descripcion}
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-slate-400">
                    {g.miembro?.nombre ?? "—"} · {formatFecha(g.fecha)}
                  </p>
                </div>
                <span className="shrink-0 font-semibold text-slate-800">
                  {formatMoney(Number(g.monto))}
                </span>
                <button
                  onClick={() => handleDelete(g.id)}
                  disabled={eliminando === g.id}
                  className="shrink-0 rounded-full p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500"
                  aria-label="Eliminar"
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
        </Card>
      )}
    </div>
  );
}

function formatFecha(fecha: string): string {
  const [a, m, d] = fecha.split("-");
  return `${d}/${m}/${a}`;
}
