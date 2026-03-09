# White Label Authentication System (Next.js + Prisma + PostgreSQL)

This is a premium, marketplace-ready authentication system built with a robust and modern stack. It features 50+ pre-configured themes, a dynamic email template system, and a comprehensive admin dashboard.

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

- **Multi-Theme System:** 50+ Pre-configured themes (Modern, Retro, Minimalist, Corporate, Creative).
- **Dynamic Theming:** Theme configuration stored in database and applied at runtime.
- **Admin Dashboard:**
  - **Theme Manager:** Visual grid to preview and activate themes instantly.
  - **Email Templates:** Edit transactional emails (Verification, Password Reset) directly from the UI.
- **Authentication:**
  - **Email/Password:** Secure login & registration with bcrypt hashing.
  - **Social Login:** Google OAuth (configurable).
  - **Passwordless/OTP:** Magic link authentication supported.
  - **Forgot Password:** Complete flow with token-based reset.
- **User Interface:**
  - Responsive layouts (Centered, Split-Left, Split-Right, Full-Background).
  - Smooth animations and visual feedback.

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

# Seed Database with Themes & Email Templates
npx prisma db seed
```

### 3. Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Email Server (SMTP) - Required for Magic Links & Forgot Password
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="apikey"
EMAIL_SERVER_PASSWORD="your-api-key"
EMAIL_FROM="noreply@example.com"
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## 📂 Project Structure

- `src/app`: App Router pages and API routes.
  - `admin/`: Dashboard for Themes and Emails.
  - `(auth)/`: Login, Register, Forgot Password pages.
  - `api/auth`: NextAuth and custom API routes.
- `src/actions`: Server Actions for Admin mutations.
- `src/components`: Reusable UI components.
- `src/lib`: Utilities (Prisma, Auth, Email).
- `prisma`: Database schema and seed script.

## 🎨 Customization

### Switching Themes
Go to `/admin/themes` to browse and activate themes. The changes apply globally in real-time.

### Editing Email Templates
Go to `/admin/emails` to modify the HTML content and subject lines for system emails.

### Adding a New Theme
1. Open `prisma/seed.ts`.
2. Add a new config object using `createConfig`.
3. Add it to the seeding loop.
4. Run `npx prisma db seed`.

## 📦 Deployment

1. **Database:** Switch `datasource` provider in `schema.prisma` to `postgresql`.
2. **Build:** Run `npm run build`.
3. **Start:** Run `npm start`.

Ensure all environment variables are set in your production environment (Vercel, Railway, etc.).
