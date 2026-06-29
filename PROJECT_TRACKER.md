# Student Management System — Project Tracker

> **University Laboratory Experiment (15 Marks)**  
> **Repository:** `labapiexp1` (monorepo — backend + frontend)  
> **Last Updated:** 2026-06-29

---

## Quick Status

| Metric | Value |
|--------|-------|
| **Current Phase** | Phase 15 complete — awaiting Phase 16 |
| **Overall Progress** | 15 / 17 phases complete |
| **Project State** | Render deployment config ready — deploy via Render dashboard |
| **Architecture** | Monorepo — backend at root, frontend in `client/` |

---

## Architecture Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Repo (labapiexp1)                  │
│                         MONOREPO                             │
├──────────────────────────┬──────────────────────────────────┤
│   BACKEND (root)         │   FRONTEND (client/)             │
│   Node.js + Express      │   Vite + React (minimal UI)      │
│   MongoDB Atlas          │   Calls REST API via fetch/axios │
└────────────┬─────────────┴──────────────────┬───────────────┘
             │                                 │
             ▼                                 ▼
      ┌─────────────┐                  ┌───────────────┐
      │   RENDER    │                  │ NETLIFY or    │
      │  (Web Svc)  │◄──── HTTPS ──────│   VERCEL      │
      │  /api/...   │      API calls   │  (Static SPA) │
      └──────┬──────┘                  └───────────────┘
             │
             ▼
      ┌─────────────┐
      │  MongoDB    │
      │   Atlas     │
      └─────────────┘
```

### Can we deploy backend and frontend separately from the same repo?

**Yes.** This is a standard monorepo deployment pattern:

| Service | Platform | Root Directory | Build Command | Start / Publish |
|---------|----------|----------------|---------------|-----------------|
| **Backend** | Render | `/` (repo root) | `npm install` | `npm start` |
| **Frontend** | Netlify or Vercel | `client/` | `npm run build` | `client/dist` |

Both platforms connect to the **same GitHub repository** but use different **root directories** and **build settings**. Pushing to `main` can trigger deploys for both services independently.

### Key integration points

- **CORS (Phase 11):** Backend must allow the Netlify/Vercel frontend origin (e.g. `https://your-app.netlify.app`).
- **Frontend env var:** `VITE_API_URL=https://your-api.onrender.com` — points to the Render backend URL.
- **Backend env var:** `CLIENT_URL=https://your-app.netlify.app` — used in CORS configuration.
- **Local dev:** Backend on `http://localhost:5000`, frontend on `http://localhost:5173` (Vite default).

---

## Phase Progress

| # | Phase | Status | Completed On | Notes |
|---|-------|--------|--------------|-------|
| 1 | Project Setup | ✅ Complete | 2026-06-29 | `package.json`, dependencies, `.gitignore`, `.env`, `.env.example` |
| 2 | Express Server | ✅ Complete | 2026-06-29 | `server.js` with JSON middleware, `/` and `/health` routes |
| 3 | MongoDB Connection | ✅ Complete | 2026-06-29 | `config/db.js`, integrated in `server.js`, health check includes DB status |
| 4 | Folder Structure | ✅ Complete | 2026-06-29 | MVC dirs created; `routes/index.js` + `studentRoutes.js` wired in `server.js` |
| 5 | Student Model | ✅ Complete | 2026-06-29 | `models/Student.js` with validation, unique fields, timestamps |
| 6 | Controllers | ✅ Complete | 2026-06-29 | `studentController.js` CRUD + `utils/apiResponse.js` |
| 7 | Routes | ✅ Complete | 2026-06-29 | REST routes wired to controllers in `studentRoutes.js` |
| 8 | Middleware | ✅ Complete | 2026-06-29 | logger, notFound, errorHandler, validateObjectId wired |
| 9 | Validation | ✅ Complete | 2026-06-29 | `validateStudent.js` on POST, PUT, PATCH with Mongoose integration |
| 10 | Search / Filter / Pagination | ✅ Complete | 2026-06-29 | Query builder + advanced `getStudents` |
| 11 | Security | ✅ Complete | 2026-06-29 | Helmet, CORS, rate limiting via `config/security.js` |
| 12 | Postman Testing | ✅ Complete | 2026-06-29 | Collection (22 requests), environment, testing guide |
| 13 | Frontend Setup | ✅ Complete | 2026-06-29 | `client/` Vite + React + Tailwind, `studentService.js` |
| 14 | Frontend UI | ✅ Complete | 2026-06-29 | Student table, forms, search/filter, pagination, CRUD |
| 15 | Backend Deployment | ✅ Complete | 2026-06-29 | `render.yaml`, `deployment/RENDER_BACKEND.md`, production Postman env |
| 16 | Frontend Deployment | ⬜ Pending | — | Netlify or Vercel from `client/` |
| 17 | Documentation & Final Review | ⬜ Pending | — | README, viva prep, end-to-end verification |

