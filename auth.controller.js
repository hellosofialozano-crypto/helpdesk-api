const authService = require("../services/auth.service");

/**
 * ------------------------------------------------------------------
 * Register a new user.
 * ------------------------------------------------------------------
 */
async function register(req, res, next) {
  try {
    const response = await authService.register(req.body);

    return res.status(201).json(response);
  } catch (error) {
    return next(error);
  }
}

/**
 * ------------------------------------------------------------------
 * Authenticate an existing user.
 * ------------------------------------------------------------------
 */
async function login(req, res, next) {
  try {
    const response = await authService.login(req.body);

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login
};
