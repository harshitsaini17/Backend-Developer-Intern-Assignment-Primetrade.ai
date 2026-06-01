import { Response } from "express";
import {
  createTask,
  getMyTasks,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../services/taskService.js";
import { AuthenticatedRequest } from "../types/index.js";

function getParam(req: AuthenticatedRequest, name: string): string {
  const val = req.params[name];
  return Array.isArray(val) ? val[0] : val;
}

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Task created successfully
 *       401:
 *         description: Not authenticated
 */
export const createTaskHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const task = await createTask(req.body, req.user!.userId);

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: task,
  });
};

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get user's tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH]
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 */
export const getMyTasksHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const priority = typeof req.query.priority === "string" ? req.query.priority : undefined;
  const tasks = await getMyTasks(req.user!.userId, { status, priority });

  res.status(200).json({
    success: true,
    message: "Tasks retrieved successfully",
    data: tasks,
  });
};

/**
 * @swagger
 * /api/v1/tasks/all:
 *   get:
 *     summary: Get all tasks (admin only)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: All tasks retrieved successfully
 *       403:
 *         description: Admin access required
 */
export const getAllTasksHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const priority = typeof req.query.priority === "string" ? req.query.priority : undefined;
  const userId = typeof req.query.userId === "string" ? req.query.userId : undefined;
  const tasks = await getAllTasks({ status, priority, userId });

  res.status(200).json({
    success: true,
    message: "All tasks retrieved successfully",
    data: tasks,
  });
};

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *       404:
 *         description: Task not found
 */
export const getTaskByIdHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const task = await getTaskById(
    getParam(req, "id"),
    req.user!.userId,
    req.user!.role === "ADMIN",
  );

  res.status(200).json({
    success: true,
    message: "Task retrieved successfully",
    data: task,
  });
};

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *               dueDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       404:
 *         description: Task not found
 */
export const updateTaskHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const task = await updateTask(
    getParam(req, "id"),
    req.body,
    req.user!.userId,
    req.user!.role === "ADMIN",
  );

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: task,
  });
};

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
export const deleteTaskHandler = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await deleteTask(
    getParam(req, "id"),
    req.user!.userId,
    req.user!.role === "ADMIN",
  );

  res.status(200).json({
    success: true,
    data: result,
  });
};