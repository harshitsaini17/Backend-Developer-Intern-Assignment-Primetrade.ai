import { Router } from "express";
import {
  createTaskHandler,
  getMyTasksHandler,
  getAllTasksHandler,
  getTaskByIdHandler,
  updateTaskHandler,
  deleteTaskHandler,
} from "../controllers/taskController.js";
import { validate } from "../middleware/validate.js";
import { createTaskSchema, updateTaskSchema } from "../utils/taskValidation.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

router.use(authenticate);

router.post("/", validate(createTaskSchema), createTaskHandler);
router.get("/all", authorize("ADMIN"), getAllTasksHandler);
router.get("/", getMyTasksHandler);
router.get("/:id", getTaskByIdHandler);
router.put("/:id", validate(updateTaskSchema), updateTaskHandler);
router.delete("/:id", deleteTaskHandler);

export default router;