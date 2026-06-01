# Backend Developer (Intern) – Assignment (Primetrade.ai)

A scalable REST API with JWT authentication, role-based access control (RBAC), and task management CRUD — paired with a React frontend for demonstration.

## Demo

[demo](https://github.com/user-attachments/assets/cc6fa530-ab41-4df4-9bc9-b7b02855acab)

> A walkthrough video (`demo.mp4`) is included in the repository root showing the full login, dashboard, and CRUD flow.

## Tech Stack

### Backend
- **Node.js** + **Express 5** + **TypeScript**
- **PostgreSQL** + **Prisma ORM** (database & migrations)
- **JWT** (JSON Web Tokens) for authentication
- **bcryptjs** for password hashing
- **Zod** for input validation
- **Swagger/OpenAPI** for API documentation
- **Helmet**, **CORS**, **Morgan** (security & logging)

### Frontend
- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
- **React Router** for routing
- **Axios** for HTTP client

### Infrastructure
- **Docker Compose** (PostgreSQL + Redis)
- Environment-based configuration

---

## Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- npm

### 1. Clone & Install

```bash
git clone https://github.com/harshitsaini17/Backend-Developer-Intern-Assignment-Primetrade.ai.git
cd Backend-Developer-Intern-Assignment-Primetrade.ai

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Start Database

```bash
# From project root
docker compose up -d
```

This starts PostgreSQL (port 5432) and Redis (port 6379).

### 3. Configure Environment

```bash
cd backend
cp .env.example .env
# Adjust .env if needed (default values work with Docker setup)
```

### 4. Run Database Migrations & Seed

```bash
cd backend
npx prisma migrate dev
npm run db:seed
```

### 5. Start Backend

```bash
cd backend
npm run dev
```

Backend runs at **http://localhost:5000**

### 6. Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at **http://localhost:5173**

### Demo Accounts

| Role  | Email                  | Password       |
|-------|------------------------|----------------|
| Admin | admin@primetrade.ai    | Admin@123456   |
| User  | demo@primetrade.ai     | Demo@123456    |

---

## API Documentation

Swagger UI is available at **http://localhost:5000/api-docs** when the server is running.

### API Endpoints

#### Authentication

| Method | Endpoint              | Description          | Auth |
|--------|-----------------------|----------------------|------|
| POST   | `/api/v1/auth/register` | Register new user    | No   |
| POST   | `/api/v1/auth/login`    | Login & get JWT      | No   |
| GET    | `/api/v1/auth/me`       | Get current profile  | Yes  |

#### Tasks (Protected)

| Method | Endpoint                | Description              | Auth  | Role  |
|--------|--------------------------|--------------------------|-------|-------|
| POST   | `/api/v1/tasks`          | Create a task            | JWT   | User  |
| GET    | `/api/v1/tasks`          | Get user's tasks         | JWT   | User  |
| GET    | `/api/v1/tasks/all`      | Get all tasks            | JWT   | Admin |
| GET    | `/api/v1/tasks/:id`      | Get single task          | JWT   | Owner/Admin |
| PUT    | `/api/v1/tasks/:id`      | Update task              | JWT   | Owner/Admin |
| DELETE | `/api/v1/tasks/:id`      | Delete task              | JWT   | Owner/Admin |

#### Query Parameters (GET /tasks & GET /tasks/all)

- `status` — Filter by: PENDING, IN_PROGRESS, COMPLETED, CANCELLED
- `priority` — Filter by: LOW, MEDIUM, HIGH
- `userId` — Filter by user (admin only)

### Example Requests

```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Password123"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@primetrade.ai","password":"Admin@123456"}'

# Create Task (use token from login response)
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{"title":"New Task","description":"Task details","priority":"HIGH"}'

# Get All Tasks (Admin)
curl http://localhost:5000/api/v1/tasks/all \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

## Database Schema

### User Model

