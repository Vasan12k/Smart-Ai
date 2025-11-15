# AI Restaurant - Smart Restaurant Management System

Full-stack AI-powered restaurant management system with real-time ordering, role-based access, and responsive UI.

## ✅ Completed Features

### Backend

- ✅ Express + MongoDB + Socket.IO server
- ✅ JWT authentication with role-based middleware
- ✅ User, FoodItem, Order models
- ✅ Auth routes (/auth/register, /auth/login)
- ✅ Manager routes (menu CRUD)
- ✅ Orders routes (create, list, update status)
- ✅ Socket.IO namespaces (/chef, /waiter, /manager, /table:<id>)
- ✅ Real-time order events (new_order, order_status_changed, order_update)
- ✅ In-memory MongoDB fallback (no Docker required for dev)

### Frontend

- ✅ React + Vite + Tailwind CSS
- ✅ React Router with protected routes
- ✅ AuthContext with JWT storage
- ✅ Login/Register pages
- ✅ Manager Panel (menu CRUD, QR generation, orders, analytics with Recharts)
- ✅ Chef Panel (incoming orders, status updates, real-time Socket.IO)
- ✅ Waiter Panel (ready notifications, mark served)
- ✅ Customer Panel (menu browse, cart, order placement, real-time tracking)
- ✅ Responsive mobile-first design
- ✅ Socket.IO client integration for all roles

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm

### 1. Backend Setup

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

Backend starts on http://localhost:4000

### 2. Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

Frontend starts on http://localhost:3000

## 📱 Usage

### Register Users

1. Go to http://localhost:3000/login
2. Click Register
3. Create accounts for each role (Manager, Chef, Waiter, Customer)

### Workflows

- **Manager**: Add menu items, generate QR codes, view orders & analytics
- **Customer**: Browse menu, add to cart, place order, track status
- **Chef**: View orders, mark as Preparing/Ready
- **Waiter**: Receive ready notifications, mark as Served

## 🔧 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Socket.IO Client, Recharts
- **Backend**: Node.js, Express, MongoDB (in-memory fallback), Socket.IO, JWT
- **Real-time**: Socket.IO with role-based namespaces

See backend/README.md and frontend/README.md for more details.
