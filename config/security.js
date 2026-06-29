const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const JSON_BODY_LIMIT = process.env.JSON_BODY_LIMIT || '10kb';

const getAllowedOrigins = () => {
  const origins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
  ];

  if (process.env.CLIENT_URL) {
    process.env.CLIENT_URL.split(',').forEach((url) => {
      const trimmed = url.trim();
      if (trimmed) {
        origins.push(trimmed);
      }
    });
  }

  return [...new Set(origins)];
};

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const helmetConfig = helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    errors: ['Rate limit exceeded. Please try again after some time'],
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  helmetConfig,
  corsMiddleware: cors(corsOptions),
  rateLimiter,
  JSON_BODY_LIMIT,
  getAllowedOrigins,
};
