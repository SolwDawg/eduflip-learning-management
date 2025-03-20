import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategory,
  listCategories,
  updateCategory,
} from "../controllers/categoryController";
import { requireAuth } from "@clerk/express";

const router = express.Router();

// Public routes
router.get("/", listCategories);
router.get("/:categoryId", getCategory);

// Protected routes (admin only)
router.post("/", requireAuth(), createCategory);
router.put("/:categoryId", requireAuth(), updateCategory);
router.delete("/:categoryId", requireAuth(), deleteCategory);

export default router;
