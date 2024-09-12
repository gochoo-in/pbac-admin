import User from "../../models/user.js";
import { StatusCodes } from "http-status-codes";
import httpFormatter from "../../../utils/formatter.js";
import { createJWT } from "../../../utils/token.js";

export const addUser = async (req, res) => {
    try {
        const { name, department } = req.body;

        if (!name  || !department) {
            return res.status(StatusCodes.BAD_REQUEST).json(httpFormatter({}, 'All fields are required', false));
        }

        const newUser = await User.create({ name, department });

        // Wrap the user ID in an object to pass as JWT payload
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
        const { name, department } = req.body;

        const updatedUser = await User.findByIdAndUpdate(id, { name, department }, { new: true });

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

        return res.status(StatusCodes.OK).json(httpFormatter({}, 'User deleted successfully', true));
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(httpFormatter({}, 'Error deleting user', false));
    }
};
