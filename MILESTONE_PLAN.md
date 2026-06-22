# MILESTONE_PLAN.md — AI Roadmap Security-Refactor

## M0 — Git Branch + Orphan Cleanup ✅ Complete

**Files affected:**
- **Delete (11 files):**
  - `ai-roadmap/ai-roadmap.jsx` (515 lines, old prototype)
  - `ai-roadmap/src/App.jsx` (old app shell, replaced by main.tsx + routing)
  - `ai-roadmap/src/main.jsx` (old entry point, replaced by main.tsx)
  - `ai-roadmap/src/data.js` (306 lines, old data — replaced by `roadmapData.ts`)
  - `ai-roadmap/src/firebase-config.js` (old firebase config template)
  - `ai-roadmap/src/sync.js` (40 lines, old sync utility)
  - `ai-roadmap/src/SyncPanel.jsx` (123 lines, old sync component)
  - `ai-roadmap/1cd` (unknown file)
  - `ai-roadmap/assets/` (3 screenshot PNGs)
  - `data_backup.js` (parent dir, 28KB backup)
  - `firebase.txt` (parent dir, config snippet)
- **.gitignore update:** deferred to M1
- **New dependency:** `git checkout -b security-refactor`
- **Success criteria:** `git status` shows only active files; `npm run build` succeeds
- **Order:** 1st (prerequisite for all else)
- **Result:** Commit `849cf75` — all orphan files deleted, build passes, branch pushed

---

## M1 — Security (PIN Hashing + Env + Rules + Route Guard) ✅ Complete

**Files affected:**
- `ai-roadmap/src/app/context/AppContext.tsx` — replace `d.pin !== enteredPin` with `bcrypt.compareSync`, store hash on signup
- `ai-roadmap/src/app/pages/PinEntry.tsx` — minor: PIN auto-submit unchanged UX
- `ai-roadmap/.gitignore` — add `.env`, `dist/`, `*.local`
- `ai-roadmap/firestore.rules` (NEW) — deny all by default, allow read/write only for authenticated users on own doc
- `ai-roadmap/firebase.json` (NEW) — `{ "firestore": { "rules": "firestore.rules" } }`
- `ai-roadmap/src/app/components/RouteGuard.tsx` (NEW) — wrap `<Route>` to redirect unauthenticated users to `/`
- **New deps:** `bcryptjs` + `@types/bcryptjs`
- **Migration:** existing users' PINs in Firestore must be hashed on first login (detect plaintext → auto-hash and save)
- **Success criteria:** PIN comparison uses `bcrypt.compareSync`; `.env` is gitignored; `firebase deploy --only firestore:rules` succeeds; unauthenticated users can't access `/dashboard`
- **Order:** 2nd (security before features)

---

## M2 — Cleanup (Unused Deps + Inline Styles → Tailwind)

**Files affected:**
- `ai-roadmap/package.json` — remove `motion`, `clsx`, `class-variance-authority`, `tailwind-merge`
- `ai-roadmap/src/app/pages/PinEntry.tsx` — replace ~30 inline `style={{}}` with Tailwind classes (e.g., `className="flex items-center justify-center min-h-screen bg-[#060A12]"`)
- `ai-roadmap/src/app/pages/Dashboard.tsx` — replace ~86 inline `style={{}}` with Tailwind
- `ai-roadmap/src/app/components/BottomNav.tsx` — replace ~6 inline styles
- `ai-roadmap/src/app/components/SearchModal.tsx` — replace ~30 inline styles
- `ai-roadmap/src/app/components/PhaseCard.tsx` — replace ~150+ inline styles (856-line file)
- `ai-roadmap/src/index.css` — verify Tailwind v4 utility coverage; remove redundant keyframes if Tailwind provides equivalents
- **No new deps**
- **Success criteria:** `npm run build` succeeds; no `style={{}}` in `src/app/` (except dynamic values like phase colors)
- **Order:** 3rd (reduce noise before refactor)

---

## M3 — Refactor PhaseCard.tsx (4 files)

**Files affected:**
- `ai-roadmap/src/app/components/PhaseCard.tsx` — strip to shell (~200 lines): imports, props, accordion, tab state, conditional rendering of 3 tab components
- `ai-roadmap/src/app/components/PhaseContentTab.tsx` (NEW) — extracted from original: topic flow, checkboxes, item rows, notes/dates
- `ai-roadmap/src/app/components/PhaseResourcesTab.tsx` (NEW) — extracted from original: filtered resource list, source links, custom resources with DnD
- `ai-roadmap/src/app/components/PhaseTasksTab.tsx` (NEW) — extracted from original: task list with progress bar
- `ai-roadmap/src/app/context/AppContext.tsx` — no changes (already provides all needed via `useApp()`)
- **No new deps**
- **Success criteria:** all 3 tabs render identically to pre-refactor; `wc -l PhaseCard.tsx` < 250 lines
- **Order:** 4th (after cleanup, before Auth)

