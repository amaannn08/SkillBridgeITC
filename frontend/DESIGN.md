# SkillBridge ITC — Frontend Design System

> Government Placement Coordination Platform
> React + Vite · Tailwind CSS v4 · Framer Motion · Lucide Icons

---

## 1. Brand Identity

**Product:** SkillBridge — India's placement coordination platform under the Ministry of Skill Development & Entrepreneurship.
**Tone:** Authoritative, trustworthy, clean. Government-grade credibility without stiffness.
**Visual personality:** Light mode, professional, data-dense, with restrained use of colour and animation.

---

## 2. Color Palette

All tokens are declared as CSS custom properties in `src/index.css` under `:root`.

### Primary (Navy)
| Token | Hex | Usage |
|---|---|---|
| `--primary` | `#1E3A5F` | Primary buttons, sidebar gradient end |
| `--primary-light` | `#2A4F7C` | Primary button hover |

### Accent (Blue)
| Token | Hex | Usage |
|---|---|---|
| `--accent` | `#2563EB` | CTAs, active tabs, focus rings, links |
| `--accent-light` | `#3B82F6` | Accent hover states |

### Semantic
| Token | Hex | Meaning |
|---|---|---|
| `--success` | `#16A34A` | Approved, hired, selected |
| `--warning` | `#EA580C` | Pending, under review |
| `--danger` | `#DC2626` | Rejected, errors, destructive actions |

### Surface & Backgrounds
| Token | Hex | Usage |
|---|---|---|
| `--surface` | `#F1F5F9` | Page background (authenticated shell) |
| `--card` | `#FFFFFF` | Card / panel backgrounds |
| `--border` | `#E2E8F0` | Default borders |
| `--border-light` | `#F1F5F9` | Subtle separators |

### Text
| Token | Hex | Usage |
|---|---|---|
| `--text-primary` | `#0F172A` | Body text, headings |
| `--text-secondary` | `#334155` | Subheadings, form labels |
| `--text-muted` | `#64748B` | Subtitles, helper text, placeholders |

### Landing / Public Dark Theme
The public landing page uses a **separate dark palette** applied inline:
- Hero background: `linear-gradient(160deg, #060d1a 0%, #0c1e38 35%, #0f2d56 65%, #1a3f7a 100%)`
- Nav: `rgba(10, 22, 40, 0.94)` with `backdrop-filter: blur(16px)`
- Footer: `#0a1628`
- CTA Banner: `linear-gradient(135deg, #0c1e38 0%, #1a3f7a 100%)`
- Accent text on dark: `#60a5fa` (blue-400) and `#93c5fd` (blue-300)

### Sidebar Gradient
```css
background: linear-gradient(180deg, #0f2444 0%, #1e3a5f 100%);
```

---

## 3. Typography

### Font Stack
```css
/* Body */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Display / Headings */
font-family: 'Plus Jakarta Sans', sans-serif;
```

Both loaded from Google Fonts in `index.css`:
```
Inter: 300, 400, 500, 600, 700
Plus Jakarta Sans: 600, 700, 800
```

### Scale & Usage
| Element | Size | Weight | Font | Class / Token |
|---|---|---|---|---|
| Page title | `1.5rem` | 700 | Plus Jakarta Sans | `.page-title` |
| Page subtitle | `0.9375rem` | 400 | Inter | `.page-subtitle` |
| Hero H1 (landing) | `clamp(2.2rem, 5vw, 3.75rem)` | 800 | Plus Jakarta Sans | Inline |
| Section H2 | `clamp(1.75rem, 3vw, 2.5rem)` | 800 | Plus Jakarta Sans | Inline |
| Card heading | `1rem` | 600 | Inter | Tailwind `font-semibold` |
| Stats value | `1.875rem` | 800 | Plus Jakarta Sans | Inline style in StatsCard |
| Table header | `0.8rem` | 600 | Inter | Global `thead th` |
| Body / table cell | `0.875rem` | 400 | Inter | Global `tbody td` |
| Badge / micro text | `0.72rem` | 600 | Inter | `.badge` |
| Form label | `0.875rem` | 500 | Inter | `.form-label` |
| Form input | `0.875rem` | 400 | Inter | `.form-input` |
| Button (default) | `0.875rem` | 600 | Inter | `.btn` |

