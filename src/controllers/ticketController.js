const ticketService = require('../services/ticketService');


const createTicket = async (req, res) => {
  try {
    const ticket = await ticketService.create(req.body, req.user);
    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    const statusCode = err.statusCode;
    res.status(statusCode).json({ success: false, message: err.message });
  }
};


const getTickets = async (req, res) => {
  try {
    const tickets = await ticketService.list(req.user, req.query);
    res.status(200).json({ success: true, count: tickets.length, data: tickets });
  } catch (err) {
    const statusCode = err.statusCode;
    res.status(statusCode).json({ success: false, message: err.message });
  }
};


const getTicketById = async (req, res) => {
  try {
    const ticket = await ticketService.getById(req.params.id, req.user);
    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    const statusCode = err.statusCode;
    res.status(statusCode).json({ success: false, message: err.message });
  }
};


const updateStatus = async (req, res) => {
  try {
    const ticket = await ticketService.updateStatus(req.params.id, req.body.status, req.user);
    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    const statusCode = err.statusCode;
    res.status(statusCode).json({ success: false, message: err.message });
  }
};


const updatePriority = async (req, res) => {
  try {
    const ticket = await ticketService.updatePriority(req.params.id, req.body.priority, req.user);
    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    const statusCode = err.statusCode;
    res.status(statusCode).json({ success: false, message: err.message });
  }
};


const assignTicket = async (req, res) => {
  try {
    const ticket = await ticketService.assign(req.params.id, req.body.assignedTo, req.user);
    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    const statusCode = err.statusCode;
    res.status(statusCode).json({ success: false, message: err.message });
  }
};

module.exports = { createTicket, getTickets, getTicketById, updateStatus, updatePriority, assignTicket };
