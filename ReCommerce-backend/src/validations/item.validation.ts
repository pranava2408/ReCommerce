import Joi from 'joi';

const createItem = {
  body: Joi.object().keys({
    sku: Joi.string().required(),
    name: Joi.string().required(),
    brand: Joi.string().optional().allow(''),
    categoryId: Joi.string().required(),
    originalPrice: Joi.number().required().positive(),
    status: Joi.string().required().valid(
      'RECEIVED', 'INSPECTING', 'INSPECTED', 'LISTED', 
      'SOLD', 'REFURBISHING', 'REFURBISHED', 'DONATED', 
      'RECYCLED', 'DISPOSED'
    ),
    locationId: Joi.string().optional().allow(''),
    metadata: Joi.object().optional(),
    images: Joi.array().items(
      Joi.object().keys({
        imageUrl: Joi.string().required(),
        imageType: Joi.string().required().valid(
          'FRONT', 'BACK', 'LEFT', 'RIGHT', 'TOP', 'BOTTOM', 'PACKAGE', 'DEFECT'
        )
      })
    ).optional()
  })
};

export default {
  createItem
};