---

## 4. Spacing & Layout

### Shell Dimensions
| Token | Value | Description |
|---|---|---|
| `--sidebar-w` | `256px` | Full sidebar width |
| `--sidebar-collapsed-w` | `72px` | Collapsed sidebar width |
| `--header-h` | `56px` | Top header height |

### Page Layout Conventions
- **Authenticated pages:** Content area uses `padding` from the `AuthLayout`. Each page starts with `.page-header` (`margin-bottom: 28px`).
- **Grid gaps:** `gap-4` (16px) for stat card grids, `gap-6` (24px) for content grids.
- **Card padding:** `.card` = `24px`, `.card-sm` = `16px`.
- **Max-width (public):** `max-w-5xl mx-auto` with `px-6 lg:px-16` padding.

---

## 5. Component Library

All base components are defined in `src/index.css`. Use these class names consistently — do **not** rebuild them with ad-hoc Tailwind utilities.

### Buttons (`.btn`)

**Base class:** `.btn` — always pair with a variant.

| Class | Style | Use |
|---|---|---|
| `.btn-primary` | Navy fill | Primary action |
| `.btn-accent` | Blue fill | Highlight CTA |
| `.btn-success` | Green fill | Approve / confirm |
| `.btn-danger` | Red fill | Reject / delete |
| `.btn-warning` | Orange fill | Caution action |
| `.btn-outline` | Transparent + border | Secondary action |
| `.btn-ghost` | Transparent | Tertiary / icon labels |

**Size modifiers:**
| Class | Padding | Radius |
|---|---|---|
| `.btn-sm` | `5px 12px` | `7px` |
| `.btn` (default) | `8px 18px` | `8px` |
| `.btn-lg` | `12px 28px` | `10px` |
| `.btn-xl` | `14px 36px` | `12px` |
| `.btn-icon` | `8px` | `8px` |

All buttons lift `translateY(-1px)` and gain `box-shadow` on hover. Disabled state: `opacity: 0.5`, `pointer-events: none`.

---

### Cards (`.card`)

| Class | Padding | Radius | Extra |
|---|---|---|---|
| `.card` | `24px` | `14px` | Base white card |
| `.card-sm` | `16px` | `12px` | Compact variant |
| `.card-hover` | — | — | Hover lift + shadow |
| `.card-interactive` | — | — | Cursor pointer + hover lift + border darken |

Cards use `border: 1px solid var(--border)` and `background: var(--card)`.

Selected / active card state: add `border-blue-400 ring-2 ring-blue-100`.

---

### Badges (`.badge`)

Base: `display: inline-flex`, `padding: 3px 10px`, `border-radius: 99px`, `font-size: 0.72rem`, `font-weight: 600`.

| Class | Background | Text |
|---|---|---|
| `.badge-blue` | `#DBEAFE` | `#1D4ED8` |
| `.badge-green` | `#DCFCE7` | `#15803D` |
| `.badge-orange` | `#FFEDD5` | `#C2410C` |
| `.badge-red` | `#FEE2E2` | `#B91C1C` |
| `.badge-gray` | `#F1F5F9` | `#475569` |
| `.badge-yellow` | `#FEF9C3` | `#A16207` |
| `.badge-purple` | `#F3E8FF` | `#7E22CE` |
| `.badge-navy` | `#EFF6FF` | `#1E3A5F` |

**React component:** `<StatusBadge type="application|student|job|user|batch|role" status="..." />` in `src/components/shared/Badges.jsx`.

| type | Status keys |
|---|---|
| `application` | `submitted`, `under_review`, `shortlisting`, `closed` |
| `student` | `applied`, `shortlisted`, `on_hold`, `rejected`, `selected` |
| `job` | `draft`, `open`, `closed`, `filled` |
| `user` | `approved`, `pending`, `rejected`, `suspended` |
| `batch` | `draft`, `active`, `archived` |
| `role` | `super_admin`, `coordinator`, `recruiter` |

**Slot badge:** `<SlotBadge slots={[{ qualification, branch, seats }]} />` renders qualification-coloured badges (ITI=orange, Diploma=blue, B.Tech=navy, M.Tech=purple, B.Sc=green, MBA=yellow).

---

### Forms

