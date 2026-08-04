const ticketService = require("../services/ticket.service");

/**
 * ------------------------------------------------------------------
 * Create a new ticket.
 * ------------------------------------------------------------------
 */
async function create(req, res, next) {
  try {
    const response = await ticketService.createTicket(
      req.body,
      req.user.id
    );

    return res.status(201).json(response);
  } catch (error) {
    return next(error);
  }
}

/**
 * ------------------------------------------------------------------
 * List tickets.
 * ------------------------------------------------------------------
 */
async function list(req, res, next) {
  try {
    const {
      status,
      priority,
      search,
      page,
      pageSize
    } = req.query;

    const response =
      await ticketService.listTickets({
        status,
        priority,
        search,
        page,
        pageSize
      });

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
}

/**
 * ------------------------------------------------------------------
 * Get ticket by ID.
 * ------------------------------------------------------------------
 */
async function getById(req, res, next) {
  try {
    const response =
      await ticketService.getTicketById(
        req.params.id
      );

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
}

/**
 * ------------------------------------------------------------------
 * Update a ticket.
 * ------------------------------------------------------------------
 */
async function update(req, res, next) {
  try {
    const response =
      await ticketService.updateTicket(
        req.params.id,
        req.body,
        req.user.id
      );

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
}

/**
 * ------------------------------------------------------------------
 * Delete a ticket.
 * ------------------------------------------------------------------
 */
async function remove(req, res, next) {
  try {
    const response =
      await ticketService.deleteTicket(
        req.params.id,
        req.user.id
      );

    return res.status(200).json(response);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  create,
  list,
  getById,
  update,
  remove
};
