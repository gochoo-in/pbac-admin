import {Router} from 'express'
import users from '../modules/user/user.routes.js'
import destination from '../modules/destination/destination.routes.js'
import cities from '../modules/cities/cities.routes.js'
const allRoutes = Router()



/*This is how we can define Routes */

const defaultRoutes = [
   
    {
        path: '/users',
        route: users
    },
    {
        path: '/cities',
        route: cities
    },
    {
        path: '/destinations',
        route: destination
    }
]

defaultRoutes.forEach((route) => {
    allRoutes.use(route.path, route.route);
  });
  
export default allRoutes