import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { idempotencyMiddleware } from '../middleware/idempotency.js';

const router = express.Router();

// Apply idempotency middleware to POST routes
router.post('/register', idempotencyMiddleware, register);
router.post('/login', idempotencyMiddleware, login);
router.get('/me', authenticate, getCurrentUser);

export default router;