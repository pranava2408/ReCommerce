import Joi from 'joi';

const getListings = {
  query: Joi.object().keys({
    status: Joi.string().valid('DRAFT', 'ACTIVE', 'RESERVED', 'SOLD', 'EXPIRED', 'REMOVED').default('ACTIVE'),
    limit: Joi.number().integer().max(100).default(20),
    page: Joi.number().integer().min(1)
  })
};

const createResaleListing = {
  body: Joi.object().keys({
    itemId: Joi.string().required(),
    title: Joi.string().required().max(255),
    description: Joi.string().optional().allow(''),
    listingPrice: Joi.number().required().positive(),
  }),
};

export default {
  getListings,
  createResaleListing
};