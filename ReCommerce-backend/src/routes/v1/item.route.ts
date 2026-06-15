import express from 'express';
import validate from '../../middlewares/validate';
import itemValidation from '../../validations/item.validation';
import itemController from '../../controllers/item.controller';
import auth from '../../middlewares/auth';
import upload from '../../middlewares/upload';

const router = express.Router();

router.post('/create', auth(), validate(itemValidation.createItem), itemController.createItem);
router.post('/:itemId/images', upload.single('image'), itemController.uploadItemImage);
router.post('/test-cloudinary', upload.single('image'), itemController.testCloudinaryUpload);
router.get('/', itemController.getItems);

export default router;
