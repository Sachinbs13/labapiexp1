# Frontend Deployment — Netlify or Vercel

Deploy the React frontend from the **`client/`** directory. Use the same GitHub repo as the backend.

---

## Prerequisites

- [x] Frontend builds locally (`cd client && npm run build`)
- [ ] Backend deployed on Render (Phase 15)
- [ ] Render backend URL available (e.g. `https://student-management-api.onrender.com`)
- [ ] GitHub repository pushed

---

## Important — Environment Variable

Vite embeds env vars at **build time**. Set this on Netlify/Vercel:

```env
VITE_API_URL=https://YOUR-RENDER-URL.onrender.com
```

No trailing slash.

---

## Option A — Netlify (Recommended)

Uses `netlify.toml` at repo root.

### Step 1 — Connect repo

1. https://app.netlify.com → **Add new site** → **Import an existing project**
2. Connect GitHub → select `labapiexp1`
3. Netlify reads `netlify.toml` automatically:

| Setting | Value |
|---------|-------|
| Base directory | `client` |
| Build command | `npm run build` |
| Publish directory | `client/dist` |

### Step 2 — Environment variables

Netlify → **Site configuration** → **Environment variables**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://YOUR-RENDER-URL.onrender.com` |

### Step 3 — Deploy

Click **Deploy site**. Note your URL:

```text
https://random-name.netlify.app
```

### Step 4 — Update Render CORS

On Render → backend service → **Environment** → update `CLIENT_URL`:

```env
CLIENT_URL=http://localhost:5173,http://localhost:5174,https://random-name.netlify.app
```

Redeploy backend on Render after changing `CLIENT_URL`.

---

## Option B — Vercel

Uses `client/vercel.json`.

### Step 1 — Connect repo

1. https://vercel.com → **Add New Project**
2. Import `labapiexp1` from GitHub
3. Configure:

| Setting | Value |
|---------|-------|
| **Root Directory** | `client` |
| **Framework Preset** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### Step 2 — Environment variables

Vercel → **Settings** → **Environment Variables**:

| Key | Value | Environments |
|-----|-------|--------------|
| `VITE_API_URL` | `https://YOUR-RENDER-URL.onrender.com` | Production, Preview |

### Step 3 — Deploy

Click **Deploy**. Note your URL:

```text
https://labapiexp1.vercel.app
```

### Step 4 — Update Render CORS

```env
CLIENT_URL=http://localhost:5173,http://localhost:5174,https://labapiexp1.vercel.app
```

Redeploy backend on Render.

---

## Verify Production End-to-End

1. Open frontend URL in browser
2. Confirm student list loads (may take ~30s if Render was sleeping)
3. **Add Student** → create a record
4. Test search, filters, edit, delete
5. Check browser DevTools → Network — API calls go to Render URL

### Quick API test from browser console

```javascript
fetch('https://YOUR-RENDER-URL.onrender.com/health')
  .then((r) => r.json())
  .then(console.log);
```

---

## SPA Routing

Both configs redirect all routes to `index.html` so client-side routing works:

- **Netlify:** `netlify.toml` redirects
- **Vercel:** `client/vercel.json` rewrites

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank page after deploy | Check build logs; verify `npm run build` succeeds |
| API calls fail (CORS) | Add Netlify/Vercel URL to Render `CLIENT_URL` |
| API calls go to `localhost` | `VITE_API_URL` not set — rebuild after adding env var |
| Network error on first load | Render free tier cold start — wait 30–60s, retry |
| 404 on refresh | SPA redirect missing — check `netlify.toml` or `vercel.json` |

---

## Netlify vs Vercel

| | Netlify | Vercel |
|---|---------|--------|
| Config file | `netlify.toml` (repo root) | `client/vercel.json` |
| Monorepo | `base = "client"` in toml | Root Directory = `client` |
| Free HTTPS | Yes | Yes |
| Auto deploy on push | Yes | Yes |

---

## Files Added (Phase 16)

| File | Purpose |
|------|---------|
| `netlify.toml` | Netlify build & SPA redirect config |
| `client/vercel.json` | Vercel build & SPA rewrite config |
| `deployment/FRONTEND_DEPLOYMENT.md` | This guide |

---

## Next Step

**Phase 17** — Final `README.md`, viva preparation, and full production verification.
