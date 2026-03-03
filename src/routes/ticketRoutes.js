const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const roleGuard = require('../middlewares/roleGuard');
const {
  createTicket,
  getTickets,
  getTicketById,
  updateStatus,
  updatePriority,
  assignTicket,
} = require('../controllers/ticketController');
const { addComment, getComments } = require('../controllers/commentController');

// Toutes les routes tickets nécessitent une authentification
router.use(auth);

// CRUD tickets
router.post('/', roleGuard('collaborateur', 'support', 'manager'), createTicket);
router.get('/', getTickets);
router.get('/:id', getTicketById);

// Actions sur un ticket
router.patch('/:id/status', roleGuard('support', 'collaborateur'), updateStatus);
router.patch('/:id/priority', roleGuard('manager'), updatePriority);
router.patch('/:id/assign', roleGuard('support'), assignTicket);

// Commentaires
router.post('/:id/comments', addComment);
router.get('/:id/comments', getComments);

module.exports = router;
