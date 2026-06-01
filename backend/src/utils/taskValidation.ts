import { z } from "zod/v4";

const isoDateString = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    if (typeof val === "string") {
      const d = new Date(val);
      if (!isNaN(d.getTime())) return d.toISOString();
    }
    return val;
  },
  z.string().datetime("Invalid date format").optional(),
);

const nullableIsoDate = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) return null;
    if (typeof val === "string") {
      const d = new Date(val);
      if (!isNaN(d.getTime())) return d.toISOString();
    }
    return val;
  },
  z.string().datetime("Invalid date format").nullable().optional(),
);

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(2000, "Description too long").optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).default("PENDING"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  dueDate: isoDateString,
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  dueDate: nullableIsoDate,
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;