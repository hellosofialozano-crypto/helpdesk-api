const express = require("express");

const ticketController = require("../controllers/ticket.controller");
const commentController = require("../controllers/comment.controller");

const validate = require("../middlewares/validate");
const { requireAuth } = require("../middlewares/auth");

const {
  createTicketSchema,
  updateTicketSchema,
  createCommentSchema
} = require("../schemas");

const router = express.Router();

/**
 * ------------------------------------------------------------------
 * Authentication
 * ------------------------------------------------------------------
 */

router.use(requireAuth);

/**
 * ------------------------------------------------------------------
 * Tickets
 * ------------------------------------------------------------------
 */

/**
 * @openapi
 * /tickets:
 *   post:
 *     tags:
 *       - Tickets
 *     summary: Create a new ticket
 *     description: Creates a new support ticket.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 example: Unable to access dashboard
 *               description:
 *                 type: string
 *                 example: After login the dashboard remains blank.
 *               priority:
 *                 type: string
 *                 enum:
 *                   - LOW
 *                   - MEDIUM
 *                   - HIGH
 *                   - URGENT
 *                 example: HIGH
 *     responses:
 *       201:
 *         description: Ticket created successfully.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/",
  validate(createTicketSchema),
  ticketController.create
);

/**
 * @openapi
 * /tickets:
 *   get:
 *     tags:
 *       - Tickets
 *     summary: List tickets
 *     description: Returns a paginated list of support tickets.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [OPEN, IN_PROGRESS, RESOLVED, CLOSED]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, URGENT]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Paginated list returned successfully.
 *       401:
 *         description: Unauthorized.
 */
router.get("/", ticketController.list);

/**
 * ------------------------------------------------------------------
 * Ticket by ID
 * ------------------------------------------------------------------
 */

/**
 * @openapi
 * /tickets/{id}:
 *   get:
 *     tags:
 *       - Tickets
 *     summary: Get ticket by ID
 *     description: Returns a ticket with comments and history.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket found.
 *       404:
 *         description: Ticket not found.
 */
router.get("/:id", ticketController.getById);

/**
 * @openapi
 * /tickets/{id}:
 *   patch:
 *     tags:
 *       - Tickets
 *     summary: Update ticket
 *     description: Updates one or more ticket fields.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket updated successfully.
 *       400:
 *         description: Validation failed.
 *       404:
 *         description: Ticket not found.
 */
router.patch(
  "/:id",
  validate(updateTicketSchema),
  ticketController.update
);

/**
 * @openapi
 * /tickets/{id}:
 *   delete:
 *     tags:
 *       - Tickets
 *     summary: Delete ticket
 *     description: Deletes a support ticket.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket deleted successfully.
 *       404:
 *         description: Ticket not found.
 */
router.delete("/:id", ticketController.remove);

/**
 * ------------------------------------------------------------------
 * Comments
 * ------------------------------------------------------------------
 */

/**
 * @openapi
 * /tickets/{id}/comments:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Add comment
 *     description: Adds a new comment to a support ticket.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Comment created successfully.
 *       404:
 *         description: Ticket not found.
 */
router.post(
  "/:id/comments",
  validate(createCommentSchema),
  commentController.create
);

/**
 * @openapi
 * /tickets/{id}/comments:
 *   get:
 *     tags:
 *       - Comments
 *     summary: List comments
 *     description: Returns all comments from a ticket.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comments returned successfully.
 *       404:
 *         description: Ticket not found.
 */
router.get("/:id/comments", commentController.list);

module.exports = router;
