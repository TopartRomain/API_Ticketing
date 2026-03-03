const Comment = require('../models/Comment');
const Ticket = require('../models/Ticket');
const ticketService = require('./ticketService');

const commentService = {
  async add(ticketId, user, { content, internal }) {
    const ticket = await Ticket.findById(ticketId)
      .populate('author', 'name email role team');

    if (!ticket) {
      const err = new Error('Ticket non trouvé');
      err.statusCode = 404;
      throw err;
    }

    ticketService._checkVisibility(ticket, user);

    if (internal && user.role !== 'support') {
      const err = new Error('Seul le support peut poster un commentaire interne');
      err.statusCode = 403;
      throw err;
    }

    const comment = await Comment.create({
      ticket: ticketId,
      author: user.id,
      content,
      internal: internal || false,
    });

    return comment.populate('author', 'name email role');
  },

  async listByTicket(ticketId, user) {
    const ticket = await Ticket.findById(ticketId)
      .populate('author', 'name email role team');

    if (!ticket) {
      const err = new Error('Ticket non trouvé');
      err.statusCode = 404;
      throw err;
    }

    ticketService._checkVisibility(ticket, user);

    const filter = { ticket: ticketId };

    if (user.role !== 'support') {
      filter.internal = false;
    }

    const comments = await Comment.find(filter)
      .populate('author', 'name email role')
      .sort({ createdAt: 1 });

    return comments;
  },
};

module.exports = commentService;
