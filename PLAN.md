# Plan de Desarrollo - TaskFlow (Gestor de Tareas)

> **Última actualización:** Mayo 2026
> **Stack:** Next.js 16 + TypeScript + Tailwind CSS v4 + Turso + Drizzle ORM
> **Entidad:** `tasks` (Gestor de Tareas)

---

## 📋 Pre-requisitos Confirmados

- ✅ Node.js instalado
- ✅ Cuenta en Turso (https://turso.tech)
- ✅ Base de datos creada en Turso
- ✅ Variables de entorno configuradas en `.env.local` (NO subir a GitHub)

---

## 🗂️ Estructura de Carpetas (Objetivo)

```
crud-moderno-js/
├── drizzle/                 # Migraciones generadas
├── public/
├── src/
│   ├── app/
│   │   ├── actions.ts       # Server Actions (CRUD)
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Página principal (Dashboard)
│   ├── components/          # Componentes reutilizables
│   │   └── ui/              # Componentes shadcn/ui
│   └── db/
│       ├── index.ts         # Cliente de Drizzle
│       └── schema.ts        # Esquema de la base de datos
├── .env.local               # Variables locales (IGNORADAS por Git)
├── .env.example             # Placeholder para documentación
├── drizzle.config.ts
└── next.config.ts
```

---

## 📌 Fase 1: Setup Inicial del Proyecto

**Estado:** ✅ COMPLETADA

### Acciones realizadas:
- Inicializado con `npx create-next-app@latest`
- Seleccionado: TypeScript, ESLint, Tailwind CSS, App Router, `src/` directory
- Instaladas dependencias: `@libsql/client`, `drizzle-orm`, `drizzle-kit`
- Configurado `drizzle.config.ts` con dialecto `turso`

### Primer commit:
```bash
git add .
git commit -m "feat: initial next.js setup with typescript and tailwind"
```

---

## 📌 Fase 2: Configuración de Base de Datos (Turso)

**Estado:** ✅ COMPLETADA

### Acciones realizadas:
- ✅ 2.1: Creada base de datos en Turso
- ✅ 2.2: Creado `.env.local` con credenciales
- ✅ 2.3: Creado `drizzle.config.ts`
- ✅ 2.4: Creado `src/db/schema.ts` (Entidad: `tasks`)
- ✅ 2.5: Creado `src/db/index.ts`
- ✅ 2.6: Generadas migraciones (`npx drizzle-kit generate`)
- ✅ 2.7: Aplicadas migraciones a Turso (`npx drizzle-kit migrate`)

### Esquema de la tabla `tasks`:
| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | integer (PK, auto-increment) | Identificador único |
| `title` | text (not null) | Título de la tarea |
| `description` | text | Descripción opcional |
| `status` | text (enum) | `pending` / `in_progress` / `completed` |
| `priority` | text (enum) | `low` / `medium` / `high` |
| `dueDate` | integer (timestamp) | Fecha límite |
| `createdAt` | integer (timestamp) | Fecha de creación |

### Commit:
```bash
git add .
git commit -m "feat: configure turso database with drizzle orm and initial schema"
```

---

## 📌 Fase 3: API / Server Actions

**Estado:** 🔄 EN PROGRESO (Próximo paso)

### 3.1: Activar Server Actions
En `next.config.ts`:
```typescript
const nextConfig = {
  experimental: {
    serverActions: true,
  },
};
export default nextConfig;
```

### 3.2: Crear Server Actions
Crear archivo `src/app/actions.ts`:

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getTasks() {
  return db.select().from(tasks).all();
}

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;
  const dueDate = formData.get("dueDate") as string;
  await db.insert(tasks).values({
    title,
    description,
    priority,
    dueDate: dueDate ? new Date(dueDate) : null,
  });
  revalidatePath("/");
}

export async function updateTask(id: number, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const priority = formData.get("priority") as string;
  const dueDate = formData.get("dueDate") as string;
  await db.update(tasks).set({
    title,
    description,
    status,
    priority,
    dueDate: dueDate ? new Date(dueDate) : null,
  }).where(eq(tasks.id, id));
  revalidatePath("/");
}

