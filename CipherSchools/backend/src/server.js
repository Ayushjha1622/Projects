import express from 'express';
import cors from 'cors';
import config from './config/env.js';
import connectDB from './config/database.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

// Import routes
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import fileRoutes from './routes/fileRoutes.js';

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging in development
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CipherStudio API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/files', fileRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to CipherStudio API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: '/api/users',
      projects: '/api/projects',
      files: '/api/files',
    },
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 CipherStudio API Server                             ║
║                                                           ║
║   Environment: ${config.nodeEnv.padEnd(43)}║
║   Port: ${PORT.toString().padEnd(50)}║
║   Frontend URL: ${config.frontendUrl.padEnd(42)}║
║                                                           ║
║   📚 API Documentation:                                   ║
║   - Health: http://localhost:${PORT}/health${' '.repeat(23)}║
║   - Users: http://localhost:${PORT}/api/users${' '.repeat(20)}║
║   - Projects: http://localhost:${PORT}/api/projects${' '.repeat(16)}║
║   - Files: http://localhost:${PORT}/api/files${' '.repeat(20)}║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

export default app;