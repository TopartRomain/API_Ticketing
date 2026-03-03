const ticketService = require('../services/ticketService');

// @desc    Get all tickets
// @route   GET /api/tickets
const getAllTickets = (req, res, next) => {
  try {
    const tickets = ticketService.findAll();
    res.status(200).json({ success: true, data: tickets });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single ticket by ID
// @route   GET /api/tickets/:id
const getTicketById = (req, res, next) => {
  try {
    const ticket = ticketService.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket non trouvé' });
    }
    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a ticket
// @route   POST /api/tickets
const createTicket = (req, res, next) => {
  try {
    const ticket = ticketService.create(req.body);
    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a ticket
// @route   PUT /api/tickets/:id
const updateTicket = (req, res, next) => {
  try {
    const ticket = ticketService.update(req.params.id, req.body);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket non trouvé' });
    }
    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a ticket
// @route   DELETE /api/tickets/:id
const deleteTicket = (req, res, next) => {
  try {
    const deleted = ticketService.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Ticket non trouvé' });
    }
    res.status(200).json({ success: true, message: 'Ticket supprimé' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
};
