import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  jwt: {
    secret: process.env.JWT_SECRET || "fallback-secret-change-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10),
  },
  databaseUrl: process.env.DATABASE_URL || "",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
};