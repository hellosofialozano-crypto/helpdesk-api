const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "HelpDesk API",
      version: "1.0.0",
      description: `
## Modern Customer Support Infrastructure

A production-inspired REST API designed to simulate the backend of a modern Help Desk platform.

Built with **Node.js**, **Express**, **Prisma ORM** and **PostgreSQL**, the API provides authentication, role-based authorization, ticket management, comments, audit history, pagination and interactive OpenAPI documentation.

This project demonstrates backend engineering practices commonly adopted in production environments, focusing on clean architecture, maintainability, security and developer experience.
      `,
      contact: {
        name: "Sofia Lozano",
        url: "https://github.com/SEU-USUARIO"
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT"
      }
    },

    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Local Development"
      },
      {
        url: "https://api.example.com/api",
        description: "Production (Example)"
      }
    ],

    tags: [
      {
        name: "Authentication",
        description: "User registration, authentication and authorization."
      },
      {
        name: "Tickets",
        description: "Support ticket lifecycle management."
      },
      {
        name: "Comments",
        description: "Ticket discussion and collaboration."
      },
      {
        name: "Users",
        description: "User profile and role management."
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token."
        }
      },

      schemas: {

        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false
            },
            message: {
              type: "string",
              example: "Unauthorized."
            }
          }
        },

        Pagination: {
          type: "object",
          properties: {
            page: {
              type: "integer",
              example: 1
            },
            limit: {
              type: "integer",
              example: 10
            },
            total: {
              type: "integer",
              example: 57
            },
            totalPages: {
              type: "integer",
              example: 6
            }
          }
        }

      }
    },

    security: [
      {
        bearerAuth: []
      }
    ]
  },

  apis: [
    "./src/routes/*.js"
  ]
};

module.exports = swaggerJsdoc(options);
