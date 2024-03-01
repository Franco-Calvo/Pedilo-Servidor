import mongoose, { Schema } from "mongoose";

export interface IProduct {
  name: String;
  price: Number;
  description: String;
  imageUrl?: String;
  user: mongoose.Schema.Types.ObjectId;
  category: mongoose.Schema.Types.ObjectId;
  stock: "Available" | "Unavailable";
}

const productSchema: Schema<IProduct> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: false },
    imageUrl: { type: String, required: false },
    stock: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("products", productSchema);

export default Product;
