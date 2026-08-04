const prisma = require("../config/db");

/**
 * ------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------
 */

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

const TRACKED_FIELDS = [
  "title",
  "description",
  "status",
  "priority",
  "assignedToId"
];

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
 * Builds pagination metadata.
 *
 * @param {number} page
 * @param {number} pageSize
 * @param {number} total
 * @returns {Object}
 */
function buildPagination(page, pageSize, total) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
}

/**
 * Generates ticket history entries based on modified fields.
 *
 * @param {Object} current
 * @param {Object} changes
 * @param {string} ticketId
 * @param {string} changedById
 * @returns {Array}
 */
function buildHistoryEntries(
  current,
  changes,
  ticketId,
  changedById
) {
  const history = [];

  for (const field of TRACKED_FIELDS) {
    if (
      changes[field] !== undefined &&
      changes[field] !== current[field]
    ) {
      history.push({
        ticketId,
        changedById,
        action: "UPDATED",
        field,
        oldValue:
          current[field] !== null &&
          current[field] !== undefined
            ? String(current[field])
            : null,
        newValue:
          changes[field] !== null &&
          changes[field] !== undefined
            ? String(changes[field])
            : null
      });
    }
  }

  return history;
}

/**
 * ------------------------------------------------------------------
 * Creates a new ticket.
 * ------------------------------------------------------------------
 */

async function createTicket(data, userId) {
  const ticket = await prisma.$transaction(async (tx) => {
    const createdTicket = await tx.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority || "MEDIUM",
        createdById: userId
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignedTo: {
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
        ticketId: createdTicket.id,
        changedById: userId,
        action: "CREATED",
        field: null,
        oldValue: null,
        newValue: null
      }
    });

    return createdTicket;
  });

  return ticket;
}

/**
 * ------------------------------------------------------------------
 * Lists tickets with filters and pagination.
 * ------------------------------------------------------------------
 */

async function listTickets({
  status,
  priority,
  search,
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE
}) {
  const currentPage = Number(page);
  const limit = Number(pageSize);

  const where = {
    ...(status && {
      status
    }),

    ...(priority && {
      priority
    }),

    ...(search && {
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: search,
            mode: "insensitive"
          }
        }
      ]
    })
  };

  const skip = (currentPage - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.ticket.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },

        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },

        _count: {
          select: {
            comments: true
          }
        }
      }
    }),

    prisma.ticket.count({
      where
    })
  ]);

  return {
    items,
    meta: buildPagination(
      currentPage,
      limit,
      total
    )
  };
            }

/**
 * ------------------------------------------------------------------
 * Returns a ticket by ID.
 * ------------------------------------------------------------------
 */

async function getTicketById(id) {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },

      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },

      comments: {
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
      },

      history: {
        orderBy: {
          createdAt: "desc"
        },
        include: {
          changedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });

  if (!ticket) {
    throw createError(404, "Ticket not found.");
  }

  return ticket;
}

/**
 * ------------------------------------------------------------------
 * Updates a ticket and stores all changes in history.
 * ------------------------------------------------------------------
 */

async function updateTicket(id, changes, userId) {
  const current = await prisma.ticket.findUnique({
    where: {
      id
    }
  });

  if (!current) {
    throw createError(404, "Ticket not found.");
  }

  const historyEntries = buildHistoryEntries(
    current,
    changes,
    id,
    userId
  );

  const [updatedTicket] = await prisma.$transaction([
    prisma.ticket.update({
      where: {
        id
      },
      data: changes,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    }),

    ...historyEntries.map((entry) =>
      prisma.ticketHistory.create({
        data: entry
      })
    )
  ]);

  return updatedTicket;
}

/**
 * ------------------------------------------------------------------
 * Deletes a ticket.
 * ------------------------------------------------------------------
 */

async function deleteTicket(id, userId) {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id
    }
  });

  if (!ticket) {
    throw createError(404, "Ticket not found.");
  }

  await prisma.$transaction([
    prisma.ticketHistory.create({
      data: {
        ticketId: id,
        changedById: userId,
        action: "DELETED",
        field: null,
        oldValue: null,
        newValue: null
      }
    }),

    prisma.ticket.delete({
      where: {
        id
      }
    })
  ]);

  return {
    success: true,
    message: "Ticket deleted successfully."
  };
}

/**
 * ------------------------------------------------------------------
 * Exports
 * ------------------------------------------------------------------
 */

module.exports = {
  createTicket,
  listTickets,
  getTicketById,
  updateTicket,
  deleteTicket
};
