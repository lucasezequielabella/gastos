"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Dashboard from "@/components/Dashboard";
import ListaGastos from "@/components/ListaGastos";
import Presupuesto from "@/components/Presupuesto";
import Comparativa from "@/components/Comparativa";
import Configuracion from "@/components/Configuracion";
import RegistrarGasto from "@/components/RegistrarGasto";
import SeleccionUsuario from "@/components/SeleccionUsuario";
import { Spinner } from "@/components/ui";
import {
  fetchCategorias,
  fetchGastos,
  fetchMiembros,
  fetchPresupuestos,
  suscribirCambios,
} from "@/lib/data";
import { anioMesDeFecha, nombreMes } from "@/lib/format";
import type {
  Categoria,
  Espacio,
  GastoConRelaciones,
  Miembro,
  Presupuesto as TPresupuesto,
} from "@/lib/types";

type Tab = "resumen" | "gastos" | "presupuesto" | "comparativa" | "ajustes";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "resumen", label: "Resumen", icon: "📊" },
  { id: "gastos", label: "Gastos", icon: "🧾" },
  { id: "presupuesto", label: "Presup.", icon: "🎯" },
  { id: "comparativa", label: "Meses", icon: "📈" },
  { id: "ajustes", label: "Ajustes", icon: "⚙️" },
];

const STORAGE_KEY = "gastos_usuario_id";
const NOMBRE_FP = "Fernando y Paula";

