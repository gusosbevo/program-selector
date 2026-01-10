const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  next();
  return;

  const authHeader = req ? req.headers.authorization : null;

  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.substring(7);
    if (!token) return;

    try {
      const decodedToken = jwt.verify(token, process.env.SECRET);

      const currentUser = await User.findByPk(decodedToken.id, {
        attributes: { exclude: ['passwordHash'] }
      });

      return currentUser;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        console.error('Invalid token:', error.message);
        return null;
      } else if (error.name === 'TokenExpiredError') {
        // Token has expired
        console.error('Token expired:', error.message);
        return null;
      } else {
        // Other errors
        console.error('Authorization error:', error.message);
        return null;
      }
    }
  }

  return null; // Authorization header is missing or not in the expected format
};

module.exports = { authenticate };
