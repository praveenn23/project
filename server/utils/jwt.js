const jwt = require('jsonwebtoken');


// Accepts userId and optionally extra payload (for admin)
const generateToken = (userId, extra = {}) => {
  return jwt.sign(
    { userId, ...extra },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = {
  generateToken,
  verifyToken
};
