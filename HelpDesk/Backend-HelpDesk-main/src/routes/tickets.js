import express from 'express';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket
} from '../controllers/ticketController.js';
import { addComment } from '../controllers/commentController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { idempotencyMiddleware } from '../middleware/idempotency.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Apply idempotency middleware to POST routes
router.use(idempotencyMiddleware);

// Ticket routes
router.post('/', createTicket);
router.get('/', getTickets);
router.get('/:id', getTicketById);
router.patch('/:id', authorize('agent', 'admin'), updateTicket);

// Comment routes
router.post('/:id/comments', addComment);

export default router;