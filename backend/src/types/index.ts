import { Request } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}