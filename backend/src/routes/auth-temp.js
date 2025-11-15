const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Temporary in-memory user storage (for testing without Firebase)
const users = [];

// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("Register attempt:", { name, email, role });

    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "Missing fields" });

    // Check if email already exists
    const existingUser = users.find((u) => u.email === email);
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create user
    const userData = {
      id: Date.now().toString(),
      name,
      email,
      passwordHash: hash,
      role,
      createdAt: new Date().toISOString(),
    };

    users.push(userData);
    console.log("User created successfully:", userData.id);
    console.log("Total users:", users.length);

    const token = jwt.sign(
      { id: userData.id, role: role },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: userData.id,
        name,
        email,
        role,
      },
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    // Find user by email
    const user = users.find((u) => u.email === email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