| Field     | Type     | Description             |
|-----------|----------|-------------------------|
| id        | UUID     | Primary key             |
| email     | String   | Unique email            |
| name      | String   | User's full name        |
| password  | String   | Bcrypt hashed password  |
| role      | Enum     | USER or ADMIN           |
| createdAt | DateTime | Auto-generated          |
| updatedAt | DateTime | Auto-updated            |

### Task Model

| Field       | Type     | Description                        |
|-------------|----------|------------------------------------|
| id          | UUID     | Primary key                        |
| title       | String   | Task title                         |
| description | String?  | Optional description               |
| status      | Enum     | PENDING, IN_PROGRESS, COMPLETED, CANCELLED |
| priority    | Enum     | LOW, MEDIUM, HIGH                  |
| dueDate     | DateTime?| Optional due date                  |
| userId      | UUID     | Foreign key → User.id              |
| createdAt   | DateTime | Auto-generated                    |
| updatedAt   | DateTime | Auto-updated                      |

### Entity Relationship

```
User (1) ──────< (N) Task
```

---

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database & environment config
│   ├── controllers/     # Route handlers (auth, task)
│   ├── docs/            # Swagger configuration
│   ├── middleware/       # Auth, validation, error handling
│   ├── routes/          # v1 API routes
│   ├── services/        # Business logic layer
│   ├── types/            # TypeScript types & interfaces
│   ├── utils/            # Zod validation schemas
│   ├── app.ts            # Express app setup
│   └── server.ts         # Entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── seed.ts           # Seed data script
│   └── migrations/       # DB migrations
├── .env.example
├── tsconfig.json
└── package.json

frontend/
├── src/
│   ├── api/              # Axios client & API modules
│   ├── components/       # Navbar, Toast, ProtectedRoute
│   ├── context/          # AuthContext (JWT state)
│   ├── pages/            # Login, Register, Dashboard
│   ├── types/             # TypeScript interfaces
│   ├── App.tsx            # Router setup
│   └── main.tsx           # Entry point
├── .env
├── vite.config.ts
└── package.json
```

---

## Scalability Note

This project is designed with scalability in mind:

### Current Architecture
- **Layered separation**: Controllers → Services → Prisma (clean separation of concerns)
- **API versioning**: All routes under `/api/v1/` — easy to add v2 without breaking v1
- **Database indexing**: Indexed `userId` on Task table for fast user-scoped queries
- **Environment-based config**: Secrets externalized to `.env`, production-ready

### Scaling Path

| Concern              | Approach                                                                 |
|----------------------|--------------------------------------------------------------------------|
| **Microservices**    | Split auth service & task service into independent deployable units       |
| **Horizontal Scaling**| Add stateless API replicas behind a load balancer (Nginx/HAProxy)       |
| **Caching**          | Redis already provisioned in Docker Compose — add caching middleware for frequently accessed tasks |
| **Database Scaling** | Read replicas for heavy read workloads; connection pooling via PgBouncer |
| **Message Queue**    | RabbitMQ/Kafka for async operations (email notifications, task reminders) |
| **API Gateway**       | Kong or AWS API Gateway for rate limiting, throttling, request routing   |
| **Container Orchestration** | Kubernetes for auto-scaling, self-healing, rolling deployments     |

### Security Considerations (Implemented)
- Password hashing with bcrypt (12 salt rounds)
- JWT authentication with configurable expiry
- Role-based access control (RBAC)
- Input validation with Zod schemas
- Helmet for HTTP security headers
- CORS configurable by origin
- Request body size limiting (10kb)

### Security Considerations (Production Recommendations)
- Add rate limiting (express-rate-limit)
- Use HTTPS everywhere
- Store JWT secrets in a vault (AWS Secrets Manager, HashiCorp Vault)
- Add request logging with correlation IDs
- Implement refresh token rotation
- Add 2FA/MFA option

---

## Available Scripts

### Backend
```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run db:migrate   # Run Prisma migrations
npm run db:seed      # Seed database with demo data
npm run db:studio    # Open Prisma Studio (DB GUI)
```

### Frontend
```bash
npm run dev          # Start dev server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## License

This project is created for the Primetrade.ai Backend Developer Intern assignment.
