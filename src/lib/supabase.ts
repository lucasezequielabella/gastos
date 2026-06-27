import { createClient } from "@supabase/supabase-js";

// Datos de conexión al proyecto Supabase.
//
// La "anon key" es una clave PÚBLICA por diseño: está pensada para vivir en el
// navegador, y el acceso real a los datos está restringido por las políticas
// RLS de la base. Por eso queda embebida acá y la app funciona sin necesidad de
// configurar variables de entorno en el hosting.
//
// Nota: se usa la clave "clásica" (JWT) en lugar de la nueva publishable porque
// este proyecto rechaza la publishable con error 401 en la Data API.
const SUPABASE_URL = "https://magcjhtastsvhijljygr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hZ2NqaHRhc3RzdmhpamxqeWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTUwNzEsImV4cCI6MjA5Njc3MTA3MX0.Q5v1XRqY5h9_-hbMprfvPTYbjqo8MnJY6rwpv4rym3g";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
