import { Response } from "express";
import { register, login, getMe } from "../services/authService.js";
import { AuthenticatedRequest } from "../types/index.js";
import { AppError } from "../middleware/errorHandler.js";

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               role:
 *                 type: string
 *                 enum: [USER, ADMIN]
 *                 default: USER
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
export const registerUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await register(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: result,
  });
};

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
export const loginUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const result = await login(req.body);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
};

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *       401:
 *         description: Not authenticated
 */
export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError(401, "Not authenticated");
  }

  const user = await getMe(req.user.userId);

  res.status(200).json({
    success: true,
    message: "Profile retrieved successfully",
    data: user,
  });
};