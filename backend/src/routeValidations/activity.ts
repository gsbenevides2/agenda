import { celebrate, Joi } from 'celebrate'

const activityValidations = {
  index: celebrate({
    headers: {
      userid: Joi.string().required(),
      sessionid: Joi.string().required()
    }
  }, { allowUnknown: true }),
  show: celebrate({
    headers: {
      userid: Joi.string().required(),
      sessionid: Joi.string().required()
    },
    params: {
      id: Joi.string().required()
    }
  }, { allowUnknown: true }),
  create: celebrate({
    headers: {
      userid: Joi.string().required(),
      sessionid: Joi.string().required()
    }
  }, { allowUnknown: true }),
  remove: celebrate({
    headers: {
      userid: Joi.string().required(),
      sessionid: Joi.string().required()
    },
    params: {
      id: Joi.string().required()
    }
  }, { allowUnknown: true })

}

export default activityValidations
