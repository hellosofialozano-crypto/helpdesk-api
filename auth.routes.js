const express = require("express");

const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");
const {
  registerSchema,
  loginSchema
} = require("../schemas");

const router = express.Router();

/**
 * ------------------------------------------------------------------
 * Register
 * ------------------------------------------------------------------
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Creates a new account and returns the authenticated user with a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       201:
 *         description: User successfully registered.
 *       400:
 *         description: Validation failed.
 *       409:
 *         description: Email already exists.
 *       500:
 *         description: Internal server error.
 */

router.post(
  "/register",
  validate(registerSchema),
  authController.register
);

/**
 * ------------------------------------------------------------------
 * Login
 * ------------------------------------------------------------------
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Authenticate user
 *     description: Authenticates a user and returns a JWT access token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Authentication successful.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Invalid email or password.
 *       500:
 *         description: Internal server error.
 */

router.post(
  "/login",
  validate(loginSchema),
  authController.login
);

module.exports = router;
