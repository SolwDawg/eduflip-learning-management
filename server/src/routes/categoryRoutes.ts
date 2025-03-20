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

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Course categories management
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categories retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Server error
 */
router.get("/", listCategories);

/**
 * @swagger
 * /categories/{categoryId}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.get("/:categoryId", getCategory);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name
 *               description:
 *                 type: string
 *                 description: Category description
 *               slug:
 *                 type: string
 *                 description: URL-friendly identifier
 *               isActive:
 *                 type: boolean
 *                 description: Category status
 *               order:
 *                 type: number
 *                 description: Display order
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid input or duplicate slug
 *       500:
 *         description: Server error
 */
router.post("/", requireAuth(), createCategory);

/**
 * @swagger
 * /categories/{categoryId}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Category name
 *               description:
 *                 type: string
 *                 description: Category description
 *               slug:
 *                 type: string
 *                 description: URL-friendly identifier
 *               isActive:
 *                 type: boolean
 *                 description: Category status
 *               order:
 *                 type: number
 *                 description: Display order
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Invalid input or duplicate slug
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.put("/:categoryId", requireAuth(), updateCategory);

/**
 * @swagger
 * /categories/{categoryId}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.delete("/:categoryId", requireAuth(), deleteCategory);

export default router;
