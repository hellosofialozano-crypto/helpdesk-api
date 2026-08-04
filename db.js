const { PrismaClient } = require("@prisma/client");

/**
 * Prisma Client configuration
 * Enables verbose logging during development
 * while keeping production logs minimal.
 */
const prismaOptions = {
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "warn", "error"]
      : ["error"]
};

/**
 * Reuse the Prisma Client instance during development
 * to prevent exhausting database connections caused by
 * hot module reloading.
 */
const prisma =
  global.prisma ||
  new PrismaClient(prismaOptions);

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

module.exports = prisma;
