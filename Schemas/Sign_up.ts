import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().min(3).max(25).messages({
    "string.min": "El nombre debe contener 3 caracteres como mínimo",
    "string.max": "El nombre no puede contener más de 25 caracteres",
    "string.empty": "El nombre no puede quedar vacío",
    "any.required": "El nombre es requerido",
  }),
  email: Joi.string()
    .required()
    .min(8)
    .email({ minDomainSegments: 2 })
    .messages({
      "string.min": "El email debe contener 8 caracteres como mínimo",
      "string.empty": "El email no puede quedar vacío",
      "any.required": "El email es requerido",
    }),
  password: Joi.string().required().min(8).max(30).messages({
    "string.min": "La contraseña debe contener 8 caracteres como mínimo",
    "string.max": "La contraseña debe contener 30 caracteres como máximo",
    "string.empty": "La contraseña no puede quedar vacía",
    "any.required": "La contraseña es requerida",
  }),
});

export default schema;
