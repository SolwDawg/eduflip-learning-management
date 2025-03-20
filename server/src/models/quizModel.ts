import { Schema, model } from "dynamoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Option:
 *       type: object
 *       required:
 *         - id
 *         - text
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the option
 *         text:
 *           type: string
 *           description: Text content of the option
 *         isCorrect:
 *           type: boolean
 *           description: Whether this option is correct
 *
 *     Question:
 *       type: object
 *       required:
 *         - questionId
 *         - text
 *         - type
 *       properties:
 *         questionId:
 *           type: string
 *           description: Unique identifier for the question
 *         text:
 *           type: string
 *           description: The question text
 *         type:
 *           type: string
 *           enum: [MultipleChoice, Essay]
 *           description: Type of question
 *         options:
 *           type: array
 *           description: Options for multiple-choice questions
 *           items:
 *             $ref: '#/components/schemas/Option'
 *         points:
 *           type: number
 *           description: Points assigned to this question
 *           default: 1
 *         correctAnswerExplanation:
 *           type: string
 *           description: Explanation of the correct answer
 *
 *     Quiz:
 *       type: object
 *       required:
 *         - quizId
 *         - courseId
 *         - title
 *       properties:
 *         quizId:
 *           type: string
 *           description: Unique identifier for the quiz
 *         courseId:
 *           type: string
 *           description: ID of the course this quiz belongs to
 *         title:
 *           type: string
 *           description: Title of the quiz
 *         description:
 *           type: string
 *           description: Description of the quiz
 *         timeLimit:
 *           type: number
 *           description: Time limit in minutes (0 means no limit)
 *           default: 0
 *         passingScore:
 *           type: number
 *           description: Minimum percentage required to pass
 *           default: 70
 *         shuffleQuestions:
 *           type: boolean
 *           description: Whether to shuffle questions for each attempt
 *           default: false
 *         questions:
 *           type: array
 *           description: List of questions in the quiz
 *           items:
 *             $ref: '#/components/schemas/Question'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the quiz was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date and time when the quiz was last updated
 *       example:
 *         quizId: "550e8400-e29b-41d4-a716-446655440000"
 *         courseId: "550e8400-e29b-41d4-a716-446655440001"
 *         title: "JavaScript Basics"
 *         description: "Test your knowledge of JavaScript basics"
 *         timeLimit: 30
 *         passingScore: 70
 *         shuffleQuestions: true
 *         questions: [
 *           {
 *             questionId: "550e8400-e29b-41d4-a716-446655440002",
 *             text: "What is JavaScript?",
 *             type: "MultipleChoice",
 *             options: [
 *               {
 *                 id: "550e8400-e29b-41d4-a716-446655440003",
 *                 text: "A programming language",
 *                 isCorrect: true
 *               },
 *               {
 *                 id: "550e8400-e29b-41d4-a716-446655440004",
 *                 text: "A markup language",
 *                 isCorrect: false
 *               }
 *             ],
 *             points: 2,
 *             correctAnswerExplanation: "JavaScript is a programming language used for web development."
 *           }
 *         ]
 */

const optionSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
});

const questionSchema = new Schema({
  questionId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["MultipleChoice", "Essay"],
    required: true,
  },
  options: {
    type: Array,
    schema: [optionSchema],
  },
  points: {
    type: Number,
    default: 1,
  },
  correctAnswerExplanation: {
    type: String,
  },
});

const quizSchema = new Schema(
  {
    quizId: {
      type: String,
      hashKey: true,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
      index: {
        name: "courseIndex",
        type: "global",
      },
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    timeLimit: {
      type: Number,
      default: 0, // 0 means no time limit
    },
    passingScore: {
      type: Number,
      default: 70, // percentage
    },
    shuffleQuestions: {
      type: Boolean,
      default: false,
    },
    questions: {
      type: Array,
      schema: [questionSchema],
    },
  },
  {
    timestamps: true,
  }
);

const Quiz = model("Quiz", quizSchema);
export default Quiz;
