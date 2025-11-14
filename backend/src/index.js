require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { initSocket } = require("./socket");

const authRoutes = require("./routes/auth");
const managerRoutes = require("./routes/manager");
const ordersRoutes = require("./routes/orders");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/manager", managerRoutes);
app.use("/orders", ordersRoutes);

// serve demo static client pages for quick testing
const path = require("path");
app.use(express.static(path.join(__dirname, "../public")));

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
const io = initSocket(server);

const { MongoMemoryServer } = require("mongodb-memory-server");

const start = async () => {
  let MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ipo";
  let mongod = null;
  try {
    // Try normal connection first
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB:", MONGO_URI);
  } catch (err) {
    console.warn("Could not connect to configured MongoDB at", MONGO_URI);
    console.warn(
      "Falling back to in-memory MongoDB for development. Error:",
      err.message
    );
    try {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to in-memory MongoDB");
    } catch (err2) {
      console.error("Error starting in-memory MongoDB", err2);
      process.exit(1);
    }
  }

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // On process exit, stop in-memory server if used
  process.on("SIGINT", async () => {
    if (mongod) await mongod.stop();
    process.exit(0);
  });
};

start();

module.exports = { app, server, io };
