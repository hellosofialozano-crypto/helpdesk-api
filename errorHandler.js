/**
 * ------------------------------------------------------------------
 * 404 - Route Not Found
 * ------------------------------------------------------------------
 */

function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    message: "Route not found.",
    method: req.method,
    path: req.originalUrl
  });
}

/**
 * ------------------------------------------------------------------
 * Global Error Handler
 * ------------------------------------------------------------------
 */

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const isDevelopment = process.env.NODE_ENV === "development";

  if (isDevelopment) {
    console.error(err);
  }

  /**
   * Prisma Errors
   */

  switch (err.code) {
    case "P2002":
      return res.status(409).json({
        success: false,
        message: "A resource with these unique values already exists."
      });

    case "P2003":
      return res.status(400).json({
        success: false,
        message: "Invalid relationship reference."
      });

    case "P2025":
      return res.status(404).json({
        success: false,
        message: "Resource not found."
      });

    case "P2021":
      return res.status(500).json({
        success: false,
        message: "Database table not found."
      });

    case "P2022":
      return res.status(500).json({
        success: false,
        message: "Database column not found."
      });

    default:
      break;
  }

  const status = err.status || 500;

  const response = {
    success: false,
    message:
      status === 500 && !isDevelopment
        ? "Internal server error."
        : err.message || "Internal server error."
  };

  if (isDevelopment && err.stack) {
    response.stack = err.stack;
  }

  return res.status(status).json(response);
}

module.exports = {
  notFoundHandler,
  errorHandler
};
