const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware d'authentification JWT.
 * Ajoute req.user avec { id, role, team } si le token est valide.
 */
const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      const err = new Error('Authentification requise');
      err.statusCode = 401;
      throw err;
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Vérifier que l'utilisateur existe toujours
    const user = await User.findById(decoded.id).select('name email role team');
    if (!user) {
      const err = new Error('Utilisateur introuvable');
      err.statusCode = 401;
      throw err;
    }

    req.user = { id: user._id, name: user.name, email: user.email, role: user.role, team: user.team };
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      err.message = 'Token invalide ou expiré';
      err.statusCode = 401;
    }
    next(err);
  }
};

module.exports = auth;