| Class | Element | Notes |
|---|---|---|
| `.form-label` | `<label>` | `0.875rem`, weight 500, `var(--text-secondary)` |
| `.form-label-sm` | `<label>` | `0.8125rem` variant |
| `.form-input` | `<input>`, `<textarea>`, `<select>` | Full-width, focus ring blue |
| `.form-select` | `<select>` | Add alongside `.form-input`; injects chevron SVG |
| `.form-textarea` | `<textarea>` | Add alongside `.form-input`; `min-height: 96px` |
| `.form-error` | Error message | `0.8125rem`, `var(--danger)` |
| `.form-hint` | Helper text | `0.8125rem`, `var(--text-muted)` |

**Focus ring:** `border-color: var(--accent)` + `box-shadow: 0 0 0 3px rgba(37,99,235,.1)`.

**Tag input:** `.tag-container` > `.tag-item` + `.tag-input` — used for multi-value fields (branches, sectors, etc.).

**Search wrapper:**
```html
<div class="search-wrap">
  <SearchIcon class="search-icon" />
  <input class="form-input" />
</div>
```

---

### Tables

Always wrap in `.table-wrapper` (handles overflow + border + radius).

```html
<div class="table-wrapper">
  <table>
    <thead><tr><th>...</th></tr></thead>
    <tbody><tr><td>...</td></tr></tbody>
  </table>
</div>
```

- `thead th`: uppercase, `0.8rem`, `font-weight: 600`, `var(--text-muted)`, `background: #F8FAFC`
- `tbody td`: `0.875rem`, `padding: 13px 16px`, hover row = `#FAFBFF`

---

### Tabs (`.tab-bar`)

```html
<div class="tab-bar">
  <button class="tab-item active">Pending <span>3</span></button>
  <button class="tab-item">Approved</button>
</div>
```

Active tab: `color: var(--accent)`, `border-bottom-color: var(--accent)`, `font-weight: 600`. Tab bar sits on a `2px solid var(--border)` bottom border with `-2px` margin-bottom offset on items.

---

### Modals

```html
<div class="modal-overlay">         <!-- fixed, blur backdrop -->
  <div class="modal-content">       <!-- max-w: 560px, radius: 18px -->
    ...
  </div>
</div>
<!-- Large: add .modal-content-lg (max-w: 720px) -->
```

Overlay: `rgba(15,23,42,.5)` + `backdrop-filter: blur(2px)`. Content enters with `.animate-scale-in`.
Always intercept click propagation on `.modal-content` to prevent overlay dismiss.

---

### Stats Cards

**Component:** `src/components/shared/StatsCard.jsx`

```jsx
<StatsCard
  icon={Users}
  value={1234}
  label="Total Users"
  color="blue"          // blue | green | orange | red | navy | purple
  trend="up"            // up | down | neutral (optional)
  trendLabel="+12 this month"  // (optional)
  delay={60}            // animation delay in ms (optional)
/>
```

Renders with Framer Motion entrance animation (`opacity 0→1, y 16→0`).

---

### Progress Bars

```html
<div class="progress-bar">                     <!-- h: 6px, gray track -->
  <div class="progress-fill" style="width: 65%; background: #2563EB;" />
</div>
```

Animated fill via `transition: width 1s ease`. For inline charts, use `height: 4px` or `height: 8px` as needed.

---

### Skeleton Loaders

```html
<div class="skeleton" style="height: 20px; width: 120px;" />
```

Shimmer animation runs `1.4s infinite`. Use `border-radius: 6px` (default) or `border-radius: 99px` for pill shapes.

---

### Empty States

```html
<div class="empty-state">
  <div class="empty-state-icon">📭</div>
  <p class="empty-state-title">No registrations found</p>
  <p class="empty-state-desc">Adjust your filters to see results</p>
</div>
```

---

### Step Dots (Wizard Progress)

```html
<div class="step-dot active" />   <!-- blue, scale(1.2) -->
<div class="step-dot done" />     <!-- green -->
<div class="step-dot" />          <!-- gray default -->
```

---

### Notification Badge

```html
<div style="position: relative;">
  <BellIcon />
  <span class="notif-badge">3</span>
</div>
```

---

### Divider

```html
<div class="divider" />   <!-- 1px gray, margin: 20px 0 -->
```

