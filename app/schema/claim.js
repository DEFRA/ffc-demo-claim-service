const Joi = require('joi')

module.exports = Joi.object({
  claimId: Joi.string().required(),
  propertyType: Joi.string().required(),
  accessible: Joi.boolean().required(),
  dateOfSubsidence: Joi.string().required(),
  mineType: Joi.array().items(Joi.any()).single(),
  email: Joi.string().email().required()
})
