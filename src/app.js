const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const ticketRoutes = require('./routes/ticketRoutes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// ── Middlewares ─────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ── Routes ──────────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: 'API Ticketing opérationnelle' }));
app.use('/api/tickets', ticketRoutes);

// ── Error handling ──────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
