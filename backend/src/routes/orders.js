const express = require("express");
const router = express.Router();
const { authMiddleware, roleRequired } = require("../middleware/auth");
const { getIo } = require("../socket");
const Order = require("../models/Order");

// Create an order (Customer)
router.post("/", authMiddleware, roleRequired("customer"), async (req, res) => {
  try {
    const { tableNumber, items, payment } = req.body;
    const order = new Order({
      tableNumber,
      items,
      customerId: req.user.id,
      payment,
    });
    await order.save();
    // TODO: emit to /chef namespace
    // Emit socket events to chef, manager, and table namespace
    const io = getIo();
    if (io) {
      // send new order to chefs
      io.of("/chef").emit("new_order", order);
      // notify manager
      io.of("/manager").emit("order_created", order);
      // notify the specific table namespace
      const tableNsName = `/table:${order.tableNumber}`;
      const ns = io.of(tableNsName);
      if (ns) ns.emit("order_update", order);
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Public order endpoint (no auth required - for QR scan customers)
router.post("/public", async (req, res) => {
  try {
    const { tableNumber, items, payment } = req.body;
    const order = new Order({ tableNumber, items, payment });
    await order.save();
    // Emit socket events
    const io = getIo();
    if (io) {
      io.of("/chef").emit("new_order", order);
      io.of("/manager").emit("order_created", order);
      const tableNsName = `/table:${order.tableNumber}`;
      const ns = io.of(tableNsName);
      if (ns) ns.emit("order_update", order);
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get orders: filter by role
router.get("/", authMiddleware, async (req, res) => {
  try {
    const role = req.user.role;
    let query = {};
    if (role === "customer") query = { customerId: req.user.id };
    // chefs see all; waiters/managers see all
    const orders = await Order.find(query).populate("items.food");
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update status (Chef/Waiter)
router.patch(
  "/:id/status",
  authMiddleware,
  roleRequired("chef", "waiter"),
  async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: "Not found" });
      order.status = status;
      await order.save();
      // TODO: emit socket updates
      // emit socket updates
      const io = getIo();
      if (io) {
        io.of("/manager").emit("order_status_changed", order);
        io.of("/chef").emit("order_status_changed", order);
        io.of("/waiter").emit("order_status_changed", order);
        const tableNsName = `/table:${order.tableNumber}`;
        const ns = io.of(tableNsName);
        if (ns) ns.emit("order_update", order);
      }
      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
