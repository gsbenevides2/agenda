import { celebrate, Joi } from 'celebrate'

const authValidations = {
  logIn: celebrate({
    params: {
      code: Joi.string().required()
    }
  }),
  logOut: celebrate({
    headers: {
      userid: Joi.string().required(),
      sessionid: Joi.string().required()
    }
  }, { allowUnknown: true }),
  user: celebrate({
    headers: {
      userid: Joi.string().required(),
      sessionid: Joi.string().required()
    }
  }, { allowUnknown: true })
}

export default authValidations