**Legend:** ⬜ Pending · 🔄 In Progress · ✅ Complete · ❌ Blocked

---

## Change Log

| Date | Phase | Change |
|------|-------|--------|
| 2026-06-29 | — | Created `PROJECT_TRACKER.md` with full specification and progress tracking |
| 2026-06-29 | — | Repository initialized with minimal `README.md` |
| 2026-06-29 | 1 | Initialized npm project, installed dependencies, created `.gitignore`, `.env`, `.env.example` |
| 2026-06-29 | 2 | Created `server.js` with Express app, JSON middleware, root and health routes |
| 2026-06-29 | — | Added frontend to scope; monorepo architecture; split deployment (Render + Netlify/Vercel); expanded to 17 phases |
| 2026-06-29 | 3 | Created `config/db.js`, wired MongoDB connection into `server.js`, enhanced health endpoint |
| 2026-06-29 | 4 | Created MVC directories; wired `routes/index.js` and `studentRoutes.js` into `server.js` |
| 2026-06-29 | 5 | Created `models/Student.js` with schema validation, unique constraints, and indexes |
| 2026-06-29 | 6 | Created `controllers/studentController.js` and `utils/apiResponse.js` with full CRUD logic |
| 2026-06-29 | 7 | Wired REST endpoints in `studentRoutes.js` to student controllers |
| 2026-06-29 | 8 | Added middleware layer and integrated into `server.js` and routes |
| 2026-06-29 | 9 | Added `validateStudent.js` for create, update, and patch request validation |
| 2026-06-29 | 10 | Added `buildStudentQuery.js` and enhanced `getStudents` with search, filter, sort, pagination |
| 2026-06-29 | 11 | Added `config/security.js` with Helmet, CORS, rate limiting; updated `server.js` |
| 2026-06-29 | 12 | Created Postman collection, environment, and `POSTMAN_TESTING.md` |
| 2026-06-29 | 13 | Scaffolded `client/` with Vite, React, Tailwind, and API service layer |
| 2026-06-29 | 14 | Built minimal UI — table, CRUD forms, search/filter/sort/pagination |
| 2026-06-29 | 15 | Added Render blueprint, deployment guide, production Postman env; CORS/index fixes |

---

## Files Created / Modified

### Backend (repo root)

