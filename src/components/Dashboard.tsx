"use client";

import { useMemo } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, SectionTitle } from "./ui";
import { formatMoney, nombreMes } from "@/lib/format";
import type {
  Categoria,
  GastoConRelaciones,
  Miembro,
  Presupuesto,
} from "@/lib/types";

export default function Dashboard({
  gastosDelMes,
  miembros,
  categorias,
  presupuesto,
  anio,
  mes,
}: {
  gastosDelMes: GastoConRelaciones[];
  miembros: Miembro[];
  categorias: Categoria[];
  presupuesto: Presupuesto | null;
  anio: number;
  mes: number;
}) {
  const total = useMemo(
    () => gastosDelMes.reduce((acc, g) => acc + Number(g.monto), 0),
    [gastosDelMes]
  );

  const limite = presupuesto?.monto_limite ?? 0;
  const pct = limite > 0 ? Math.min((total / limite) * 100, 100) : 0;
  const excedido = limite > 0 && total > limite;
  const restante = limite - total;

  const porCategoria = useMemo(() => {
    const map = new Map<string, number>();
    for (const g of gastosDelMes) {
      const key = g.categoria_id ?? "sin";
      map.set(key, (map.get(key) ?? 0) + Number(g.monto));
    }
    return categorias
      .map((c) => ({
        nombre: c.nombre,
        icono: c.icono,
        color: c.color,
        monto: map.get(c.id) ?? 0,
      }))
      .filter((c) => c.monto > 0)
      .sort((a, b) => b.monto - a.monto);
  }, [gastosDelMes, categorias]);

  const porMiembro = useMemo(() => {
    const map = new Map<string, number>();
    for (const g of gastosDelMes) {
      const key = g.miembro_id ?? "sin";
      map.set(key, (map.get(key) ?? 0) + Number(g.monto));
    }
    return miembros
      .map((m) => ({
        nombre: m.nombre,
        color: m.color,
        monto: map.get(m.id) ?? 0,
      }))
      .sort((a, b) => b.monto - a.monto);
  }, [gastosDelMes, miembros]);

  const maxMiembro = Math.max(1, ...porMiembro.map((m) => m.monto));

  return (
    <div className="space-y-5">
      {/* Resumen + presupuesto */}
      <Card>
        <p className="text-sm font-medium text-slate-500">
          Gastado en {nombreMes(mes)} {anio}
        </p>
        <p className="mt-1 text-4xl font-bold text-slate-900">
          {formatMoney(total)}
        </p>

        {limite > 0 ? (
          <div className="mt-4">
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all ${
                  excedido
                    ? "bg-red-500"
                    : pct > 80
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-slate-500">
                Presupuesto: {formatMoney(limite)}
              </span>
              <span
                className={`font-semibold ${
                  excedido ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {excedido
                  ? `Excedido por ${formatMoney(Math.abs(restante))}`
                  : `Quedan ${formatMoney(restante)}`}
              </span>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-400">
            No definiste presupuesto para este mes. Configuralo en la pestaña
            “Presupuesto”.
          </p>
        )}
      </Card>

      {gastosDelMes.length === 0 ? (
        <Card>
          <p className="py-8 text-center text-slate-400">
            Todavía no hay gastos en {nombreMes(mes)}. Tocá el botón{" "}
            <span className="font-semibold text-brand">+</span> para agregar el
            primero.
          </p>
        </Card>
      ) : (
        <>
          {/* Por categoría */}
          <Card>
            <SectionTitle>Por categoría</SectionTitle>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="h-44 w-44 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={porCategoria}
                      dataKey="monto"
                      nameKey="nombre"
                      innerRadius={45}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {porCategoria.map((c, i) => (
                        <Cell key={i} fill={c.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number) => formatMoney(v)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="w-full space-y-2">
                {porCategoria.map((c) => (
                  <li
                    key={c.nombre}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                      <span>
                        {c.icono} {c.nombre}
                      </span>
                    </span>
                    <span className="font-semibold text-slate-700">
                      {formatMoney(c.monto)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Por miembro */}
          <Card>
            <SectionTitle>Por miembro</SectionTitle>
            <ul className="space-y-3">
              {porMiembro.map((m) => (
                <li key={m.nombre}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: m.color }}
                      />
                      {m.nombre}
                    </span>
                    <span className="font-semibold text-slate-700">
                      {formatMoney(m.monto)}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(m.monto / maxMiembro) * 100}%`,
                        backgroundColor: m.color,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}
