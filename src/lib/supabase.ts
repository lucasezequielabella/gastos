import { createClient } from "@supabase/supabase-js";

// Datos de conexión al proyecto Supabase dedicado a la app de gastos.
//
// La "anon key" es una clave PÚBLICA por diseño: está pensada para vivir en el
// navegador, y el acceso real a los datos está restringido por las políticas
// RLS de la base. Por eso queda embebida acá y la app funciona sin necesidad de
// configurar variables de entorno en el hosting.
const SUPABASE_URL = "https://apmausbkxgxhrujhbewb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwbWF1c2JreGd4aHJ1amhiZXdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NjI0NDksImV4cCI6MjA5ODEzODQ0OX0.Z28J8e7c_yju3mU4t9SdJt6462KtyrZfTP2o5rY96X8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
