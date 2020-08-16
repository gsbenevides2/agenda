import { celebrate, Joi } from 'celebrate'

const classroomValidations = {
  create: celebrate({
    headers: {
      userid: Joi.string().required(),
      sessionid: Joi.string().required()
    }
  }, { allowUnknown: true }),
  show: celebrate({
    query: {
      processId: Joi.string().required()
    },
    headers: {
      userid: Joi.string().required(),
      sessionid: Joi.string().required()
    }
  }, { allowUnknown: true })
}

export default classroomValidations
