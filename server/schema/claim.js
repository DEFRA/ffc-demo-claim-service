const Joi = require('joi')

module.exports = {
  claimId: Joi.string(),
  propertyType: Joi.string(),
  accessible: Joi.boolean(),
  dateOfSubsidence: Joi.string(),
  mineType: Joi.array().items(Joi.any()).single()
}
