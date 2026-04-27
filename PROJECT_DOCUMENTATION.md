# Internza Frontend - Project Documentation

## Project Overview

**Internza** is a proof-of-work internship platform that connects students with industry-level internship opportunities through a verified, milestone-based system. Unlike traditional internship platforms, Internza requires students to submit tangible proof of work (code, documentation, analysis) at each milestone, which is then verified by industry mentors/reviewers.

### Core Value Proposition
- **Verified Skills**: Every internship completion is backed by verifiable proof
- **Industry Relevance**: Internships are designed around real-world problems and technologies
- **Transparent Progress**: Students, reviewers, and employers can track progress transparently
- **Portable Credentials**: Students get shareable verification profiles

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | Custom + shadcn/ui |
| State Management | Zustand |
| Data Fetching | TanStack Query |
| Forms | React Hook Form |
| Icons | Lucide React |

---

## Design System

### Color Palette
- **Primary**: #1A2B4B (Navy - Brand identity, headers, primary actions)
- **Secondary**: #64748B (Slate - Body text, borders, secondary elements)
- **Accent**: #10B981 (Emerald - Success states, verified badges, CTAs)
- **Neutral**: #F8FAFC (Light gray - Backgrounds, cards)
- **Semantic Colors**: Error (red), Warning (amber), Success (emerald), Info (blue)

### Typography
- **Font Family**: Inter (body), Manrope (headings)
- **Scale**: xs (12px) to 5xl (48px)

---

## Architecture

### Folder Structure
```
app/
├── (auth)/           # Authentication routes (login, signup)
│   ├── login/
│   └── signup/
├── (dashboard)/      # Protected dashboard routes
│   ├── dashboard/    # Home dashboard
│   ├── internships/  # Internship listing & details
│   ├── milestones/   # Milestone tracker
│   ├── submissions/  # Submit proof of work
│   ├── settings/     # User preferences
│   └── support/      # Help & FAQ
├── admin/            # Admin dashboard
├── reviewer/         # Reviewer dashboard
├── verify/           # Public verification profiles
├── layout.tsx        # Root layout
└── page.tsx          # Landing page

components/
└── ui/               # Reusable UI components
    ├── button.tsx
    ├── card.tsx
    ├── badge.tsx
    ├── input.tsx
    ├── progress.tsx
    └── label.tsx

lib/
├── types.ts          # TypeScript interfaces
├── mockData.ts       # Mock data for development
├── api.ts            # API hooks
└── utils.ts          # Utility functions

stores/
└── authStore.ts      # Authentication state
```

---

## Page Descriptions

### 1. Landing Page (`/`)
**Purpose**: Convert visitors into users
**Key Sections**:
- Hero with value proposition and CTA
- Stats (verified proofs, active internships, partner companies)
- Features (AI-Powered, Proof-Based, Verified Network, Full-Stack)
- Internship templates showcase
- Call-to-action for early access

**Functionality**:
- Navigation to login/signup
- Internship category filtering
- Responsive mobile menu

---

### 2. Authentication Pages

#### Login (`/login`)
- Email/password login form
- Password visibility toggle
- Loading states
- "Remember me" option
- Link to signup page

#### Signup (`/signup`)
- Full name, email, password fields
- Account type selection (Student/Mentor)
- Terms agreement checkbox
- Social login options (Google, GitHub placeholders)
- Testimonial section (desktop only)

---

### 3. Dashboard (`/dashboard`)
**Purpose**: Central hub for student activity
**Components**:
- **Stats Cards**: Active internships, pending reviews, completed milestones, verification score
- **Active Internships**: Current enrollments with progress bars
- **Recent Activity**: Timeline of submissions and approvals
- **Upcoming Deadlines**: Milestones due soon
- **Quick Actions**: Browse internships, submit proof, view profile

**Data Sources**:
- Mock data for internships, activities, deadlines
- Real-time search functionality

---

### 4. Internships Listing (`/internships`)
**Purpose**: Browse and filter available internships
**Features**:
- Search by title/description
- Category filters (AI/ML, Fullstack, Blockchain, Data Science, Mobile, DevOps)
- Difficulty filters (Beginner, Intermediate, Advanced)
- Internship cards with:
  - Cover image
  - Verification badge
  - Duration & enrollment count
  - Skills required
  - Stipend information
  - Enrollment progress bar
- Empty state when no matches found

---

### 5. Internship Detail (`/internships/[id]`)
**Purpose**: Deep dive into a specific internship
**Layout**:
- **Left Column (70%)**:
  - Internship header with image
  - AI-generated roadmap with milestones
  - Each milestone shows:
    - Status (completed, in-progress, locked)
    - Duration
    - Priority level
    - Task checklist
  - Stipend and requirements
- **Right Column (30%)**:
  - AI Reasoning sidebar
  - Market readiness score
  - Skill recommendations
  - Action buttons (Apply, View Certificate)

---

### 6. Milestones (`/milestones`)
**Purpose**: Track internship progress
**Components**:
- Progress overview card (25% complete example)
- Journey roadmap with visual timeline:
  - Completed (green checkmark)
  - Under Review (amber clock)
  - Available (blue play)
  - Locked (gray lock)
- Quick stats (proofs verified, review time, pending, success rate)
- Submit proof CTA button

**Visual Design**:
- Color-coded status icons
- Responsive layout (stack on mobile)

---

### 7. Submissions (`/submissions`)
**Purpose**: Submit proof of work for milestones
**Form**:
- Milestone selector dropdown
- File upload area (drag & drop)
- Submission notes textarea
- Guidelines checklist
- Submit button with loading state

**User Flow**:
1. Select milestone
2. Upload files (PDF, code, images)
3. Add description
4. Confirm guidelines
5. Submit for review

