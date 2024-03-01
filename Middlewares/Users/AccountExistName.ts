import { NextFunction, Request, Response } from "express";
import User from "../../Models/Users.js";

async function accountExistName(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name } = req.body;

  const user = await User.findOne({ name: name });

  if (user) {
    return res.status(400).json({
      success: false,
      message: "¡El nombre de usuario ya está en uso!",
    });
  }

  return next();
}

export default accountExistName;
