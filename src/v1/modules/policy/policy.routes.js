import express from 'express';
import { assignAccess, getPolicies, updatePolicy, deletePolicy } from './policy.controller.js';

const router = express.Router();

router.post('/', assignAccess);

router.get('/', getPolicies);

router.patch('/:id', updatePolicy);

router.delete('/:id', deletePolicy);

export default router;
