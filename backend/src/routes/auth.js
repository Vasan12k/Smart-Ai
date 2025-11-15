const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getDb } = require("../config/firebase");

// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("Register attempt:", { name, email, role });

    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "Missing fields" });

    let db;
    try {
      db = getDb();
    } catch (dbError) {
      console.error("Firebase connection error:", dbError.message);
      return res.status(500).json({
        message:
          "Database connection error. Please check Firebase configuration.",
      });
    }

    const usersRef = db.collection("users");

    // Check if email already exists
    try {
      const existingUser = await usersRef.where("email", "==", email).get();
      if (!existingUser.empty)
        return res.status(400).json({ message: "Email already registered" });
    } catch (dbError) {
      console.error("Database query error:", dbError.message);
      return res.status(500).json({
        message: "Database error. Please check Firebase credentials.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create user document
    const userData = {
      name,
      email,
      passwordHash: hash,
      role,
      createdAt: new Date().toISOString(),
    };

    let userDoc;
    try {
      userDoc = await usersRef.add(userData);
      console.log("User created successfully:", userDoc.id);
    } catch (dbError) {
      console.error("Database write error:", dbError.message);
      return res.status(500).json({
        message: "Could not create user. Please check Firebase credentials.",
      });
    }

    const token = jwt.sign(
      { id: userDoc.id, role: role },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: userDoc.id,
        name,
        email,
        role,
      },
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    let db;
    try {
      db = getDb();
    } catch (dbError) {
      console.error("Firebase connection error:", dbError.message);
      return res.status(500).json({
        message:
          "Database connection error. Please check Firebase configuration.",
      });
    }

    const usersRef = db.collection("users");

    // Find user by email
    let userSnapshot;
    try {
      userSnapshot = await usersRef.where("email", "==", email).get();
    } catch (dbError) {
      console.error("Database query error:", dbError.message);
      return res.status(500).json({
        message: "Database error. Please check Firebase credentials.",
      });
    }

    if (userSnapshot.empty)
      return res.status(401).json({ message: "Invalid credentials" });

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();
    const userId = userDoc.id;

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: userId, role: user.role },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
