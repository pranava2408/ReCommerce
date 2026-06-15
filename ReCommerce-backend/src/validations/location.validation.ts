import Joi from 'joi';

const bulkCreateLocations = {
  body: Joi.object().keys({
    locations: Joi.array().items(
      Joi.object().keys({
        country: Joi.string().required(),
        state: Joi.string().required(),
        city: Joi.string().required(),
        pincode: Joi.string().optional().allow(''),
        latitude: Joi.number().required().min(-90).max(90),
        longitude: Joi.number().required().min(-180).max(180)
      })
    ).required().min(1)
  })
};

export default {
  bulkCreateLocations
};