export function formatMoney(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function nombreMes(mes: number): string {
  return MESES[mes - 1] ?? "";
}

export function claveMes(anio: number, mes: number): string {
  return `${anio}-${String(mes).padStart(2, "0")}`;
}

/** Devuelve {anio, mes} (mes 1-12) a partir de una fecha YYYY-MM-DD */
export function anioMesDeFecha(fecha: string): { anio: number; mes: number } {
  const [anio, mes] = fecha.split("-").map(Number);
  return { anio, mes };
}

export function hoyISO(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60 * 1000);
  return local.toISOString().slice(0, 10);
}
