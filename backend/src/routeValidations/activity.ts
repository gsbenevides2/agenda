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
    body: {
      name: Joi.string().required(),
      date: Joi.number()
    },
    headers: {
      userid: Joi.string().required(),
      sessionid: Joi.string().required()
    }
  }, { allowUnknown: true }),
  uodate: celebrate({
    params: {
      id: Joi.string().required()
    },
    body: {
      name: Joi.string().required(),
      date: Joi.number()
    },
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
