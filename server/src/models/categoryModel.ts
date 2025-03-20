import { Schema, model } from "dynamoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - categoryId
 *         - name
 *         - slug
 *       properties:
 *         categoryId:
 *           type: string
 *           description: Unique identifier for the category
 *         name:
 *           type: string
 *           description: Category name
 *         description:
 *           type: string
 *           description: Category description
 *         slug:
 *           type: string
 *           description: URL-friendly identifier
 *         isActive:
 *           type: boolean
 *           description: Category status
 *           default: true
 *         order:
 *           type: number
 *           description: Display order
 *           default: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the category was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the category was last updated
 *       example:
 *         categoryId: "550e8400-e29b-41d4-a716-446655440000"
 *         name: "Programming"
 *         description: "Programming courses"
 *         slug: "programming"
 *         isActive: true
 *         order: 1
 *         createdAt: "2023-01-01T00:00:00.000Z"
 *         updatedAt: "2023-01-01T00:00:00.000Z"
 */

const categorySchema = new Schema(
  {
    categoryId: {
      type: String,
      hashKey: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Category = model("Category", categorySchema);
export default Category;
