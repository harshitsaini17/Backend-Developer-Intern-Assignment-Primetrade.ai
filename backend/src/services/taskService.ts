import prisma from "../config/database.js";
import { CreateTaskInput, UpdateTaskInput } from "../utils/taskValidation.js";
import { AppError } from "../middleware/errorHandler.js";

export const createTask = async (data: CreateTaskInput, userId: string) => {
  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      userId,
    },
  });

  return task;
};

export const getMyTasks = async (userId: string, filters?: { status?: string; priority?: string }) => {
  const where: Record<string, unknown> = { userId };

  if (filters?.status) where.status = filters.status;
  if (filters?.priority) where.priority = filters.priority;

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return tasks;
};

export const getAllTasks = async (filters?: { status?: string; priority?: string; userId?: string }) => {
  const where: Record<string, unknown> = {};

  if (filters?.status) where.status = filters.status;
  if (filters?.priority) where.priority = filters.priority;
  if (filters?.userId) where.userId = filters.userId;

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return tasks;
};

export const getTaskById = async (taskId: string, userId: string, isAdmin: boolean) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new AppError(404, "Task not found");
  }

  if (!isAdmin && task.userId !== userId) {
    throw new AppError(403, "You are not authorized to view this task");
  }

  return task;
};

export const updateTask = async (taskId: string, data: UpdateTaskInput, userId: string, isAdmin: boolean) => {
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!existingTask) {
    throw new AppError(404, "Task not found");
  }

  if (!isAdmin && existingTask.userId !== userId) {
    throw new AppError(403, "You are not authorized to update this task");
  }

  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;

  const task = await prisma.task.update({
    where: { id: taskId },
    data: updateData,
  });

  return task;
};

export const deleteTask = async (taskId: string, userId: string, isAdmin: boolean) => {
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!existingTask) {
    throw new AppError(404, "Task not found");
  }

  if (!isAdmin && existingTask.userId !== userId) {
    throw new AppError(403, "You are not authorized to delete this task");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  return { message: "Task deleted successfully" };
};