export async function deleteTask(id: number) {
  await db.delete(tasks).where(eq(tasks.id, id));
  revalidatePath("/");
}
```

### Commit:
```bash
git add .
git commit -m "feat: add server actions for task crud operations"
```

---

## 📌 Fase 4: UI Base con shadcn/ui

**Estado:** ⬜ PENDIENTE

### 4.1: Inicializar shadcn
```bash
npx shadcn-ui@latest init
```
Seleccionar:
- Style: **New York**
- Base color: **Slate** o **Zinc**
- CSS variables: **Yes**

### 4.2: Instalar componentes necesarios
```bash
npx shadcn-ui@latest add button input textarea dialog card dropdown-menu badge command sonner
```

### 4.3: Configurar fuente
En `src/app/layout.tsx`, usar fuente Geist o Inter.

### Commit:
```bash
git add .
git commit -m "feat: add shadcn ui components and theme configuration"
```

---

## 📌 Fase 5: Página Principal y CRUD UI

**Estado:** ⬜ PENDIENTE

### 5.1: Layout base
- Fondo sutil (`bg-slate-50`)
- Navegación limpia

### 5.2: Página principal (`src/app/page.tsx`)
- Fetch inicial de tasks con Server Action
- Grid de Cards (`rounded-2xl`, `shadow-sm`)
- Campos: Título, descripción truncada, status con Badge, prioridad, fecha límite
- Botones: Editar (Dialog), Eliminar (confirmación)

### 5.3: Formularios
- Dialog modal para Crear/Editar
- Validación con **Zod** + **React Hook Form**
  ```bash
  npm install react-hook-form zod @hookform/resolvers
  ```
- Feedback visual en errores

### 5.4: Estados vacíos
- Mensaje/ilustración cuando no hay tareas
- Botón CTA prominente

### Commit:
```bash
git add .
git commit -m "feat: implement main dashboard with task cards and forms"
```

---

## 📌 Fase 6: Animaciones y Micro-interacciones

**Estado:** ⬜ PENDIENTE

### 6.1: Instalar Framer Motion
```bash
npm install framer-motion
```

### 6.2: Animaciones a implementar
1. **Entrada de lista:** `staggerChildren` en el grid
2. **Hover en cards:** `whileHover={{ y: -4 }}` con spring
3. **Dialog:** `AnimatePresence` + fade/scale
4. **Botones:** `whileTap={{ scale: 0.97 }}`
5. **Eliminar:** Encogimiento y desvanecimiento de la card

### Commit:
```bash
git add .
git commit -m "feat: add framer motion animations and micro-interactions"
```

---

## 📌 Fase 7: Command Palette (Ctrl+K)

**Estado:** ⬜ PENDIENTE

### 7.1: Instalar dependencia
```bash
npm install cmdk
```

### 7.2: Implementar
Crear `src/components/command-menu.tsx`:
- Abrir con `Ctrl+K` / `Cmd+K`
- Acciones: Crear nuevo, Ver activos, Ver completados
- Navegación con flechas, Enter para ejecutar
- Fondo con `backdrop-blur-md`

### Commit:
```bash
git add .
git commit -m "feat: add command palette with keyboard navigation"
```

---

## 📌 Fase 8: Polish y Responsive

**Estado:** ⬜ PENDIENTE

### 8.1: Responsive Design
- Grid: 1 col (mobile), 2 cols (tablet), 3 cols (desktop)
- Dialogs fullscreen en mobile: `sm:max-w-lg`
- Touch targets mínimo 44px

### 8.2: Toasts de confirmación
Ya instalado con `sonner` en Fase 4.
Implementar notificaciones para:
- "Tarea creada exitosamente"
- "Tarea eliminada"
- "Error al guardar"

### 8.3: Loading states
- Skeletons con `animate-pulse`

### Commit:
```bash
git add .
git commit -m "feat: add responsive design, toasts and loading states"
```

---

## 📌 Fase 9: Deploy en Vercel

**Estado:** ⬜ PENDIENTE

### 9.1: Preparar para producción
- Verificar `.env.local` en `.gitignore`
- Verificar `next.config.ts`

### 9.2: Crear repo en GitHub
```bash
gh repo create nombre-del-proyecto --public --source=. --push
```
*(O crear manualmente en https://github.com/new)*

### 9.3: Conectar a Vercel
1. Ir a https://vercel.com → Importar proyecto desde GitHub
2. En **Environment Variables**, agregar:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
3. Deploy

### Commit final de fase:
```bash
git add .
git commit -m "chore: prepare for vercel deployment"
```

---

## 📌 Fase 10: LinkedIn Ready

**Estado:** ⬜ PENDIENTE

### 10.1: README profesional
Incluir:
- Badge de deploy (Vercel)
- GIF de la app funcionando
- Stack tecnológico con logos
- Explicación de por qué Turso + Drizzle
- Link al deploy

### 10.2: Screenshot/GIF
Capturar con CleanShot u otra herramienta:
- Animación de entrada
- Command Palette en acción
- Flujo crear-editar-eliminar

### 10.3: Post de LinkedIn
Estructura:
1. Hook: "Así es como construí un CRUD en 2024..."
2. Problema: DB tradicionales no funcionan bien en serverless
3. Solución: Turso (SQLite edge-native) + Drizzle ORM
4. Resultado: GIF de la app
5. CTA: "Link en comentarios 👇"

---

## 🔒 Seguridad: Variables de Entorno

| Archivo | Contenido | ¿Sube a GitHub? |
|---------|-----------|-----------------|
| `.env.local` | Credenciales reales | ❌ NO (ignorado por Git) |
| `.env.example` | Placeholders de ejemplo | ✅ SÍ (documentación) |
| Vercel Dashboard | Credenciales reales | ✅ NO (solo en la nube) |

**Recordatorio:** Siempre verificar con `git status` antes de hacer push.

---

## 🛡️ Protección de la Base de Datos (Opciones)

Decidí que para tu demo de LinkedIn vamos a usar **Opción B: PIN de Admin**.

- La **lista pública** se ve para todos (modo read-only).
- Las acciones de **escritura** (crear, editar, eliminar) requieren un PIN.
- El PIN se valida contra una variable de entorno `ADMIN_SECRET`.

### Implementación sugerida (Fase 5 o 8):
1. Crear variable `ADMIN_SECRET=mi-clave-super-secreta-123` en `.env.local` y en Vercel.
2. En los formularios de escritura, agregar campo "Clave de acceso".
3. Si el PIN no coincide, deshabilitar/denegar la acción.

---

## 📝 Decisiones Confirmadas

1. **Entidad:** `tasks` (Gestor de Tareas)
   - Campos: title, description, status, priority, dueDate, createdAt

2. **Nombre del proyecto:** `TaskFlow` (propuesto)
   - Actual repo: `crud-moderno-js`

3. **Estilo visual:**
   - Estilo Linear/Notion limpio + Command Palette (Ctrl+K) ✅
   - Tailwind CSS v4 + shadcn/ui

---

## 🚀 Checklist de Comandos Útiles

```bash
# Generar migraciones
npx drizzle-kit generate

# Aplicar migraciones
npx drizzle-kit migrate

# Ver estado de migraciones
npx drizzle-kit check

# Iniciar servidor de desarrollo
npm run dev

# Verificar cambios antes de commitear
git status

# Commits sugeridos por fase
# (Ver sección de cada fase arriba)
```

---

## 📚 Documentación de Referencia

- Next.js App Router: `node_modules/next/dist/docs/`
- Drizzle ORM: https://orm.drizzle.team/
- Turso: https://turso.tech/
- shadcn/ui: https://ui.shadcn.com/
- Tailwind CSS: https://tailwindcss.com/

---

*Plan creado para el proyecto CRUD Moderno con Turso y Next.js.*
