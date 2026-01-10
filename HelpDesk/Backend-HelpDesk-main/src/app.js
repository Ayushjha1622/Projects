import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import ticketRoutes from './routes/tickets.js';
import { simpleRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
// Enable CORS for all origins with all permissions
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: '*',
  exposedHeaders: ['Content-Type', 'Authorization', 'X-Idempotency-Key', 'X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  credentials: false,
  optionsSuccessStatus: 200,
  preflightContinue: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all routes
app.use(simpleRateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Meta endpoint
app.get('/api/_meta', (req, res) => {
  res.json({
    name: 'Helpdesk Ticketing System',
    version: '1.0.0',
    description: 'A comprehensive helpdesk ticketing system with SLA tracking and role-based access control',
    endpoints: {
      health: '/api/health',
      meta: '/api/_meta',
      manifest: '/.well-known/hackathon.json',
      auth: {
        register: '/api/auth/register',
        login: '/api/auth/login'
      },
      tickets: {
        list: '/api/tickets',
        create: '/api/tickets',
        get: '/api/tickets/:id',
        update: '/api/tickets/:id',
        addComment: '/api/tickets/:id/comments'
      }
    },
    features: [
      'Role-based access control (Admin, Agent, User)',
      'SLA tracking with automatic breach detection',
      'Ticket priority management',
      'Comment system with internal notes',
      'Timeline tracking',
      'Optimistic locking',
      'Pagination support',
      'Rate limiting (60 req/min/user)',
      'Idempotency key support'
    ],
    rateLimit: {
      windowMs: 60000,
      maxRequests: 60,
      message: 'Rate limit: 60 requests per minute per user'
    }
  });
});

// Serve hackathon manifest
app.get('/.well-known/hackathon.json', (req, res) => {
  res.sendFile('hackathon.json', { root: '.well-known' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;