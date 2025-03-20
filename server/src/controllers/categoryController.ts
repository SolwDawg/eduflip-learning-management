import { Request, Response } from "express";
import Category from "../models/categoryModel";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "@clerk/express";

export const listCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await Category.scan().exec();
    res.json({
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving categories", error });
  }
};

export const getCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { categoryId } = req.params;
  try {
    const category = await Category.get(categoryId);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.json({ message: "Category retrieved successfully", data: category });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving category", error });
  }
};

export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, slug, isActive, order } = req.body;

    if (!name || !slug) {
      res.status(400).json({ message: "Name and slug are required" });
      return;
    }

    // Check for duplicate slug
    const existingCategory = await Category.scan("slug").eq(slug).exec();
    if (existingCategory.count > 0) {
      res
        .status(400)
        .json({ message: "A category with this slug already exists" });
      return;
    }

    const newCategory = new Category({
      categoryId: uuidv4(),
      name,
      description: description || "",
      slug,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
    });

    await newCategory.save();

    res
      .status(201)
      .json({ message: "Category created successfully", data: newCategory });
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { categoryId } = req.params;
  const updateData = { ...req.body };

  // Only admin can update categories - add proper checks here if needed

  try {
    const category = await Category.get(categoryId);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    // Check for duplicate slug if slug is being updated
    if (updateData.slug && updateData.slug !== category.slug) {
      const existingCategory = await Category.scan("slug")
        .eq(updateData.slug)
        .exec();
      if (existingCategory.count > 0) {
        res
          .status(400)
          .json({ message: "A category with this slug already exists" });
        return;
      }
    }

    Object.assign(category, updateData);
    await category.save();

    res.json({ message: "Category updated successfully", data: category });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { categoryId } = req.params;

  // Only admin can delete categories - add proper checks here if needed

  try {
    const category = await Category.get(categoryId);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    await Category.delete(categoryId);

    res.json({ message: "Category deleted successfully", data: category });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};
