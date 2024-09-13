import logger from '../config/logger.js'; // Adjust the path as necessary

import { StatusCodes } from 'http-status-codes';
import { getCasbinEnforcer } from '../config/casbinEnforcer.js';
import httpFormatter from './formatter.js';
import { verifyToken } from './token.js';

export const casbinMiddleware = async (req, res, next) => {
  try {
    await verifyToken(req, res, async () => {
      logger.info('--- Casbin Middleware Start ---');
      logger.debug('Extracted user from token', { user: req.user });

      if (!req.user || !req.user._id) {
        logger.warn('User not found or invalid token payload');
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json(httpFormatter({}, 'User not found', false));
      }

      const userId = req.user._id; // Get user ID
      const resource = req.originalUrl; // URL of the resource being accessed
      const action = req.method.toUpperCase(); // HTTP method (GET, POST, etc.)

      logger.debug('Enforcement inputs', { userId, resource, action });

      const enforcer = await getCasbinEnforcer();

      // Log the loaded policies to ensure policies are loaded correctly
      const policies = await enforcer.getPolicy();
      logger.debug('Loaded Casbin policies', { policies });

      const allowed = await enforcer.enforce(userId, resource, action); // Use userId

      logger.info('Enforcement result', {
        userId,
        resource,
        action,
        allowed,
      });

      if (!allowed) {
        logger.warn('Access denied', { userId, resource, action });
        return res
          .status(StatusCodes.FORBIDDEN)
          .json(httpFormatter({}, 'Access denied', false));
      }

      logger.info('Access granted. Proceeding to next middleware or handler.');
      logger.info('--- Casbin Middleware End ---');
      next();
    });
  } catch (error) {
    logger.error('Casbin middleware error', { error: error.message });
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(httpFormatter({}, 'Error processing request', false));
  }
};
