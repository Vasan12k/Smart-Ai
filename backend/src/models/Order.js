const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
  food: { type: Schema.Types.ObjectId, ref: "FoodItem" },
  name: String,
  price: Number,
  qty: { type: Number, default: 1 },
});

const OrderSchema = new Schema({
  tableNumber: { type: Number, required: true },
  items: [OrderItemSchema],
  customerId: { type: Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["received", "preparing", "ready", "served", "completed"],
    default: "received",
  },
  payment: {
    method: { type: String, enum: ["cash", "online"], default: "cash" },
    paid: { type: Boolean, default: false },
    razorpayPaymentId: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
