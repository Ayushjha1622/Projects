import rateLimit from 'express-rate-limit';
import MongoStore from 'rate-limit-mongo';

// Create rate limiter with MongoDB store for distributed systems
export const createRateLimiter = () => {
  return rateLimit({
    store: new MongoStore({
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdesk',
      collectionName: 'rateLimits',
      expireTimeMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000
    }),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 60, // 60 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      // Use user ID if authenticated, otherwise use IP
      return req.user ? req.user._id.toString() : req.ip;
    },
    handler: (req, res) => {
      res.status(429).json({
        error: {
          code: 'RATE_LIMIT',
          message: 'Too many requests, please try again later'
        }
      });
    },
    skip: (req) => {
      // Skip rate limiting for health check endpoints
      return req.path === '/health' || req.path === '/api/health';
    }
  });
};

// Simple in-memory rate limiter for development
export const simpleRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 60,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? req.user._id.toString() : req.ip;
  },
  handler: (req, res) => {
    res.status(429).json({
      error: {
        code: 'RATE_LIMIT',
        message: 'Too many requests, please try again later'
      }
    });
  }
});