# Stack Técnico Completo — TaskFlow

> Documento de referencia para posts de LinkedIn, CV y portfolio.

---

## 1. Framework y Runtime

| Tecnología | Versión | Propósito |
|---|---|---|
| **Next.js** | 16.2.4 (Turbopack) | Framework full-stack React con App Router, Server Components y Server Actions |
| **React** | 19.2.4 | Librería UI con hooks, context y concurrent features |
| **React DOM** | 19.2.4 | Renderizado del árbol de componentes |
| **TypeScript** | 5.x | Tipado estático en todo el proyecto |
| **Node.js** | 24.11.1 (entorno local) | Runtime de JavaScript para desarrollo |

**Decision clave:** Usamos App Router de Next.js (no Pages Router) para aprovechar Server Components, que ejecutan queries de base de datos directamente en el servidor sin enviar JavaScript al cliente.

---

## 2. Base de Datos

| Tecnología | Propósito |
|---|---|
| **Turso** (libSQL) | Base de datos SQLite distribuida, edge-first, hosteada en la nube |
| **@libsql/client** | Cliente oficial de Turso para conexión desde serverless |
| **SQLite** | Motor de base de datos embebido (el dialecto subyacente de Turso) |

**Por qué Turso:** Es **edge-native**, lo que significa que funciona perfectamente en las serverless functions de Vercel sin latencia. Además tiene un generoso free tier y es poco conocida (diferenciador para portfolio).

