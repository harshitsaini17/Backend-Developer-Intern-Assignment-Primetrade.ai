import { Router } from "express";
import { registerUser, loginUser, getProfile } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../utils/authValidation.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.get("/me", authenticate, getProfile);

export default router;