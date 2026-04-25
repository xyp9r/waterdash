# 💧 WaterDash - Project Plan & Architecture

## 🎯 Concept
A modern, mobile-first web application for tracking daily hydration with custom drinks, real-time statistics, and dark/light mode.

## 🛠 Tech Stack (The "Fullstack Killer" Stack)
- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite.
- **Backend:** Node.js, Express, TypeScript.
- **Database:** PostgreSQL + Prisma ORM.
- **Infrastructure:** Docker.
- **Hosting/Deployment:** GitHub Actions, Vercel/Render.

## 🎨 UI/UX Design
- **Theme:** Dark/Light mode toggle. 
  - *Light Mode:* Clean white (`bg-white`), dark grey text, vibrant blue accents.
  - *Dark Mode:* Deep slate (`bg-slate-900`), white text, neon blue glowing accents.
- **Layout:** Mobile-first approach with a Bottom Navigation Bar.
- **Main Element:** Animated Circular Progress Bar.

## 🚀 Roadmap (Phases of Development)

### 🟢 Phase 1: MVP Frontend (Local Storage) - ✅ COMPLETED
* [x] Initialize React + TS + Tailwind + Vite project.
* [x] Setup UI shell (Header, Bottom Nav, Theme Provider).
* [x] Build Home Dashboard (Circular Progress, Quick Add buttons).
* [x] Build History Tab (List of today's drinks with delete option).
* [x] Build Data Types (TypeScript interfaces for `Drink`, `Log`).
* [x] Logic: Save and retrieve data from browser `LocalStorage`.

### 🟡 Phase 2: The Backend Engine - ✅ COMPLETED
* [x] Initialize Node.js + Express + TS environment.
* [x] Setup Docker and PostgreSQL database.
* [x] Setup Prisma ORM and create database schemas (Users, DrinkLogs).
* [x] Build CRUD API endpoints (Create, Read, Update, Delete logs).

### 🔴 Phase 3: Auth & Data Isolation - ✅ COMPLETED
* [x] User Registration & Login (JWT Auth & Auto-login).
* [x] Connect Frontend to Backend (replace LocalStorage with real API calls).
* [x] Isolate user data (users only see their own water logs).
* [ ] Leaderboards or Friends system (optional).

### 🟠 Phase 3.5: Premium Profile & Settings (IN PROGRESS)
* [x] Extend Database Schema with Prisma (weight, height, gender, weather, activity).
* [x] Smart Backend logic for partial profile updates.
* [x] Update Onboarding calculator to save full profile to DB.
* [ ] Build interactive Settings Tab with slide-up modals for updating profile parameters.

### 🟣 Phase 4: Desktop Dashboard & Responsive Mastery
* [ ] Fully responsive layout (mobile-first → desktop).
* [ ] Desktop UI: Creation of a comprehensive desktop dashboard (everything on a single screen: statistics, charts, drink-adding panel).
* [ ] Mobile UI: Preserving the native mobile experience in the WaterMinder style (bottom navigation bar, pop-up panels).
* [ ] Complex responsiveness logic: a tough battle with CSS (`flex`, `grid`, `hidden md:block`) to ensure the interface doesn’t break on any device.