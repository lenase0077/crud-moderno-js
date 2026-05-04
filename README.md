# TaskFlow

> Un gestor de tareas Kanban moderno, construido con tecnologías de vanguardia y desplegado en la edge.

[![Deploy](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://crud-moderno-js.vercel.app)
[![Stack](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Database](https://img.shields.io/badge/Turso-SQLite_Edge-green?logo=sqlite)](https://turso.tech/)
[![ORM](https://img.shields.io/badge/Drizzle-TypeSafe-blue)](https://orm.drizzle.team/)

---

## 🚀 Demo en vivo

🔗 **[https://crud-moderno-js.vercel.app](https://crud-moderno-js.vercel.app)**

Código de acceso: `314159`

---

## ✨ Features

- **Tablero Kanban** — Tres columnas: Pendientes, En progreso, Completadas
- **Drag & Drop** — Arrastrá tareas entre columnas, reordená, convertí en subtareas
- **Subtareas** — Checklist con barra de progreso dentro de cada card
- **Modo Oscuro** — Toggle instantáneo, persistente en localStorage
- **Command Palette** — `Ctrl + K` para crear, buscar y filtrar
- **Protección** — Código de acceso para demos públicas
- **Animaciones** — Micro-interacciones con Framer Motion en cada acción
- **Zero Reloads** — Todas las operaciones CRUD son instantáneas

---

## 🛠 Stack Técnico

| Capa | Tecnología |
|---|---|
| **Framework** | Next.js 16 (App Router, Server Actions) |
| **Base de Datos** | Turso — SQLite distribuido, edge-native |
| **ORM** | Drizzle ORM — type-safe, SQL-like |
| **Estilos** | Tailwind CSS v4 + shadcn/ui |
| **Animaciones** | Framer Motion |
| **Drag & Drop** | @dnd-kit (core + sortable) |
| **Command Palette** | cmdk |
| **Formularios** | React Hook Form + Zod |
| **Fechas** | date-fns |
| **Iconos** | Lucide React |
| **Deploy** | Vercel |

---

## 🏗 Arquitectura

- **Server Components** para data fetching inicial
- **Server Actions** para mutaciones (sin API REST)
- **Optimistic UI** — estado local actualizado inmediatamente
- **Context API** para tema y protección

---

## 🎓 Decisiones Destacadas

- **Turso** en vez de PostgreSQL → edge-native, menor latencia, diferenciador
- **Drizzle** en vez de Prisma → más liviano, sin generación de cliente pesada
- **Server Actions** en vez de API REST → menos código, type-safe end-to-end
- **Kanban** en vez de lista → mejor UX, drag & drop intuitivo

---

## 📦 Instalación local

```bash
git clone https://github.com/lenase0077/crud-moderno-js.git
cd crud-moderno-js
npm install
```

Creá un archivo `.env.local`:

```env
TURSO_DATABASE_URL="libsql://tu-db.turso.io"
TURSO_AUTH_TOKEN="tu-token"
ACCESS_CODE="314159"
```

Generá las migraciones:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

Corré el proyecto:

```bash
npm run dev
```

---

## 📄 Licencia

MIT — hecho con 💜 para aprender y compartir.

---

*¿Te gustó? Dale ⭐ al repo y compartilo en LinkedIn.*
