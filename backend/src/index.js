require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { initSocket } = require("./socket");

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

const { MongoMemoryServer } = require("mongodb-memory-server");

const start = async () => {
  let mongod = null;

  // Check if external MongoDB URI is configured
  const MONGO_URI = process.env.MONGO_URI;

  if (MONGO_URI) {
    try {
      // Try external connection if URI is provided
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ Connected to MongoDB:", MONGO_URI);
    } catch (err) {
      console.warn("⚠️  Could not connect to external MongoDB:", err.message);
      console.log("📦 Starting in-memory MongoDB...");
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ Connected to in-memory MongoDB");
    }
  } else {
    // No external URI, use in-memory directly
    console.log(
      "📦 No external MongoDB configured, using in-memory database..."
    );
    try {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ Connected to in-memory MongoDB:", uri);
    } catch (err2) {
      console.error("❌ Error starting in-memory MongoDB:", err2);
      process.exit(1);
    }
  }

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  // On process exit, stop in-memory server if used
  process.on("SIGINT", async () => {
    if (mongod) await mongod.stop();
    process.exit(0);
  });
};

start();

module.exports = { app, server, io };
