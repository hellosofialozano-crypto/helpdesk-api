/**
 * ------------------------------------------------------------------
 * Generic request validation middleware using Zod.
 * ------------------------------------------------------------------
 *
 * Usage:
 * router.post("/users", validate(schema), controller)
 */

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.errors.map((error) => ({
        field: error.path.join("."),
        message: error.message
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors
      });
    }

    // Replace request body with validated and sanitized data
    req.body = result.data;

    next();
  };
}

module.exports = validate;
