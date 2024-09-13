import { StatusCodes } from 'http-status-codes';
import casbinpolicy from '../../models/policy.js';
import httpFormatter from '../../../utils/formatter.js';

// Assign API access to a user
export const assignAccess = async (req, res) => {
    const { ptype, v0, v1, v2 } = req.body;

    if (!v0 || !v1 || !v2) {
        return res.status(400).json({ error: 'Missing userId, endpoint, or action' });
    }
    try {

        const data = await casbinpolicy.create({ptype, v0, v1, v2})
        res.status(StatusCodes.CREATED).json(httpFormatter({data}, 'Policy added successfully',  true));
    } catch (error) {
        console.log("error", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(httpFormatter({}, 'Internal Server Error', false));
    }
};


