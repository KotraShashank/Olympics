const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');
const notFound = require('./src/middleware/notFound');

const app = express();

// Mirrors: CorsConfig.java
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'Accept'],
    credentials: true,
  })
);

app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Mirrors: @RequestMapping("/api/...") base path on every controller
app.use('/api', routes);

// Mirrors: SecurityConfig's authorizeHttpRequests rules are already
// enforced per-route via the `protect` middleware in each router file.

app.use(notFound);
app.use(errorHandler); // must be the last middleware, like @RestControllerAdvice

module.exports = app;
