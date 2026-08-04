const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./docs/swagger");
const authRoutes = require("./routes/auth.routes");
const ticketRoutes = require("./routes/ticket.routes");
const {
  notFoundHandler,
  errorHandler
} = require("./middlewares/errorHandler");

const app = express();

const isTest = process.env.NODE_ENV === "test";

/**
 * ------------------------------------------------------------------
 * Security
 * ------------------------------------------------------------------
 */

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin"
    }
  })
);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true
  })
);

/**
 * ------------------------------------------------------------------
 * Body Parsers
 * ------------------------------------------------------------------
 */

app.use(
  express.json({
    limit: "1mb"
  })
);

app.use(
  express.urlencoded({
    extended: true
  })
);

/**
 * ------------------------------------------------------------------
 * Logger
 * ------------------------------------------------------------------
 */

app.use(
  morgan(isTest ? "silent" : "dev")
);

/**
 * ------------------------------------------------------------------
 * Rate Limiter
 * ------------------------------------------------------------------
 */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

app.use(limiter);

/**
 * ------------------------------------------------------------------
 * Health & API Info
 * ------------------------------------------------------------------
 */

app.get("/", (req, res) => {
  res.status(200).json({
    name: "HelpDesk API",
    version: "1.0.0",
    description:
      "Production-inspired REST API for modern customer support platforms.",
    documentation: "/api/docs",
    health: "/health"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

/**
 * ------------------------------------------------------------------
 * API Documentation
 * ------------------------------------------------------------------
 */

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "HelpDesk API Documentation"
  })
);

/**
 * ------------------------------------------------------------------
 * API Routes
 * ------------------------------------------------------------------
 */

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

/**
 * ------------------------------------------------------------------
 * Error Handling
 * ------------------------------------------------------------------
 */

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