---

### 8. Settings (`/settings`)
**Purpose**: Manage user profile and preferences
**Sections**:
- **Profile**: Name, email, bio, profile picture
- **Notifications**: Email preferences toggle
- **Security**: Password change option
- **Preferences**: Theme, language (prepared for future)

**Functionality**:
- Form validation
- Save/Cancel actions
- Success feedback

---

### 9. Support (`/support`)
**Purpose**: Help center and contact options
**Components**:
- FAQ accordion (general, technical, verification)
- Resource cards (Documentation, Video Tutorials, Community)
- Contact options (Live Chat, Email)
- Search functionality placeholder

---

### 10. Public Verification (`/verify/[id]`)
**Purpose**: Shareable proof-of-work profile
**Layout**:
- Profile header with verification badge
- University/location info
- QR code for quick verification
- Stats cards (verification score, internships, proof submissions)
- Verified internships list with:
  - Company & team info
  - Period
  - Description
  - Skills used
  - View code/preview buttons

**Use Case**: Students share this link with employers

---

### 11. Reviewer Dashboard (`/reviewer/dashboard`)
**Purpose**: For mentors to review student submissions
**Layout**: 3-panel design
- **Left Sidebar**: Navigation
- **Middle Panel**: Task list (pending reviews)
  - Student avatar & name
  - Milestone title
  - Submission time
  - File count
- **Right Panel**: Review detail
  - Submission overview
  - Proof attachments
  - Technical checklist
  - Mentor comments
  - Approve/Reject/Request Changes buttons

---

### 12. Admin Dashboard (`/admin/dashboard`)
**Purpose**: Platform administration
**Components**:
- System statistics cards
- Student activity chart (area chart visualization)
- Internship categories pie chart
- Recent activity log
- Quick action buttons

**Metrics**:
- Total students, internships, proofs, mentors
- Verification rate
- Active submissions

---

## Data Flow

### Authentication Flow
1. User logs in via `/login`
2. Credentials validated (mock)
3. Auth store (`authStore.ts`) updates state
4. User redirected to dashboard
5. Protected routes check auth status

### Internship Enrollment Flow
1. Browse `/internships`
2. Filter by category/difficulty
3. Click internship → `/internships/[id]`
4. Review AI roadmap
5. Click "Apply Now"
6. Enrollment confirmed (mock)

### Proof Submission Flow
1. Navigate to `/milestones` or `/submissions`
2. Select available milestone
3. Upload files via dropzone
4. Add submission notes
5. Confirm guidelines
6. Submit → Status becomes "Under Review"
7. Reviewer gets notification (mock)

### Verification Flow
1. Reviewer opens `/reviewer/dashboard`
2. Selects task from list
3. Reviews attachments
4. Checks technical checklist
5. Approves/Rejects/Requests changes
6. Student notified of decision
7. If approved → Milestone marked complete
8. Verification profile updated

---

## Current Scope & Features

### Implemented ✅
- Complete design system with exact color tokens
- Responsive layouts for all pages
- Navigation and routing
- Form handling with validation
- Loading states
- Empty states
- Search functionality
- Mobile menu
- Mock data for all entities

### API-Ready Structure ✅
- TypeScript interfaces defined
- API hooks prepared (TanStack Query)
- Mock API functions in place
- Ready to swap with real endpoints

### Pending (Future Scope) ⚠️
- Real authentication backend
- File upload to cloud storage
- Real-time notifications (WebSocket/SSE)
- Payment integration for stipends
- Email service integration
- Analytics dashboard (more detailed)
- AI-powered internship matching
- Chat system between students and mentors
- Calendar integration for deadlines
- Mobile app (React Native)

---

## How to Extend

### Adding a New Page
1. Create folder in appropriate route group
2. Add `page.tsx` with component
3. Update navigation in `layout.tsx` if needed
4. Add route to mock data if applicable

### Adding a New API Endpoint
1. Define TypeScript interface in `lib/types.ts`
2. Add mock data in `lib/mockData.ts`
3. Create hook in `lib/api.ts`
4. Use hook in component

### Adding a New UI Component
1. Create file in `components/ui/`
2. Use `cva` for variants
3. Follow design system colors
4. Export from index if needed

---

## Key Differentiators

1. **Proof-Based Model**: Unlike LinkedIn or traditional job boards, every skill claim is backed by verifiable work
2. **Milestone Structure**: Breaks down complex internships into manageable, reviewable chunks
3. **AI Integration**: Roadmap generation and skill recommendations
4. **Transparency**: Public verification profiles create trust
5. **Gamification**: Progress tracking, scores, and badges

---

## Target Users

1. **Students**: CS/Engineering students seeking verified experience
2. **Mentors/Reviewers**: Industry professionals wanting to give back
3. **Employers**: Companies looking for pre-verified talent
4. **Universities**: Institutions wanting to track student outcomes
5. **Admins**: Platform operators

---

## Success Metrics (To Track)

- Internship completion rate
- Average time to complete milestones
- Reviewer response time
- Verification profile shares
- Student-to-employer conversion
- Platform engagement (DAU/MAU)

---

## Next Steps for Enhancement

1. **Backend Integration**: Connect to real API endpoints
2. **Real-time Features**: Notifications, chat, live updates
3. **Advanced Search**: Full-text search, filters, recommendations
4. **Mobile Optimization**: PWA or native app
5. **AI Enhancements**: Resume parsing, skill gap analysis
6. **Community Features**: Forums, peer reviews, study groups
7. **Enterprise Features**: Company dashboards, bulk hiring

---

*Document Version: 1.0*
*Last Updated: April 2026*
