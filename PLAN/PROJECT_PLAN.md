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

### 🟣 Phase 4: The Great Refactoring & Multi-Platform UI - 🚧 IN PROGRESS
* [x] **Step 1: Brain Extraction (Custom Hook):**
  * [x] Isolate all state, fetch requests, and logic into `src/hooks/useWaterData.ts` (The Brain).
* [ ] **Step 2: The Mobile Symbiote (Light Theme First):**
  * [ ] Create `MobileDashboard.tsx` (Dumb component).
  * [ ] Redesign UI based on Waterminder references (Light, clean, aesthetic).
  * [ ] Lay foundation for dark mode (`dark:` Tailwind classes).
* [ ] **Step 3: Theme Toggle:**
  * [ ] Add a working Light/Dark mode switcher in the Settings Tab.
* [ ] **Step 4: Desktop Bento-Grid:**
  * [ ] Create `DesktopDashboard.tsx` (Dumb component).
  * [ ] Build a strict, wide-screen SaaS-like grid layout with a sidebar.
* [ ] **Step 5: Smart Router:**
  * [ ] Setup `Dashboard.tsx` to conditionally render Mobile or Desktop based on screen width.
* [ ] **Deployment:** 
  * [ ] Deploy frontend to Vercel.
  * [ ] Deploy backend to Render / Supabase.