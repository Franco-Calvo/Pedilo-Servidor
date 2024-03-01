import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const secret: Secret = process.env.SECRET || "";
  console.log(secret);

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  try {
    const user = jwt.verify(token, secret);
    req.user = user;
    next();
  } catch (err) {
    return res.sendStatus(403);
  }
}

export default authenticateToken;
