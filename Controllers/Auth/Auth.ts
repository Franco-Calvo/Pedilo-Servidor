import bcryptjs from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import jsonwebtoken, { Secret } from "jsonwebtoken";
import User, { IUser, defaultUser } from "../../Models/Users.js";

const secret: Secret = process.env.SECRET || "";

const controller = {
  sign_up: async (req: Request, res: Response, next: NextFunction) => {
    const userBody: IUser = req.body;

    try {
      const user = await User.create({
        ...defaultUser,
        password: bcryptjs.hashSync(userBody.password, 10),
        email: userBody.email.toLowerCase(),
        name: userBody.name,
      });
      return res.status(201).json({
        success: true,
        message: "Te has registrado correctamente",
      });
    } catch (error: any) {
      next(error);
    }
  },

  sign_in: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRequest: IUser = JSON.parse(req.params.user);

      const user: IUser | null = await User.findOneAndUpdate(
        { email: userRequest.email.toLowerCase() },
        {
          is_online: true,
          is_admin: true,
        },
        { new: true }
      );
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Usuario o contraseña incorrectos",
        });
      }
      user.password = "";
      const token = jsonwebtoken.sign({ id: user._id }, secret, {
        expiresIn: 60 * 60 * 24 * 7,
      });

      return res.status(200).json({
        success: true,
        message: "Has iniciado sesión",
        user,
        token,
      });
    } catch (error) {
      next(error);
    }
  },

  sign_out: async (req: Request, res: Response, next: NextFunction) => {
    const { email }: any = req.body;
    try {
      await User.findOneAndUpdate(
        { email },
        { is_online: false },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "Usuario deslogueado",
      });
    } catch (error) {
      next(error);
    }
    next();
  },

  verifyToken: async (req: Request, res: Response, next: NextFunction) => {
    const authorization: string = req.headers.authorization || "";
    const user: any = req.user;

    try {
      const token = authorization.replace("Bearer ", "");
      const decoded = jsonwebtoken.verify(token, secret);
      return res.status(200).json({
        success: true,
        message: "Token válido",
        is_admin: user.is_admin,
        decoded,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token inválido",
      });
      console.log(error);
    }
  },
};

export default controller;
