// 404 handler — catches all unmatched routes
const notFound = (req, res, next) => {
  const err = new Error(`Route non trouvée : ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

module.exports = notFound;
