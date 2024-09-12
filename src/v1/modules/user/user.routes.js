import express from "express";
import { addUser, updateUser, deleteUser, getUsers } from "./user.controller.js";
const router = express.Router();

router.post('/:id', addUser);
router.get('/',getUsers);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;