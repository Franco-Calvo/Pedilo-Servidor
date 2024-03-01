import Joi from "joi";

const schema_signin = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
    "string.empty": "El email/nombre de usuario no puede quedar vacío",
    "any.required": "El email/nombre de usuario es requerido",
    "string.email": "El formato del email es incorrecto",
  }),
  password: Joi.string().required().messages({
    "string.empty": "La contraseña no puede quedar vacía",
    "any.required": "La contraseña es requerida",
  }),
});

export default schema_signin;
