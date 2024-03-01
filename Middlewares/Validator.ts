import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

const validator = (schema: ObjectSchema) => [
  (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.validate(req.body, { abortEarly: false });
    if (validation.error) {
      return res.status(400).json({
        success: false,
        message: validation.error.details.map((error: any) => {
          switch (error.type) {
            case "string.email":
              return "Debes colocar un email válido";
            default:
              return error.message;
          }
        }),
      });
    }
    return next();
  },
];

export default validator;
