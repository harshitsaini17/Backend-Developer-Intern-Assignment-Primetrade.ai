import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/database.js";
import { config } from "../config/env.js";
import { RegisterInput, LoginInput } from "../utils/authValidation.js";
import { AppError } from "../middleware/errorHandler.js";

export const register = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError(409, "User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, config.bcrypt.saltRounds);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  const token = generateToken(user.id, user.email, user.role);

  return { user, token };
};

export const login = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = generateToken(user.id, user.email, user.role);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const generateToken = (userId: string, email: string, role: string): string => {
  return jwt.sign(
    { userId, email, role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn } as jwt.SignOptions,
  );
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
};