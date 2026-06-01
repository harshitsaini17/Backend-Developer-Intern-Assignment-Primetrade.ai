import { z } from "zod/v4";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(2000, "Description too long").optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).default("PENDING"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  dueDate: z.string().datetime("Invalid date format").optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  dueDate: z.string().datetime("Invalid date format").optional().nullable(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;