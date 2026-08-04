const commentService = require("../services/comment.service");

/**
 * ------------------------------------------------------------------
 * Create a new comment.
 * ------------------------------------------------------------------
 */
async function create(req, res, next) {
  try {
    const response = await commentService.addComment(
      req.params.id,
      req.user.id,
      req.body.content
    );

    return res.status(201).json(response);
  } catch (error) {
    return next(error);
  }
}

/**
 * ------------------------------------------------------------------
 * List all comments from a ticket.
 * ------------------------------------------------------------------
 */
async function list(req, res, next) {
  try {
    const response =
      await commentService.listComments(
        req.params.id
      );

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
  list
};
