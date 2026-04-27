# Internza - Proof-Based Internship Platform

A modern, premium frontend for Internza - a proof-based internship platform for CS/AI students.

## Features

- **Landing Page** - Hero section, stats, features, internship templates grid
- **Authentication** - Login/Signup with social auth
- **Student Dashboard** - Milestone tracking, internship roadmap, proof submission
- **Public Verification** - Shareable student profiles with verified internships
- **Reviewer Dashboard** - Review and approve student submissions
- **Admin Dashboard** - System overview, analytics, and activity monitoring

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Custom UI Components (shadcn/ui inspired)

## Project Structure

```
app/
├── (auth)/           # Authentication routes (login, signup)
├── (dashboard)/      # Protected dashboard routes
│   ├── dashboard/
│   ├── internships/
│   └── milestones/
├── admin/dashboard/  # Admin dashboard
├── reviewer/dashboard/ # Reviewer dashboard
├── verify/[id]/      # Public verification page
├── page.tsx          # Landing page
└── layout.tsx        # Root layout

components/
└── ui/               # Reusable UI components
    ├── button.tsx
    ├── card.tsx
    ├── badge.tsx
    ├── progress.tsx
    ├── input.tsx
    └── label.tsx

lib/
├── types.ts          # TypeScript types
├── mockData.ts       # Mock data
├── api.ts            # API hooks (TanStack Query)
└── utils.ts          # Utility functions

stores/
└── authStore.ts      # Zustand auth store
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Pages

- `/` - Landing Page
- `/login` - Login
- `/signup` - Signup
- `/dashboard` - Student Dashboard
- `/milestones` - Milestone Tracker
- `/internships/[id]` - Internship Roadmap Detail
- `/verify/[id]` - Public Verification Profile
- `/reviewer/dashboard` - Reviewer Dashboard
- `/admin/dashboard` - Admin Dashboard

## Design System

The app uses a custom design system inspired by the Figma screenshots:

- **Primary Color**: Navy blue (#0f172a)
- **Accent Color**: Emerald green (#10b981)
- **Background**: White with gray-50 for sections
- **Typography**: Inter font family
- **Border Radius**: 0.625rem (10px) default
- **Shadows**: Subtle shadows for cards

## Notes

- All TypeScript errors shown in the IDE are expected before `npm install` is run
- The app uses mock data for demonstration purposes
- API hooks are ready for backend integration
- Components are built to be reusable and accessible
