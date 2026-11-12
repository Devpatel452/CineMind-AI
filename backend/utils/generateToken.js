import jwt from 'jsonwebtoken';

/**
 * Generate a signed JSON Web Token
 * @param {string} userId - User's MongoDB _id
 * @returns {string} Signed JWT
 */
export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is missing from environment variables');
  }

  return jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export default generateToken;
