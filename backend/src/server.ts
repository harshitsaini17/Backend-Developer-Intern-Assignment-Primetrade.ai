import { config } from "./config/env.js";
import prisma from "./config/database.js";
import app from "./app.js";

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
      console.log(`API Documentation: http://localhost:${config.port}/api-docs`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Database disconnected");
  process.exit(0);
});

startServer();