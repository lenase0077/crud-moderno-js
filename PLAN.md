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

**Estado:** ✅ COMPLETADA

### Nota:
- `next.config.ts` usa `serverActions: { bodySizeLimit: "2mb" }` (en Next.js 16 no acepta `true` directamente)

### Acciones realizadas:
- ✅ 3.1: Activadas Server Actions en `next.config.ts`
- ✅ 3.2: Creado `src/app/actions.ts` con las siguientes funciones:
  - `getTasks()` - Obtener todas las tareas
  - `getTaskById(id)` - Obtener una tarea por ID
  - `createTask(formData)` - Crear nueva tarea (valida título obligatorio)
  - `updateTask(id, formData)` - Actualizar tarea existente
  - `updateTaskStatus(id, status)` - Actualizar solo el estado (para drag & drop)
  - `deleteTask(id)` - Eliminar tarea

### Archivos creados/modificados:
- `src/app/actions.ts` (nuevo)
- `next.config.ts` (modificado - activa server actions)

### Commit:
```bash
git add .
git commit -m "feat: add server actions for task crud operations"
```

---

## 📌 Fase 4: UI Base con shadcn/ui

**Estado:** ✅ COMPLETADA

### Acciones realizadas:
- ✅ 4.1: Instaladas dependencias base (`class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`)
- ✅ 4.2: Creado `src/lib/utils.ts` (función `cn()`)
- ✅ 4.3: Creado `components.json` (configuración shadcn)
- ✅ 4.4: Creados componentes UI personalizados:
  - `button.tsx` - Botones con variantes (default, outline, ghost, destructive, etc.)
  - `card.tsx` - Cards con header, title, description, content, footer
  - `badge.tsx` - Badges con variantes de color
  - `input.tsx` - Inputs estilizados
  - `textarea.tsx` - Textareas estilizados
  - `label.tsx` - Labels de formularios
  - `dialog.tsx` - Modales con Radix UI (overlay, animaciones, backdrop blur)
  - `sonner.tsx` - Toasts/notificaciones (posición bottom-right, rich colors)
- ✅ 4.5: Actualizado `globals.css` con variables CSS de tema y animaciones para dialogs
- ✅ 4.6: Actualizado `layout.tsx` con título "TaskFlow", idioma español y Toaster

### Dependencias instaladas:
```bash
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install @radix-ui/react-dialog sonner
```

### Commit:
```bash
git add .
git commit -m "feat: add shadcn ui components and theme configuration"
```

---

## 📌 Fase 5: Página Principal y CRUD UI

**Estado:** ✅ COMPLETADA

### Dependencias instaladas:
```bash
npm install react-hook-form zod @hookform/resolvers date-fns
```

### Componentes creados:

| Componente | Archivo | Descripción |
|---|---|---|
| `EmptyState` | `src/components/empty-state.tsx` | Estado vacío con icono, mensaje y CTA |
| `TaskCard` | `src/components/task-card.tsx` | Card de tarea con badges, hover actions, fechas |
| `TaskForm` | `src/components/task-form.tsx` | Modal crear/editar con React Hook Form + Zod |
| `DeleteDialog` | `src/components/delete-dialog.tsx` | Confirmación de eliminación con icono de alerta |
| `TaskDashboard` | `src/components/task-dashboard.tsx` | Client Component con toda la lógica interactiva |

### Página principal (`src/app/page.tsx`):
- Server Component que hace `getTasks()`
- Serializa fechas a strings para pasar al Client Component
- Renderiza `TaskDashboard`

### Features implementadas:
- ✅ Header sticky con blur backdrop
- ✅ Buscador de tareas en tiempo real
- ✅ Filtros por estado (Todas, Pendientes, En progreso, Completadas)
- ✅ Toggle vista Grid / List
- ✅ Cards con hover effects (elevar + mostrar botones)
- ✅ Badges de estado con colores (ámbar, azul, esmeralda)
- ✅ Badges de prioridad con colores (gris, naranja, rosa)
- ✅ Formulario validado con Zod (título obligatorio, máximos caracteres)
- ✅ Modal de eliminación con confirmación
- ✅ Toasts de éxito/error con Sonner
- ✅ Fechas formateadas con `date-fns` en español

### Commit:
```bash
git add .
git commit -m "feat: implement main dashboard with task cards and forms"
```

---

## 📌 Fase 6: Animaciones y Micro-interacciones

**Estado:** ✅ COMPLETADA

### Dependencias instaladas:
```bash
npm install framer-motion
```

### Animaciones implementadas:

