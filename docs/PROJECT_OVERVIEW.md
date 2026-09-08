# SmartSchool Frontend — Project Overview

This file is the single "catch-up" document for this repo: what SmartSchool is, how the frontend
is structured, what has actually been built (as opposed to only planned), why each decision was
made, and what is still missing. Read this before touching the code after a break.

The backend has its own equivalent doc at `smartschool-backend/docs/PROJECT_OVERVIEW.md` — read
that too if you need the full picture, since almost every screen here is a thin layer over an API
described there.

---

## 1. What SmartSchool is

A multi-tenant School Management SaaS. This frontend is the one app used by four kinds of people,
routed to different areas of the same codebase based on role:

- **Platform admin** — `/platform` — manages Accounts (customers) and the Organizations (schools)
  under them. Never touches a school's day-to-day data.
- **School admin** — `/:organizationId/admin/*` — everything about running one school: students,
  staff, classes, attendance, homework, notices, fees, exams, PTM, leave requests.
- **Teacher** — `/:organizationId/teacher/*` — their own dashboard, PTM slots.
- **Parent** — `/:organizationId/parent/*` — their children's homework, fees, results, leave
  requests, PTM booking, notices.

`:organizationId` in the URL is the tenant boundary — every API call the frontend makes for a
school-scoped screen is scoped to that id.

## 2. Stack

- **Vite 6 + React 18 + TypeScript**
- **`react-query` v3** — the data layer actually in use (see §7 for the v5 migration status)
- **`react-router-dom` v6**
- **Tailwind 3** + Headless UI + a handful of Radix primitives (`@radix-ui/react-dialog`,
  `-alert-dialog`, `-avatar`, `-popover`, `-switch`) — Radix is used for the notification Sheet and
  a few overlay components; most of the UI is still hand-built Tailwind, not a full primitive layer
- **`i18next`** (English + Hindi) — most (not all) copy is translated via `t()`
- **`socket.io-client`** — real-time notification push, mirrors the backend's Socket.IO server
- **`axios`** — one shared client (`src/config/api-client.ts`)
- **`highcharts`** — dashboard charts
- **`vitest` + React Testing Library** — test setup (see §8)

## 3. Folder structure (what actually exists today)

```
smartschool-frontend/
  src/
    app equivalent:
    routes/
      routes.tsx              the full route tree (public + role-scoped)
      routes-controller.tsx   route guards (PublicRoute / PrivateRoute, tenant + role checks)
      index.tsx
    config/
      api-client.ts            the one axios instance: auth header injection, 401/403 handling,
                                 refresh-on-expiry behavior
      index.ts
    context/
      auth-context.tsx         current user, login/logout, token state
      theme-context.tsx        light/dark theme
      page-header-context.tsx  lets a page inject actions (buttons) into the shared header
      notification-context.tsx in-app notification list + unread count + Socket.IO subscription
    components/                shared, cross-feature UI: sidebar, header, table primitives,
                                custom-select, date-picker, spinner, no-record-found, delete
                                confirmation dialog, notification bell + Sheet, etc.
                                components/ui/ holds a few Radix-based primitives
    hooks/
      page-header/  useful for the page-header-context above
      error/         useError() — wires a mutation's error into a toast automatically
    pages/                      the actual screens, grouped by role — see §5
      admin/  teacher/  parent/  platform/  auth/
    services/                   ⚠️ legacy — see §6, mostly dead code
    types/index.ts               shared TypeScript interfaces for every API shape
    utils/                       emuns.ts (API routes/keys, enums), format-date, format-currency,
                                 validators, exportCsv.ts
    i18n.ts                      i18next setup
    test/setup.ts                vitest + RTL global setup
  docs/                          this file
```

### The `x.tsx` + `x-controller.ts` + `index.ts` pattern

Nearly every feature folder follows the same triad, and it's worth knowing before you go looking
for logic in the wrong file:

```
pages/admin/fees/
  fees.tsx              JSX only — reads everything from the controller hook, renders it
  fees-controller.ts    useFeesController() — all state, all react-query hooks, all handlers
  service/
    fees-service.ts     the actual axios calls + react-query hook definitions for this feature
  index.ts              re-export barrel
```

This cleanly separates "what does this screen do" (controller) from "what does it look like"
(the `.tsx`) from "how does it talk to the API" (service). New screens should follow this same
split.

## 4. Multi-tenancy on the frontend

`:organizationId` lives in the route path for every tenant-scoped screen, read via `useParams()`
in each feature's controller and passed into that feature's service hooks, which build the request
URL with it (e.g. `${APIS_ROUTES.FEE_SERVICE}/${organizationId}/...`). There is no global
`TenantProvider` yet (see §7) — each controller independently reads `organizationId` from the URL.
Route guards in `routes-controller.tsx` block access to a role/tenant combination the logged-in
user doesn't actually have membership in.

## 5. Feature-by-feature: what's built, why, and how

### Auth
Login, forgot password, an organization picker (for a user with memberships in more than one
school), and — built this project, previously entirely missing — a **set-password** page
(`pages/auth/set-password/`) for invited users: reads `?token=` from the URL, mirrors Login's
visual style, posts to the backend's `set-user-password` endpoint. Before this existed, the
invite-email flow was broken end-to-end because there was nowhere for the emailed link to go.

### Students
Full CRUD, a 2-step create wizard (basic details → parent link), CSV bulk import, search/filter/
pagination. Enrollment history (transfer, withdraw) and the year-end **promotion workflow** UI
were added this project — the backend for these existed with no frontend consumer at all until
then.

### Attendance
Daily marking screen: pick academic year → class → section → date, mark each student
present/absent/late/excused with an optional reason, bulk "mark all present/absent", save. A
same-day **CSV export** button was added (exports the currently-displayed roster + statuses) —
there is currently no separate historical attendance report screen (see gap list, §9).

### Homework
Teacher creates homework with attachments and a due date; parent/student side lists and views it.

### Notices
Publish/list/attachments, including AI-assisted content generation on the create form.

### Notifications
A bell icon (below the profile section in the sidebar) opens a **shadcn/Radix `Sheet`** sliding in
from the right, listing in-app notifications with read/unread state and mark-all-read. Backed by
`notification-context.tsx`, which holds the list + unread count and subscribes to the backend's
Socket.IO channel for live push — a new notification appears in the bell the instant the backend
creates it, no polling or refresh needed. This was built and fully tested (RTL) as its own
feature phase before leave-requests began.

### Leave requests
Parent submits a leave request for their child (with optional attachment) → teacher/admin
approves or rejects with a note → parent sees the decision, both sides notified. A real
**authorization-ordering bug** was found and fixed during a code review of this feature (an
authorization check that ran after a side effect instead of before it) — worth knowing if you're
auditing similar flows elsewhere.

### PTM (Parent-Teacher Meetings)
Teacher creates an event and generates bookable slots; parent picks a child and books a slot,
capacity-enforced; both sides can see their agenda.

### Fees
Admin: fee heads → fee structures (with installments) → assign to students → record payments →
reverse a payment → **grant a concession** (built this project — a form + a "concessions granted"
history table, using the same `useRef(crypto.randomUUID())` idempotency-key pattern as recording a
payment, so a double-click never double-charges or double-discounts) → payment ledger with a
**CSV export** button (added this project). Parent: view their child's fee summary, installments,
concessions and balance.

### Exams & Results
Admin: grading schemes → exams → exam subjects → marks entry (theory/practical, mark absent) →
verify → publish (locks marks, computes results) — plus a **marks-sheet CSV export** button
(added this project). Parent: view published results per child, with a **"Download report
card"** link (added this project) that fetches a real generated PDF from the backend and saves it
— not just an on-screen table.

### Platform Console
Built this project, entirely new: `/platform` — a non-tenant area, guarded by
`user.isPlatformAdmin`, where the platform admin creates Accounts (customers), adds Organizations
(schools) to an account, and suspends/reactivates an account (which cascades to every school under
it on the backend). This is the actual "I sell to a school, create their tenant, hand it over"
workflow described by the product owner.

