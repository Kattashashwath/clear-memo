# Clear Memo — Project Context for Claude Code

## Product
Clear Memo is a web app that turns raw meeting notes into three polished outputs in one click:
1. A 5-bullet summary of key takeaways
2. A numbered list of action items with owners and deadlines
3. A ready-to-send follow-up email

The core promise: what normally takes 20 minutes is done in under 10 seconds.

---

## Users
- **MBA students** — learning to run meetings professionally; need output that sounds senior
- **Consultants** — time-poor, high-output; need copy-paste ready text, zero jargon in the UI
- Both groups are **non-technical** — never show raw JSON, stack traces, or developer terminology in the UI. All error messages should be plain English.

---

## Outcome
User pastes notes → clicks "Generate Summary" → sees summary + actions + email → optionally clicks "Log to Google Sheets" to archive the memo permanently.

---

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Language | TypeScript (strict mode) |
| AI | Google Gemini 1.5 Flash via `@google/generative-ai` |
| Logging | Google Sheets API v4 via `googleapis` (service account auth) |
| Deployment | Vercel |
| Secrets | `.env.local` (never committed) |

---

## API Details

### POST `/api/process`
- **Input:** `{ notes: string }` — raw meeting notes from the textarea
- **Output:** `{ summary: string[], actions: string[], email: string }`
- **AI model:** `gemini-1.5-flash`
- **Prompt contract:** Gemini must return valid JSON with exactly 3 keys. Summary must have exactly 5 items.

### POST `/api/log`
- **Input:** Full `MemoResult` object `{ summary, actions, email }`
- **Output:** `{ ok: true }` on success
- **Sheet columns:** A=timestamp, B=summary (pipe-joined), C=actions (pipe-joined), D=email

### Environment variables (all in `.env.local`)
```
GEMINI_API_KEY            # from Google AI Studio
GOOGLE_SHEET_ID           # from the Sheet's URL
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY        # multi-line, keep \n escapes
```

---

## Design Rules
1. **One job per component** — each file in `components/` does exactly one thing. No component fetches data; all data flows down as props from `app/page.tsx`.
2. **Plain English in the UI** — button labels, placeholders, and error messages use natural language. No developer terms.
3. **Single-column layout** — `max-w-2xl mx-auto`. No sidebars, no grids. Professionals scan top to bottom.
4. **Colour palette** — indigo (`indigo-600`) as the primary accent. White cards (`bg-white`) on a soft grey background (`bg-gray-50`).
5. **Output must sound human** — the Gemini prompt explicitly instructs complete sentences, a warm email tone, and no robotic bullet fragments.
6. **Errors stay user-friendly** — catch all API errors at the route handler level; surface only a plain message to the browser. Log technical details with `console.error` server-side.
7. **Secrets never leave `.env.local`** — no secrets hardcoded anywhere. `.gitignore` already excludes `.env*.local`.
