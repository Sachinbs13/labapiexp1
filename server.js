require('dotenv').config();

const express = require('express');
const { connectDB, getConnectionStatus } = require('./config/db');
const {
  helmetConfig,
  corsMiddleware,
  rateLimiter,
  JSON_BODY_LIMIT,
} = require('./config/security');
const apiRoutes = require('./routes');
const logger = require('./middleware/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(helmetConfig);
app.use(corsMiddleware);
app.use(rateLimiter);
app.use(logger);
app.use(express.json({ limit: JSON_BODY_LIMIT }));

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Student Management API is running',
    data: {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: getConnectionStatus(),
    },
  });
});

app.get('/health', (req, res) => {
  const database = getConnectionStatus();
  const isHealthy = database.status === 'connected';

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    message: isHealthy ? 'Server is healthy' : 'Server is running but database is not connected',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database,
    },
  });
});

app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
};

startServer();

module.exports = app;
