import Joi from 'joi';

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    parentId: Joi.string().optional().allow(null, '')
  })
};

export default {
  createCategory
};