---

## M4 — Firebase Auth (Google OAuth Integration)

**Files affected:**
- `ai-roadmap/src/app/context/AppContext.tsx`:
  - Add `onAuthStateChanged` listener
  - Add `signInWithGoogle()` function
  - Add `logout()` function
  - Migration strategy: new users get doc at `progress/{uid}`; existing users (username-based) can link via email or manual migration prompt
- `ai-roadmap/src/app/pages/PinEntry.tsx` — add "Continue with Google" button above username input
- `ai-roadmap/src/app/components/RouteGuard.tsx` — update to check `auth.currentUser`
- `ai-roadmap/firestore.rules` — update to `request.auth.uid == resource.id` (document ID = uid)
- **No new deps** (Firebase Auth already imported but unused; `GoogleAuthProvider` already configured in `firebase.js`)
- **Migration strategy:**
  1. On first Google login, check if `progress/{uid}` exists
  2. If not, show "Link existing account?" prompt
  3. User enters username+PIN → we find old doc, copy `checked`, `tasks`, etc. to new `progress/{uid}`
  4. Delete old doc (optional)
  5. Existing PIN-only users continue via legacy login (username+PIN) or upgrade
- **Success criteria:** Google OAuth popup works; progress data accessible after linking; legacy PIN login still works
- **Order:** 5th (after refactor, before AI features)

---

## M5 — AI Search (Gemini 3 Flash API)

**Files affected:**
- `ai-roadmap/src/app/components/SearchModal.tsx` — replace mock results with `fetch()` to Gemini API:
  - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-001:generateContent?key=${API_KEY}`
  - Prompt: structured JSON output for topic resources
  - Add `VITE_GEMINI_API_KEY` to `.env`
- `ai-roadmap/.env` — add `VITE_GEMINI_API_KEY`
- Error handling: network failure → retry button, rate limit (429) → backoff message, empty response → fallback text
- **New dep:** none (native `fetch`)
- **Success criteria:** search with "transformer" returns real results; error states display correctly; within free tier (1500 req/day)
- **Order:** 6th (after Auth)

---

## M6 — Student Features (4 sub-features)

**Files affected:**

### 6a. localStorage offline backup
- `ai-roadmap/src/app/context/AppContext.tsx` — add `useEffect` to save `checkedTopics`/`tasks` to `localStorage` on every change; on mount, try Firestore first, fallback to localStorage
- Key: `ai-roadmap-cache-v1`

### 6b. Recharts progress analytics
- `ai-roadmap/src/app/pages/Dashboard.tsx` — add a `<ProgressChart>` section below hero
- New file: `ai-roadmap/src/app/components/ProgressChart.tsx`
- Uses `recharts` `PieChart` + `BarChart` (per-phase completion)
- **New dep:** `recharts`

### 6c. Dark mode toggle
- `ai-roadmap/src/app/context/AppContext.tsx` — add `isDark` state + `toggleDark` (default `true` for current design)
- `ai-roadmap/src/app/pages/Dashboard.tsx` — toggle button in header
- `ai-roadmap/src/app/components/BottomNav.tsx` — respect theme
- Use `class="dark"` on `<html>` + Tailwind `dark:` variants
- **No new dep**

### 6d. Share progress as image/text
- New util: `ai-roadmap/src/app/utils/shareProgress.ts`
- Text share: `navigator.share({ text: "..." })` with completion stats
- Image share: use `html2canvas` to capture dashboard → blob → `navigator.share({ files: [...] })`
- **New dep:** `html2canvas` (only ~17KB)

**Success criteria:** localStorage fallback works offline; chart renders with real data; dark mode toggles; share produces text/image
**Order:** 7th (after AI Search)

---

## M7 — Design Enhancement (Gemini Vision)

**Files affected:**
- `ai-roadmap/src/index.css` — may add new utility classes based on analysis
- `ai-roadmap/src/app/pages/Dashboard.tsx` — UI polish
- `ai-roadmap/src/app/pages/PinEntry.tsx` — UI polish
- User provides reference image → Gemini 3 Flash Vision analyzes it → produces CSS/Tailwind recommendations
- **No new deps**
- **Success criteria:** UI matches reference image within 90% visual fidelity
- **Order:** 8th (last, polishing)

---

## Execution Summary

```
M0: branch + cleanup  →  M1: security  →  M2: deps/styles cleanup  →
M3: PhaseCard split  →  M4: Google Auth  →  M5: Gemini Search  →
M6: Student features  →  M7: Design polish
```

All milestones are strictly sequential. Each milestone's success criteria must pass before proceeding to the next.
