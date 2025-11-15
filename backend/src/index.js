require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { initSocket } = require("./socket");
const { initializeFirebase } = require("./config/firebase");

const authRoutes = require("./routes/auth");
const managerRoutes = require("./routes/manager");
const ordersRoutes = require("./routes/orders");
const recommendationsRoutes = require("./routes/recommendations");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/manager", managerRoutes);
app.use("/orders", ordersRoutes);
app.use("/ai", recommendationsRoutes);

// serve demo static client pages for quick testing
const path = require("path");
app.use(express.static(path.join(__dirname, "../public")));

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
const io = initSocket(server);

const start = async () => {
  try {
    // Initialize Firebase Firestore
    initializeFirebase();
    console.log("✅ Firebase Firestore initialized successfully");
  } catch (err) {
    console.error("❌ Error initializing Firebase:", err);
    process.exit(1);
  }

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📁 Database: Firebase Firestore`);
  });

  // Graceful shutdown
  process.on("SIGINT", async () => {
    console.log("\n🛑 Shutting down server...");
    process.exit(0);
  });
};

start();

module.exports = { app, server, io };
