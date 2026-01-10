import mongoose from 'mongoose';

// In-memory store for idempotency keys (in production, use Redis or MongoDB)
const idempotencyStore = new Map();

// Cleanup old entries every hour
setInterval(() => {
  const oneHourAgo = Date.now() - 3600000;
  for (const [key, value] of idempotencyStore.entries()) {
    if (value.timestamp < oneHourAgo) {
      idempotencyStore.delete(key);
    }
  }
}, 3600000);

export const idempotencyMiddleware = (req, res, next) => {
  // Only apply to POST requests
  if (req.method !== 'POST') {
    return next();
  }

  const idempotencyKey = req.headers['idempotency-key'];

  if (!idempotencyKey) {
    return res.status(400).json({
      error: {
        code: 'FIELD_REQUIRED',
        field: 'Idempotency-Key',
        message: 'Idempotency-Key header is required for POST requests'
      }
    });
  }

  // Create a unique key combining user ID and idempotency key
  const userId = req.user ? req.user._id.toString() : 'anonymous';
  const storeKey = `${userId}:${idempotencyKey}`;

  // Check if this request was already processed
  const cached = idempotencyStore.get(storeKey);
  if (cached) {
    // Return cached response
    return res.status(cached.status).json(cached.body);
  }

  // Store original res.json to intercept response
  const originalJson = res.json.bind(res);
  
  res.json = function (body) {
    // Cache the response
    idempotencyStore.set(storeKey, {
      status: res.statusCode,
      body: body,
      timestamp: Date.now()
    });

    // Call original json method
    return originalJson(body);
  };

  next();
};