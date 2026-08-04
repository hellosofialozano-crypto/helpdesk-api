const bcrypt = require("bcryptjs");

const prisma = require("../config/db");
const { signToken } = require("../utils/jwt");

const SALT_ROUNDS = 10;

/**
 * Creates a standardized application error.
 *
 * @param {number} status
 * @param {string} message
 * @returns {Error}
 */
function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

/**
 * Removes sensitive information from the user object.
 *
 * @param {Object} user
 * @returns {Object}
 */
function buildUserResponse(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

/**
 * Registers a new user.
 *
 * @param {Object} data
 * @returns {Promise<Object>}
 */
async function register({ name, email, password }) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (existingUser) {
    throw createError(
      409,
      "An account with this email already exists."
    );
  }

  const hashedPassword = await bcrypt.hash(
    password,
    SALT_ROUNDS
  );

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  });

  const token = signToken({
    id: user.id,
    role: user.role
  });

  return {
    user: buildUserResponse(user),
    token
  };
}

/**
 * Authenticates a user.
 *
 * @param {Object} credentials
 * @returns {Promise<Object>}
 */
async function login({ email, password }) {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!user) {
    throw createError(
      401,
      "Invalid email or password."
    );
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw createError(
      401,
      "Invalid email or password."
    );
  }

  const token = signToken({
    id: user.id,
    role: user.role
  });

  return {
    user: buildUserResponse(user),
    token
  };
}

module.exports = {
  register,
  login
};
