import { StatusCodes } from 'http-status-codes';
import casbinpolicy from '../../models/policy.js';
import httpFormatter from '../../../utils/formatter.js';

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

export const getPolicies = async (req, res) => {
    try {
        const policies = await casbinpolicy.find();
        res.status(StatusCodes.OK).json(httpFormatter({ policies }, 'Policies fetched successfully', true));
    } catch (error) {
        console.log("error", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(httpFormatter({}, 'Internal Server Error', false));
    }
};

export const updatePolicy = async (req, res) => {
    const { id } = req.params;
    const { ptype, v0, v1, v2 } = req.body;

    try {
        const updatedPolicy = await casbinpolicy.findByIdAndUpdate(
            id,
            { ptype, v0, v1, v2 },
            { new: true, runValidators: true }
        );

        if (!updatedPolicy) {
            return res.status(StatusCodes.NOT_FOUND).json(httpFormatter({}, 'Policy not found', false));
        }

        res.status(StatusCodes.OK).json(httpFormatter({ updatedPolicy }, 'Policy updated successfully', true));
    } catch (error) {
        console.log("error", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(httpFormatter({}, 'Internal Server Error', false));
    }
};



export const deletePolicy = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPolicy = await casbinpolicy.findByIdAndDelete(id);

        if (!deletedPolicy) {
            return res.status(StatusCodes.NOT_FOUND).json(httpFormatter({}, 'Policy not found', false));
        }

        res.status(StatusCodes.OK).json(httpFormatter({}, 'Policy deleted successfully', true));
    } catch (error) {
        console.log("error", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(httpFormatter({}, 'Internal Server Error', false));
    }
};


