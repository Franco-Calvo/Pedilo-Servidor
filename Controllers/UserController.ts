import { Request, Response } from "express";
import User from "../Models/Users.js";

export const getUserByUserName = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ name: req.params.username }).populate(
      "products"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userObject = user.toObject();
    userObject.password = "";
    delete userObject.mercadopagoAccessToken;
    delete userObject.mercadopagoRefreshToken;

    res.json(userObject);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