| Ubicación | Animación | Detalle |
|---|---|---|
| `task-dashboard.tsx` | **Stagger Children** | Las cards aparecen secuencialmente con delay de 60ms cada una |
| `task-dashboard.tsx` | **Layout Animation** | Las cards se reordenan suavemente al filtrar |
| `task-dashboard.tsx` | **AnimatePresence** | Transiciones suaves entre estado vacío y lista de tareas |
| `task-card.tsx` | **Hover Spring** | `y: -4` con `stiffness: 400, damping: 20` al pasar el mouse |
| `task-card.tsx` | **Tap Scale** | `scale: 0.98` al hacer click |
| `task-card.tsx` | **Entry Animation** | `opacity: 0 → 1`, `y: 20 → 0`, `scale: 0.95 → 1` |
| `task-card.tsx` | **Exit Animation** | `opacity: 0`, `scale: 0.9` al eliminar |
| `empty-state.tsx` | **Spring Entry** | Entrada suave con spring al aparecer |

### Componentes modificados:
- `src/components/task-dashboard.tsx`
- `src/components/task-card.tsx`
- `src/components/empty-state.tsx`

### Commit:
```bash
git add .
git commit -m "feat: add framer motion animations and micro-interactions"
```

---

## 📌 Fase 7: Subtareas, Drag & Drop y Command Palette

**Estado:** ✅ COMPLETADA

### Schema actualizado (`src/db/schema.ts`):
- Agregado `parentId: integer` para relacionar subtareas con tareas padre
- Agregado `sortOrder: integer` para persistir el orden de drag & drop
- Migración regenerada y aplicada en Turso

### Dependencias instaladas:
```bash
npm install cmdk @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### Features implementadas:

| Feature | Detalle |
|---|---|
| **Subtareas** | Cada tarea puede tener subtareas anidadas. Botón "+ Subtarea" en cada card. Se muestran colapsables con animación. |
| **Drag & Drop** | `@dnd-kit` permite arrastrar y reordenar tarjetas. El orden se persiste en `sortOrder`. |
| **Command Palette** | `Ctrl+K` abre un menú de comandos estilo Notion/Linear. Acciones: crear tarea, filtrar por estado, buscar tareas. |
| **Keyboard shortcut** | Event listener global detecta `Ctrl+K` / `Cmd+K`. |

### Server Actions actualizadas:
- `getAllTasks()` - Trae todas las tareas (incluyendo subtareas)
- `reorderTask(id, newSortOrder)` - Actualiza el orden de una tarea
- `createTask()` - Ahora acepta `parentId` para crear subtareas

### Componentes nuevos/modificados:
- `src/components/subtask-form.tsx` - Formulario para crear subtareas
- `src/components/task-card.tsx` - Ahora muestra subtareas colapsables y botón para agregar
- `src/components/task-dashboard.tsx` - Integra DndContext, SortableContext y Command Palette
- `src/app/page.tsx` - Usa `getAllTasks()` para traer tareas padre e hijas
- `src/db/schema.ts` - Nuevos campos `parentId` y `sortOrder`

### Commit:
```bash
git add .
git commit -m "feat: add subtasks, drag-and-drop and command palette"
```

---

## 📌 Fase 8: Dark Mode, Protección PIN y Drag-to-Subtask

**Estado:** ✅ COMPLETADA

### Features implementadas:

| Feature | Detalle |
|---|---|
| **Dark Mode** | Toggle en el header. Persiste en localStorage. Variables CSS cambian automáticamente. |
| **Protección PIN** | Pantalla de bloqueo al entrar. PIN se guarda en localStorage. Persiste la sesión con `taskflow-pin-verified`. Botón de bloqueo en esquina inferior izquierda. |
| **Drag-to-Subtask** | Arrastrar una tarea sobre otra la convierte en subtarea. Visual feedback con DragOverlay. |
| **Fix DialogTitle** | Agregado `DialogTitle` con clase `sr-only` al Command Palette para accesibilidad. |
| **Scrollbars** | Estilizadas para modo claro y oscuro. |

### Componentes nuevos:
- `src/components/theme-provider.tsx` - Contexto de tema con localStorage
- `src/components/pin-guard.tsx` - Pantalla de bloqueo/desbloqueo con PIN

### Componentes modificados:
- `src/components/task-dashboard.tsx` - Dark mode classes, DragOverlay, drag-to-subtask
- `src/components/task-card.tsx` - Dark mode classes, drag overlay styling
- `src/components/empty-state.tsx` - Dark mode classes
- `src/app/layout.tsx` - Integra ThemeProvider y PinGuard
- `src/app/globals.css` - Variables CSS para dark mode, scrollbar styling

### Commit:
```bash
git add .
git commit -m "feat: add dark mode, pin protection and drag-to-subtask"
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
