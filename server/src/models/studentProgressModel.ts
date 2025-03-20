import { Schema, model } from "dynamoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     LessonAccess:
 *       type: object
 *       required:
 *         - courseId
 *         - sectionId
 *         - chapterId
 *         - accessTimestamp
 *       properties:
 *         courseId:
 *           type: string
 *           description: ID of the course
 *         sectionId:
 *           type: string
 *           description: ID of the section
 *         chapterId:
 *           type: string
 *           description: ID of the chapter
 *         accessTimestamp:
 *           type: string
 *           description: Timestamp when the lesson was accessed
 *
 *     QuizAttempt:
 *       type: object
 *       required:
 *         - quizId
 *         - courseId
 *         - attemptTimestamp
 *         - score
 *       properties:
 *         quizId:
 *           type: string
 *           description: ID of the quiz
 *         courseId:
 *           type: string
 *           description: ID of the course
 *         attemptTimestamp:
 *           type: string
 *           description: Timestamp when the quiz was attempted
 *         score:
 *           type: number
 *           description: Score achieved in the quiz (percentage)
 *         timeTaken:
 *           type: number
 *           description: Time taken to complete the quiz (in seconds)
 *         completed:
 *           type: boolean
 *           description: Whether the quiz was completed
 *
 *     DiscussionActivity:
 *       type: object
 *       required:
 *         - courseId
 *         - activityType
 *         - timestamp
 *       properties:
 *         courseId:
 *           type: string
 *           description: ID of the course
 *         sectionId:
 *           type: string
 *           description: ID of the section (if applicable)
 *         chapterId:
 *           type: string
 *           description: ID of the chapter (if applicable)
 *         activityType:
 *           type: string
 *           enum: [Comment, Reply, Reaction]
 *           description: Type of discussion activity
 *         commentId:
 *           type: string
 *           description: ID of the comment (if applicable)
 *         timestamp:
 *           type: string
 *           description: Timestamp of the activity
 *
 *     StudentProgress:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           description: ID of the student
 *         lessonAccessHistory:
 *           type: array
 *           description: History of lesson accesses
 *           items:
 *             $ref: '#/components/schemas/LessonAccess'
 *         quizAttempts:
 *           type: array
 *           description: History of quiz attempts
 *           items:
 *             $ref: '#/components/schemas/QuizAttempt'
 *         discussionActivities:
 *           type: array
 *           description: History of discussion activities
 *           items:
 *             $ref: '#/components/schemas/DiscussionActivity'
 *         lastActive:
 *           type: string
 *           description: Last activity timestamp
 */

const lessonAccessSchema = new Schema({
  courseId: {
    type: String,
    required: true,
  },
  sectionId: {
    type: String,
    required: true,
  },
  chapterId: {
    type: String,
    required: true,
  },
  accessTimestamp: {
    type: String,
    required: true,
  },
});

const quizAttemptSchema = new Schema({
  quizId: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  attemptTimestamp: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  timeTaken: {
    type: Number,
  },
  completed: {
    type: Boolean,
    default: true,
  },
});

const discussionActivitySchema = new Schema({
  courseId: {
    type: String,
    required: true,
  },
  sectionId: {
    type: String,
  },
  chapterId: {
    type: String,
  },
  activityType: {
    type: String,
    enum: ["Comment", "Reply", "Reaction"],
    required: true,
  },
  commentId: {
    type: String,
  },
  timestamp: {
    type: String,
    required: true,
  },
});

const studentProgressSchema = new Schema(
  {
    userId: {
      type: String,
      hashKey: true,
      required: true,
    },
    lessonAccessHistory: {
      type: Array,
      schema: [lessonAccessSchema],
      default: [],
    },
    quizAttempts: {
      type: Array,
      schema: [quizAttemptSchema],
      default: [],
    },
    discussionActivities: {
      type: Array,
      schema: [discussionActivitySchema],
      default: [],
    },
    lastActive: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const StudentProgress = model("StudentProgress", studentProgressSchema);
export default StudentProgress;
