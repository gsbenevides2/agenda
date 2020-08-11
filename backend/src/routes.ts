import { Router } from 'express'
import AuthController from './controllers/auth'
import ClassroomController from './controllers/classroom'
import ActivityController from './controllers/activity'
import authValidations from './routeValidations/auth'
import classroomValidations from './routeValidations/classroom'
import activityValidations from './routeValidations/activity'

const routes = Router()

const authController = new AuthController()
routes.get('/authUrl', authController.getUrl)
routes.get(
  '/logIn',
  authValidations.logIn,
  authController.logIn
)
routes.get(
  '/logOut',
  authValidations.logOut,
  authController.validadeAutenticatedRequest,
  authController.logOut
)
routes.get(
  '/user',
  authValidations.user,
  authController.validadeAutenticatedRequest,
  authController.retriveUserData
)

const classroomController = new ClassroomController()
routes.post(
  '/classroomSync',
  classroomValidations.sync,
  authController.validadeAutenticatedRequest,
  classroomController.sync
)

const activityController = new ActivityController()
routes.get(
  '/activities',
  activityValidations.index,
  authController.validadeAutenticatedRequest,
  activityController.index
)
routes.get(
  '/activity/:id',
  activityValidations.show,
  authController.validadeAutenticatedRequest,
  activityController.show
)
routes.post(
  '/activity',
  activityValidations.create,
  authController.validadeAutenticatedRequest,
  activityController.create
)
routes.delete(
  '/activity/:id',
  activityValidations.remove,
  authController.validadeAutenticatedRequest,
  activityController.remove
)

export default routes
