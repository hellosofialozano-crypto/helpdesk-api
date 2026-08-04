const jwt = require("jsonwebtoken");

/**
 * ------------------------------------------------------------------
 * JWT Configuration
 * ------------------------------------------------------------------
 */

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required.");
}

const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  algorithm: "HS256"
};

/**
 * Generates a signed JWT.
 *
 * @param {Object} payload
 * @returns {string}
 */
function signToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
    algorithm: jwtConfig.algorithm
  });
}

/**
 * Verifies and decodes a JWT.
 *
 * @param {string} token
 * @returns {Object}
 */
function verifyToken(token) {
  return jwt.verify(token, jwtConfig.secret, {
    algorithms: [jwtConfig.algorithm]
  });
}

module.exports = {
  signToken,
  verifyToken
};
