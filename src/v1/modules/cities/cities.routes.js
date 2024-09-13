import express from 'express';
import { addCity, getAllCities, getCityWithActivities, getCityById, updateCityById, deleteCityById } from './cities.controller.js';
import { casbinMiddleware } from '../../../utils/casbinMiddleware.js';


const router = express.Router();

router.post('/', casbinMiddleware, addCity); 
router.get('/', casbinMiddleware, getAllCities); 
router.get('/:cityName/activities', casbinMiddleware, getCityWithActivities);
router.get('/:cityId', casbinMiddleware, getCityById);
router.patch('/:cityId', casbinMiddleware, updateCityById)
router.delete('/:cityId', casbinMiddleware, deleteCityById)

export default router;
