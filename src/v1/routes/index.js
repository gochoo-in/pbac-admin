import {Router} from 'express'
import users from '../modules/user/user.routes.js'
import destination from '../modules/destination/destination.routes.js'
import cities from '../modules/cities/cities.routes.js'
import Policy from '../modules/policy/policy.routes.js'
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
    },
    {
        path:'/policy',
        route:Policy
    }
]

defaultRoutes.forEach((route) => {
    allRoutes.use(route.path, route.route);
  });
  
export default allRoutes