| File | Phase | Status | Description |
|------|-------|--------|-------------|
| `README.md` | 17 | Exists | Placeholder (to be expanded in Phase 17) |
| `PROJECT_TRACKER.md` | — | ✅ Updated | Master spec & progress tracker |
| `package.json` | 1 | ✅ Created | Backend manifest, scripts, dependencies |
| `package-lock.json` | 1 | ✅ Created | Locked dependency versions |
| `.gitignore` | 1 | ✅ Created | Ignores `node_modules`, `.env`, logs, etc. |
| `.env` | 1 | ✅ Created | Local backend env (gitignored) |
| `.env.example` | 1 | ✅ Created | Backend env template |
| `server.js` | 2, 3, 4, 8, 11 | ✅ Updated | Express entry point; DB; routes; middleware; security |
| `config/security.js` | 11 | ✅ Created | Helmet, CORS, rate limiter configuration |
| `config/db.js` | 3 | ✅ Created | MongoDB Atlas connection via Mongoose |
| `routes/index.js` | 4 | ✅ Created | Main API router, mounts `/students` |
| `routes/studentRoutes.js` | 4, 7, 8, 9 | ✅ Complete | REST routes with ObjectId and body validation |
| `middleware/validateStudent.js` | 9 | ✅ Created | Create, update, patch validation via Mongoose schema |
| `models/Student.js` | 5 | ✅ Created | Mongoose schema with validation, unique USN/email, timestamps |
| `controllers/studentController.js` | 6, 10 | ✅ Updated | CRUD + advanced list query |
| `utils/buildStudentQuery.js` | 10 | ✅ Created | Search, filter, sort, pagination, field selection |
| `utils/apiResponse.js` | 6 | ✅ Created | Standardized success/error response helpers |
| `middleware/errorHandler.js` | 8, 11 | ✅ Updated | Global errors + CORS violation handling |
| `middleware/notFound.js` | 8 | ✅ Created | 404 handler for unknown routes |
| `middleware/logger.js` | 8 | ✅ Created | Request logging with duration |
| `middleware/validateObjectId.js` | 8 | ✅ Created | ObjectId param validation on `:id` routes |

### Postman (`postman/`)

| File | Phase | Status | Description |
|------|-------|--------|-------------|
| `postman/Student_Management_API.postman_collection.json` | 12 | ✅ Created | 22 requests across 4 folders with test scripts |
| `postman/Student_Management_API.postman_environment.json` | 12 | ✅ Created | Local env with `baseUrl` and `studentId` |
| `render.yaml` | 15 | ✅ Created | Render blueprint for backend web service |
| `deployment/RENDER_BACKEND.md` | 15 | ✅ Created | Step-by-step Render + Atlas deployment guide |
| `postman/Student_Management_API.postman_environment.production.json` | 15 | ✅ Created | Production Postman environment template |

### Frontend (`client/`)

| File | Phase | Status | Description |
|------|-------|--------|-------------|
| `client/package.json` | 13 | ✅ Created | Frontend manifest & scripts |
| `client/vite.config.js` | 13 | ✅ Created | Vite config with dev proxy to backend |
| `client/.env.example` | 13 | ✅ Created | `VITE_API_URL` template |
| `client/src/main.jsx` | 13 | ✅ Created | React entry point |
| `client/src/App.jsx` | 13, 14 | ✅ Complete | Main app with state management and CRUD flow |
| `client/src/constants/student.js` | 14 | ✅ Created | Form defaults, filter options, sort options |
| `client/src/components/Alert.jsx` | 14 | ✅ Created | Success/error alert messages |
| `client/src/components/ConfirmDialog.jsx` | 14 | ✅ Created | Delete confirmation modal |
| `client/src/components/Header.jsx` | 14 | ✅ Created | Title + API health indicator |
| `client/src/components/LoadingSpinner.jsx` | 14 | ✅ Created | Loading state |
| `client/src/components/Pagination.jsx` | 14 | ✅ Created | Page navigation |
| `client/src/components/SearchFilters.jsx` | 14 | ✅ Created | Search, branch, semester, CGPA, sort |
| `client/src/components/StudentForm.jsx` | 14 | ✅ Created | Create/edit student modal |
| `client/src/components/StudentTable.jsx` | 14 | ✅ Created | Student data table with actions |
| `client/src/services/studentService.js` | 13 | ✅ Created | All API calls to backend |
| `client/src/constants/api.js` | 13 | ✅ Created | API path constants |
| `client/src/utils/cn.js` | 13 | ✅ Created | Tailwind classname utility |
| `client/src/components/` | 14 | ✅ Complete | 8 UI components |
| `client/netlify.toml` or `client/vercel.json` | 16 | Pending | SPA routing & build config |

