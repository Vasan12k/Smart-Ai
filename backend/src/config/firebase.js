const admin = require("firebase-admin");

// Initialize Firebase Admin
// For development, you can use a service account key JSON file
// For production, use environment variables or secure storage

let db;

const initializeFirebase = () => {
  try {
    // Check if already initialized
    if (admin.apps.length > 0) {
      db = admin.firestore();
      return db;
    }

    // Try to load service account from file
    try {
      const serviceAccount = require("../../serviceAccountKey.json");
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("✅ Firebase initialized with service account");
    } catch (fileError) {
      // Fallback to environment variable or project ID
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        console.log("✅ Firebase initialized with environment credentials");
      } else if (process.env.FIREBASE_PROJECT_ID) {
        admin.initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID,
        });
        console.log("⚠️  Firebase initialized with project ID only");
      } else {
        throw new Error("No Firebase credentials found");
      }
    }

    db = admin.firestore();
    return db;
  } catch (error) {
    console.error("❌ Error initializing Firebase:", error.message);
    throw error;
  }
};

const getDb = () => {
  if (!db) {
    return initializeFirebase();
  }
  return db;
};

module.exports = { initializeFirebase, getDb, admin };
