const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ── Middlewares globaux ─────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ── Routes ──────────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: 'API Ticketing Nexora Dynamics — opérationnelle' }));
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

// ── Gestion des erreurs ─────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
