const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
      minlength: [3, 'Le titre doit contenir au moins 3 caractères'],
      maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères'],
    },
    description: {
      type: String,
      required: [true, 'La description est requise'],
      trim: true,
      minlength: [10, 'La description doit contenir au moins 10 caractères'],
    },
    category: {
      type: String,
      enum: {
        values: ['bug', 'access', 'materiel', 'autre'],
        message: 'Catégorie invalide. Valeurs autorisées : bug, access, materiel, autre',
      },
      required: [true, 'La catégorie est requise'],
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'critical'],
        message: 'Priorité invalide. Valeurs autorisées : low, medium, high, critical',
      },
      default: 'medium',
    },
    status: {
      type: String,
      enum: {
        values: ['open', 'assigned', 'in_progress', 'resolved', 'closed', 'cancelled'],
        message: 'Statut invalide',
      },
      default: 'open',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

// Index pour optimiser les requêtes fréquentes
ticketSchema.index({ status: 1 });
ticketSchema.index({ priority: 1 });
ticketSchema.index({ category: 1 });
ticketSchema.index({ author: 1 });
ticketSchema.index({ assignedTo: 1 });
ticketSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Ticket', ticketSchema);
