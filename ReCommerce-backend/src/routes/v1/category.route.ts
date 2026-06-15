import express from 'express';
import validate from '../../middlewares/validate';
import categoryController from '../../controllers/category.controller';

const router = express.Router();

router.post('/', categoryController.createCategory);
router.post('/bulk-parents', categoryController.bulkCreateParents);
router.get('/', categoryController.getCategories);

export default router;