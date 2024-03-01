import mongoose, { Schema } from "mongoose";

export interface IUser {
  is_online: Boolean;
  is_admin: Boolean;
  name: String;
  shopName: String;
  email: String;
  password: string;
  products: Array<mongoose.Schema.Types.ObjectId>;
  categories: Array<mongoose.Schema.Types.ObjectId>;
  timestamps: Boolean;
  mercadopagoAccessToken?: string;
  mercadopagoRefreshToken?: string;
  orders: Array<mongoose.Schema.Types.ObjectId>;
  _id?: mongoose.Schema.Types.ObjectId;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
}

export const defaultUser: IUser = {
  is_online: false,
  is_admin: false,
  email: "",
  name: "",
  shopName: "",
  password: "",
  products: [],
  orders: [],
  categories: [],
  timestamps: true,
  resetPasswordToken: undefined,
  resetPasswordExpires: undefined,
};

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: false },
    password: { type: String, required: false },
    shopName: { type: String, required: false },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    mercadopagoAccessToken: { type: String },
    mercadopagoRefreshToken: { type: String },
    resetPasswordExpires: { type: String },
    resetPasswordToken: { type: Number },
    is_online: { type: Boolean, required: true },
    is_admin: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("users", userSchema);

export default User;
