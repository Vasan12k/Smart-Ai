const express = require("express");
const router = express.Router();
const { authMiddleware, roleRequired } = require("../middleware/auth");
const FoodItem = require("../models/FoodItem");

// Create food item (Manager only)
router.post(
  "/menu",
  authMiddleware,
  roleRequired("manager"),
  async (req, res) => {
    try {
      const { name, category, price, imageUrl, inStock } = req.body;
      const item = new FoodItem({ name, category, price, imageUrl, inStock });
      await item.save();
      res.json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// List menu (manager)
router.get(
  "/menu",
  authMiddleware,
  roleRequired("manager"),
  async (req, res) => {
    const items = await FoodItem.find();
    res.json(items);
  }
);

// Public menu endpoint (no auth required - for QR scan customers)
router.get("/menu/public", async (req, res) => {
  const items = await FoodItem.find();
  res.json(items);
});

// Update & delete endpoints would go here (left as exercise)

module.exports = router;
