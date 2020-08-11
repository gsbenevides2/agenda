import { celebrate, Joi } from 'celebrate'

const classroomValidations = {
  sync: celebrate({
    headers: {
      userid: Joi.string().required(),
      sessionid: Joi.string().required()
    }
  }, { allowUnknown: true })
}

export default classroomValidations
