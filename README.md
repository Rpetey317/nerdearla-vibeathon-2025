# Rep's EduCompass – Educational Dashboard MVP (T3 style: Next.js + TS + Tailwind)

This is an MVP web app built for the Semillero Digital hackathon. Rep's EduCompass provides a complementary dashboard to Google Classroom focused on:

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

### Quick Start (Mock Data)
1) Install Node.js (recommended via nvm)

2) Set up your environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your Google OAuth credentials
```

3) Run the app:
```bash
npm run dev
```

4) Sign in with your Google account that has Classroom access

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
  - `AuthWrapper.tsx` – authentication guard component
  - `SessionProvider.tsx` – NextAuth session provider wrapper
- `src/context/role-context.tsx` – simple role context with localStorage persistence
- `src/lib/`
  - `auth.ts` – NextAuth configuration with Google OAuth
  - `google-classroom.ts` – Google Classroom API service layer
  - `data-service.ts` – client-side data fetching functions
  - `mockData.ts` – mocked entities (fallback/development)
  - `utils.ts` – small helpers (date formatting, status colors)
- `src/app/api/` – API routes for Google Classroom data
  - `auth/[...nextauth]/route.ts` – NextAuth API handler
  - `classroom/courses/route.ts` – courses endpoint
  - `classroom/courses/[courseId]/students/route.ts` – course students
  - `classroom/courses/[courseId]/coursework/route.ts` – assignments
  - `classroom/courses/[courseId]/submissions/route.ts` – submissions
- `src/types/index.ts` – TypeScript entity definitions

## Notes

- Type errors about missing modules will disappear after `npm install`.
- Tailwind works via the files: `tailwind.config.ts`, `postcss.config.js`, and `src/app/globals.css`.
- The UI is fully responsive.

## Features

### ✅ Completed
- **Authentication**: Google OAuth integration with NextAuth
- **Real Data**: Connected to Google Classroom API
- **Dashboard**: Overview with stats, recent activity, and at-risk students
- **Progress Tracking**: Detailed student progress by course
- **Course Management**: View courses, assignments, and due dates
- **Student Management**: List students with completion rates
- **Notifications**: Generated from real classroom data
- **Metrics**: KPIs and course benchmarks
- **Role Switching**: Test different user perspectives
- **Responsive Design**: Works on mobile and desktop

### 🚧 Future Enhancements
- **Real-time Notifications**: Email/WhatsApp/Telegram integration
- **Attendance Tracking**: Google Calendar integration
- **Advanced Reports**: Exportable charts and analytics
- **Grade Management**: Integration with Google Classroom grading
- **Assignment Creation**: Create assignments from the dashboard
- **Bulk Operations**: Manage multiple students/courses at once
