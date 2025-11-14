# IPO Restaurant Management System

## ✅ QR Code Flow Complete!

Customers no longer need to login. The workflow is now:

1. **Manager** logs in → generates QR code for each table
2. **Customer** scans QR code → directly opens menu for that table
3. **Customer** browses menu, adds to cart, and places order (no login!)
4. **Chef** receives order → marks as Preparing/Ready
5. **Waiter** sees Ready notification → delivers and marks Served

## 🚀 Quick Start

### Option 1: One-Click Start (Recommended)

```powershell
.\start.ps1
```

This will automatically start both backend and frontend servers and open your browser.

### Option 2: Manual Start

Open 2 PowerShell windows:

**Terminal 1 - Backend:**

```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**

```powershell
cd frontend
npm run dev
```

Then open: http://localhost:3000

## 📱 How to Use

### 1. Login as Manager

- Go to http://localhost:3000
- Click "Register" if first time
- Create account with role "Manager"
- Email: manager@test.com
- Password: password123

### 2. Generate QR Codes

- In Manager panel, go to "QR" tab
- Enter table number (e.g., 1, 2, 3)
- QR code appears automatically
- Customer scans this QR → opens menu for that table

### 3. Customer Experience (No Login!)

- Scan QR code OR manually go to: http://localhost:3000/table/1
- Browse menu
- Add items to cart
- Click "Place Order"
- See real-time order status updates

### 4. Chef & Waiter Login

Create accounts for Chef and Waiter roles the same way.

## 🎯 Test the Flow

1. Open Manager panel → QR tab → generate QR for table 1
2. Open new browser tab → go to http://localhost:3000/table/1
3. Add items and place order
4. In Manager panel → Orders tab → see the new order
5. Login as Chef in another tab → see order → mark as Ready
6. Login as Waiter → see Ready notification → mark as Served

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + QR Code + Socket.IO
- **Backend**: Node.js + Express + MongoDB (in-memory) + Socket.IO
- **Real-time**: Socket.IO namespaces for instant updates
- **Auth**: JWT (only for Manager/Chef/Waiter, not customers!)

## 📝 API Endpoints

### Public (No Auth)

- `GET /manager/menu/public` - Get menu items
- `POST /orders/public` - Place order (for QR customers)

### Protected (Requires Auth)

- `POST /auth/register` - Register user
- `POST /auth/login` - Login
- `POST /manager/menu` - Add menu item (Manager only)
- `GET /manager/menu` - Get menu (Manager only)
- `GET /orders` - Get orders (role-filtered)
- `PATCH /orders/:id/status` - Update order status (Chef/Waiter)

## 🔗 URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- Customer (Table 1): http://localhost:3000/table/1
- Customer (Table 2): http://localhost:3000/table/2

## 🎨 Next Steps (Optional)

- Add payment integration (Razorpay)
- Add AI recommendations endpoint
- Add voice ordering (Whisper + GPT-4)
- Deploy to production
- Add more analytics charts

---

**Enjoy your IPO Restaurant Management System!** 🍽️
