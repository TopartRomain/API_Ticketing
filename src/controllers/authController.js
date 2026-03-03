const authService = require('../services/authService');

// @desc    Inscription
// @route   POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, team } = req.body;
    const data = await authService.register({ name, email, password, role, team });
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// @desc    Connexion
// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login({ email, password });
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// @desc    Profil de l'utilisateur connecté
// @route   GET /api/auth/me
const getMe = (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};

module.exports = { register, login, getMe };
