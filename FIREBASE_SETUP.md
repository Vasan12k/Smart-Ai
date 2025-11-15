# Firebase Setup Guide

## 🔥 AI Restaurant - Firebase Configuration

The project has been migrated from MongoDB to **Firebase Firestore**.

---

## For Local Development (Demo Mode)

The app works out-of-the-box with a demo Firebase project ID:

```env
FIREBASE_PROJECT_ID=demo-ai-restaurant
```

**No additional setup needed** for local testing!

---

## For Production (Real Firebase Project)

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name (e.g., "ai-restaurant")
4. Follow the setup wizard

### 2. Enable Firestore Database

1. In Firebase Console, go to **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location (e.g., asia-south1)
5. Click **"Enable"**

### 3. Get Service Account Key

1. Go to **Project Settings** (gear icon)
2. Click on **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Save the downloaded JSON file securely

### 4. Configure Environment Variables

**Option A: Using Service Account JSON (Recommended for Production)**

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id",...}
```

**Option B: Using Project ID Only (Development)**

```env
FIREBASE_PROJECT_ID=your-project-id
```

---

## Firestore Collections Structure

### `users` Collection

```javascript
{
  name: "string",
  email: "string",
  passwordHash: "string",
  role: "manager" | "chef" | "waiter" | "customer",
  createdAt: "ISO 8601 timestamp"
}
```

### `foodItems` Collection

```javascript
{
  name: "string",
  category: "string",
  price: number,
  imageUrl: "string",
  inStock: number,
  createdAt: "ISO 8601 timestamp"
}
```

### `orders` Collection

```javascript
{
  tableNumber: number,
  items: [
    {
      food: "string (food item ID)",
      name: "string",
      price: number,
      qty: number
    }
  ],
  customerId: "string (user ID, optional)",
  status: "received" | "preparing" | "ready" | "served" | "completed",
  payment: {
    method: "cash" | "online",
    paid: boolean,
    razorpayPaymentId: "string (optional)"
  },
  createdAt: "ISO 8601 timestamp"
}
```

---

## Security Rules (For Production)

In Firestore Rules, set appropriate security:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Food items - public read
    match /foodItems/{itemId} {
      allow read: true;
      allow write: if request.auth != null; // Authenticated users only
    }

    // Orders
    match /orders/{orderId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null || true; // Allow public orders
      allow update: if request.auth != null;
    }
  }
}
```

---

## Migration Benefits

✅ **No Infrastructure Management** - Firebase handles scaling  
✅ **Real-time Sync** - Built-in real-time updates  
✅ **Free Tier** - 1GB storage, 50K reads/day free  
✅ **Global CDN** - Low latency worldwide  
✅ **Easy Authentication** - Built-in auth system

---

## Testing

Start the server:

```bash
npm start
```

You should see:

```
✅ Firebase Firestore initialized successfully
🚀 Server running on port 4000
📁 Database: Firebase Firestore
```

---

## Troubleshooting

**Issue**: "Failed to initialize Firebase"

- **Solution**: Check your `FIREBASE_PROJECT_ID` or service account JSON

**Issue**: "Permission denied" errors

- **Solution**: Update Firestore security rules in Firebase Console

**Issue**: "Quota exceeded"

- **Solution**: Upgrade to Firebase Blaze (pay-as-you-go) plan

---

## Resources

- [Firebase Firestore Docs](https://firebase.google.com/docs/firestore)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Pricing](https://firebase.google.com/pricing)
