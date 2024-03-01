import { NextFunction, Request, Response } from "express";
import User from "../../Models/Users.js";

async function accountExistSignIn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = await User.findOne({
    email: req.body.email,
  });
  if (user) {
    req.params.user = JSON.stringify(user);
    return next();
  }
  return res.status(400).json({
    succes: false,
    message: "¡Credenciales inválidas!",
  });
}

export default accountExistSignIn;
