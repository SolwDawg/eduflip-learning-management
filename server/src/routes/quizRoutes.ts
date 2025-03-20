import express from "express";
import {
  createQuiz,
  deleteQuiz,
  getQuiz,
  listQuizzes,
  updateQuiz,
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/quizController";
import { requireAuth } from "@clerk/express";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: Quiz management endpoints
 */

/**
 * @swagger
 * /quizzes:
 *   get:
 *     summary: Get all quizzes
 *     tags: [Quizzes]
 *     parameters:
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: string
 *         description: Filter quizzes by course ID
 *     responses:
 *       200:
 *         description: List of quizzes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quizzes retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Quiz'
 */
router.get("/", listQuizzes);

/**
 * @swagger
 * /quizzes/{quizId}:
 *   get:
 *     summary: Get a quiz by ID
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Quiz retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Quiz'
 *       404:
 *         description: Quiz not found
 */
router.get("/:quizId", getQuiz);

/**
 * @swagger
 * /quizzes:
 *   post:
 *     summary: Create a new quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - title
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: ID of the course this quiz belongs to
 *               title:
 *                 type: string
 *                 description: Title of the quiz
 *               description:
 *                 type: string
 *                 description: Description of the quiz
 *               timeLimit:
 *                 type: number
 *                 description: Time limit in minutes (0 means no limit)
 *               passingScore:
 *                 type: number
 *                 description: Minimum percentage required to pass
 *               shuffleQuestions:
 *                 type: boolean
 *                 description: Whether to shuffle questions for each attempt
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Course not found
 */
router.post("/", requireAuth(), createQuiz);

/**
 * @swagger
 * /quizzes/{quizId}:
 *   put:
 *     summary: Update a quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the quiz
 *               description:
 *                 type: string
 *                 description: Description of the quiz
 *               timeLimit:
 *                 type: number
 *                 description: Time limit in minutes (0 means no limit)
 *               passingScore:
 *                 type: number
 *                 description: Minimum percentage required to pass
 *               shuffleQuestions:
 *                 type: boolean
 *                 description: Whether to shuffle questions for each attempt
 *               questions:
 *                 type: array
 *                 description: List of questions
 *                 items:
 *                   $ref: '#/components/schemas/Question'
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Quiz not found
 */
router.put("/:quizId", requireAuth(), updateQuiz);

/**
 * @swagger
 * /quizzes/{quizId}:
 *   delete:
 *     summary: Delete a quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Quiz not found
 */
router.delete("/:quizId", requireAuth(), deleteQuiz);

/**
 * @swagger
 * /quizzes/{quizId}/questions:
 *   post:
 *     summary: Add a question to a quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - type
 *             properties:
 *               text:
 *                 type: string
 *                 description: Question text
 *               type:
 *                 type: string
 *                 enum: [MultipleChoice, Essay]
 *                 description: Type of question
 *               options:
 *                 type: array
 *                 description: Options for multiple-choice questions
 *                 items:
 *                   $ref: '#/components/schemas/Option'
 *               points:
 *                 type: number
 *                 description: Points assigned to this question
 *               correctAnswerExplanation:
 *                 type: string
 *                 description: Explanation of the correct answer
 *     responses:
 *       201:
 *         description: Question added successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Quiz not found
 */
router.post("/:quizId/questions", requireAuth(), addQuestion);

/**
 * @swagger
 * /quizzes/{quizId}/questions/{questionId}:
 *   put:
 *     summary: Update a question in a quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: Question text
 *               type:
 *                 type: string
 *                 enum: [MultipleChoice, Essay]
 *                 description: Type of question
 *               options:
 *                 type: array
 *                 description: Options for multiple-choice questions
 *                 items:
 *                   $ref: '#/components/schemas/Option'
 *               points:
 *                 type: number
 *                 description: Points assigned to this question
 *               correctAnswerExplanation:
 *                 type: string
 *                 description: Explanation of the correct answer
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Quiz or question not found
 */
router.put("/:quizId/questions/:questionId", requireAuth(), updateQuestion);

/**
 * @swagger
 * /quizzes/{quizId}/questions/{questionId}:
 *   delete:
 *     summary: Delete a question from a quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Quiz or question not found
 */
router.delete("/:quizId/questions/:questionId", requireAuth(), deleteQuestion);

export default router;
