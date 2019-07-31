const Joi = require('joi')

module.exports = {
  claimId: Joi.string().required(),
  propertyType: Joi.string().required(),
  accessible: Joi.boolean().required(),
  dateOfSubsidence: Joi.string().required(),
  mineType: Joi.array().items(Joi.any()).single()
}
