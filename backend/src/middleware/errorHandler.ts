import { Response, NextFunction } from "express";
import { ApiResponse } from "../types/index.js";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Express.Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      message: err.message,
    };
    res.status(err.statusCode).json(response);
    return;
  }

  console.error("Unhandled error:", err);
  const response: ApiResponse = {
    success: false,
    message: "Internal server error",
  };
  res.status(500).json(response);
};

export const notFound = (_req: Express.Request, res: Response): void => {
  const response: ApiResponse = {
    success: false,
    message: "Route not found",
  };
  res.status(404).json(response);
};