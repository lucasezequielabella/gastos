"use client";

import { useEffect, useState } from "react";
import { Button, Card, Field, inputClass, SectionTitle } from "./ui";
import { formatMoney, nombreMes } from "@/lib/format";
import { upsertPresupuesto } from "@/lib/data";
import type {
  Espacio,
  GastoConRelaciones,
  Presupuesto as TPresupuesto,
} from "@/lib/types";

export default function Presupuesto({
  presupuesto,
  gastosDelMes,
  espacio,
  anio,
  mes,
  onSaved,
}: {
  presupuesto: TPresupuesto | null;
  gastosDelMes: GastoConRelaciones[];
  espacio: Espacio;
  anio: number;
  mes: number;
  onSaved: () => void;
}) {
  const [valor, setValor] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setValor(presupuesto ? String(presupuesto.monto_limite) : "");
    setOk(false);
  }, [presupuesto, anio, mes]);

  const total = gastosDelMes.reduce((acc, g) => acc + Number(g.monto), 0);
  const limite = presupuesto?.monto_limite ?? 0;
  const restante = limite - total;
  const excedido = limite > 0 && total > limite;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = parseFloat(valor.replace(",", "."));
    if (isNaN(num) || num < 0) return;
    setGuardando(true);
    setOk(false);
    try {
      await upsertPresupuesto(espacio, anio, mes, num);
      setOk(true);
      onSaved();
    } catch (err) {
      alert("No se pudo guardar el presupuesto.");
      console.error(err);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card>
        <SectionTitle>
          Presupuesto de {nombreMes(mes)} {anio}
        </SectionTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Límite máximo a gastar este mes">
            <input
              className={`${inputClass} text-2xl font-bold`}
              inputMode="decimal"
              placeholder="0"
              value={valor}
              onChange={(e) => {
                setValor(e.target.value);
                setOk(false);
              }}
            />
          </Field>
          <Button type="submit" disabled={guardando} className="w-full">
            {guardando ? "Guardando..." : "Guardar presupuesto"}
          </Button>
          {ok && (
            <p className="text-center text-sm font-medium text-emerald-600">
              ✓ Presupuesto guardado
            </p>
          )}
        </form>
      </Card>

      {limite > 0 && (
        <Card>
          <SectionTitle>Estado del mes</SectionTitle>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-slate-400">Límite</p>
              <p className="font-bold text-slate-800">{formatMoney(limite)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Gastado</p>
              <p className="font-bold text-slate-800">{formatMoney(total)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">
                {excedido ? "Excedido" : "Disponible"}
              </p>
              <p
                className={`font-bold ${
                  excedido ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {formatMoney(Math.abs(restante))}
              </p>
            </div>
          </div>
          {excedido && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-center text-sm font-medium text-red-600">
              ⚠️ Superaste el presupuesto del mes.
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
