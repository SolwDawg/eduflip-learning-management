import { Request, Response } from "express";
import Quiz from "../models/quizModel";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "@clerk/express";
import Course from "../models/courseModel";

export const listQuizzes = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { courseId } = req.query;
  try {
    const quizzes = courseId
      ? await Quiz.scan("courseId").eq(courseId).exec()
      : await Quiz.scan().exec();
    res.json({ message: "Quizzes retrieved successfully", data: quizzes });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving quizzes", error });
  }
};

export const getQuiz = async (req: Request, res: Response): Promise<void> => {
  const { quizId } = req.params;
  try {
    const quiz = await Quiz.get(quizId);
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    res.json({ message: "Quiz retrieved successfully", data: quiz });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving quiz", error });
  }
};

export const createQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = getAuth(req);
    const {
      courseId,
      title,
      description,
      timeLimit,
      passingScore,
      shuffleQuestions,
    } = req.body;

    if (!courseId || !title) {
      res.status(400).json({ message: "Course ID and title are required" });
      return;
    }

    // Verify the course exists and the user is the teacher of the course
    const course = await Course.get(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    if (course.teacherId !== userId) {
      res
        .status(403)
        .json({ message: "Not authorized to create quizzes for this course" });
      return;
    }

    const newQuiz = new Quiz({
      quizId: uuidv4(),
      courseId,
      title,
      description: description || "",
      timeLimit: timeLimit !== undefined ? timeLimit : 0,
      passingScore: passingScore !== undefined ? passingScore : 70,
      shuffleQuestions:
        shuffleQuestions !== undefined ? shuffleQuestions : false,
      questions: [],
    });

    await newQuiz.save();

    res
      .status(201)
      .json({ message: "Quiz created successfully", data: newQuiz });
  } catch (error) {
    res.status(500).json({ message: "Error creating quiz", error });
  }
};

export const updateQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { quizId } = req.params;
  const updateData = { ...req.body };
  const { userId } = getAuth(req);

  try {
    const quiz = await Quiz.get(quizId);
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    // Verify the user is the teacher of the course
    const course = await Course.get(quiz.courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    if (course.teacherId !== userId) {
      res.status(403).json({ message: "Not authorized to update this quiz" });
      return;
    }

    // Process questions and options if they exist in the update data
    if (updateData.questions) {
      updateData.questions = updateData.questions.map((question: any) => {
        return {
          ...question,
          questionId: question.questionId || uuidv4(),
          options: question.options?.map((option: any) => ({
            ...option,
            id: option.id || uuidv4(),
          })),
        };
      });
    }

    Object.assign(quiz, updateData);
    await quiz.save();

    res.json({ message: "Quiz updated successfully", data: quiz });
  } catch (error) {
    res.status(500).json({ message: "Error updating quiz", error });
  }
};

export const deleteQuiz = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { quizId } = req.params;
  const { userId } = getAuth(req);

  try {
    const quiz = await Quiz.get(quizId);
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    // Verify the user is the teacher of the course
    const course = await Course.get(quiz.courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    if (course.teacherId !== userId) {
      res.status(403).json({ message: "Not authorized to delete this quiz" });
      return;
    }

    await Quiz.delete(quizId);

    res.json({ message: "Quiz deleted successfully", data: quiz });
  } catch (error) {
    res.status(500).json({ message: "Error deleting quiz", error });
  }
};

export const addQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { quizId } = req.params;
  const { text, type, options, points, correctAnswerExplanation } = req.body;
  const { userId } = getAuth(req);

  try {
    const quiz = await Quiz.get(quizId);
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    // Verify the user is the teacher of the course
    const course = await Course.get(quiz.courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    if (course.teacherId !== userId) {
      res.status(403).json({ message: "Not authorized to modify this quiz" });
      return;
    }

    if (!text || !type) {
      res.status(400).json({ message: "Question text and type are required" });
      return;
    }

    // For multiple choice questions, options are required
    if (type === "MultipleChoice" && (!options || options.length < 2)) {
      res.status(400).json({
        message: "Multiple choice questions require at least 2 options",
      });
      return;
    }

    // Process options to ensure they have IDs
    const processedOptions = options
      ? options.map((option: any) => ({
          ...option,
          id: option.id || uuidv4(),
        }))
      : [];

    const newQuestion = {
      questionId: uuidv4(),
      text,
      type,
      options: processedOptions,
      points: points || 1,
      correctAnswerExplanation: correctAnswerExplanation || "",
    };

    if (!quiz.questions) {
      quiz.questions = [];
    }

    quiz.questions.push(newQuestion);
    await quiz.save();

    res.status(201).json({
      message: "Question added successfully",
      data: newQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding question", error });
  }
};

export const updateQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { quizId, questionId } = req.params;
  const updateData = { ...req.body };
  const { userId } = getAuth(req);

  try {
    const quiz = await Quiz.get(quizId);
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    // Verify the user is the teacher of the course
    const course = await Course.get(quiz.courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    if (course.teacherId !== userId) {
      res.status(403).json({ message: "Not authorized to modify this quiz" });
      return;
    }

    if (!quiz.questions) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    const questionIndex = quiz.questions.findIndex(
      (q) => q.questionId === questionId
    );

    if (questionIndex === -1) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    // Process options if they exist in the update data
    if (updateData.options) {
      updateData.options = updateData.options.map((option: any) => ({
        ...option,
        id: option.id || uuidv4(),
      }));
    }

    // Update the question
    quiz.questions[questionIndex] = {
      ...quiz.questions[questionIndex],
      ...updateData,
    };

    await quiz.save();

    res.json({
      message: "Question updated successfully",
      data: quiz.questions[questionIndex],
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating question", error });
  }
};

export const deleteQuestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { quizId, questionId } = req.params;
  const { userId } = getAuth(req);

  try {
    const quiz = await Quiz.get(quizId);
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    // Verify the user is the teacher of the course
    const course = await Course.get(quiz.courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    if (course.teacherId !== userId) {
      res.status(403).json({ message: "Not authorized to modify this quiz" });
      return;
    }

    if (!quiz.questions) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    const questionIndex = quiz.questions.findIndex(
      (q) => q.questionId === questionId
    );

    if (questionIndex === -1) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    const deletedQuestion = quiz.questions[questionIndex];
    quiz.questions.splice(questionIndex, 1);

    await quiz.save();

    res.json({
      message: "Question deleted successfully",
      data: deletedQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting question", error });
  }
};
