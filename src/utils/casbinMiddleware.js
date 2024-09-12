import { StatusCodes } from 'http-status-codes';
import { getCasbinEnforcer } from '../config/casbinEnforcer.js';
import httpFormatter from './formatter.js';
import { verifyToken } from './token.js';  

export const casbinMiddleware = async (req, res, next) => {
    try {
        await verifyToken(req, res, async () => {
            console.log('Extracted user:', req.user);

            if (!req.user || !req.user.department) {
                return res.status(StatusCodes.UNAUTHORIZED).json(httpFormatter({}, 'User department not found', false));
            }

            const userDepartment = req.user.department;
            const resource = req.originalUrl; 
            const action = req.method.toUpperCase(); 
            console.log('Enforcement inputs:', { userDepartment, resource, action });

            const enforcer = await getCasbinEnforcer();
            const allowed = await enforcer.enforce(userDepartment, resource, action);

            if (!allowed) {
                console.log('Access denied:', { userDepartment, resource, action });
                return res.status(StatusCodes.FORBIDDEN).json(httpFormatter({}, 'Access denied', false));
            }

            next();
        });
    } catch (error) {
        console.error('Casbin middleware error:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(httpFormatter({}, 'Error processing request', false));
    }
};
