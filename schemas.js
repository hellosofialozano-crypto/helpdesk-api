const { z } = require("zod");

/**
 * ------------------------------------------------------------------
 * Shared Enums
 * ------------------------------------------------------------------
 */

const TicketPriority = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT"
];

const TicketStatus = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED"
];

/**
 * ------------------------------------------------------------------
 * Authentication
 * ------------------------------------------------------------------
 */

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters.")
    .max(120, "Name cannot exceed 120 characters."),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address."),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters.")
    .max(100, "Password cannot exceed 100 characters.")
}).strict();

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address."),

  password: z
    .string()
    .min(1, "Password is required.")
}).strict();

/**
 * ------------------------------------------------------------------
 * Tickets
 * ------------------------------------------------------------------
 */

const createTicketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must contain at least 3 characters.")
    .max(150, "Title cannot exceed 150 characters."),

  description: z
    .string()
    .trim()
    .min(5, "Description must contain at least 5 characters.")
    .max(5000, "Description cannot exceed 5000 characters."),

  priority: z
    .enum(TicketPriority)
    .optional()
}).strict();

const updateTicketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3)
    .max(150)
    .optional(),

  description: z
    .string()
    .trim()
    .min(5)
    .max(5000)
    .optional(),

  status: z
    .enum(TicketStatus)
    .optional(),

  priority: z
    .enum(TicketPriority)
    .optional(),

  assignedToId: z
    .string()
    .uuid()
    .nullable()
    .optional()
})
.strict()
.refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided."
  }
);

/**
 * ------------------------------------------------------------------
 * Comments
 * ------------------------------------------------------------------
 */

const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty.")
    .max(2000, "Comment cannot exceed 2000 characters.")
}).strict();

module.exports = {
  registerSchema,
  loginSchema,
  createTicketSchema,
  updateTicketSchema,
  createCommentSchema
};