**Schema:**
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  due_date INTEGER,
  parent_id INTEGER,        -- Para subtareas (relación jerárquica)
  sort_order INTEGER DEFAULT 0,
  created_at INTEGER
);
```

---

## 3. ORM (Object-Relational Mapping)

| Tecnología | Versión | Propósito |
|---|---|---|
| **Drizzle ORM** | 0.45.2 | ORM type-safe para SQLite/Turso |
| **Drizzle Kit** | 0.31.10 | Generador y runner de migraciones |

**Por qué Drizzle en vez de Prisma:**
- Mucho más ligero y rápido
- Sintaxis SQL-like (no DSL propietario)
- Sin proceso de generación de cliente pesado
- Más moderno y poco usado (diferenciador)

**Patrón:** Schema-first con `drizzle.config.ts` y migraciones SQL generadas automáticamente.

---

## 4. UI Components (shadcn/ui)

| Componente | Fuente | Propósito |
|---|---|---|
| **Button** | Custom shadcn | Botones con variantes (default, outline, ghost, destructive) |
| **Card** | Custom shadcn | Contenedores de contenido con header, content, footer |
| **Badge** | Custom shadcn | Etiquetas de estado y prioridad |
| **Input** | Custom shadcn | Campos de texto estilizados |
| **Textarea** | Custom shadcn | Áreas de texto multilinea |
| **Label** | Custom shadcn | Etiquetas de formularios |
| **Dialog** | Radix UI + custom | Modales con overlay, animaciones y backdrop blur |
| **Select** | Radix UI + custom | Dropdowns nativos estilizados (fix para dark mode) |
| **Sonner** | Emil Kowalski | Notificaciones toast (toasts de éxito/error) |

**Base de diseño:** shadcn/ui con estilo **New York**, colores **Slate/Zinc**.

---

## 5. Estilos y CSS

| Tecnología | Versión | Propósito |
|---|---|---|
| **Tailwind CSS** | 4.x | Framework CSS utility-first |
| **@tailwindcss/postcss** | 4.x | Plugin PostCSS para Tailwind v4 |
| **CSS Variables** | Nativo | Variables HSL para theming dinámico (claro/oscuro) |
| **Geist** | Next.js font | Fuente tipográfica oficial de Vercel |

**Decision clave:** Tailwind v4 usa `@import "tailwindcss"` en vez del archivo `tailwind.config.ts` tradicional. Las variables CSS personalizadas permiten el toggle de dark mode sin recargar.

---

## 6. Animaciones

| Tecnología | Versión | Propósito |
|---|---|---|
| **Framer Motion** | Última | Animaciones declarativas con React |

**Animaciones implementadas:**
- Stagger children (cards aparecen secuencialmente)
- Layout animations (reordenamiento suave al filtrar)
- Hover spring (cards se elevan al pasar el mouse)
- Tap scale (feedback táctil al hacer click)
- AnimatePresence (transiciones de entrada/salida)
- Drag overlay (card flotante con rotación y sombra al arrastrar)

---

## 7. Drag & Drop

| Tecnología | Versión | Propósito |
|---|---|---|
| **@dnd-kit/core** | Última | Motor de drag & drop accesible y moderno |
| **@dnd-kit/sortable** | Última | Ordenamiento de listas arrastrables |
| **@dnd-kit/utilities** | Última | Helpers de CSS transforms |

**Features de DnD:**
- Reordenar cards dentro de una columna Kanban
- Mover cards entre columnas (cambia estado automáticamente)
- Convertir tarea en subtarea (soltar sobre otra card)
- Droppable areas en columnas vacías
- Drag overlay con sombra y rotación visual

---

## 8. Command Palette

| Tecnología | Versión | Propósito |
|---|---|---|
| **cmdk** | Última | Command palette accesible estilo Notion/Linear |
| **Radix Dialog** | (via shadcn) | Modal contenedor del command palette |

**Atajo:** `Ctrl+K` / `Cmd+K`
**Acciones:** Crear tarea, filtrar por estado, buscar tareas, limpiar filtros.

---

## 9. Formularios y Validación

| Tecnología | Versión | Propósito |
|---|---|---|
| **React Hook Form** | Última | Manejo de formularios con performance optimizada |
| **Zod** | Última | Validación de schemas TypeScript-first |
| **@hookform/resolvers** | Última | Puente entre Zod y React Hook Form |

**Validaciones:**
- Título obligatorio (mínimo 1, máximo 100 caracteres)
- Descripción opcional (máximo 500 caracteres)
- Estado: enum [pending, in_progress, completed]
- Prioridad: enum [low, medium, high]

---

## 10. Manejo de Fechas

| Tecnología | Versión | Propósito |
|---|---|---|
| **date-fns** | Última | Manipulación y formateo de fechas |
| **date-fns/locale/es** | (incluido) | Localización en español |

**Formatos usados:** `dd MMM` (ej: "04 may")

---

## 11. Iconografía

| Tecnología | Versión | Propósito |
|---|---|---|
| **Lucide React** | Última | Iconos modernos y limpios (reemplazo de Heroicons) |

**Iconos principales:** Plus, Search, Pencil, Trash2, GripVertical, CheckCircle2, Circle, Clock, ChevronDown, ChevronRight, ArrowUpFromLine, LayoutGrid, List, Command, Moon, Sun, Lock, Unlock, Shield, Eye, EyeOff, MoreHorizontal.

---

## 12. Dark Mode

| Tecnología | Propósito |
|---|---|
| **Context API (React)** | Proveedor de tema global |
| **localStorage** | Persistencia de preferencia de tema |
| **classList (DOM)** | Toggle de clase `.dark` en `<html>` |
| **Tailwind @custom-variant** | Configuración para usar clases `.dark` en vez de `prefers-color-scheme` |

**Paleta dark mode:** Fondo violeta muy oscuro, cards con elevación sutil, acentos en violeta/indigo.

---

## 13. Autenticación / Protección

| Tecnología | Propósito |
|---|---|
| **Variables de entorno** | Código de acceso maestro (`ACCESS_CODE`) |
| **localStorage** | Persistencia de sesión verificada |
| **React state + Context** | Pantalla de bloqueo condicional |

**Flujo:**
1. Usuario entra a la app
2. Ve pantalla de bloqueo con logo y campo de código
3. Ingresa el código (ej: `314159`)
4. Se valida contra `process.env.ACCESS_CODE`
5. Si coincide, se guarda en `localStorage` y accede
6. Botón de bloqueo disponible para cerrar sesión

---

## 14. Deploy y Hosting

| Tecnología | Propósito |
|---|---|
| **Vercel** | Hosting serverless para Next.js |
| **Vercel CLI** | 53.1.0 | Deploy desde terminal |
| **GitHub** | Control de versiones y CI/CD automático |
| **Git** | Sistema de control de versiones |

**Variables de entorno en Vercel:**
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `ACCESS_CODE`

**URL de producción:** https://crud-moderno-js.vercel.app

---

## 15. Herramientas de Desarrollo

| Herramienta | Propósito |
|---|---|
| **ESLint** | 9.x | Linting de código TypeScript/JavaScript |
| **eslint-config-next** | Configuración oficial de Next.js para ESLint |
| **TypeScript Compiler (`tsc`)** | Chequeo de tipos estáticos |
| **PostCSS** | Procesamiento de CSS (con plugin de Tailwind) |
| **dotenv** | Carga de variables de entorno locales |

---

## 16. Patrones Arquitectónicos

| Patrón | Implementación |
|---|---|
| **Server Components** | `page.tsx` hace fetch de tareas en el servidor |
| **Client Components** | `"use client"` para interactividad (dashboard, forms, DnD) |
| **Server Actions** | Funciones async que mutan datos y revalidan cache |
| **Optimistic UI** | Actualización de estado local inmediata tras CRUD (sin recargar) |
| **Compound Components** | shadcn/ui con composición de subcomponentes (Card, CardHeader, etc.) |
| **Controlled Forms** | React Hook Form + Zod para validación type-safe |
| **Context API** | ThemeProvider para dark mode, PinGuard para protección |
| **Custom Hooks** | `useTheme`, `useSortable` (dnd-kit) |

---

## 17. Decisiones Técnicas Destacables

### ¿Por qué Turso en vez de PostgreSQL/Vercel Postgres?
- Es **edge-native** (menor latencia en serverless)
- Replica global automática
- Free tier generoso
- Es **diferenciador** (poca gente lo usa en portfolios)

### ¿Por qué Drizzle en vez de Prisma?
- Más liviano y rápido
- Sin generación de cliente pesada
- Sintaxis SQL-like (menos curva de aprendizaje)
- Más moderno y **diferenciador**

### ¿Por qué no usamos API REST tradicional?
- **Server Actions** de Next.js 16 permiten llamar funciones del servidor directamente desde componentes React
- Menos código, menos archivos, menos complejidad
- Type-safe de extremo a extremo

### ¿Por qué Kanban en vez de lista tradicional?
- Mejor visualización del estado de las tareas
- Drag & drop más intuitivo
- Se siente como una app profesional (Trello, Linear, Notion)

### ¿Por qué protección con PIN y no autenticación completa?
- Para un **demo de portfolio**, un login completo es overkill
- El PIN permite que cualquiera pruebe la app sin crear cuenta
- Mantiene la experiencia simple y directa
- Ideal para compartir en LinkedIn

---

## 18. Estructura de Carpetas Final

```
crud-moderno-js/
├── drizzle/                    # Migraciones SQL generadas
│   ├── 0000_*.sql
│   └── meta/
├── public/                     # Assets estáticos
├── src/
│   ├── app/
│   │   ├── actions.ts          # Server Actions (CRUD)
│   │   ├── globals.css         # Variables CSS + Tailwind
│   │   ├── layout.tsx          # Root layout (ThemeProvider + PinGuard)
│   │   └── page.tsx            # Server Component (fetch inicial)
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   └── sonner.tsx
│   │   ├── delete-dialog.tsx   # Modal de confirmación
│   │   ├── empty-state.tsx     # Estado vacío
│   │   ├── pin-guard.tsx       # Pantalla de bloqueo
│   │   ├── subtask-form.tsx    # Formulario de subtarea
│   │   ├── task-card.tsx       # Card de tarea (Kanban)
│   │   ├── task-dashboard.tsx  # Tablero Kanban completo
│   │   ├── task-form.tsx       # Formulario crear/editar
│   │   └── theme-provider.tsx  # Contexto de dark mode
│   ├── db/
│   │   ├── index.ts            # Cliente Drizzle + Turso
│   │   └── schema.ts           # Schema de la base de datos
│   └── lib/
│       └── utils.ts            # Función cn() para clases
├── .env.example                # Template de variables
├── .env.local                  # Variables locales (no subir)
├── .gitignore
├── components.json             # Configuración shadcn/ui
├── drizzle.config.ts           # Configuración Drizzle Kit
├── next.config.ts              # Configuración Next.js
├── package.json
├── PLAN.md                     # Plan de desarrollo completo
├── postcss.config.mjs          # Configuración PostCSS
├── README.md
└── tsconfig.json               # Configuración TypeScript
```

---

## 19. Métricas del Proyecto

| Métrica | Valor |
|---|---|
| **Commits totales** | 15+ |
| **Fases completadas** | 9 de 10 |
| **Dependencias** | ~25 (producción + desarrollo) |
| **Tecnologías principales** | 8 |
| **Componentes UI** | 10+ |
| **Server Actions** | 8 |
| **Features implementadas** | 15+ |
| **Tiempo de build (local)** | ~3 segundos |
| **Tiempo de build (Vercel)** | ~32 segundos |
| **Deploys** | 2 (1 fallido por env vars, 1 exitoso) |

---

*Documento generado para referencia en LinkedIn, CV y portfolio técnico.*
