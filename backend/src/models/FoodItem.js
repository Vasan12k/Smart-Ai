const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FoodItemSchema = new Schema({
  name: { type: String, required: true },
  imageUrl: { type: String },
  category: { type: String },
  price: { type: Number, required: true },
  inStock: { type: Number, default: 9999 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FoodItem", FoodItemSchema);