---

# Master Specification

## Primary Objective

Build a **complete, production-ready Student Management System** with:

- **Backend:** RESTful API using Node.js, Express.js, MongoDB Atlas, and Mongoose
- **Frontend:** Simple minimal UI in the same repo to showcase all API capabilities
- **Deployment:** Backend on **Render**, frontend on **Netlify** or **Vercel** — both from one GitHub repo

### Core Requirements

**Backend**
- Full CRUD Operations
- REST Architecture
- MVC Architecture
- MongoDB Atlas Integration
- Proper Validation
- Error Handling
- Security Middleware
- Search, Filter, Sorting & Pagination
- Postman Testing

**Frontend**
- Minimal, clean UI to demo the API
- Student list with pagination
- Create / edit / delete students
- Search, filter, and sort controls
- API error handling & loading states
- Environment-based API URL (`VITE_API_URL`)

**DevOps**
- Monorepo (single GitHub repo)
- GitHub Ready
- Render (backend) + Netlify/Vercel (frontend) deployment

---

## Technology Stack

| Category | Technologies |
|----------|-------------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose |
| **Frontend** | Vite, React, Tailwind CSS |
| **Security** | Helmet, CORS, express-rate-limit |
| **Development** | Nodemon, dotenv |
| **Testing** | Postman (backend), browser (frontend) |
| **Backend Deployment** | Render |
| **Frontend Deployment** | Netlify or Vercel |
| **Version Control** | Git & GitHub |

---

## Project Structure (Monorepo)

```text
labapiexp1/
│
├── client/                          # Frontend (Vite + React)
│   ├── public/
│   ├── src/
│   │   ├── components/              # UI components
│   │   ├── services/                # API service layer
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example                 # VITE_API_URL
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── netlify.toml / vercel.json   # Deploy config (Phase 16)
│
├── config/
│   └── db.js
│
├── controllers/
│   └── studentController.js
│
├── middleware/
│   ├── errorHandler.js
│   ├── notFound.js
│   ├── logger.js
│   └── validateObjectId.js
│
├── models/
│   └── Student.js
│
├── routes/
│   └── studentRoutes.js
│
├── utils/
│   └── apiResponse.js
│
├── .env                             # Backend env (gitignored)
├── .env.example
├── .gitignore
├── package.json                     # Backend manifest
├── server.js
├── PROJECT_TRACKER.md
└── README.md
```

---

## Student Model

| Field | Constraints |
|-------|-------------|
| `name` | Required |
| `usn` | Required, Unique |
| `email` | Required, Unique |
| `phone` | Required |
| `branch` | Required |
| `semester` | Required |
| `cgpa` | Required |
| `age` | Required |
| `gender` | Required |
| `address` | Required |

Additional: Required fields, validation rules, unique constraints, timestamps (`createdAt`, `updatedAt`).

---

## REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/students` | List students (with search, filter, sort, pagination) |
| `GET` | `/api/students/:id` | Get single student by ID |
| `POST` | `/api/students` | Create a new student |
| `PUT` | `/api/students/:id` | Full update of a student |
| `PATCH` | `/api/students/:id` | Partial update of a student |
| `DELETE` | `/api/students/:id` | Delete a student |

---

## Frontend UI Features (Minimal Showcase)

| Feature | UI Element |
|---------|------------|
| List students | Table / card grid with pagination |
| View student | Row click or detail view |
| Create student | Modal or form panel |
| Edit student | Pre-filled form (PUT/PATCH) |
| Delete student | Delete button with confirmation |
| Search | Input for name / USN |
| Filter | Dropdowns for branch, semester; input for CGPA |
| Sort | Column headers or sort dropdown |
| API status | Connection indicator using `/health` |
| Errors | Toast / inline messages from API responses |

---

## Advanced Features (Backend — surfaced in Frontend)

