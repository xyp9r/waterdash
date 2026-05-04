```markdown
# 💧 WaterDash 

> A full-stack hydration tracking application built with React, Node.js, and PostgreSQL. 

WaterDash is not just a counter; it's a smart hydration dashboard. It calculates your personalized daily water goal based on your physical metrics and environment, tracks your intake with custom presets, and visualizes your progress through interactive charts.

---

## ✨ Key Features

*   **🔒 Secure Authentication:** JWT-based user registration and login with bcrypt password hashing.
*   **👤 Smart Profiles:** Personalized daily water goals calculated dynamically based on gender, weight, height, activity level, and weather.
*   **📊 Interactive Analytics:** Custom Recharts integration for detailed 7-day and 30-day hydration statistics.
*   **⭐ Custom Presets:** Build and save favorite drink combinations (volume + icon) for quick one-tap logging.
*   **📱 Responsive UI:** Mobile-first design with smooth Tailwind CSS animations and slide-up modals.

## 🛠️ Tech Stack

**Frontend:**
*   React 18 + Vite
*   TypeScript
*   Tailwind CSS
*   Recharts (Data Visualization)
*   React Router DOM

**Backend:**
*   Node.js + Express
*   RESTful API Architecture
*   JWT (JSON Web Tokens)
*   Bcryptjs

**Database & DevOps:**
*   PostgreSQL
*   Prisma ORM
*   Docker (for local DB environment)

---

## 🚀 Getting Started (Local Development)

### Prerequisites
*   Node.js (v18+)
*   Docker & Docker Compose

### 1. Clone the repository
\`\`\`bash
git clone [https://github.com/xyp9r/waterdash.git](https://github.com/xyp9r/waterdash.git)
cd waterdash
\`\`\`

### 2. Setup Backend & Database
1. Navigate to the server folder (if applicable) or root.
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the PostgreSQL database using Docker:
   \`\`\`bash
   docker-compose up -d
   \`\`\`
4. Create a \`.env\` file and add your variables:
   \`\`\`env
   DATABASE_URL="postgresql://user:password@localhost:5432/waterdash?schema=public"
   JWT_SECRET="your_super_secret_key"
   \`\`\`
5. Push the Prisma schema to the database:
   \`\`\`bash
   npx prisma db push
   \`\`\`
6. Start the backend server:
   \`\`\`bash
   npm run dev
   \`\`\`

### 3. Setup Frontend
1. Open a new terminal tab.
2. Navigate to the client folder (if applicable).
3. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
4. Start the Vite development server:
   \`\`\`bash
   npm run dev
   \`\`\`

---

## 🗺️ Roadmap
- [x] Phase 1-3: Core MVP, Database, and Authentication.
- [x] Phase 3.8: Advanced UI, Custom Presets, and Recharts Analytics.
- [ ] **Phase 4 (Current):** Desktop-first Grid UI redesign & Smart/Dumb component refactoring.
- [ ] Deployment (Vercel + Render).

## 👨‍💻 Author
**Ivan (v4mp)** - [v4mp.dev](https://v4mp.dev)