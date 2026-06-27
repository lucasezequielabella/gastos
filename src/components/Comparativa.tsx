"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, SectionTitle } from "./ui";
import { anioMesDeFecha, formatMoney, nombreMes } from "@/lib/format";
import type { GastoConRelaciones, Presupuesto } from "@/lib/types";

export default function Comparativa({
  gastos,
  presupuestos,
}: {
  gastos: GastoConRelaciones[];
  presupuestos: Presupuesto[];
}) {
  const datos = useMemo(() => {
    const map = new Map<string, number>();
    for (const g of gastos) {
      const { anio, mes } = anioMesDeFecha(g.fecha);
      const key = `${anio}-${String(mes).padStart(2, "0")}`;
      map.set(key, (map.get(key) ?? 0) + Number(g.monto));
    }
    // últimos 12 meses con o sin datos, terminando en el mes más reciente con gastos
    const claves = Array.from(map.keys()).sort();
    const presupMap = new Map(
      presupuestos.map((p) => [
        `${p.anio}-${String(p.mes).padStart(2, "0")}`,
        Number(p.monto_limite),
      ])
    );
    return claves.slice(-12).map((key) => {
      const [anio, mes] = key.split("-").map(Number);
      return {
        key,
        label: `${nombreMes(mes).slice(0, 3)} ${String(anio).slice(2)}`,
        anio,
        mes,
        total: map.get(key) ?? 0,
        presupuesto: presupMap.get(key) ?? 0,
      };
    });
  }, [gastos, presupuestos]);

  const promedio =
    datos.length > 0
      ? datos.reduce((acc, d) => acc + d.total, 0) / datos.length
      : 0;

  const variacion = useMemo(() => {
    if (datos.length < 2) return null;
    const ult = datos[datos.length - 1].total;
    const prev = datos[datos.length - 2].total;
    if (prev === 0) return null;
    return ((ult - prev) / prev) * 100;
  }, [datos]);

  if (datos.length === 0) {
    return (
      <Card>
        <p className="py-8 text-center text-slate-400">
          Cuando registres gastos vas a ver acá la comparativa mes a mes.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle>Comparativa mensual</SectionTitle>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datos} margin={{ top: 10, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                width={48}
                tickFormatter={(v) =>
                  v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)
                }
              />
              <Tooltip
                formatter={(v: number, name) => [
                  formatMoney(v),
                  name === "total" ? "Gastado" : "Presupuesto",
                ]}
                labelFormatter={(_l, payload) => {
                  const p = payload?.[0]?.payload;
                  return p ? `${nombreMes(p.mes)} ${p.anio}` : "";
                }}
              />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {datos.map((d, i) => (
                  <Cell
                    key={i}
                    fill={
                      d.presupuesto > 0 && d.total > d.presupuesto
                        ? "#ef4444"
                        : "#6366f1"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-center text-xs text-slate-400">
          Las barras en rojo superaron el presupuesto de ese mes.
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <p className="text-xs text-slate-400">Promedio mensual</p>
          <p className="mt-1 text-xl font-bold text-slate-800">
            {formatMoney(promedio)}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-slate-400">Variación último mes</p>
          {variacion === null ? (
            <p className="mt-1 text-xl font-bold text-slate-400">—</p>
          ) : (
            <p
              className={`mt-1 text-xl font-bold ${
                variacion > 0 ? "text-red-600" : "text-emerald-600"
              }`}
            >
              {variacion > 0 ? "▲" : "▼"} {Math.abs(variacion).toFixed(0)}%
            </p>
          )}
        </Card>
      </div>

      <Card className="!p-0">
        <ul className="divide-y divide-slate-100">
          {[...datos].reverse().map((d) => (
            <li
              key={d.key}
              className="flex items-center justify-between px-4 py-3 text-sm"
            >
              <span className="font-medium text-slate-700">
                {nombreMes(d.mes)} {d.anio}
              </span>
              <span className="flex items-center gap-3">
                {d.presupuesto > 0 && (
                  <span className="text-xs text-slate-400">
                    / {formatMoney(d.presupuesto)}
                  </span>
                )}
                <span
                  className={`font-semibold ${
                    d.presupuesto > 0 && d.total > d.presupuesto
                      ? "text-red-600"
                      : "text-slate-800"
                  }`}
                >
                  {formatMoney(d.total)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
