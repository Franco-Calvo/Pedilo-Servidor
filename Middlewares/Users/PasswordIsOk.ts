import bcryptjs from "bcryptjs";
import { NextFunction, Request, Response } from "express";

function passwordIsOk(req: Request, res: Response, next: NextFunction) {
  const user: any = JSON.parse(req.params.user);
  const db_pass = user.password;
  const form_pass = req.body.password;

  if (bcryptjs.compareSync(form_pass, db_pass)) {
    return next();
  }
  return res.status(400).json({
    succes: false,
    message: "¡Credenciales inválidas!",
  });
}

export default passwordIsOk;
