# Post de LinkedIn — TaskFlow

---

## 📝 Versión Final (copiar y pegar)

Así es como construí un gestor de tareas Kanban en 2024 usando una stack que poca gente conoce.

No usé PostgreSQL. No usé Prisma. No usé una API REST tradicional.

Usé esto:

🔹 Next.js 16 con App Router y Server Actions
🔹 Turso — SQLite distribuido, edge-native
🔹 Drizzle ORM — type-safe, sin generación de cliente pesada
🔹 @dnd-kit para drag & drop nativo
🔹 Framer Motion para micro-interacciones
🔹 cmdk para Command Palette (Ctrl+K)

¿Y el resultado?

Un tablero Kanban estilo Trello con:
✅ Drag & drop entre columnas
✅ Subtareas con checklist y progreso
✅ Modo oscuro persistente
✅ Zero reloads en cada operación
✅ Protección con código para demos

La diferencia clave: Turso + Drizzle.

La mayoría usa PostgreSQL + Prisma. Yo fui por SQLite serverless + un ORM moderno que pocos conocen. La app corre en la edge con latencia mínima y un free tier generoso.

¿Querés probarlo?

🔗 Link en comentarios 👇
Código de acceso: 314159

---

## 📎 Comentario adjunto (para poner el link)

Demo en vivo: https://crud-moderno-js.vercel.app
Repo: https://github.com/lenase0077/crud-moderno-js
Stack completo: https://github.com/lenase0077/crud-moderno-js/blob/master/STACK.md

---

## 🔄 Variantes del post

### Versión corta (para story o tweet)

Construí un Kanban con Next.js 16 + Turso (SQLite edge) + Drizzle ORM.

Drag & drop, subtareas, dark mode, Command Palette.

Link: https://crud-moderno-js.vercel.app
Código: 314159

---

### Versión técnica profunda

Así es como funciona el data layer de mi último proyecto:

1. Next.js Server Component hace SELECT a Turso (en el servidor)
2. Los datos se serializan y pasan al Client Component
3. Cualquier mutación llama a una Server Action directamente
4. Drizzle ejecuta INSERT/UPDATE/DELETE en Turso
5. El estado local de React se actualiza optimistamente
6. Zero recargas, zero API REST, zero Prisma client

Tecnologías: Next.js 16 · Turso · Drizzle ORM · @dnd-kit · Framer Motion

Demo: https://crud-moderno-js.vercel.app

---

### Versión con storytelling

Hace 2 semanas no sabía qué era Turso.

Hoy tengo un gestor de tareas Kanban desplegado en Vercel con:

→ SQLite distribuido en la edge
→ Un ORM que no necesita generar cliente
→ Server Actions que eliminan la necesidad de API REST
→ Drag & drop con @dnd-kit
→ Todo type-safe de extremo a extremo

La clave: probar tecnologías que poca gente usa todavía. Cuando todos usan PostgreSQL + Prisma, hay valor en aprender Turso + Drizzle.

Demo 👇
https://crud-moderno-js.vercel.app

Código: 314159

Repo: https://github.com/lenase0077/crud-moderno-js

---

## 🏷 Hashtags sugeridos

#nextjs #react #typescript #tailwindcss #turso #drizzle #sqlite #vercel #webdevelopment #frontend #fullstack #kanban #draganddrop #framer #dndkit #webdev #developer #javascript #programming

---

## 🎯 Tips para publicar

1. **Publicar de lunes a jueves**, entre 8-10am o 12-14hs (mayor engagement)
2. **Responder rápido** a los primeros comentarios (el algoritmo premia la interacción temprana)
3. **Pedir explícitamente** que prueben el demo (más clics = más alcance)
4. **Actualizar el post** después de 24hs con un comentario tipo "¡Ya son X personas las que probaron! Gracias"
5. **Cross-postear** en Twitter/X con la versión corta
6. **Agregar el link en el primer comentario** (el algoritmo de LinkedIn prefiere que el post principal no tenga links externos)

---

## 📸 Screenshots recomendados (para agregar al post)

1. **Tablero Kanban en modo claro** — mostrar las 3 columnas con cards
2. **Tablero Kanban en modo oscuro** — mismo ángulo, modo oscuro
3. **Drag & drop en acción** — screenshot de una card siendo arrastrada
4. **Subtareas con checklist** — mostrar la barra de progreso
5. **Command Palette** — Ctrl+K abierto con opciones
6. **GIF animado** — si es posible, un GIF corto de crear una tarea y moverla entre columnas

---

*Post preparado para publicación. Éxito en LinkedIn.*
