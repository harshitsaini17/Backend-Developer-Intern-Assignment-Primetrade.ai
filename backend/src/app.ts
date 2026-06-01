import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import swaggerUi from "swagger-ui-express";
import specs from "./docs/swagger.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));

app.get("/api/v1/health", (_req, res) => {
  res.json({ success: true, message: "API is running", version: "1.0.0" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(notFound);
app.use(errorHandler);

export default app;