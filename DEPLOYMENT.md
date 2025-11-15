# AI Restaurant - Cloud Deployment Guide

## Quick Deploy (Free)

### Backend - Railway.app

1. **Create account**: https://railway.app (Login with GitHub)

2. **Deploy Backend**:

   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login
   railway login

   # Deploy backend
   cd backend
   railway init
   railway up
   ```

3. **Add MongoDB**:

   - In Railway dashboard, click "New" → "Database" → "MongoDB"
   - Copy the connection string
   - Add to environment variables: `MONGO_URI=<your-connection-string>`

4. **Set Environment Variables** in Railway dashboard:

   ```
   JWT_SECRET=your-super-secret-key-change-this
   PORT=4000
   NODE_ENV=production
   ```

5. **Get your backend URL**: `https://your-app.railway.app`

---

### Frontend - Vercel

1. **Create account**: https://vercel.com (Login with GitHub)

2. **Update API endpoint** in `frontend/vite.config.js`:

   ```javascript
   proxy: {
     "/auth": "https://your-backend.railway.app",
     "/manager": "https://your-backend.railway.app",
     "/orders": "https://your-backend.railway.app",
     "/payments": "https://your-backend.railway.app",
     "/recommendations": "https://your-backend.railway.app"
   }
   ```

3. **Deploy Frontend**:

   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Login
   vercel login

   # Deploy
   cd frontend
   vercel
   ```

4. **Get your frontend URL**: `https://your-app.vercel.app`

---

## Alternative: Render.com (All-in-one)

### Backend on Render

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Settings:

   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/index.js`
   - **Environment**: Node

5. Add Environment Variables:
   ```
   MONGO_URI=<your-mongo-connection>
   JWT_SECRET=your-secret-key
   PORT=4000
   ```

### Frontend on Render

1. Click "New +" → "Static Site"
2. Settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

---

## Update QR Codes

After deployment, update `frontend/src/pages/Manager.jsx`:

```javascript
// Replace network IP with your deployed URL
value={`https://your-app.vercel.app/table/${tableNum}`}
```

---

## MongoDB Atlas (Free Database)

1. Create account: https://www.mongodb.com/cloud/atlas
2. Create free cluster (M0)
3. Add database user
4. Whitelist IP: `0.0.0.0/0` (allow all)
5. Get connection string
6. Add to backend environment variables

---

## Final Steps

1. ✅ Deploy backend to Railway/Render
2. ✅ Deploy frontend to Vercel/Render
3. ✅ Setup MongoDB Atlas
4. ✅ Update environment variables
5. ✅ Update QR codes with production URL
6. ✅ Test from any phone/network!

Your restaurant system will work from anywhere in the world! 🌍
