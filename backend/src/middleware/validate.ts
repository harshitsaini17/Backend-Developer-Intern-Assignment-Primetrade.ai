import { Response, NextFunction } from "express";
import { z } from "zod/v4";
import { AuthenticatedRequest } from "../types/index.js";
import { AppError } from "./errorHandler.js";

export const validate = (schema: z.ZodSchema) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return next(new AppError(400, "Validation failed"));
    }

    req.body = result.data;
    next();
  };
};