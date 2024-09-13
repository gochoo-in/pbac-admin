import User from "../../models/user.js";
import { StatusCodes } from "http-status-codes";
import casbinpolicy from '../../models/policy.js'; 
import httpFormatter from "../../../utils/formatter.js";
import { createJWT } from "../../../utils/token.js";

export const addUser = async (req, res) => {
    try {
        const { name, department, email } = req.body;

        if (!name  || !department || !email) {
            return res.status(StatusCodes.BAD_REQUEST).json(httpFormatter({}, "User's name, email and department are required", false));
        }

        const newUser = await User.create({ name, department, email });

        const token = createJWT({ _id: newUser._id.toString() });
        console.log("token", token);

        return res.status(StatusCodes.CREATED).json(httpFormatter({ newUser, token }, 'User added successfully', true));
    } catch (error) {
        console.error('Error adding user:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(httpFormatter({}, 'Error adding user', false));
    }
};


export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(StatusCodes.OK).json(httpFormatter({ users }, 'Users fetched successfully', true));
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(httpFormatter({}, 'Error fetching users', false));
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, department, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(id, { name, department, email }, { new: true });

        if (!updatedUser) {
            return res.status(StatusCodes.NOT_FOUND).json(httpFormatter({}, 'User not found', false));
        }

        return res.status(StatusCodes.OK).json(httpFormatter({ updatedUser }, 'User updated successfully', true));
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(httpFormatter({}, 'Error updating user', false));
    }
};


export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(StatusCodes.NOT_FOUND).json(httpFormatter({}, 'User not found', false));
        }

        const deletedPolicies = await casbinpolicy.deleteMany({ v0: id }); 

        console.log(`Deleted ${deletedPolicies.deletedCount} associated policies for user ID: ${id}`);

        return res.status(StatusCodes.OK).json(httpFormatter({}, 'User and associated policies deleted successfully', true));
    } catch (error) {
        console.error('Error deleting user and associated policies:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(httpFormatter({}, 'Error deleting user and associated policies', false));
    }
};