### Dashboards
Role-scoped stat/chart screens (Highcharts) for admin/teacher/parent — largely pre-existing;
export buttons were **not** added here (the CSV export work targeted list/report screens, not the
dashboard charts themselves — see gap list, §9).

## 6. `src/services/` — legacy, mostly dead

`src/services/api.ts` is a **second axios instance**, separate from `src/config/api-client.ts`,
using `localStorage` instead of the real auth flow. It predates the current per-feature
`service/` folders. Only a couple of student-related files still import from it. Do not build new
features against it — use the `service/` folder colocated with the feature, following the pattern
in `pages/admin/fees/service/fees-service.ts`. This directory is flagged for eventual deletion, not
active development.

## 7. Known, deliberately-deferred debt

These were identified and explicitly scoped, not accidental oversights:

- **`react-query` v3 → `@tanstack/react-query` v5 migration — not started.** `@tanstack/react-query`
  v5 is already installed (`package.json` has it) but genuinely unused; every actual data hook in
  the app still imports from `react-query` v3 (confirmed via grep across the codebase — 49 files).
  14 of those files use `onSuccess`/`onError` directly inside a `useQuery` call, which v5 removes
  from `useQuery` entirely (only `useMutation` keeps them) — migrating those needs real logic
  restructuring (moving side effects into a `useEffect` watching `data`/`isSuccess`, or into the
  calling component), not a mechanical import rename. This is the single largest piece of frontend
  debt in the app.
- **`react-hook-form` + `zod` — not installed at all.** Every form in the app is still raw
  `useState` + manual validation. No shared schema with the backend's zod schemas, no field-level
  error UX, and (per the original architecture plan) failed submissions don't reliably preserve
  input or show per-field errors.
- **No `TenantProvider` / no tenant-scoped react-query cache keys.** Each screen reads
  `organizationId` from the route independently; query keys are not consistently parameterized by
  tenant. Not currently a proven data-leak (screens re-fetch on tenant switch in practice) but it's
  exactly the kind of thing the react-query v5 migration should fix properly rather than patch
  around.
- **No `@/` path alias.** Every import is relative (`../../../../types`), which makes moving files
  around painful. Worth adding before any large restructuring.

## 8. Testing

`vitest` + React Testing Library, set up via `src/test/setup.ts` and `vite.config.ts`'s `test`
block (`jsdom` environment). Test coverage exists specifically for the **notification** feature
(context + bell + Sheet) — 16 passing tests across 3 files. Per explicit product decision, no test
coverage was added for LeaveRequest or the fee-concessions/report-card/CSV-export work — those were
verified live against a running backend instead (see the backend doc's verification notes). If you
add tests for a new feature, follow the notification tests as the reference pattern for this repo.

## 9. What's NOT built yet (honest gap list, as of this doc)

Mirrors the backend doc's gap list, frontend-side specifics:

- **Student self-service portal** — no student login/dashboard; everything routes through a parent
  or staff account.
- **Accountant / Staff roles in the "Add User" screen** — the roles exist on the backend, but the
  admin UI to create such a user doesn't expose them.
- **Parent self-service guardian management** — no parent-facing UI to add/edit a second guardian.
- **No dedicated attendance history/report screen** — only the daily marking screen exists (now
  with a same-day export); there's no "attendance over a date range" view.
- **No scheduled/automated exports** — every CSV export button is user-triggered and client-side;
  nothing is emailed or generated on a schedule.
- **react-query v5 migration** and **react-hook-form + zod** — see §7.
- **Payment gateway UI** — no card/UPI checkout flow; blocked on the backend having real gateway
  credentials.

## 10. Where to look next

If you're picking this up cold: read `src/config/api-client.ts` (the one thing every screen goes
through), then `pages/admin/fees/` end-to-end as a representative example of the full
`.tsx` + `-controller.ts` + `service/` pattern, including the idempotency-key pattern used for
every money-affecting mutation.
