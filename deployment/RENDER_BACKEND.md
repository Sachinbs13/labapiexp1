# Backend Deployment — Render + MongoDB Atlas

Deploy the Express API from the **repo root** (`/`). Reuse your existing MongoDB Atlas cluster.

---

## Prerequisites

- [x] Backend working locally (`npm run dev`)
- [x] MongoDB Atlas cluster connected
- [ ] GitHub repository pushed
- [ ] Render account — https://render.com

---

## Step 1 — Prepare MongoDB Atlas

Reuse your existing cluster. No new cluster needed.

### Database name

Use a named database in your connection string (not default `test`):

```text
mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/student-management?retryWrites=true&w=majority
```

### Network access

In Atlas → **Network Access** → allow:

- `0.0.0.0/0` (allow from anywhere — required for Render free tier)

Or add Render's IP ranges if you restrict access.

### Database user

Use an existing user or create one with **readWrite** on your database.

---

## Step 2 — Push to GitHub

```bash
cd /Users/prathameshpatil/Drive/RVCE/API/labapiexp1
git add .
git commit -m "Prepare backend for Render deployment"
git push -u origin main
```

> Never commit `.env`. Secrets go only on Render.

---

## Step 3 — Create Render Web Service

### Option A — Blueprint (`render.yaml`)

1. Render Dashboard → **New** → **Blueprint**
2. Connect your GitHub repo
3. Render reads `render.yaml` from repo root
4. Set secret env vars when prompted: `MONGODB_URI`, `CLIENT_URL`

### Option B — Manual setup

1. Render Dashboard → **New** → **Web Service**
2. Connect GitHub repo `labapiexp1`
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `student-management-api` |
| **Root Directory** | *(leave empty — repo root)* |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Health Check Path** | `/health` |

---

## Step 4 — Environment Variables on Render

In Render → your service → **Environment**:

| Variable | Value | Required |
|----------|-------|----------|
| `NODE_ENV` | `production` | Yes |
| `MONGODB_URI` | Your Atlas connection string | Yes |
| `CLIENT_URL` | `http://localhost:5173,http://localhost:5174` (add Netlify URL after Phase 16) | Yes |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Optional |
| `RATE_LIMIT_MAX` | `100` | Optional |
| `JSON_BODY_LIMIT` | `10kb` | Optional |

> `PORT` is set automatically by Render — do not override it.

### Example `CLIENT_URL` after frontend deploy (Phase 16)

```env
CLIENT_URL=http://localhost:5173,http://localhost:5174,https://your-app.netlify.app
```

---

## Step 5 — Deploy & Verify

After deploy completes, note your URL:

```text
https://student-management-api.onrender.com
```

### Health check

```bash
curl https://YOUR-RENDER-URL.onrender.com/health
```

**Expected (200):**

```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "database": { "status": "connected", ... }
  }
}
```

### API info

```bash
curl https://YOUR-RENDER-URL.onrender.com/api
```

### Create student (Postman or curl)

```bash
curl -X POST https://YOUR-RENDER-URL.onrender.com/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "usn": "1RV22CS099",
    "email": "test@rvce.edu",
    "phone": "9876543210",
    "branch": "CSE",
    "semester": 6,
    "cgpa": 8.5,
    "age": 20,
    "gender": "Male",
    "address": "RVCE Campus, Bangalore"
  }'
```

---

## Step 6 — Update Postman for Production

1. Duplicate environment: **Student Management API - Production**
2. Set `baseUrl` = `https://YOUR-RENDER-URL.onrender.com`
3. Run the collection

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check `package.json` has `start` script |
| DB connection fails | Verify `MONGODB_URI`, Atlas network access `0.0.0.0/0` |
| 503 on `/health` | MongoDB not connected — check URI and credentials |
| CORS errors from frontend | Add frontend URL to `CLIENT_URL` on Render |
| Cold start slow | Render free tier spins down after inactivity (~50s first request) |
| Service crashes on start | Check Render logs → **Logs** tab |

---

## Render Free Tier Notes

- Service sleeps after ~15 min inactivity
- First request after sleep may take 30–60 seconds
- HTTPS included automatically
- Custom domain available on paid plans

---

## Next Step

**Phase 16** — Deploy frontend to Netlify/Vercel and set:

```env
VITE_API_URL=https://YOUR-RENDER-URL.onrender.com
```

Then update Render `CLIENT_URL` with your Netlify/Vercel URL.
