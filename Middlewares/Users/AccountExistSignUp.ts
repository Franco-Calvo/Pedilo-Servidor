import { NextFunction, Request, Response } from "express";
import User from "../../Models/Users.js";

async function accountExistSignUp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email } = req.body;

  const user = await User.findOne({ email: email });

  console.log(user);
  if (user) {
    return res.status(400).json({
      success: false,
      message: "¡El usuario ya existe!",
    });
  }

  return next();
}

export default accountExistSignUp;
