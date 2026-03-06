# Variant 1: Next.js + Prisma + PostgreSQL (White Label Auth)

This is the primary implementation of the White Label Authentication System, built with a robust and modern stack.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database ORM:** Prisma
- **Database:** SQLite (Dev) / PostgreSQL (Prod)
- **Authentication:** NextAuth.js v4 (with Prisma Adapter)
- **Styling:** Tailwind CSS + Shadcn UI
- **Validation:** Zod + React Hook Form
- **Animation:** Framer Motion

## ✨ Key Features

- **Multi-Theme System:** 26+ Pre-configured themes (Modern, Retro, Minimalist, Corporate, Creative).
- **Dynamic Theming:** Theme configuration stored in database and applied at runtime.
- **Authentication:**
  - Email/Password Login & Registration.
  - Google OAuth (configured).
  - Secure Password Hashing (bcryptjs).
- **User Interface:**
  - Responsive Login & Register Pages.
  - Modal Routes (`/modal/login`, `/modal/register`).
  - Shake animations and visual feedback for errors.
- **White Label Ready:** Easy to customize branding and themes.

## 🛠️ Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

This project uses SQLite for local development for ease of setup.

```bash
# Generate Prisma Client
npx prisma generate

# Push Schema to Database (creates dev.db)
npx prisma db push

# Seed Database with 26 Themes
npx prisma db seed
```

### 3. Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## 📂 Project Structure

- `src/app`: App Router pages and API routes.
- `src/components/auth`: Login and Register forms.
- `src/components/ui`: Reusable UI components.
- `src/lib`: Utilities and configuration (Prisma, Auth).
- `src/types`: TypeScript definitions (Theme config).
- `prisma`: Database schema and seed script.

## 🎨 Theme Configuration

Themes are stored in the `Theme` table in the database. Each theme contains a JSON `config` object defining colors, typography, and component styles.

To change the active theme, update the `isActive` flag in the database:

```sql
UPDATE Theme SET isActive = 0;
UPDATE Theme SET isActive = 1 WHERE name = 'Retro';
```
