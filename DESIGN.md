
---

**DESIGN.md**

```markdown
# Design Document

## 1. Problem Recap
- Learners diagnose virtual patients via a chat UI.
- For each patient:
  1. Choose the best diagnostic test.
  2. Review returned results.
  3. Enter the correct diagnosis.
- Points reward first-try accuracy (10 pts max; –2 per extra attempt; 0 if contra-indicated).

## 2. Architecture Sketch

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Expo App (React Native)                      │
│                                                                     │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐        │
│  │  Chat Screens │    │  Sync Banner  │    │ Points Modal  │        │
│  └───────────────┘    └───────────────┘    └───────────────┘        │
│                                                                     │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            │ WebSockets
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Express Backend Server                         │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    TursoDB/SQLite                           │    │
│  │                                                             │    │
│  │  ┌───────────────┐    ┌───────────────┐    ┌─────────────┐  │    │
│  │  │ Actions Queue │    │Sessions Table │    │  User Data  │  │    │
│  │  └───────────────┘    └───────────────┘    └─────────────┘  │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    AI + Function Handlers                   │    │
│  │                                                             │    │
│  │  ┌───────────────┐    ┌───────────────┐    ┌─────────────┐  │    │
│  │  │ Chat Handler  │    │Score Handler  │    │ Sync Logic  │  │    │
│  │  └───────────────┘    └───────────────┘    └─────────────┘  │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Key Components:

1. **Expo App (React Native)**
   - Chat Screens: Main interface for doctor-AI interaction
   - Sync Banner: Shows connection status
   - Points Modal: Displays scoring information

2. **Express Backend**
   - WebSocket Server: Real-time communication
   - TursoDB/SQLite: Persistent storage
   - AI + Function Handlers: Business logic

3. **Data Flow**
   - Real-time: WebSocket connection
   - Sync: REST API endpoints
   - Storage: SQLite database operations

## 3. Data Model / Schema
- **patients** (static JSON or DB)
  - `id`, `name`, `age`, `gender`, `history`, `symptoms`, `additionalInfo`, `correctTest`, `correctDiagnosis`, `contraIndicatedTests?`
- **actions** (SQLite)
  - `id`, `patientId`, `type` (‘test’/‘diagnosis’), `input`, `result` (‘correct’, ‘incorrect’, ‘contra’), `points`, `timestamp`, `synced` (0/1)
- **sessions**
  - `id`, `patientId`, `totalScore`, `timestamp`, `synced` (0/1)

## 4. Offline & Sync Flow
1. **Action**: user submits test or diagnosis → insert into `actions` with `synced=0`.
2. **Banner** shows "Offline" if no network.
3. On reconnect:
   - Read all `synced=0` actions.
   - Batch-upload via `POST /sync` to backend.
   - Backend evaluates & returns authoritative scores/messages.
   - Update local `actions.synced=1` and update chat history.
4. **Conflict rule**: last writer wins on same fields.

## 5. Module Breakdown
- **Screens / Components**
  - `PatientScreen` (chat UI, scoring logic)
  - `ScoreScreen` (results & pass/fail)
  - `Banner` (patient info + points badge)
  - `PointsModal` (breakdown popup)
  - `SyncBanner` (Offline ▸ Syncing ▸ Synced)
  - `ChatMessage` (bubble + header)
- **Hooks**
  - `useDatabase` (initialize SQLite)
  - `useSync` (connectivity listener + sync logic)
- **lib/db.ts**
  - `initDb()`, `addAction()`, `getUnsyncedActions()`, `markActionsSynced()`, `addSession()`
- **Scoring Helper**
  - `computeScore(attempts: number): number`
- **Express Routes**
  - `POST /sync` (accept actions, evaluate via AI functions, respond with updated messages & scores)
- **LLM Integration**
  - Vercel AI SDK with function-calling (`evaluateTest`, `evaluateDiagnosis`)

## 6. Assumptions & Open Questions
- **Assumed** all patient data lives locally; no dynamic additions.
- **Assumed** initial network check via JavaScript fetch.
- **Open**: exact retry UX for contra-indicated tests.
- **Open**: LLM prompts and fallback when offline.
- **Open**: extending to add haptic feedback or Detox tests.
