import Joi from 'joi';

const createMlModelSchema = Joi.object({
  name: Joi.string().trim().required(),

  version: Joi.string().trim().required(),

  description: Joi.string().allow('', null).optional()
});

export default {
  createMlModelSchema
};
