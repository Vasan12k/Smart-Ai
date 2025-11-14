# IPO Restaurant - Step-by-Step Cloud Deployment

## இப்போது செய்ய வேண்டியவை:

### Step 1: MongoDB Atlas Setup (Free Database)

1. **Create MongoDB Account**:

   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up (free)

2. **Create Cluster**:

   - Click "Build a Database"
   - Choose "M0 FREE" option
   - Select region closest to you (Singapore/Mumbai)
   - Click "Create Cluster"

3. **Setup Access**:

   - Username: `ipo_admin`
   - Password: Create a strong password (save it!)
   - Click "Create Database User"

4. **Network Access**:

   - Click "Network Access" → "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**:
   - Click "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://ipo_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ipo_restaurant?retryWrites=true&w=majority`

---

### Step 2: Deploy Backend (Railway.app - FREE)

1. **Create Railway Account**:

   - Go to: https://railway.app
   - Click "Login" → "Login with GitHub"

2. **Deploy Backend**:

   - Click "New Project" → "Deploy from GitHub repo"
   - Select your IPO project (or upload folder)
   - Root Directory: `backend`
   - Build Command: (leave empty)
   - Start Command: `npm start`

3. **Add Environment Variables**:

   - Click your service → "Variables"
   - Add these:
     ```
     MONGO_URI=<your-mongodb-connection-string-from-step1>
     JWT_SECRET=ipo-restaurant-secret-key-2025
     PORT=4000
     NODE_ENV=production
     ```

4. **Generate Domain**:
   - Click "Settings" → "Generate Domain"
   - Copy your backend URL (e.g., `https://ipo-backend-production.up.railway.app`)

---

### Step 3: Deploy Frontend (Vercel - FREE)

1. **Create Vercel Account**:

   - Go to: https://vercel.com/signup
   - Sign up with GitHub

2. **Import Project**:

   - Click "Add New" → "Project"
   - Import your IPO repository
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variable**:

   - Go to "Settings" → "Environment Variables"
   - Add:
     ```
     VITE_API_URL=<your-railway-backend-url>
     ```
     Example: `https://ipo-backend-production.up.railway.app`

4. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Copy your frontend URL (e.g., `https://ipo-restaurant.vercel.app`)

---

### Step 4: Update Code for Production

You need to update the QR codes to use production URL:

Open `frontend/src/pages/Manager.jsx` and change line ~237:

```javascript
// OLD (local):
value={
  window.location.hostname === 'localhost'
    ? `http://10.205.196.96:3000/table/${tableNum}`
    : `${window.location.origin}/table/${tableNum}`
}

// NEW (production):
value={`https://YOUR-VERCEL-URL.vercel.app/table/${tableNum}`}
```

---

### Step 5: Update Frontend API Configuration

Open `frontend/vite.config.js` and update for production:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: "0.0.0.0",
    proxy: {
      "/auth": "https://YOUR-RAILWAY-URL.railway.app",
      "/manager": "https://YOUR-RAILWAY-URL.railway.app",
      "/orders": "https://YOUR-RAILWAY-URL.railway.app",
      "/payments": "https://YOUR-RAILWAY-URL.railway.app",
      "/recommendations": "https://YOUR-RAILWAY-URL.railway.app",
    },
  },
});
```

---

## Alternative: One-Click Deploy with Render.com

### Backend:

1. Go to https://render.com
2. "New +" → "Web Service"
3. Connect GitHub
4. Settings:

   - Name: `ipo-backend`
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
   - Plan: Free

5. Environment Variables (same as Railway)

### Frontend:

1. "New +" → "Static Site"
2. Settings:
   - Name: `ipo-frontend`
   - Root Directory: `frontend`
   - Build: `npm install && npm run build`
   - Publish: `dist`
   - Plan: Free

---

## Final Testing

1. ✅ Open your Vercel URL: `https://your-app.vercel.app`
2. ✅ Login as Manager
3. ✅ Add food items
4. ✅ Go to QR Codes section
5. ✅ Scan from ANY phone (different WiFi) - Should work! 📱
6. ✅ Place order from phone
7. ✅ Check Chef/Waiter panels

---

## Cost: 100% FREE! 🎉

- MongoDB Atlas: M0 Free (512MB)
- Railway: 500 free hours/month
- Vercel: Unlimited free hosting

எங்கிருந்தும் scan செய்யலாம் - different WiFi, mobile data, anywhere! 🌍
