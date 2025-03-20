import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import StudentProgress from "../models/studentProgressModel";
import { v4 as uuidv4 } from "uuid";

/**
 * Get a student's progress data
 */
export const getStudentProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const auth = getAuth(req);

  // Verify user is authorized to access this data
  if (!auth || auth.userId !== userId) {
    res.status(403).json({ message: "Access denied" });
    return;
  }

  try {
    const progress = await StudentProgress.get({ userId });

    if (!progress) {
      // Create initial empty progress if none exists
      const newProgress = new StudentProgress({
        userId,
        lessonAccessHistory: [],
        quizAttempts: [],
        discussionActivities: [],
        lastActive: new Date().toISOString(),
      });

      await newProgress.save();

      res.json({
        message: "Student progress initialized",
        data: newProgress,
      });
      return;
    }

    res.json({
      message: "Student progress retrieved successfully",
      data: progress,
    });
  } catch (error) {
    console.error("Error retrieving student progress:", error);
    res.status(500).json({
      message: "Error retrieving student progress",
      error,
    });
  }
};

/**
 * Record a lesson access event
 */
export const recordLessonAccess = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const { courseId, sectionId, chapterId } = req.body;
  const auth = getAuth(req);

  // Verify user is authorized to update this data
  if (!auth || auth.userId !== userId) {
    res.status(403).json({ message: "Access denied" });
    return;
  }

  // Validate required fields
  if (!courseId || !sectionId || !chapterId) {
    res.status(400).json({
      message:
        "Missing required fields: courseId, sectionId, and chapterId are required",
    });
    return;
  }

  try {
    let progress = await StudentProgress.get({ userId });
    const currentTime = new Date().toISOString();

    if (!progress) {
      // Create new progress record if none exists
      progress = new StudentProgress({
        userId,
        lessonAccessHistory: [
          {
            courseId,
            sectionId,
            chapterId,
            accessTimestamp: currentTime,
          },
        ],
        quizAttempts: [],
        discussionActivities: [],
        lastActive: currentTime,
      });
    } else {
      // Add new lesson access to existing record
      progress.lessonAccessHistory.push({
        courseId,
        sectionId,
        chapterId,
        accessTimestamp: currentTime,
      });
      progress.lastActive = currentTime;
    }

    await progress.save();

    res.json({
      message: "Lesson access recorded successfully",
      data: progress,
    });
  } catch (error) {
    console.error("Error recording lesson access:", error);
    res.status(500).json({
      message: "Error recording lesson access",
      error,
    });
  }
};

/**
 * Record a quiz attempt
 */
export const recordQuizAttempt = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const { quizId, courseId, score, timeTaken, completed } = req.body;
  const auth = getAuth(req);

  // Verify user is authorized to update this data
  if (!auth || auth.userId !== userId) {
    res.status(403).json({ message: "Access denied" });
    return;
  }

  // Validate required fields
  if (!quizId || !courseId || score === undefined) {
    res.status(400).json({
      message:
        "Missing required fields: quizId, courseId, and score are required",
    });
    return;
  }

  try {
    let progress = await StudentProgress.get({ userId });
    const currentTime = new Date().toISOString();

    if (!progress) {
      // Create new progress record if none exists
      progress = new StudentProgress({
        userId,
        lessonAccessHistory: [],
        quizAttempts: [
          {
            quizId,
            courseId,
            attemptTimestamp: currentTime,
            score,
            timeTaken,
            completed: completed !== undefined ? completed : true,
          },
        ],
        discussionActivities: [],
        lastActive: currentTime,
      });
    } else {
      // Add new quiz attempt to existing record
      progress.quizAttempts.push({
        quizId,
        courseId,
        attemptTimestamp: currentTime,
        score,
        timeTaken,
        completed: completed !== undefined ? completed : true,
      });
      progress.lastActive = currentTime;
    }

    await progress.save();

    res.json({
      message: "Quiz attempt recorded successfully",
      data: progress,
    });
  } catch (error) {
    console.error("Error recording quiz attempt:", error);
    res.status(500).json({
      message: "Error recording quiz attempt",
      error,
    });
  }
};

/**
 * Record a discussion activity
 */
