import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@primetrade.ai";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("Admin user already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("Admin@123456", 12);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`Admin user created: ${admin.email}`);

  const demoUser = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@primetrade.ai",
      password: await bcrypt.hash("Demo@123456", 12),
      role: "USER",
    },
  });

  console.log(`Demo user created: ${demoUser.email}`);

  await prisma.task.createMany({
    data: [
      {
        title: "Set up CI/CD pipeline",
        description: "Configure GitHub Actions for automated deployment",
        status: "IN_PROGRESS",
        priority: "HIGH",
        userId: admin.id,
      },
      {
        title: "Write API documentation",
        description: "Complete Swagger docs for all endpoints",
        status: "PENDING",
        priority: "MEDIUM",
        userId: admin.id,
      },
      {
        title: "Implement rate limiting",
        description: "Add request rate limiting middleware",
        status: "PENDING",
        priority: "LOW",
        userId: demoUser.id,
      },
    ],
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });