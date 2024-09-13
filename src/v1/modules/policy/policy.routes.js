import express from 'express';
import { assignAccess } from './policy.controller.js';

const router = express.Router();

// Route to assign API access to a user
router.post('/', assignAccess);


export default router;