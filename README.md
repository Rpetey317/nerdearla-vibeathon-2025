# Semillero Digital – Dashboard MVP (T3 style: Next.js + TS + Tailwind)

This is an MVP web app built for the Semillero Digital hackathon. It provides a complementary dashboard to Google Classroom focused on:

- Seguimiento del progreso por alumno, clase y profesor
- Centro de notificaciones y comunicaciones
- Métricas rápidas de asistencia, participación y entregas

Data is mocked for now. Later we can connect to the Google Classroom API and Google Calendar.

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (+ @tailwindcss/forms)
- lucide-react (icons)

## Features implemented

- Dashboard principal (`/`): resumen de estudiantes, cursos, entregas y actividad reciente
- Seguimiento de progreso (`/progress`): vista consolidada por alumno y por curso
- Notificaciones (`/notifications`): centro con filtros y búsqueda
- Cursos (`/courses`): tarjetas con próximas entregas
- Estudiantes (`/students`): listado con progreso general
- Métricas (`/metrics`): KPIs y benchmarks por curso
- Conmutador de roles (alumno/profesor/coordinador) en el top bar para probar vistas

## Getting started

1) Install Node.js (recommended via nvm)

```bash
# If you don't have nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# restart your shell, then
nvm install --lts
nvm use --lts
```

2) Install dependencies

```bash
npm install
```

3) Run the dev server

```bash
npm run dev
```

Then open http://localhost:3000

## Project structure

- `src/app/` – App Router pages
  - `layout.tsx` – wraps pages with RoleProvider and global styles
  - `page.tsx` – dashboard
  - `progress/page.tsx` – progress tracking
  - `notifications/page.tsx` – notifications center
  - `courses/page.tsx` – courses grid
  - `students/page.tsx` – students table
  - `metrics/page.tsx` – KPIs and charts (progress bars)
- `src/components/`
  - `Layout.tsx` – responsive shell with sidebar and topbar
  - `RoleSwitcher.tsx` – role dropdown
- `src/context/role-context.tsx` – simple role context with localStorage persistence
- `src/lib/mockData.ts` – mocked entities (users, courses, assignments, submissions, attendance, notifications)
- `src/types/index.ts` – TypeScript entity definitions
- `src/lib/utils.ts` – small helpers (date formatting, status colors)

## Notes

- Type errors about missing modules will disappear after `npm install`.
- Tailwind works via the files: `tailwind.config.ts`, `postcss.config.js`, and `src/app/globals.css`.
- The UI is fully responsive.

## Next steps (integration)

- Auth via Google to identify users by email
- Connect to Google Classroom API to load real courses, assignments, submissions
- Optional: notifications via Email/WhatsApp/Telegram
- Optional: asistencia via Google Calendar
- Optional: exportar reportes y gráficos más avanzados