- Search by **name** or **USN**
- Filter by **branch**
- Filter by **semester**
- Filter by **CGPA**
- **Sorting** (query parameter)
- **Pagination** (`page`, `limit`)
- **Field selection** (sparse fieldsets)
- Proper query parameter handling

---

## Security

- Helmet (secure HTTP headers)
- CORS — allow `CLIENT_URL` (local + Netlify/Vercel production origin)
- Rate limiting (`express-rate-limit`)
- Environment variables (no hardcoded secrets)
- Secure headers
- Request validation
- JSON body size limit

---

## Error Handling

Handle and return proper JSON for:

- Validation errors
- Duplicate email (`409 Conflict`)
- Duplicate USN (`409 Conflict`)
- Invalid ObjectId (`400 Bad Request`)
- Missing resources (`404 Not Found`)
- Database errors
- Internal server errors (`500`)

---

## Response Format

### Success

```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

## HTTP Status Codes

| Code | Usage |
|------|-------|
| `200` | OK |
| `201` | Created |
| `204` | No Content (where appropriate) |
| `400` | Bad Request |
| `404` | Not Found |
| `409` | Conflict |
| `422` | Unprocessable Entity |
| `500` | Internal Server Error |

---

## Development Rules

1. Build **phase by phase** — never generate the entire project at once.
2. Only work on the **requested phase**.
3. Do not modify existing working code unless absolutely necessary.
4. If a file must be changed: explain why, preserve functionality, update only required sections.
5. Always keep the project in a **runnable state**.
6. Do not introduce breaking changes.
7. Use **ES Modules or CommonJS consistently** within each package (backend: CommonJS, frontend: ESM via Vite).
8. Every generated file must compile successfully — no placeholders or TODOs.
9. **Frontend API calls** must go through `client/src/services/` — never call APIs directly in components.

### Before Writing Code (Each Phase)

1. Explain what will be built.
2. Explain why it is required.
3. Explain how it integrates with the existing project.
4. List the files to be created or modified.

### After Each Phase

- Explain how to run the project.
- Explain how to test (Postman for backend, browser for frontend).
- Show sample requests and expected responses.
- Confirm previous features still work.

---

## Phase Details

### Phase 1 — Project Setup ✅
- Initialize npm project (backend at root)
- Install dependencies: `express`, `mongoose`, `dotenv`, `helmet`, `cors`, `express-rate-limit`
- Install dev dependencies: `nodemon`
- Create `.gitignore`, `.env` template
- Configure `package.json` scripts

### Phase 2 — Express Server ✅
- Create `server.js`
- Basic Express app with JSON middleware
- Health/root route
- Server listen on configurable port

### Phase 3 — MongoDB Connection
- Create `config/db.js`
- Connect to MongoDB Atlas via `MONGODB_URI`
- Handle connection events and errors

### Phase 4 — Folder Structure
- Create all MVC directories (backend)
- Wire up module exports

### Phase 5 — Student Model
- Define Mongoose schema with all fields
- Add validation, unique indexes, timestamps

### Phase 6 — Controllers
- Implement CRUD controller functions
- Use standardized API response utility

### Phase 7 — Routes
- Mount student routes at `/api/students`
- Connect routes to controllers

### Phase 8 — Middleware
- `errorHandler.js` — global error handler
- `notFound.js` — 404 handler
- `logger.js` — request logging
- `validateObjectId.js` — param validation
- `utils/apiResponse.js` — response helpers

### Phase 9 — Validation
- Input validation on create/update
- Mongoose schema validation integration

### Phase 10 — Search / Filter / Pagination
- Query building in `getStudents`
- Search, filter, sort, pagination, field selection

### Phase 11 — Security
- Helmet, CORS (allow `CLIENT_URL` + localhost:5173), rate limiting
- JSON body size limit
- Environment-based configuration

### Phase 12 — Postman Testing
- Document all endpoints
- Sample requests/responses
- Verify all CRUD + advanced features

### Phase 13 — Frontend Setup
- Scaffold `client/` with Vite + React + Tailwind
- Create `client/src/services/studentService.js`
- Configure `VITE_API_URL` in `.env.example`
- Optional Vite dev proxy to backend

### Phase 14 — Frontend UI
- Student table with pagination
- Add / edit / delete forms
- Search, filter, sort controls wired to API query params
- Loading states, error display, delete confirmation

### Phase 15 — Backend Deployment (Render)
- Render web service from repo root
- MongoDB Atlas production cluster
- Set `MONGODB_URI`, `CLIENT_URL`, `NODE_ENV=production`
- Verify `/health` and `/api/students` on Render URL

### Phase 16 — Frontend Deployment (Netlify or Vercel)
- Connect same GitHub repo
- Set base directory to `client/`
- Build: `npm run build` → publish `dist/`
- Set `VITE_API_URL` to Render backend URL
- Configure SPA fallback routing (`netlify.toml` or `vercel.json`)
- Update backend `CLIENT_URL` to Netlify/Vercel URL

### Phase 17 — Documentation & Final Review
- Professional `README.md` (backend + frontend + deployment)
- End-to-end testing (local + production)
- Viva Q&A preparation notes

---

## Environment Variables

### Backend (`.env` at repo root)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/student-management?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
JSON_BODY_LIMIT=10kb
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000
```

