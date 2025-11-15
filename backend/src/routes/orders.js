const express = require("express");
const router = express.Router();
const { authMiddleware, roleRequired } = require("../middleware/auth");
const { getIo } = require("../socket");
const { getDb } = require("../config/firebase");

// Create an order (Customer)
router.post("/", authMiddleware, roleRequired("customer"), async (req, res) => {
  try {
    const { tableNumber, items, payment } = req.body;

    let db;
    try {
      db = getDb();
    } catch (dbError) {
      console.error("Firebase error:", dbError.message);
      return res.status(500).json({ message: "Database connection error" });
    }

    const ordersRef = db.collection("orders");

    const orderData = {
      tableNumber,
      items,
      customerId: req.user.id,
      payment: payment || { method: "cash", paid: false },
      status: "received",
      createdAt: new Date().toISOString(),
    };

    try {
      const orderDoc = await ordersRef.add(orderData);
      const order = { id: orderDoc.id, ...orderData };

      // Emit socket events to chef, manager, and table namespace
      const io = getIo();
      if (io) {
        io.of("/chef").emit("new_order", order);
        io.of("/manager").emit("order_created", order);
        const tableNsName = `/table:${order.tableNumber}`;
        const ns = io.of(tableNsName);
        if (ns) ns.emit("order_update", order);
      }
      res.json(order);
    } catch (dbError) {
      console.error("Firebase write error:", dbError.message);
      return res.status(500).json({ message: "Could not create order" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Public order endpoint (no auth required - for QR scan customers)
router.post("/public", async (req, res) => {
  try {
    const { tableNumber, items, payment } = req.body;
    const db = getDb();
    const ordersRef = db.collection("orders");

    const orderData = {
      tableNumber,
      items,
      payment: payment || { method: "cash", paid: false },
      status: "received",
      createdAt: new Date().toISOString(),
    };

    const orderDoc = await ordersRef.add(orderData);
    const order = { id: orderDoc.id, ...orderData };

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
    const db = getDb();
    const ordersRef = db.collection("orders");

    let query = ordersRef;
    if (role === "customer") {
      query = query.where("customerId", "==", req.user.id);
    }

    const snapshot = await query.get();
    const orders = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

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
      const db = getDb();
      const ordersRef = db.collection("orders");
      const orderDoc = await ordersRef.doc(req.params.id).get();

      if (!orderDoc.exists) {
        return res.status(404).json({ message: "Not found" });
      }

      await ordersRef.doc(req.params.id).update({ status });
      const order = { id: orderDoc.id, ...orderDoc.data(), status };

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
