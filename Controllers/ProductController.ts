import { Request, Response } from "express";
import Product from "../Models/Products.js";
import User from "../Models/Users.js";
import Category from "../Models/Category.js";

export const createProduct = async (req: Request, res: Response) => {
  const { name, price, description, imageUrl, stock, category } = req.body;

  try {
    const product = new Product({
      name,
      price,
      description,
      imageUrl,
      stock,
      user: req.body.user,
      category,
    });

    const savedProduct = await product.save();

    await User.findByIdAndUpdate(req.body.user, {
      $push: { products: savedProduct._id },
    });

    await Category.findByIdAndUpdate(category, {
      $push: { products: savedProduct._id },
    });

    res.status(201).json({ message: "Product created", product });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    const user = await User.findById(userId).populate("products");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.products);
  } catch (error: any) {
    res.status(500).json({ error: error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, imageUrl, category, stock } = req.body;

    const oldProduct = await Product.findById(req.params.id);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, description, imageUrl, category, stock },
      { new: true }
    );

    if (!product) return res.status(404).json({ message: "Product not found" });

    if (oldProduct?.category.toString() !== category) {
      await Category.findByIdAndUpdate(oldProduct?.category, {
        $pull: { products: req.params.id },
      });
      await Category.findByIdAndUpdate(category, {
        $push: { products: req.params.id },
      });
    }

    res.json({ message: "Product updated", product });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndRemove(req.params.id);

    await User.findByIdAndUpdate(product.user, {
      $pull: { products: product._id },
    });

    await Category.findByIdAndUpdate(product.category, {
      $pull: { products: product._id },
    });

    res.json({ message: "Product deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