export default function Home() {
  const ahora = new Date();
  const [tab, setTab] = useState<Tab>("resumen");
  const [anio, setAnio] = useState(ahora.getFullYear());
  const [mes, setMes] = useState(ahora.getMonth() + 1);

  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [usuarioListo, setUsuarioListo] = useState(false);
  const [espacio, setEspacio] = useState<Espacio>("familia");

  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [gastos, setGastos] = useState<GastoConRelaciones[]>([]);
  const [presupuestos, setPresupuestos] = useState<TPresupuesto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);

  // Leer el usuario guardado en este dispositivo
  useEffect(() => {
    try {
      setUsuarioId(localStorage.getItem(STORAGE_KEY));
    } catch {
      /* ignore */
    }
    setUsuarioListo(true);
  }, []);

  const cargar = useCallback(async () => {
    try {
      setError("");
      const [m, c, g, p] = await Promise.all([
        fetchMiembros(),
        fetchCategorias(),
        fetchGastos(espacio),
        fetchPresupuestos(espacio),
      ]);
      setMiembros(m);
      setCategorias(c);
      setGastos(g);
      setPresupuestos(p);
    } catch (err) {
      console.error(err);
      setError(
        "No se pudieron cargar los datos. Verificá la conexión e intentá de nuevo."
      );
    } finally {
      setCargando(false);
    }
  }, [espacio]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Actualización en vivo + al volver a la app
  useEffect(() => {
    const cancelar = suscribirCambios(() => cargar());
    const onVisible = () => {
      if (document.visibilityState === "visible") cargar();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", cargar);
    return () => {
      cancelar();
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", cargar);
    };
  }, [cargar]);

  const usuario = useMemo(
    () => miembros.find((m) => m.id === usuarioId) ?? null,
    [miembros, usuarioId]
  );

  function elegirUsuario(m: Miembro) {
    try {
      localStorage.setItem(STORAGE_KEY, m.id);
    } catch {
      /* ignore */
    }
    setUsuarioId(m.id);
    setEspacio("familia");
  }

  function cambiarUsuario() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setUsuarioId(null);
    setEspacio("familia");
    setTab("resumen");
  }

  const gastosDelMes = useMemo(
    () =>
      gastos.filter((g) => {
        const { anio: a, mes: m } = anioMesDeFecha(g.fecha);
        return a === anio && m === mes;
      }),
    [gastos, anio, mes]
  );

  const presupuestoDelMes = useMemo(
    () => presupuestos.find((p) => p.anio === anio && p.mes === mes) ?? null,
    [presupuestos, anio, mes]
  );

  function cambiarMes(delta: number) {
    let nuevoMes = mes + delta;
    let nuevoAnio = anio;
    if (nuevoMes < 1) {
      nuevoMes = 12;
      nuevoAnio -= 1;
    } else if (nuevoMes > 12) {
      nuevoMes = 1;
      nuevoAnio += 1;
    }
    setMes(nuevoMes);
    setAnio(nuevoAnio);
  }

  const muestraSelectorMes =
    tab === "resumen" || tab === "gastos" || tab === "presupuesto";

  // --- Pantalla de selección de usuario ---
  if (!usuarioListo || (cargando && miembros.length === 0 && !error)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <Spinner />
      </div>
    );
  }

  if (!usuario) {
    if (miembros.length === 0) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 px-6 text-center text-slate-300">
          {error || "Cargando..."}
        </div>
      );
    }
    return <SeleccionUsuario miembros={miembros} onSelect={elegirUsuario} />;
  }

  const esFp = espacio === "fp";

  return (
    <div className="mx-auto min-h-screen max-w-lg pb-28">
      {/* Header */}
      <header
        className={`sticky top-0 z-30 px-4 pb-3 pt-5 text-white shadow-md transition-colors ${
          esFp ? "bg-emerald-600" : "bg-brand"
        }`}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">
            💸 {esFp ? NOMBRE_FP : "Gastos en Familia"}
          </h1>
          <button
            onClick={cambiarUsuario}
            className="flex items-center gap-1.5 rounded-full bg-white/20 py-1 pl-1 pr-2.5 text-sm font-medium hover:bg-white/30"
            title="Cambiar de usuario"
          >
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
              style={{ backgroundColor: usuario.color }}
            >
              {usuario.nombre.charAt(0).toUpperCase()}
            </span>
            {usuario.nombre}
          </button>
        </div>

        {/* Selector de espacio (solo si el usuario accede al privado) */}
        {usuario.accede_privado && (
          <div className="mt-3 flex gap-1 rounded-xl bg-white/15 p-1">
            <button
              onClick={() => setEspacio("familia")}
              className={`flex-1 rounded-lg py-1.5 text-sm font-semibold transition ${
                !esFp ? "bg-white text-slate-800" : "text-white"
              }`}
            >
              👨‍👩‍👧‍👦 Familia
            </button>
            <button
              onClick={() => setEspacio("fp")}
              className={`flex-1 rounded-lg py-1.5 text-sm font-semibold transition ${
                esFp ? "bg-white text-emerald-700" : "text-white"
              }`}
            >
              🔒 {NOMBRE_FP}
            </button>
          </div>
        )}

        {muestraSelectorMes && (
          <div className="mt-3 flex items-center justify-center gap-4">
            <button
              onClick={() => cambiarMes(-1)}
              className="rounded-full bg-white/20 p-1.5 hover:bg-white/30"
              aria-label="Mes anterior"
            >
              <Chevron dir="left" />
            </button>
            <span className="min-w-[140px] text-center text-sm font-semibold">
              {nombreMes(mes)} {anio}
            </span>
            <button
              onClick={() => cambiarMes(1)}
              className="rounded-full bg-white/20 p-1.5 hover:bg-white/30"
              aria-label="Mes siguiente"
            >
              <Chevron dir="right" />
            </button>
          </div>
        )}
      </header>

      {/* Contenido */}
      <main className="px-4 py-5">
        {error ? (
          <div className="rounded-2xl bg-red-50 p-5 text-center text-red-600">
            {error}
          </div>
        ) : (
          <>
            {tab === "resumen" && (
              <Dashboard
                gastosDelMes={gastosDelMes}
                miembros={miembros}
                categorias={categorias}
                presupuesto={presupuestoDelMes}
                anio={anio}
                mes={mes}
              />
            )}
            {tab === "gastos" && (
              <ListaGastos
                gastos={gastosDelMes}
                miembros={miembros}
                categorias={categorias}
                onChanged={cargar}
              />
            )}
            {tab === "presupuesto" && (
              <Presupuesto
                presupuesto={presupuestoDelMes}
                gastosDelMes={gastosDelMes}
                espacio={espacio}
                anio={anio}
                mes={mes}
                onSaved={cargar}
              />
            )}
            {tab === "comparativa" && (
              <Comparativa gastos={gastos} presupuestos={presupuestos} />
            )}
            {tab === "ajustes" && (
              <Configuracion
                miembros={miembros}
                categorias={categorias}
                onChanged={cargar}
              />
            )}
          </>
        )}
      </main>

      {/* Botón flotante nuevo gasto */}
      {!error && (
        <button
          onClick={() => setModalAbierto(true)}
          className={`fixed bottom-24 left-1/2 z-30 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full text-3xl text-white shadow-lg transition active:scale-95 ${
            esFp ? "bg-emerald-600 hover:bg-emerald-700" : "bg-brand hover:bg-brand-dark"
          }`}
          aria-label="Nuevo gasto"
        >
          +
        </button>
      )}

      {/* Navegación inferior */}
      <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-lg -translate-x-1/2 border-t border-slate-200 bg-white">
        <div className="grid grid-cols-5">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition ${
                tab === t.id
                  ? esFp
                    ? "text-emerald-600"
                    : "text-brand"
                  : "text-slate-400"
              }`}
            >
              <span className="text-lg leading-none">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <RegistrarGasto
        open={modalAbierto}
        onClose={() => setModalAbierto(false)}
        miembros={miembros}
        categorias={categorias}
        espacio={espacio}
        miembroActualId={usuario.id}
        onSaved={cargar}
      />
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
