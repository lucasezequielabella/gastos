export type Miembro = {
  id: string;
  nombre: string;
  color: string;
  orden: number;
  created_at: string;
};

export type Categoria = {
  id: string;
  nombre: string;
  icono: string;
  color: string;
  orden: number;
  created_at: string;
};

export type Gasto = {
  id: string;
  miembro_id: string | null;
  categoria_id: string | null;
  monto: number;
  descripcion: string | null;
  fecha: string; // YYYY-MM-DD
  created_at: string;
};

export type GastoConRelaciones = Gasto & {
  miembro: Miembro | null;
  categoria: Categoria | null;
};

export type Presupuesto = {
  id: string;
  anio: number;
  mes: number;
  monto_limite: number;
  created_at: string;
  updated_at: string;
};
