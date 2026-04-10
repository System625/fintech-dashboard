# Phase 3: Inner UI/UX Revamp

> **Roadmap ref**: Phase 3 in [`IMPLEMENTATION_ROADMAP.md`](../IMPLEMENTATION_ROADMAP.md)
> **Prereq**: Phase 2 (core features working)
> **Goal**: Match inner dashboard quality to the landing page's cyberpunk energy.
> **Estimated scope**: 2-3 sessions
> **Status**: COMPLETED (2026-04-03)

---

## Context

The landing page has a strong cyberpunk identity — glitch effects, neon accents, animated borders. The inner dashboard looks like a generic admin template by comparison. With real features working from Phase 2, it's time to make the experience feel premium.

## Session 1: Design System Alignment

### Cyberpunk Component Upgrades
- [ ] **Cards**: Add subtle neon border glow on hover, dark gradient backgrounds, scan-line overlay effect
- [ ] **Buttons**: Primary buttons get neon glow, secondary buttons get outline with glow-on-hover
- [ ] **Inputs**: Dark backgrounds with neon focus rings, subtle inner glow on focus
- [ ] **Charts**: Update Recharts theme — neon colors for data series, dark grid lines, glow on data points
- [ ] **Tables**: Alternating row backgrounds with subtle transparency, hover glow

### Color System
Use existing cyberpunk tokens consistently across inner app:
```css
--neon-blue: #00F0FF     /* Primary actions, links */
--neon-green: #00FF41    /* Success, income, positive changes */
--neon-pink: #FF007F     /* Alerts, expenses, destructive */
--neon-purple: #B847FF   /* Accent, secondary info */
--matrix-dark: #0A0A0A   /* Background */
--matrix-accent: #1A1A1A /* Card backgrounds */
```

### Typography
- [ ] Use JetBrains Mono (already in stack) for all financial numbers/amounts
- [ ] Geist for headings, Inter for body text
- [ ] Larger, bolder numbers on metric cards
- [ ] Subtle letter-spacing on labels

## Session 2: Component-Level Polish

### Dashboard Page
- [ ] Metric cards: larger numbers, trend arrows (up/down vs last month), subtle glow based on positive/negative
- [ ] Financial overview chart: fullwidth, dark background, neon gradient line, animated draw-in on load
- [ ] Quick actions: icon buttons with glow effect, clear labels
- [ ] Recent transactions: category icons, color-coded amounts (green income, pink expense)

### Empty States
Every section needs a styled empty state for new users:
- [ ] No accounts yet -> "Set up your first account" with CTA button
- [ ] No transactions -> "Record your first transaction" illustration
- [ ] No savings goals -> "Start saving toward something" prompt
- [ ] No bills -> "Track your recurring bills" prompt

Design: centered text, muted cyberpunk illustration or icon, single CTA button.

### Error States
- [ ] Error boundary component with cyberpunk-styled fallback
- [ ] "Something went wrong" with glitch text effect
- [ ] Retry button
- [ ] Report issue link

### Loading States
- [ ] Skeleton loaders matching card layouts (not generic gray boxes)
- [ ] Neon pulse animation on skeleton placeholders
- [ ] Page transition: quick fade with slight upward motion

## Session 3: Navigation & Mobile

### Sidebar
- [ ] Active page indicator with neon accent bar
- [ ] Icon-only collapsed mode on medium screens
- [ ] Smooth expand/collapse animation
- [ ] User avatar/initials at bottom with quick-access dropdown

### Mobile Experience
- [ ] Bottom navigation bar on mobile (replace sidebar)
- [ ] Swipe gestures on transaction list (swipe to delete/edit)
- [ ] Full-width cards that stack naturally
- [ ] Touch-friendly form inputs (44px min tap targets)
- [ ] Pull-to-refresh on list pages

### Onboarding Flow (New Users)
- [ ] Welcome screen after first signup
- [ ] Step 1: "Create your first account" (name + type)
- [ ] Step 2: "Add your first transaction" (quick entry)
- [ ] Step 3: "Set a savings goal" (optional, skippable)
- [ ] Animated transitions between steps
- [ ] Skip option always visible

### Page Transitions
- [ ] Framer Motion `AnimatePresence` on route changes
- [ ] Subtle fade + slide-up (200ms duration)
- [ ] No transitions on back navigation (instant feel)

## Tools Used

All free:
- **Tailwind CSS 4** — utility classes, no additional CSS framework
- **Framer Motion** (already installed) — animations and transitions
- **Lucide React** (already installed) — icons
- **Recharts** (already installed) — chart theming updates
- **Google Fonts** — JetBrains Mono if not already loaded

## Design Reference

Pull visual cues from the landing page components:
- `src/components/landing/LandingHero.tsx` — glitch effects, gradient text
- `src/components/ui/cyber-card.tsx` — neon border glow pattern
- `src/components/ui/glitch-text.tsx` — glitch text effect

Apply these patterns to dashboard components without making the UI feel heavy or slow. Subtlety is key — a hint of glow, not a rave.
