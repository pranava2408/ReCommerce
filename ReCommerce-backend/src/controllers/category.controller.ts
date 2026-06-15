import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import categoryService from '../services/category.service';

const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(httpStatus.CREATED).send(category);
});

const bulkCreateParents = catchAsync(async (req, res) => {
  const result = await categoryService.bulkCreateParentCategories(req.body.categories);
  res.status(httpStatus.CREATED).send(result);
});

const getCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  res.status(httpStatus.OK).send(categories);
});

export default {
  createCategory,
  bulkCreateParents,
  getCategories
};