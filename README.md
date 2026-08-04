# SOFIE'S HelpDesk API

> Modern customer support infrastructure built for scalable support teams.

A production-inspired REST API that simulates the backend of a modern Help Desk platform. Built with clean architecture principles, authentication, role-based authorization, ticket management, audit history, comments and interactive API documentation.

Designed as a portfolio project to demonstrate backend engineering practices commonly used in real-world SaaS applications.

---

## ✨ Overview

The HelpDesk API provides everything required to manage customer support tickets while maintaining a scalable and maintainable architecture.

### Core Features

### 🔐 Authentication & Authorization

- JWT Authentication
- Secure Password Hashing
- Role-Based Access Control (USER, AGENT, ADMIN)
- Protected Routes

### 🎫 Ticket Management

- Create, Read, Update and Delete Tickets
- Status Workflow
  - OPEN
  - IN_PROGRESS
  - RESOLVED
  - CLOSED
- Priority Levels
  - LOW
  - MEDIUM
  - HIGH
  - URGENT
- Search
- Filters
- Pagination

### 💬 Collaboration

- Ticket Comments
- Automatic Activity History
- Audit Trail

### ⚙ Developer Experience

- Prisma ORM
- Swagger / OpenAPI Documentation
- Zod Validation
- Docker Ready
- Automated Tests
- Environment Configuration

---

# 🏗 Architecture

The project follows a layered architecture to separate HTTP concerns from business rules, making the application easier to maintain and scale.

```

Client

↓

REST API

↓

Routes

↓

Controllers

↓

Services

↓

Prisma ORM

↓

PostgreSQL

```

---

# 🛠 Tech Stack

| Backend | Database | Quality | DevOps |
|----------|----------|---------|---------|
| Node.js | PostgreSQL | Jest | Docker |
| Express | Prisma ORM | Supertest | Docker Compose |
| JWT | | Swagger | Git |
| Zod | | REST API | |

---

# 📁 Project Structure

```

helpdesk-api/

├── prisma/
│ ├── schema.prisma
│ └── seed.js
│
├── src/
│ ├── config/
│ ├── controllers/
│ ├── middlewares/
│ ├── routes/
│ ├── services/
│ ├── docs/
│ ├── utils/
│ ├── schemas.js
│ ├── app.js
│ └── server.js
│
├── tests/
├── Dockerfile
├── docker-compose.yml
├── package.json
└── .env.example

```

---

# 🚀 Quick Start

## Clone the repository

```bash
git clone https://github.com/yourusername/helpdesk-api.git

cd helpdesk-api
```

## Install dependencies

```bash
npm install
```

## Configure environment

```bash
cp .env.example .env
```

Update your database connection inside the `.env` file.

---

## Run database migrations

```bash
npx prisma migrate dev
```

---

## Seed sample data (optional)

```bash
npm run prisma:seed
```

---

## Start development server

```bash
npm run dev
```

The API will be available at

```
http://localhost:3000
```

---

# 🐳 Running with Docker

```bash
docker compose up --build
```

Docker automatically starts:

- PostgreSQL
- API Server
- Database migrations

---

# 📚 API Documentation

Once the application is running, open:

```
http://localhost:3000/api/docs
```

Swagger provides a complete interactive interface where every endpoint can be explored and tested directly from the browser.

---

# 🔑 Main Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |

---

## Tickets

| Method | Endpoint |
|---------|----------|
| GET | /api/tickets |
| POST | /api/tickets |
| GET | /api/tickets/:id |
| PATCH | /api/tickets/:id |
| DELETE | /api/tickets/:id |

---

## Comments

| Method | Endpoint |
|---------|----------|
| POST | /api/tickets/:id/comments |
| GET | /api/tickets/:id/comments |

---

All protected routes require:

```
Authorization: Bearer <JWT_TOKEN>
```

---

# 📦 Example Request

```http
POST /api/tickets
```

```json
{
  "title": "Unable to login",
  "description": "User cannot access dashboard.",
  "priority": "HIGH"
}
```

---

# ✅ Example Response

```json
{
  "id": 1,
  "title": "Unable to login",
  "status": "OPEN",
  "priority": "HIGH",
  "createdAt": "2026-08-04T18:00:00Z"
}
```

---

# 🔒 Security

The API includes several security practices commonly adopted in production systems.

- JWT Authentication
- Password Hashing
- Input Validation
- Protected Routes
- Role-Based Permissions
- Environment Variables

---

# 🧪 Testing

Run all automated tests.

```bash
npm test
```

Current test coverage includes:

- Authentication
- Authorization
- Ticket CRUD
- Comments
- Filters
- Pagination
- Activity History

---

# 👥 Seed Users

| Email | Password | Role |
|--------|----------|------|
| admin@helpdesk.com | senha123 | ADMIN |
| agente@helpdesk.com | senha123 | AGENT |
| cliente@helpdesk.com | senha123 | USER |

---

# 🗺 Roadmap

## Completed

- JWT Authentication
- Prisma ORM
- PostgreSQL
- Swagger Documentation
- Docker Support
- Input Validation
- Audit History
- Ticket Comments
- Pagination
- Search & Filters

---

## Next Steps

- Email Notifications
- File Attachments
- Redis Cache
- Rate Limiting
- GitHub Actions CI/CD
- Monitoring
- WebSockets
- Multi-tenancy
- Metrics Dashboard

---

# 💡 Why This Project?

This project was created to demonstrate backend engineering practices frequently used in production environments while simulating the infrastructure of a modern customer support platform.

Rather than focusing only on CRUD operations, the project emphasizes architecture, maintainability, documentation, security and developer experience.

---

# 📄 License

This project is licensed under the MIT License.

---

<div align="center">

# SOFIE'S

### Software Engineering

Modern Backend Development • Clean Architecture • REST APIs

Designed & Developed by **Sofia Lozano**

</div>
