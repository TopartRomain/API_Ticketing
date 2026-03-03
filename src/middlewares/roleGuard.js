/**
 * Middleware de contrôle d'accès par rôle.
 * Usage : roleGuard('support', 'manager')
 */
const roleGuard = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    const err = new Error('Authentification requise');
    err.statusCode = 401;
    return next(err);
  }

  if (!allowedRoles.includes(req.user.role)) {
    const err = new Error(`Accès refusé : rôle "${req.user.role}" non autorisé`);
    err.statusCode = 403;
    return next(err);
  }

  next();
};

module.exports = roleGuard;
