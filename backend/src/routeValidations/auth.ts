import { celebrate, Joi } from 'celebrate'

const authValidations = {
  getUrl: celebrate({
    query: {
      redirect: Joi.string().required()
    }
  }),
  logIn: celebrate({
    query: {
      code: Joi.string().required(),
      redirectUrl: Joi.string().required()
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
