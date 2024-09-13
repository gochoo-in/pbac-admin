import { StatusCodes } from 'http-status-codes';
import casbinpolicy from '../../models/policy.js';
import httpFormatter from '../../../utils/formatter.js';
import logger from '../../../config/logger.js'; // Import the logger

// Assign Access Function
export const assignAccess = async (req, res) => {
  const { ptype, userId, endpoint, action } = req.body;

  // Validate required fields
  if (!userId || !endpoint || !action) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(httpFormatter({}, 'Missing userId, endpoint, or action', false));
  }

  try {
    // Check if the policy already exists
    const existingPolicy = await casbinpolicy.findOne({
      ptype,
      v0: userId,
      v1: endpoint,
      v2: action,
    });

    if (existingPolicy) {
      // Policy already exists
      logger.warn('Policy already exists', { userId, endpoint, action });
      return res
        .status(StatusCodes.CONFLICT)
        .json(httpFormatter({}, 'Policy already exists', false));
    }

    // Create the new policy
    const data = await casbinpolicy.create({
      ptype,
      v0: userId,
      v1: endpoint,
      v2: action,
    });

    logger.info('Policy added successfully', { policyId: data._id, userId, endpoint, action });

    res
      .status(StatusCodes.CREATED)
      .json(httpFormatter({ data }, 'Policy added successfully', true));
  } catch (error) {
    logger.error('Error creating policy', { error: error.message });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(httpFormatter({}, 'Internal Server Error', false));
  }
};

// Get Policies Function
export const getPolicies = async (req, res) => {
  try {
    const policies = await casbinpolicy.find();
    logger.info('Policies fetched successfully', { count: policies.length });
    res
      .status(StatusCodes.OK)
      .json(httpFormatter({ policies }, 'Policies fetched successfully', true));
  } catch (error) {
    logger.error('Error fetching policies', { error: error.message });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(httpFormatter({}, 'Internal Server Error', false));
  }
};

// Update Policy Function
export const updatePolicy = async (req, res) => {
  const { id } = req.params;
  const { ptype, userId, endpoint, action } = req.body;

  // Validate required fields
  if (!userId || !endpoint || !action) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(httpFormatter({}, 'Missing userId, endpoint, or action', false));
  }

  try {
    // Check for conflicting policies
    const existingPolicy = await casbinpolicy.findOne({
      _id: { $ne: id },
      ptype,
      v0: userId,
      v1: endpoint,
      v2: action,
    });

    if (existingPolicy) {
      logger.warn('Conflict: Policy with these details already exists', { userId, endpoint, action });
      return res
        .status(StatusCodes.CONFLICT)
        .json(httpFormatter({}, 'A policy with these details already exists', false));
    }

    // Update the policy
    const updatedPolicy = await casbinpolicy.findByIdAndUpdate(
      id,
      { ptype, v0: userId, v1: endpoint, v2: action },
      { new: true, runValidators: true }
    );

    if (!updatedPolicy) {
      logger.warn('Policy not found for update', { policyId: id });
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(httpFormatter({}, 'Policy not found', false));
    }

    logger.info('Policy updated successfully', { policyId: id });

    res
      .status(StatusCodes.OK)
      .json(httpFormatter({ updatedPolicy }, 'Policy updated successfully', true));
  } catch (error) {
    logger.error('Error updating policy', { error: error.message });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(httpFormatter({}, 'Internal Server Error', false));
  }
};

// Delete Policy Function
export const deletePolicy = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the policy
    const deletedPolicy = await casbinpolicy.findByIdAndDelete(id);

    if (!deletedPolicy) {
      logger.warn('Policy not found for deletion', { policyId: id });
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(httpFormatter({}, 'Policy not found', false));
    }

    logger.info('Policy deleted successfully', { policyId: id });

    res
      .status(StatusCodes.OK)
      .json(httpFormatter({}, 'Policy deleted successfully', true));
  } catch (error) {
    logger.error('Error deleting policy', { error: error.message });
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(httpFormatter({}, 'Internal Server Error', false));
  }
};
