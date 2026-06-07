# societylens-web

Next.js 14 frontend for **SocietyLens** — a multi-tenant apartment maintenance management platform for Indian apartment communities.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local — set NEXTAUTH_SECRET

# 3. Start the API server first (societylens-api on port 8000)

# 4. Start dev server
npm run dev
```

App runs at: http://localhost:3000

## Seed Credentials

| Role   | Email                  | Password  |
|--------|------------------------|-----------|
| Admin  | admin@prestige.com     | admin123  |
| Tenant | anjali@prestige.com    | tenant123 |
| Tenant | suresh@prestige.com    | tenant123 |
| Tenant | priya@prestige.com     | tenant123 |

## Project Structure

```
app/
  (auth)/          — login, register, join pages (no sidebar)
  (tenant)/        — tenant-facing pages with sidebar
  (admin)/         — admin-facing pages with sidebar
  api/auth/        — NextAuth handler
components/
  Sidebar.tsx      — role-aware navigation sidebar
  StatCard.tsx     — metric summary card
  StatusBadge.tsx  — issue status badge
  CategoryBadge.tsx — expense category badge
lib/
  api.ts           — Axios instance with auth interceptor
  auth.ts          — NextAuth config
  utils.ts         — formatCurrency (₹), formatDate, getInitials
middleware.ts      — route protection
```

## Routes

| Path | Auth | Description |
|------|------|-------------|
| /login | Public | Sign in |
| /register | Public | Create new community |
| /join | Public | Join with invite code |
| /dashboard | Tenant | Overview dashboard |
| /expenses | Tenant | Browse & vote on expenses |
| /expenses/[id] | Tenant | Expense detail + vote |
| /issues | Tenant | Browse issues |
| /issues/new | Tenant | Report new issue |
| /announcements | Tenant | View announcements |
| /admin/dashboard | Admin | Admin overview |
| /admin/expenses | Admin | Manage expenses |
| /admin/expenses/new | Admin | Create expense |
| /admin/issues | Admin | Update issue status |
| /admin/announcements | Admin | Manage announcements |
| /admin/announcements/new | Admin | Post announcement |
| /admin/tenants | Admin | View all tenants |
| /admin/invite | Admin | Manage invite code |
| /admin/settings | Admin | Update community details |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | FastAPI backend URL (default: http://localhost:8000) |
| `NEXTAUTH_SECRET` | Random secret for NextAuth session encryption |
| `NEXTAUTH_URL` | App URL (default: http://localhost:3000) |

## Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

## Brand

- Primary green: `#1DB87A`
- Dark anchor: `#0B3D2E`
- Fonts: Sora (headings) + DM Sans (body)

## Future Roadmap

### Phase 2 — Razorpay Payments
- Add payment flow on expense approval
- Integrate Razorpay checkout in expense detail page

### Phase 3 — Push Notifications
- Implement web push for announcements and issue updates
- Register service worker for background notifications

### Phase 4 — React Native Mobile App
- API is stateless JWT — fully mobile-ready
- All list endpoints paginated and return `{ data, meta }` envelope

### Phase 5 — Contractor Rating System
- Add contractor directory page
- Integrate rating UI on resolved issues
