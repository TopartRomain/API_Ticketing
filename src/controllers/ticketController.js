const ticketService = require('../services/ticketService');

// @desc    Créer un ticket
// @route   POST /api/tickets
const createTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.create(req.body, req.user);
    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

// @desc    Lister les tickets (selon rôle + filtres)
// @route   GET /api/tickets
const getTickets = async (req, res, next) => {
  try {
    const tickets = await ticketService.list(req.user, req.query);
    res.status(200).json({ success: true, count: tickets.length, data: tickets });
  } catch (err) {
    next(err);
  }
};

// @desc    Consulter un ticket
// @route   GET /api/tickets/:id
const getTicketById = async (req, res, next) => {
  try {
    const ticket = await ticketService.getById(req.params.id, req.user);
    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

// @desc    Modifier le statut d'un ticket
// @route   PATCH /api/tickets/:id/status
const updateStatus = async (req, res, next) => {
  try {
    const ticket = await ticketService.updateStatus(req.params.id, req.body.status, req.user);
    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

// @desc    Modifier la priorité d'un ticket
// @route   PATCH /api/tickets/:id/priority
const updatePriority = async (req, res, next) => {
  try {
    const ticket = await ticketService.updatePriority(req.params.id, req.body.priority, req.user);
    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

// @desc    Assigner un ticket
// @route   PATCH /api/tickets/:id/assign
const assignTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.assign(req.params.id, req.body.assignedTo, req.user);
    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTicket, getTickets, getTicketById, updateStatus, updatePriority, assignTicket };
