# Phase 0: Codebase Cleanup ✅ COMPLETED (2026-04-02)

> **Roadmap ref**: Phase 0 in [`IMPLEMENTATION_ROADMAP.md`](../IMPLEMENTATION_ROADMAP.md)
> **Goal**: Remove dead code, unused files, and confusion before building new features.
> **Estimated scope**: Single session

---

## Context

The codebase was originally built with MSW mock data powering everything. Auth uses Firebase (working), but state management has duplicate approaches (legacy Context + Zustand). Several service files were scaffolded but never connected. Console logs litter the chart components.

## Tasks

### 1. Delete unused AuthContext

- **File**: `src/context/AuthContext.tsx`
- **Why**: The real auth layer is `src/stores/useAuthStore.ts` (Zustand). AuthContext is imported nowhere.
- **Action**: Delete the file. Verify no imports reference it (`grep -r "AuthContext" src/`).

### 2. Remove MSW from production builds

- **File**: `src/main.tsx` (MSW initialization)
- **Why**: MSW currently runs in production — users see fake data. It should only run when `VITE_USE_MOCKS=true`.
- **Action**:
  - Wrap MSW startup in `if (import.meta.env.VITE_USE_MOCKS === 'true')` guard
  - Update `.env.example` to document the flag
  - Ensure production builds skip MSW entirely

### 3. Clean up console statements

- **Files**: `src/components/charts/*.tsx`, `src/mocks/browser.ts`
- **Action**: Remove all `console.log`, `console.error`, `console.warn` in chart components. Keep only genuinely useful error logging (e.g., in auth store catch blocks).

### 4. Remove stale service files

- **Files**:
  - `src/services/secureApi.ts` — unused backend proxy scaffold
  - `src/services/firebaseApi.ts` — unused Cloud Functions wrapper
- **Why**: These will be rebuilt properly in Phase 1. Keeping them around causes confusion.
- **Action**: Delete both. Verify no imports reference them.

### 5. Audit dependencies

- **File**: `package.json`
- **Action**: Run `npx depcheck` to find unused dependencies. Candidates to investigate:
  - `echarts` / `echarts-for-react` — check if still used or fully replaced by Recharts
  - Any other packages only referenced in deleted code

### 6. Fix hardcoded dates in mock data

- **Files**: `src/mocks/data/*.ts`
- **Why**: Mock data has 2023 timestamps which look obviously fake.
- **Action**: Use relative date generation (`new Date()` minus N days) so mocks always look current. Only matters while MSW is still used in dev.

### 7. Fix TypeScript warnings

- **Action**: Run `npx tsc --noEmit` and fix all errors/warnings. Common issues:
  - Loose typing on form submit handlers
  - Unused imports
  - Any `any` types that should be narrowed

## Verification

After cleanup:
- `npm run build` succeeds with no warnings
- `npx tsc --noEmit` passes clean
- App still works in dev mode with `VITE_USE_MOCKS=true`
- App shows appropriate empty/loading states without MSW (production mode)

## Notes for Next Session

After this phase, the codebase is clean and ready for Phase 1 (Firestore integration). The app will show empty states in production — that's expected and correct. Real data comes in Phase 1.
