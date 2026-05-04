## 🚀 Roadmap (Phases of Development)

### 🟢 Phase 1: MVP Frontend (Local Storage) - ✅ COMPLETED
* [x] Initialize React + TS + Tailwind + Vite project.
* [x] Setup UI shell.
* [x] Build Home Dashboard & History Tab.

### 🟡 Phase 2: The Backend Engine - ✅ COMPLETED
* [x] Setup Docker, PostgreSQL, Prisma ORM.
* [x] Build CRUD API endpoints.

### 🔴 Phase 3: Auth & Data Isolation - ✅ COMPLETED
* [x] User Registration & Login (JWT Auth & Auto-login).
* [x] Connect Frontend to Backend.
* [x] Isolate user data.

### 🟠 Phase 3.5: Premium Profile & Settings - ✅ COMPLETED
* [x] Extend Database Schema with Prisma.
* [x] Smart Backend logic for partial profile updates.
* [x] Interactive Settings Tab with slide-up modals.

### 🔵 Phase 3.8: Core Logic & Analytics - ✅ COMPLETED
* [x] Implement Logout functionality.
* [x] Quick Add drink buttons on the Home screen.
* [x] Quick Add custom amount modal (the "+" button on Home).
* [x] Custom Drink Builder (saving favorite presets with ⭐).
* [x] Advanced Statistics (Weekly/Monthly) with interactive charts (Recharts) in History Tab.

### 🟣 Phase 4: Smart Architecture & Desktop Mastery - 🚧 IN PROGRESS
* [ ] **Refactoring (Smart/Dumb Components):**
  * [ ] Extract logic into `useWaterData.ts` (Custom Hook / "The Brain").
  * [ ] Create `MobileDashboard.tsx` (Dumb component for mobile view).
  * [ ] Create `DesktopDashboard.tsx` (Dumb component for desktop view).
  * [ ] Setup `Dashboard.tsx` as a smart router based on screen width.
* [ ] **Desktop UI:**
  * [ ] Build a comprehensive grid-based dashboard for wide screens.
  * [ ] Implement a sticky sidebar navigation.
* [ ] **Deployment:** 
  * [ ] Deploy frontend to Vercel.
  * [ ] Deploy backend to Render / Supabase.