---

### CSV Drop Zone

```html
<div class="csv-drop-zone">
  Drop CSV file here or click to browse
</div>
```

Hover / dragging state activates `border-color: var(--accent)` and `background: #EFF6FF`.

---

## 6. Layout Architecture

### Authenticated Shell (`AuthLayout`)

```
┌──────────────────────────────────┐
│         .app-header (56px)       │
├───────────┬──────────────────────┤
│  .sidebar │   <page content>     │
│  (256px)  │   (scrollable)       │
│           │                      │
└───────────┴──────────────────────┘
```

- Sidebar: sticky full-height left column, collapsible on desktop, slide-in drawer on mobile.
- Header: sticky top, `z-index: 30`.
- Content: `padding: 24px` (or similar), scrollable independently.

**Collapsed sidebar:** Class `.sidebar-collapsed` on `<aside>` reduces width to `72px`. Icons remain visible; labels hide. Tooltip appears on hover (`.group-hover` tooltip in Sidebar.jsx).

**Mobile:** Sidebar is `position: fixed`, slides in from left with `.open` class. A `.mobile-overlay` div covers the content area.

### Public Layout (`PublicLayout`)

Minimal wrapper — just `min-h-screen bg-[#F8FAFC]`. The Landing page is fully self-contained with its own sticky nav.

---

## 7. Animation & Motion

### CSS Keyframes (utility classes)

| Class | Animation | Duration | Easing |
|---|---|---|---|
| `.animate-fade-in` | `fadeIn` (opacity + translateY 6px) | `0.35s` | `ease-out` |
| `.animate-slide-up` | `slideUp` (opacity + translateY 16px) | `0.4s` | `ease-out` |
| `.animate-scale-in` | `scaleIn` (opacity + scale 0.96→1) | `0.22s` | `ease-out` |
| `.animate-spin` | `spin` (full rotation) | `0.8s` | `linear infinite` |

**Staggered children:** Wrap parent in `.stagger-children` — each `:nth-child` receives a `55ms` incremental delay (up to 8 children).

### Framer Motion Usage

| Component | Motion pattern |
|---|---|
| `StatsCard` | `initial: {opacity:0, y:16}` → animate in, delay from prop |
| `Landing FadeUp` | `useInView` scroll-triggered, `y: 28→0`, duration `0.55s`, easing `[0.22,1,0.36,1]` |
| Sidebar active indicator | `layoutId="sidebar-active"`, spring `{stiffness:400, damping:35}` |
| Header dropdowns | `variants: hidden→visible→exit`, scale + opacity, `0.18s` |
| General page content | `animate-fade-in` CSS class on root container |

---

## 8. Sidebar Navigation

Navigation items are role-gated — each role sees only its own nav array (defined in `Sidebar.jsx`):

| Role | Nav items |
|---|---|
| `super_admin` | Dashboard, District Map, Pending Approvals (badge), All Users, Job Requirements, Analytics, Audit Trail |
| `coordinator` | Dashboard, Browse Jobs, My Applications, Talent Pool Batches, Institution Profile, Notifications (badge) |
| `recruiter` | Dashboard, My Job Postings, Post New Job, Applications, Company Profile, Notifications (badge) |
| `student` | Dashboard, Browse Jobs, My Applications, My Profile, Notifications (badge) |

Active item uses Framer Motion `layoutId` spring for the highlight indicator. Collapsed tooltips appear on hover to the right of the icon.

---

## 9. Icon System

