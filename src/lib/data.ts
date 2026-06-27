import { supabase } from "./supabase";
import type {
  Categoria,
  Gasto,
  GastoConRelaciones,
  Miembro,
  Presupuesto,
} from "./types";

// ---------- Miembros ----------
export async function fetchMiembros(): Promise<Miembro[]> {
  const { data, error } = await supabase
    .from("familia_miembros")
    .select("*")
    .order("orden", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function updateMiembro(
  id: string,
  cambios: Partial<Pick<Miembro, "nombre" | "color">>
): Promise<void> {
  const { error } = await supabase
    .from("familia_miembros")
    .update(cambios)
    .eq("id", id);
  if (error) throw error;
}

export async function createMiembro(
  nombre: string,
  color: string,
  orden: number
): Promise<void> {
  const { error } = await supabase
    .from("familia_miembros")
    .insert({ nombre, color, orden });
  if (error) throw error;
}

export async function deleteMiembro(id: string): Promise<void> {
  const { error } = await supabase.from("familia_miembros").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Categorías ----------
export async function fetchCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from("familia_categorias")
    .select("*")
    .order("orden", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createCategoria(
  nombre: string,
  icono: string,
  color: string,
  orden: number
): Promise<void> {
  const { error } = await supabase
    .from("familia_categorias")
    .insert({ nombre, icono, color, orden });
  if (error) throw error;
}

export async function updateCategoria(
  id: string,
  cambios: Partial<Pick<Categoria, "nombre" | "icono" | "color">>
): Promise<void> {
  const { error } = await supabase
    .from("familia_categorias")
    .update(cambios)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteCategoria(id: string): Promise<void> {
  const { error } = await supabase
    .from("familia_categorias")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// ---------- Gastos ----------
export async function fetchGastos(): Promise<GastoConRelaciones[]> {
  const { data, error } = await supabase
    .from("familia_gastos")
    .select(
      "*, miembro:familia_miembros(*), categoria:familia_categorias(*)"
    )
    .order("fecha", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as GastoConRelaciones[];
}

export async function createGasto(
  gasto: Pick<
    Gasto,
    "miembro_id" | "categoria_id" | "monto" | "descripcion" | "fecha"
  >
): Promise<void> {
  const { error } = await supabase.from("familia_gastos").insert(gasto);
  if (error) throw error;
}

export async function deleteGasto(id: string): Promise<void> {
  const { error } = await supabase.from("familia_gastos").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Presupuestos ----------
export async function fetchPresupuestos(): Promise<Presupuesto[]> {
  const { data, error } = await supabase
    .from("familia_presupuestos")
    .select("*");
  if (error) throw error;
  return data ?? [];
}

/** Crea o actualiza el presupuesto de un mes (upsert por anio+mes) */
export async function upsertPresupuesto(
  anio: number,
  mes: number,
  monto_limite: number
): Promise<void> {
  const { error } = await supabase
    .from("familia_presupuestos")
    .upsert(
      { anio, mes, monto_limite, updated_at: new Date().toISOString() },
      { onConflict: "anio,mes" }
    );
  if (error) throw error;
}
