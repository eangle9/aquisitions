import logger from '#config/logger.js';
import jwt from 'jsonwebtoken';

const { verify } = jwt
const JWT_SECRET = process.env.JWT_SECRET || 'your jwt_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export const tokens = {
  sign: payload => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (e) {
      logger.error('Error signing JWT:', e);
      throw new Error('Error signing JWT');
    }
  },
  verify: token => {
    try {
      return verify(token, JWT_SECRET);
    } catch (e) {
      logger.error('Error verifying JWT:', e);
      throw new Error('Error verifying JWT');
    }
  },
};
