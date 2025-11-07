const jwt = require('jsonwebtoken');

exports.requireAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // contains id, role, email
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

exports.requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  if (req.user.role !== role && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
};
