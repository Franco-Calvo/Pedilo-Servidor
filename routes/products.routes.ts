import express from "express";

import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../Controllers/ProductController.js";
import validator from "../Middlewares/Validator.js";
import ProductSchema from "../Schemas/Products.js";

const router = express.Router();

router.post("/newproduct", validator(ProductSchema), createProduct);

router.post("/getproducts", getProducts);
router.get("/:id", getProductById);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

export default router;
