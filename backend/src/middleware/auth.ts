import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { AuthenticatedRequest } from "../types/index.js";
import { AppError } from "./errorHandler.js";

export const authenticate = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(401, "Access denied. No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string; email: string; role: string };

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch {
    throw new AppError(401, "Invalid or expired token");
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(401, "User not authenticated");
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(403, "Access denied. Insufficient permissions");
    }

    next();
  };
};