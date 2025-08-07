const connectToMongo = require("./db");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require('dotenv').config();


// Connect to MongoDB
connectToMongo();

const app = express();
const port = 5000;
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false 
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    error: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1';
  }
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: "Too many authentication attempts, please try again later."
  },
  skip: (req) => {
    return req.ip === '127.0.0.1' || req.ip === '::1' || req.ip === '::ffff:127.0.0.1';
  }
});

const corsOptions = {
  origin: true, 
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'auth-token', 
    'x-requested-with',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods'
  ]
};
app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  if (req.body && Object.keys(req.body).length > 0) {
  }
  next();
});

// Add response logging
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`Response for ${req.method} ${req.path}:`, {
      status: res.statusCode,
      data: typeof data === 'string' ? data.substring(0, 200) + '...' : data
    });
    originalSend.call(this, data);
  };
  next();
});


// Routes
try {
  app.use("/api/auth", authLimiter, require("./routes/auth"));
} catch (error) {
  console.error(' Error loading auth routes:', error.message);
}

try {
  app.use("/api/notes", require("./routes/notes"));
} catch (error) {
  console.error(' Error loading notes routes:', error.message);
}

// Health check endpoint
app.get('/health', (req, res) => {
  console.log(' Health check requested');
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Diary Desk API',
    port: port,
    mongodb: 'Connected',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Diary Desk API is running!',
    port: port,
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      notes: '/api/notes',
      health: '/health'
    },
    availableRoutes: [
      'POST /api/auth/createuser - Create new user',
      'POST /api/auth/login - User login',
      'GET /api/auth/getuser - Get user profile',
      'GET /api/notes/fetchallnotes - Get all user notes',
      'POST /api/notes/addnote - Create new note'
    ]
  });
});

// Test endpoint for quick debugging
app.get('/test', (req, res) => {
  res.json({
    message: 'Test endpoint working!',
    timestamp: new Date().toISOString(),
    server: 'Running',
    port: port
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found',
    requestedUrl: req.originalUrl,
    availableEndpoints: [
      '/',
      '/health',
      '/test',
      '/api/auth/createuser',
      '/api/auth/login',
      '/api/notes/fetchallnotes'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(500).json({ 
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server with better error handling
const server = app.listen(port, (err) => {
  if (err) {
    process.exit(1);
  }
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    process.exit(1);
  } else {
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  server.close(() => {
    process.exit(0);
  });
});

module.exports = app;