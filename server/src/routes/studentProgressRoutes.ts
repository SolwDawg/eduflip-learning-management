import express from "express";
import {
  getStudentProgress,
  recordLessonAccess,
  recordQuizAttempt,
  recordDiscussionActivity,
  getStudentStatistics,
} from "../controllers/studentProgressController";

/**
 * @swagger
 * tags:
 *   name: Student Progress
 *   description: API for tracking and retrieving student progress data
 */

const router = express.Router();

/**
 * @swagger
 * /api/progress/{userId}:
 *   get:
 *     summary: Get a student's progress data
 *     tags: [Student Progress]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student
 *     responses:
 *       200:
 *         description: Student progress data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/StudentProgress'
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.get("/:userId", getStudentProgress);

/**
 * @swagger
 * /api/progress/{userId}/lesson-access:
 *   post:
 *     summary: Record a lesson access event
 *     tags: [Student Progress]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - sectionId
 *               - chapterId
 *             properties:
 *               courseId:
 *                 type: string
 *               sectionId:
 *                 type: string
 *               chapterId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lesson access recorded successfully
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.post("/:userId/lesson-access", recordLessonAccess);

/**
 * @swagger
 * /api/progress/{userId}/quiz-attempt:
 *   post:
 *     summary: Record a quiz attempt
 *     tags: [Student Progress]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quizId
 *               - courseId
 *               - score
 *             properties:
 *               quizId:
 *                 type: string
 *               courseId:
 *                 type: string
 *               score:
 *                 type: number
 *               timeTaken:
 *                 type: number
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Quiz attempt recorded successfully
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.post("/:userId/quiz-attempt", recordQuizAttempt);

/**
 * @swagger
 * /api/progress/{userId}/discussion-activity:
 *   post:
 *     summary: Record a discussion activity
 *     tags: [Student Progress]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - activityType
 *             properties:
 *               courseId:
 *                 type: string
 *               sectionId:
 *                 type: string
 *               chapterId:
 *                 type: string
 *               activityType:
 *                 type: string
 *                 enum: [Comment, Reply, Reaction]
 *               commentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Discussion activity recorded successfully
 *       400:
 *         description: Missing required fields or invalid activity type
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.post("/:userId/discussion-activity", recordDiscussionActivity);

/**
 * @swagger
 * /api/progress/{userId}/statistics:
 *   get:
 *     summary: Get student statistics
 *     tags: [Student Progress]
 *     security:
 *       - clerkAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student
 *     responses:
 *       200:
 *         description: Student statistics retrieved successfully
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
 *                     totalLessonsAccessed:
 *                       type: integer
 *                     uniqueLessonsAccessed:
 *                       type: integer
 *                     totalQuizAttempts:
 *                       type: integer
 *                     uniqueQuizAttempts:
 *                       type: integer
 *                     averageQuizScore:
 *                       type: number
 *                     totalDiscussionActivities:
 *                       type: integer
 *                     discussionBreakdown:
 *                       type: object
 *                       properties:
 *                         comments:
 *                           type: integer
 *                         replies:
 *                           type: integer
 *                         reactions:
 *                           type: integer
 *                     mostAccessedCourses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           value:
 *                             type: string
 *                           count:
 *                             type: integer
 *                     lastActive:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: No progress data found
 *       403:
 *         description: Access denied
 *       500:
 *         description: Server error
 */
router.get("/:userId/statistics", getStudentStatistics);

export default router;