**Library:** [Lucide React](https://lucide.dev/) — used exclusively throughout.

Common icon sizes:
- Navigation / labels: `size={17}`
- Buttons inline: `size={14}–{16}`
- Empty state: `size={32}`
- Stats card: `size={20}`
- Form decorators (search, etc.): `size={15}`

---

## 10. Page Anatomy (Authenticated)

Every authenticated page follows this structure:

```jsx
<div className="animate-fade-in">
  {/* Page header */}
  <div className="page-header">
    <h1 className="page-title">Page Title</h1>
    <p className="page-subtitle">Descriptive subtitle</p>
  </div>

  {/* Optional: action bar (tabs + search / filter + CTA button) */}
  <div className="flex items-center justify-between mb-6">
    <div className="tab-bar ...">...</div>
    <div className="search-wrap ...">...</div>
  </div>

  {/* Main content */}
  <div className="grid lg:grid-cols-2 gap-6">
    <div className="card">...</div>
    <div className="card">...</div>
  </div>
</div>
```

---

## 11. Role-Based Color Coding

Roles have semantic colour associations used consistently in badges, process cards, and icon tints:

| Role | Badge class | Accent hex |
|---|---|---|
| Super Admin | `badge-navy` | `#1E3A5F` |
| Coordinator | `badge-green` | `#16A34A` |
| Recruiter | `badge-blue` | `#2563EB` |
| Student | `badge-purple` | `#7C3AED` |

---

## 12. Scrollbar

Custom scrollbar, 5×5px, thumb `#CBD5E1` → hover `#94A3B8`, no track background. Applied globally.

---

## 13. Responsive Breakpoints

Uses Tailwind's default breakpoint system (`sm: 640px`, `md: 768px`, `lg: 1024px`).

Critical mobile behaviour:
- Sidebar: hidden, triggered by hamburger `Menu` icon in header → slides in as drawer.
- Stats grids: `grid-cols-2` on mobile, `lg:grid-cols-4` on desktop.
- Approvals layout: single-column on mobile, `lg:grid-cols-3` on desktop.
- Public landing hero: `clamp()` font sizes, wrapping flex stat blocks.

---

## 14. Toast Notifications

**Library:** `react-hot-toast`, position `top-right`.

```js
toast.success('User approved successfully');
toast.error('User registration rejected');
```

Style override in `App.jsx`:
```js
{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', borderRadius: '10px' }
```

Duration: `3500ms`.

---

## 15. Key Design Patterns

### Master-Detail Layout
Used in Approvals: a scrollable list column (1/3 width) paired with a sticky detail panel (2/3 width). Selected item gets `border-blue-400 ring-2 ring-blue-100` highlight.

### Stat Grid with Stagger
Grids of `<StatsCard>` components wrapped in `.stagger-children` for sequential entrance animation.

### Dark Hero Card
Used in Analytics (`placement ratio` card): navy gradient background card (`linear-gradient(135deg, #0c1e38, #1a3f7a)`) with white/blue text — a visual anchor for key metrics.

### Table + "View All" Ghost Button
Recurring pattern: a `.card` with a flex header containing a section title (with Lucide icon) and a `btn btn-ghost btn-sm text-blue-600` "View All" button with a `ChevronRight` icon.

### Inline Field Detail Rows
In detail panels, field groups are rendered as `bg-gray-50 rounded-xl p-3` blocks in a 2-column grid.

### Rejection Reason Alert
Red-tinted info box: `bg-red-50 border border-red-100 rounded-xl p-4` — used when showing rejection reasons.

---

## 16. Files Reference

| Path | Purpose |
|---|---|
| `src/index.css` | Global design tokens, utility classes, all base components |
| `src/App.css` | Minimal reset only |
| `src/App.jsx` | Route definitions, Toaster config |
| `src/components/shared/Sidebar.jsx` | Role-gated navigation, collapse/mobile |
| `src/components/shared/Header.jsx` | Top bar, role switcher, notifications, profile dropdown |
| `src/components/shared/StatsCard.jsx` | Animated metric card |
| `srctml/components/shared/Badges.jsx` | `StatusBadge`, `SlotBadge` components |
| `src/components/shared/NotificationBell.jsx` | Bell icon with unread counter |
| `src/layouts/AuthLayout.jsx` | Sidebar + Header shell wrapper |
| `src/layouts/PublicLayout.jsx` | Minimal public wrapper |
| `src/pages/Landing.jsx` | Marketing page (dark theme) |
| `src/pages/Register.jsx` | Multi-step registration wizard |
| `src/pages/Pending.jsx` | Post-registration approval pending screen |
| `src/pages/admin/` | Super Admin portal pages |
| `src/pages/coordinator/` | Coordinator portal pages |
| `src/pages/recruiter/` | Recruiter portal pages |
| `src/pages/student/` | Student portal pages |
| `src/context/AppContext.jsx` | Global state: current user, unread count, sidebar open |
| `src/data/mockData.js` | All mock data (users, jobs, institutions, analytics) |
