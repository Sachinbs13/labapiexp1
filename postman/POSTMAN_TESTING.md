# Postman Testing Guide — Student Management API

## Prerequisites

1. Server running: `npm run dev`
2. Valid `MONGODB_URI` in `.env`
3. [Postman](https://www.postman.com/downloads/) installed

---

## Import Collection & Environment

1. Open Postman
2. **Import** → select both files from `postman/`:
   - `Student_Management_API.postman_collection.json`
   - `Student_Management_API.postman_environment.json`
3. Select environment: **Student Management API - Local**
4. Verify `baseUrl` = `http://localhost:5000` (change if using another port)

---

## Collection Structure

| Folder | Requests | Purpose |
|--------|----------|---------|
| **Health & Info** | 3 | Root, health check, API info |
| **Students - CRUD** | 6 | Full create → read → update → delete flow |
| **Search, Filter & Pagination** | 8 | Advanced query features |
| **Error Cases** | 5 | Validation, 404, 409, 400 errors |

**Total: 22 requests**

---

## Recommended Test Order

### Step 1 — Health & Info

| # | Request | Expected |
|---|---------|----------|
| 1 | Root - API Status | 200 |
| 2 | Health Check | 200 (or 503 if DB disconnected) |
| 3 | API Info | 200 |

### Step 2 — CRUD Flow (run in order)

| # | Request | Expected | Notes |
|---|---------|----------|-------|
| 1 | Create Student | 201 | Saves `studentId` to environment |
| 2 | Get All Students | 200 | Includes pagination metadata |
| 3 | Get Student By ID | 200 | Uses saved `studentId` |
| 4 | Patch Student | 200 | Updates cgpa & semester |
| 5 | Update Student (PUT) | 200 | Full document replace |
| 6 | Delete Student | 200 | Removes test student |

> Re-run **Create Student** before testing Error Cases that need existing data.

### Step 3 — Search, Filter & Pagination

Create 2–3 students with different branches/semesters first, then test:

- `GET /api/students?search=1RV22`
- `GET /api/students?branch=CSE`
- `GET /api/students?semester=6`
- `GET /api/students?minCgpa=8&maxCgpa=10`
- `GET /api/students?sort=-cgpa`
- `GET /api/students?page=1&limit=5`
- `GET /api/students?fields=name,usn,cgpa`
- `GET /api/students?branch=CSE&semester=6&sort=name&page=1&limit=10`

### Step 4 — Error Cases

| Request | Expected | Status |
|---------|----------|--------|
| Route Not Found | `Cannot GET /api/unknown` | 404 |
| Invalid ObjectId | Invalid student ID | 400 |
| Missing Fields | Validation failed | 422 |
| Duplicate USN | Conflict (run after Create) | 409 |
| Invalid Query Param | semester must be 1-8 | 400 |

---

## Run Entire Collection

1. Click collection **Student Management API**
2. Click **Run** (Collection Runner)
3. Select all folders
4. Click **Run Student Management API**

> **Note:** CRUD folder deletes the student at the end. Error Cases like Duplicate USN require a student to exist — run Create Student first or run Error Cases before Delete.

---

## Sample Requests & Responses

### Create Student — `POST /api/students`

**Request body:**

```json
{
  "name": "Prathamesh Patil",
  "usn": "1RV22CS001",
  "email": "prathamesh@rvce.edu",
  "phone": "9876543210",
  "branch": "CSE",
  "semester": 6,
  "cgpa": 8.5,
  "age": 20,
  "gender": "Male",
  "address": "RVCE Campus, Mysore Road, Bangalore"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "student": {
      "_id": "665f1a2b3c4d5e6f7a8b9c0d",
      "name": "Prathamesh Patil",
      "usn": "1RV22CS001",
      "email": "prathamesh@rvce.edu",
      "phone": "9876543210",
      "branch": "CSE",
      "semester": 6,
      "cgpa": 8.5,
      "age": 20,
      "gender": "Male",
      "address": "RVCE Campus, Mysore Road, Bangalore",
      "createdAt": "2026-06-29T10:00:00.000Z",
      "updatedAt": "2026-06-29T10:00:00.000Z"
    }
  }
}
```

### List Students — `GET /api/students?page=1&limit=10`

**Response (200):**

```json
{
  "success": true,
  "message": "Students fetched successfully",
  "data": {
    "count": 1,
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "students": [ ... ]
  }
}
```

### Validation Error — `POST /api/students` (missing fields)

**Response (422):**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "usn is required",
    "email is required",
    "phone is required"
  ]
}
```

### Duplicate USN — `POST /api/students`

**Response (409):**

```json
{
  "success": false,
  "message": "Duplicate usn value",
  "errors": ["USN already exists"]
}
```

---

## Automated Tests

The collection includes Postman test scripts that verify:

- HTTP status codes
- `success` field in responses
- Pagination metadata on list endpoint
- Auto-save `studentId` after create
- Error response structure

Green checkmarks in Collection Runner = tests passed.

---

## Production Testing

After Render deployment (Phase 15):

1. Duplicate the environment
2. Rename to **Student Management API - Production**
3. Set `baseUrl` to your Render URL (e.g. `https://student-api.onrender.com`)
4. Re-run the collection

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Connection refused | Start server with `npm run dev` |
| 503 on /health | Check `MONGODB_URI` in `.env` |
| 409 on Create | Change `usn` or `email` — already exists |
| `studentId` empty on Get By ID | Run Create Student first |
| Port in use | Change `PORT` in `.env` and update `baseUrl` |