export const recordDiscussionActivity = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const { courseId, sectionId, chapterId, activityType, commentId } = req.body;
  const auth = getAuth(req);

  // Verify user is authorized to update this data
  if (!auth || auth.userId !== userId) {
    res.status(403).json({ message: "Access denied" });
    return;
  }

  // Validate required fields
  if (!courseId || !activityType) {
    res.status(400).json({
      message:
        "Missing required fields: courseId and activityType are required",
    });
    return;
  }

  // Validate activity type
  const validActivityTypes = ["Comment", "Reply", "Reaction"];
  if (!validActivityTypes.includes(activityType)) {
    res.status(400).json({
      message: `Invalid activityType. Must be one of: ${validActivityTypes.join(
        ", "
      )}`,
    });
    return;
  }

  try {
    let progress = await StudentProgress.get({ userId });
    const currentTime = new Date().toISOString();

    if (!progress) {
      // Create new progress record if none exists
      progress = new StudentProgress({
        userId,
        lessonAccessHistory: [],
        quizAttempts: [],
        discussionActivities: [
          {
            courseId,
            sectionId,
            chapterId,
            activityType,
            commentId,
            timestamp: currentTime,
          },
        ],
        lastActive: currentTime,
      });
    } else {
      // Add new discussion activity to existing record
      progress.discussionActivities.push({
        courseId,
        sectionId,
        chapterId,
        activityType,
        commentId,
        timestamp: currentTime,
      });
      progress.lastActive = currentTime;
    }

    await progress.save();

    res.json({
      message: "Discussion activity recorded successfully",
      data: progress,
    });
  } catch (error) {
    console.error("Error recording discussion activity:", error);
    res.status(500).json({
      message: "Error recording discussion activity",
      error,
    });
  }
};

/**
 * Get student statistics
 */
export const getStudentStatistics = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const auth = getAuth(req);

  // Verify user is authorized to access this data
  if (!auth || auth.userId !== userId) {
    res.status(403).json({ message: "Access denied" });
    return;
  }

  try {
    const progress = await StudentProgress.get({ userId });

    if (!progress) {
      res
        .status(404)
        .json({ message: "No progress data found for this student" });
      return;
    }

    // Calculate various statistics
    const stats = {
      totalLessonsAccessed: progress.lessonAccessHistory.length,
      uniqueLessonsAccessed: new Set(
        progress.lessonAccessHistory.map(
          (access: any) =>
            `${access.courseId}:${access.sectionId}:${access.chapterId}`
        )
      ).size,

      totalQuizAttempts: progress.quizAttempts.length,
      uniqueQuizAttempts: new Set(
        progress.quizAttempts.map((attempt: any) => attempt.quizId)
      ).size,
      averageQuizScore:
        progress.quizAttempts.length > 0
          ? progress.quizAttempts.reduce(
              (sum: number, attempt: any) => sum + attempt.score,
              0
            ) / progress.quizAttempts.length
          : 0,

      totalDiscussionActivities: progress.discussionActivities.length,
      discussionBreakdown: {
        comments: progress.discussionActivities.filter(
          (activity: any) => activity.activityType === "Comment"
        ).length,
        replies: progress.discussionActivities.filter(
          (activity: any) => activity.activityType === "Reply"
        ).length,
        reactions: progress.discussionActivities.filter(
          (activity: any) => activity.activityType === "Reaction"
        ).length,
      },

      mostAccessedCourses: getTopItems(
        progress.lessonAccessHistory,
        "courseId",
        5
      ),
      lastActive: progress.lastActive,
    };

    res.json({
      message: "Student statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Error retrieving student statistics:", error);
    res.status(500).json({
      message: "Error retrieving student statistics",
      error,
    });
  }
};

// Helper function to get the most frequent items in an array
function getTopItems(array: any[], key: string, limit: number) {
  const frequency: any = {};

  // Count frequency of each item
  array.forEach((item) => {
    const value = item[key];
    frequency[value] = (frequency[value] || 0) + 1;
  });

  // Convert to array of {value, count} and sort by count (descending)
  return Object.entries(frequency)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => (b.count as number) - (a.count as number))
    .slice(0, limit);
}
