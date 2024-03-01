import Joi from "joi";

const schema: any = Joi.object({
  name: Joi.string().min(2).messages({
    "string.min": "El nombre debe contener 2 caracteres como mínimo",
    "string.empty": "El nombre no puede quedar vacío",
    "any.required": "El nombre es requerido",
  }),
  price: Joi.number().required().min(1).messages({
    "number.base": "El precio debe ser un número",
    "number.min": "El precio debe contener como mínimo 1 caracter",
    "number.empty": "El precio no puede quedar vacío",
    "any.required": "El precio es requerido",
  }),
  description: Joi.string().required().min(8).max(100).messages({
    "string.min": "La descripción debe contener 8 caracteres como mínimo",
    "string.max": "La descripción debe contener 100 caracteres como máximo",
    "string.empty": "La descripción no puede quedar vacía",
    "any.required": "La descripción es requerida",
  }),
  imageUrl: Joi.string().messages({
    "any.required": "La imagen es requerida",
    "string.empty": "La imagen no puede quedar vacía",
  }),
  stock: Joi.string().required(),
  user: Joi.string().required(),
  category: Joi.string().required(),
});

export default schema;
