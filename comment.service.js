const prisma = require("../config/db");

/**
 * ------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------
 */

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
 * ------------------------------------------------------------------
 * Adds a comment to a ticket.
 * ------------------------------------------------------------------
 */

async function addComment(ticketId, userId, content) {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId
    }
  });

  if (!ticket) {
    throw createError(404, "Ticket not found.");
  }

  const comment = await prisma.$transaction(async (tx) => {
    const createdComment = await tx.comment.create({
      data: {
        ticketId,
        authorId: userId,
        content
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    await tx.ticketHistory.create({
      data: {
        ticketId,
        changedById: userId,
        action: "COMMENT_ADDED",
        field: "comment",
        oldValue: null,
        newValue: createdComment.id
      }
    });

    return createdComment;
  });

  return comment;
}

/**
 * ------------------------------------------------------------------
 * Lists all comments from a ticket.
 * ------------------------------------------------------------------
 */

async function listComments(ticketId) {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId
    },
    select: {
      id: true
    }
  });

  if (!ticket) {
    throw createError(404, "Ticket not found.");
  }

  return prisma.comment.findMany({
    where: {
      ticketId
    },
    orderBy: {
      createdAt: "asc"
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
}

module.exports = {
  addComment,
  listComments
};