### Production

| Variable | Where | Example |
|----------|-------|---------|
| `MONGODB_URI` | Render | Atlas connection string |
| `CLIENT_URL` | Render | `https://student-mgmt.netlify.app` |
| `NODE_ENV` | Render | `production` |
| `VITE_API_URL` | Netlify/Vercel | `https://student-api.onrender.com` |

> Never commit `.env` files to version control.

---

## Local Development

```bash
# Terminal 1 — Backend
npm run dev

# Terminal 2 — Frontend (after Phase 13)
cd client && npm run dev
```

| Service | URL |
|---------|-----|
| Backend API | `http://localhost:5000` |
| Frontend UI | `http://localhost:5173` |
| Health check | `http://localhost:5000/health` |

---

## Deployment Checklist

### Backend — Render

- [x] MongoDB Atlas cluster connected (reuse existing)
- [ ] Database name set in URI (`student-management` recommended)
- [ ] Network access configured (`0.0.0.0/0` for Render)
- [ ] GitHub repository pushed
- [ ] Render web service created (use `render.yaml` or manual setup)
- [x] Build command: `npm install`
- [x] Start command: `npm start`
- [x] Health check path: `/health`
- [ ] Env vars set on Render: `MONGODB_URI`, `CLIENT_URL`, `NODE_ENV`
- [ ] `/health` responds on production Render URL

### Frontend — Netlify or Vercel

- [ ] Same GitHub repo connected
- [ ] Base directory: `client`
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Env var set: `VITE_API_URL` = Render backend URL
- [ ] SPA redirect configured (all routes → `index.html`)
- [ ] Backend `CLIENT_URL` updated to frontend production URL
- [ ] Full CRUD flow works in production browser

### Netlify vs Vercel

| | Netlify | Vercel |
|---|---------|--------|
| **Best for** | Static SPA, simple config | React apps, fast CDN |
| **Monorepo support** | Base directory setting | Root directory setting |
| **Config file** | `client/netlify.toml` | `client/vercel.json` |
| **Free tier** | Yes | Yes |

Both work equally well for this project. Pick one — config will be added in Phase 16.

---

## Viva Preparation Notes

_Section to be filled during Phase 17._

- REST principles demonstrated:
- MVC pattern explanation (backend):
- Frontend–backend separation & monorepo benefits:
- MongoDB/Mongoose concepts used:
- Security measures implemented (CORS, Helmet, rate limit):
- Error handling strategy:
- Deployment architecture (Render + Netlify/Vercel):
- Sample demo flow (UI → API → Database):

---

## Next Step

**Awaiting instruction to begin Phase 16: Frontend Deployment (Netlify or Vercel).**

Deploy backend on Render using `deployment/RENDER_BACKEND.md`, then proceed to Phase 16.
