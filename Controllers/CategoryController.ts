import { Request, Response } from "express";
import Category from "../Models/Category.js";
import User from "../Models/Users.js";

export const createCategory = async (req: Request, res: Response) => {
  const { name, userId } = req.body;

  try {
    const category = new Category({
      name,
      user: userId,
    });

    const savedCategory = await category.save();
    await User.findByIdAndUpdate(userId, {
      $push: { categories: savedCategory._id },
    });

    res.status(201).json({ message: "Category created", category });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};

export const getUserCategories = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    const categories = await Category.find({ user: userId });

    if (!categories.length) {
      return res
        .status(404)
        .json({ message: "Categories not found for the given user" });
    }
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.json(category);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category updated", category });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await Category.findByIdAndRemove(req.params.id);
    await User.findByIdAndUpdate(category.user, {
      $pull: { categories: category._id },
    });
    res.json({ message: "Category deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
