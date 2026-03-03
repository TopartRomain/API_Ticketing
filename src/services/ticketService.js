const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { canTransition } = require('../utils/statusTransitions');

const ticketService = {
  // ────────────────────────────────────────────────────────
  // Création
  // ────────────────────────────────────────────────────────
  async create(data, user) {
    // Règle : un collaborateur ne peut pas créer un ticket 'critical'
    if (user.role === 'collaborateur' && data.priority === 'critical') {
      const err = new Error('Un collaborateur ne peut pas créer un ticket avec la priorité "critical"');
      err.statusCode = 403;
      throw err;
    }

    const ticket = await Ticket.create({ ...data, author: user.id });
    return ticket.populate('author', 'name email role team');
  },

  // ────────────────────────────────────────────────────────
  // Liste selon rôle + filtres
  // ────────────────────────────────────────────────────────
  async list(user, query) {
    const filter = {};

    // Visibilité par rôle
    if (user.role === 'collaborateur') {
      filter.author = user.id;
    } else if (user.role === 'manager') {
      const teamMembers = await User.find({ team: user.team }).select('_id');
      filter.author = { $in: teamMembers.map((m) => m._id) };
    }
    // support → pas de filtre, voit tout

    // Filtres optionnels
    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;
    if (query.category) filter.category = query.category;

    const tickets = await Ticket.find(filter)
      .populate('author', 'name email role team')
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 });

    return tickets;
  },

  // ────────────────────────────────────────────────────────
  // Détail d'un ticket
  // ────────────────────────────────────────────────────────
  async getById(ticketId, user) {
    const ticket = await Ticket.findById(ticketId)
      .populate('author', 'name email role team')
      .populate('assignedTo', 'name email role');

    if (!ticket) {
      const err = new Error('Ticket non trouvé');
      err.statusCode = 404;
      throw err;
    }

    ticketService._checkVisibility(ticket, user);
    return ticket;
  },

  // ────────────────────────────────────────────────────────
  // Changement de statut
  // ────────────────────────────────────────────────────────
  async updateStatus(ticketId, newStatus, user) {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      const err = new Error('Ticket non trouvé');
      err.statusCode = 404;
      throw err;
    }

    const result = canTransition(ticket.status, newStatus, user.role, user.id, ticket.author);
    if (!result.allowed) {
      const err = new Error(result.reason);
      err.statusCode = 403;
      throw err;
    }

    ticket.status = newStatus;
    await ticket.save();

    return ticket.populate([
      { path: 'author', select: 'name email role team' },
      { path: 'assignedTo', select: 'name email role' },
    ]);
  },

  // ────────────────────────────────────────────────────────
  // Modification de la priorité
  // ────────────────────────────────────────────────────────
  async updatePriority(ticketId, newPriority, user) {
    if (user.role !== 'manager') {
      const err = new Error('Seul un manager peut modifier la priorité');
      err.statusCode = 403;
      throw err;
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      const err = new Error('Ticket non trouvé');
      err.statusCode = 404;
      throw err;
    }

    ticketService._checkVisibility(ticket, user);

    ticket.priority = newPriority;
    await ticket.save();

    return ticket.populate([
      { path: 'author', select: 'name email role team' },
      { path: 'assignedTo', select: 'name email role' },
    ]);
  },

  // ────────────────────────────────────────────────────────
  // Assignation d'un ticket
  // ────────────────────────────────────────────────────────
  async assign(ticketId, assignedToId, user) {
    if (user.role !== 'support') {
      const err = new Error('Seul le support peut assigner un ticket');
      err.statusCode = 403;
      throw err;
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      const err = new Error('Ticket non trouvé');
      err.statusCode = 404;
      throw err;
    }

    const targetUser = await User.findById(assignedToId);
    if (!targetUser || targetUser.role !== 'support') {
      const err = new Error("Le ticket ne peut être assigné qu'à un membre du support");
      err.statusCode = 400;
      throw err;
    }

    ticket.assignedTo = assignedToId;

    // Passer automatiquement en 'assigned' si le ticket est 'open'
    if (ticket.status === 'open') {
      ticket.status = 'assigned';
    }

    await ticket.save();

    return ticket.populate([
      { path: 'author', select: 'name email role team' },
      { path: 'assignedTo', select: 'name email role' },
    ]);
  },

  // ────────────────────────────────────────────────────────
  // Vérification de visibilité
  // ────────────────────────────────────────────────────────
  _checkVisibility(ticket, user) {
    if (user.role === 'support') return;

    if (user.role === 'collaborateur') {
      if (String(ticket.author._id || ticket.author) !== String(user.id)) {
        const err = new Error('Accès refusé : ce ticket ne vous appartient pas');
        err.statusCode = 403;
        throw err;
      }
      return;
    }

    if (user.role === 'manager') {
      const authorTeam = ticket.author.team !== undefined ? ticket.author.team : null;
      if (authorTeam !== user.team) {
        const err = new Error('Accès refusé : ce ticket ne fait pas partie de votre équipe');
        err.statusCode = 403;
        throw err;
      }
    }
  },
};

module.exports = ticketService;
