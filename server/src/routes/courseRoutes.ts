import express from "express";
import multer from "multer";
import {
  createCourse,
  deleteCourse,
  getCourse,
  listCourses,
  updateCourse,
  getUploadVideoUrl,
  getUploadImageUrl,
  getUploadDocumentUrl,
} from "../controllers/courseController";
import { requireAuth } from "@clerk/express";

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management
 */

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category filter
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get("/", listCourses);

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - clerkAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Course created successfully
 */
router.post("/", requireAuth(), createCourse);

/**
 * @swagger
 * /courses/{courseId}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course details
 */
router.get("/:courseId", getCourse);

router.put("/:courseId", requireAuth(), upload.single("image"), updateCourse);
router.delete("/:courseId", requireAuth(), deleteCourse);

/**
 * @swagger
 * /courses/{courseId}/get-upload-image-url:
 *   post:
 *     summary: Get a pre-signed URL for image upload
 *     tags: [Courses]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileName
 *               - fileType
 *             properties:
 *               fileName:
 *                 type: string
 *               fileType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Upload URL generated successfully
 */
router.post(
  "/:courseId/get-upload-image-url",
  requireAuth(),
  getUploadImageUrl
);

/**
 * @swagger
 * /courses/{courseId}/sections/{sectionId}/chapters/{chapterId}/get-upload-url:
 *   post:
 *     summary: Get a pre-signed URL for video upload
 *     tags: [Courses]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileName
 *               - fileType
 *             properties:
 *               fileName:
 *                 type: string
 *               fileType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Upload URL generated successfully
 */
router.post(
  "/:courseId/sections/:sectionId/chapters/:chapterId/get-upload-url",
  requireAuth(),
  getUploadVideoUrl
);

/**
 * @swagger
 * /courses/{courseId}/sections/{sectionId}/chapters/{chapterId}/get-document-upload-url:
 *   post:
 *     summary: Get a pre-signed URL for document upload (docx, pdf, ppt, xlsx)
 *     tags: [Courses]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: sectionId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: chapterId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileName
 *               - fileType
 *             properties:
 *               fileName:
 *                 type: string
 *                 example: document.docx
 *               fileType:
 *                 type: string
 *                 example: application/vnd.openxmlformats-officedocument.wordprocessingml.document
 *                 description: MIME type (application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, etc.)
 *     responses:
 *       200:
 *         description: Document upload URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     uploadUrl:
 *                       type: string
 *                     documentUrl:
 *                       type: string
 *                     documentType:
 *                       type: string
 *                       enum: [docx, pdf, ppt, xlsx]
 *       400:
 *         description: Invalid file type or missing required fields
 */
router.post(
  "/:courseId/sections/:sectionId/chapters/:chapterId/get-document-upload-url",
  requireAuth(),
  getUploadDocumentUrl
);

export default router;
