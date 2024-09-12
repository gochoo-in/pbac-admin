import { StatusCodes } from 'http-status-codes';
import { getCasbinEnforcer } from '../config/casbinEnforcer.js';
import httpFormatter from './formatter.js';
import { verifyToken } from './token.js';  

export const casbinMiddleware = async (req, res, next) => {
    try {
        await verifyToken(req, res, async () => {
            console.log('--- Casbin Middleware Start ---');
            console.log('Extracted user from token:', req.user);

            if (!req.user || !req.user._id) {
                console.log('User not found or invalid token payload');
                return res.status(StatusCodes.UNAUTHORIZED).json(httpFormatter({}, 'User not found', false));
            }

            const userId = req.user._id;  // Get user ID
            const resource = req.originalUrl;  // URL of the resource being accessed
            const action = req.method.toUpperCase();  // HTTP method (GET, POST, etc.)
            
            console.log(`Enforcement inputs: { User ID: ${userId}, Resource: ${resource}, Action: ${action} }`);

            const enforcer = await getCasbinEnforcer();
            
            // Log the loaded policies to ensure policies are loaded correctly
            const policies = await enforcer.getPolicy();
            console.log('Loaded Casbin policies:', policies);

            const allowed = await enforcer.enforce(userId, resource, action);  // Use userId

            console.log(`Enforcement result for User ID: ${userId}, Resource: ${resource}, Action: ${action} => Allowed: ${allowed}`);

            if (!allowed) {
                console.log(`Access denied for User ID: ${userId} on Resource: ${resource} with Action: ${action}`);
                return res.status(StatusCodes.FORBIDDEN).json(httpFormatter({}, 'Access denied', false));
            }

            console.log('Access granted. Proceeding to next middleware or handler.');
            console.log('--- Casbin Middleware End ---');
            next();
        });
    } catch (error) {
        console.error('Casbin middleware error:', error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(httpFormatter({}, 'Error processing request', false));
    }
};
