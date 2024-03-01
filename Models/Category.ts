import mongoose, { Schema } from "mongoose";

export interface ICategory {
  name: String;
  user: mongoose.Schema.Types.ObjectId;
  products: Array<mongoose.Schema.Types.ObjectId>;
}

const categorySchema: Schema<ICategory> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
  },
  { timestamps: true }
);

const Category = mongoose.model("categories", categorySchema);

export default Category;
