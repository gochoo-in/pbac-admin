import express from 'express';
import { addDestination, getAllDestinations, getActivitiesByDestination, getCitiesByDestination, updateDestination, deleteDestination, getDestinationById } from './destination.controller.js';
import { casbinMiddleware } from '../../../utils/casbinMiddleware.js';

const router = express.Router();

router.post('/', casbinMiddleware, addDestination);
router.get('/', casbinMiddleware, getAllDestinations); 
router.get('/:destinationId', casbinMiddleware, getDestinationById); 
router.get('/:destinationId/activities', casbinMiddleware,  getActivitiesByDestination); 
router.get('/:destinationId/cities', casbinMiddleware, getCitiesByDestination); 
router.patch('/:destinationId', casbinMiddleware, updateDestination);
router.delete('/:destinationId', casbinMiddleware, deleteDestination);

export default router;
