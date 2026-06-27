# 💸 Gastos en Familia

Aplicación web para gestionar los gastos de una familia de 4 personas. Permite
registrar gastos por categoría y por miembro, definir un presupuesto mensual con
alertas, y comparar la evolución del gasto mes a mes.

## Funcionalidades

- **Registro de gastos**: monto, miembro que gastó, categoría, fecha y detalle.
- **Resumen mensual**: total del mes, gasto por categoría (gráfico de torta) y
  por miembro (barras), con navegación entre meses.
- **Presupuesto mensual**: definís el límite máximo a gastar en cada mes y la app
  muestra cuánto te queda disponible y te avisa si lo superás.
- **Comparativa mensual**: gráfico de barras con los últimos meses, promedio,
  variación respecto al mes anterior y marca en rojo los meses que superaron el
  presupuesto.
- **Ajustes**: renombrar a los miembros de la familia y crear/editar/eliminar
  categorías (nombre, ícono y color).

## Stack

- [Next.js 14](https://nextjs.org/) (App Router) + React + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) para los estilos
- [Recharts](https://recharts.org/) para los gráficos
- [Supabase](https://supabase.com/) (PostgreSQL) como base de datos

Diseñada *mobile-first*: pensada para usarse cómodamente desde el celular.

## Puesta en marcha

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Configurar las variables de entorno. Copiá `.env.example` a `.env.local` y
   completá con los datos de tu proyecto Supabase:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-publishable
   ```

3. Levantar el entorno de desarrollo:

   ```bash
   npm run dev
   ```

   La app queda disponible en http://localhost:3000

## Base de datos

El esquema usa cuatro tablas con prefijo `familia_` para no interferir con otros
datos del proyecto Supabase:

- `familia_miembros` — los integrantes de la familia.
- `familia_categorias` — categorías de gasto (comida, transporte, etc.).
- `familia_gastos` — cada gasto registrado.
- `familia_presupuestos` — el límite mensual por mes.

Todas tienen RLS habilitado con políticas de acceso abierto, pensado para un uso
familiar sin login. Si querés restringir el acceso, podés agregar autenticación
de Supabase y ajustar las políticas.

## Despliegue

La forma más simple de publicarla es con [Vercel](https://vercel.com/):
conectás el repositorio, configurás las dos variables de entorno
(`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`) y listo.
