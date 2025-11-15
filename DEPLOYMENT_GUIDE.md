# AI Restaurant Deployment Guide

## Prerequisites

✅ Vercel CLI installed
✅ Firebase project configured (ai-website-df9b4)
✅ Groq API key ready

## Deployment Steps

### 1. Deploy Backend to Vercel

```bash
cd backend
vercel --prod
```

**During deployment, set these environment variables:**

- `GROQ_API_KEY`: Your Groq API key (gsk\_...)
- `JWT_SECRET`: ai-restaurant-secret-2024
- `PORT`: 4000
- `FIREBASE_PROJECT_ID`: ai-website-df9b4
- `NODE_ENV`: production

**Note:** You'll need to upload `serviceAccountKey.json` as a Vercel secret or use Firebase Admin SDK environment variables.

### 2. Deploy Frontend to Vercel

```bash
cd frontend
vercel --prod
```

**Update frontend/.env with backend URL:**

```
VITE_API_URL=https://your-backend-url.vercel.app
```

### 3. Alternative: Deploy with Docker

Build and run using Docker Compose:

```bash
# From project root
docker-compose up -d
```

This will start:

- Backend on port 4000
- Frontend on port 3000
- MongoDB on port 27017

### 4. Deploy to Render.com (Alternative)

**Backend:**

1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repo
4. Build command: `cd backend && npm install`
5. Start command: `cd backend && npm start`
6. Add environment variables

**Frontend:**

1. Create new Static Site
2. Build command: `cd frontend && npm run build`
3. Publish directory: `frontend/dist`

### 5. Deploy to Railway.app (Alternative)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway init
railway up

# Deploy frontend
cd frontend
railway init
railway up
```

## Post-Deployment Checklist

- [ ] Update CORS origins in backend
- [ ] Update API URL in frontend
- [ ] Test all user roles (Customer, Chef, Waiter, Manager)
- [ ] Test voice ordering with Groq AI
- [ ] Verify Firebase database connection
- [ ] Test real-time Socket.IO updates
- [ ] Check mobile responsiveness

## Environment Variables Required

### Backend

```env
GROQ_API_KEY=your-groq-key
JWT_SECRET=ai-restaurant-secret-2024
PORT=4000
FIREBASE_PROJECT_ID=ai-website-df9b4
NODE_ENV=production
```

### Frontend

```env
VITE_API_URL=https://your-backend-url.vercel.app
```

## Quick Deploy Commands

### Vercel (Fastest)

```bash
# Backend
cd backend && vercel --prod

# Frontend
cd frontend && vercel --prod
```

### Docker (Local + Production)

```bash
docker-compose up -d
```

## Troubleshooting

### CORS Issues

Add your frontend domain to backend CORS configuration in `src/index.js`:

```javascript
const cors = require("cors");
app.use(
  cors({
    origin: ["https://your-frontend-url.vercel.app"],
    credentials: true,
  })
);
```

### Firebase Connection Issues

- Ensure `serviceAccountKey.json` is properly configured
- Check Firebase project ID matches
- Verify Firestore is enabled in Firebase Console

### Socket.IO Issues

- Update Socket.IO connection URL in frontend
- Check WebSocket support on hosting platform
- Vercel supports WebSockets on Pro plan

## Production URLs

After deployment, you'll have:

- **Backend API**: `https://ai-restaurant-backend.vercel.app`
- **Frontend App**: `https://ai-restaurant.vercel.app`
- **Admin Panel**: `https://ai-restaurant.vercel.app/login` (role: manager)

## Security Checklist

- [ ] Remove all API keys from code
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS
- [ ] Set secure JWT secret
- [ ] Configure proper CORS
- [ ] Rate limit API endpoints
- [ ] Validate all user inputs

## Support

For issues, check:

- Vercel deployment logs
- Browser console for frontend errors
- Firebase Console for database issues
- Groq API dashboard for AI requests

---

**Last Updated:** November 15, 2025
**Project:** AI Restaurant Management System
