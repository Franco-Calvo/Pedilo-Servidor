import { Router } from "express";
import {
  createCategory,
  getCategoryById,
  getUserCategories,
  updateCategory,
  deleteCategory,
} from "../Controllers/CategoryController.js";

const router = Router();

router.post("/create", createCategory);
router.post("/:id", getUserCategories);
router.post("/category/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
