import express from "express";
import { addUser, updateUser, deleteUser, getUsers } from "./user.controller.js";
import { casbinMiddleware } from "../../../utils/casbinMiddleware.js";
const router = express.Router();

router.post('/', casbinMiddleware, addUser);
router.get('/', casbinMiddleware, getUsers);
router.patch('/:id', casbinMiddleware, updateUser);
router.delete('/:id', casbinMiddleware, deleteUser);

export default router;