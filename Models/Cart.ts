import mongoose from "mongoose";

const cartTempSchema = new mongoose.Schema({
  preferenceId: String,
  cartDetails: Array,
  tableNumber: String,
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "2h",
  },
});

const CartTemp = mongoose.model("CartTemp", cartTempSchema);

export default CartTemp;
