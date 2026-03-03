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

router.use(auth);

router.post('/', roleGuard('collaborateur', 'support', 'manager'), createTicket);
router.get('/', getTickets);
router.get('/:id', getTicketById);

router.put('/:id/status', roleGuard('support', 'collaborateur'), updateStatus);
router.put('/:id/priority', roleGuard('manager'), updatePriority);
router.put('/:id/assign', roleGuard('support'), assignTicket);

router.post('/:id/comments', addComment);
router.get('/:id/comments', getComments);

module.exports = router;
