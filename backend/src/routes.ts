import { Router } from 'express'
import AuthController from './controllers/auth'
import ClassroomController from './controllers/classroom'
import ActivityController from './controllers/activity'
import authValidations from './routeValidations/auth'
import classroomValidations from './routeValidations/classroom'
import activityValidations from './routeValidations/activity'

const routes = Router()

const authController = new AuthController()
routes.get(
  '/authUrl',
  authValidations.getUrl,
  authController.getUrl
)
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
routes.delete(
  '/user',
  authValidations.user,
  authController.validadeAutenticatedRequest,
  authController.deleteUser
)

const classroomController = new ClassroomController()
routes.post(
  '/classroomSync/start',
  classroomValidations.create,
  authController.validadeAutenticatedRequest,
  classroomController.create
)
routes.get(
  '/classroomSync/status',
  classroomValidations.show,
  authController.validadeAutenticatedRequest,
  classroomController.show
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
routes.put(
  '/activity/:id',
  activityValidations.uodate,
  authController.validadeAutenticatedRequest,
  activityController.update
)
routes.delete(
  '/activity/:id',
  activityValidations.remove,
  authController.validadeAutenticatedRequest,
  activityController.remove
)

export default routes
