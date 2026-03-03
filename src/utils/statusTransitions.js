/**
 * Transitions de statut autorisées.
 * Clé = statut actuel, valeur = tableau d'objets { to, roles, authorOnly }
 *
 * authorOnly : seul l'auteur du ticket peut effectuer cette transition
 */
const ALLOWED_TRANSITIONS = {
  open: [
    { to: 'assigned', roles: ['support'] },
    { to: 'cancelled', roles: ['collaborateur', 'support', 'manager'], authorOnly: true },
  ],
  assigned: [
    { to: 'in_progress', roles: ['support'] },
  ],
  in_progress: [
    { to: 'resolved', roles: ['support'] },
  ],
  resolved: [
    { to: 'closed', roles: ['support', 'collaborateur'] },
  ],
};

/**
 * Vérifie si une transition de statut est autorisée.
 * @returns {{ allowed: boolean, reason?: string }}
 */
const canTransition = (currentStatus, newStatus, userRole, userId, ticketAuthorId) => {
  const transitions = ALLOWED_TRANSITIONS[currentStatus];

  if (!transitions) {
    return { allowed: false, reason: `Aucune transition possible depuis le statut "${currentStatus}"` };
  }

  const transition = transitions.find((t) => t.to === newStatus);

  if (!transition) {
    return { allowed: false, reason: `Transition "${currentStatus}" → "${newStatus}" non autorisée` };
  }

  if (!transition.roles.includes(userRole)) {
    return { allowed: false, reason: `Le rôle "${userRole}" ne peut pas effectuer cette transition` };
  }

  if (transition.authorOnly && String(userId) !== String(ticketAuthorId)) {
    return { allowed: false, reason: 'Seul l\'auteur du ticket peut effectuer cette action' };
  }

  return { allowed: true };
};

module.exports = { ALLOWED_TRANSITIONS, canTransition };
