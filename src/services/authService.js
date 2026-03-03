const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authService = {
  async register({ name, email, password, role, team }) {
    const existing = await User.findOne({ email });
    if (existing) {
      const err = new Error('Cet email est déjà utilisé');
      err.statusCode = 409;
      throw err;
    }

    const user = await User.create({ name, email, password, role, team });

    const token = authService.generateToken(user);
    return {
      user: { id: user._id, name: user.name, email: user.email, role: user.role, team: user.team },
      token,
    };
  },

  async login({ email, password }) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const err = new Error('Email ou mot de passe incorrect');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const err = new Error('Email ou mot de passe incorrect');
      err.statusCode = 401;
      throw err;
    }

    const token = authService.generateToken(user);
    return {
      user: { id: user._id, name: user.name, email: user.email, role: user.role, team: user.team },
      token,
    };
  },

  generateToken(user) {
    return jwt.sign(
      { id: user._id, role: user.role, team: user.team },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  },
};

module.exports = authService;
