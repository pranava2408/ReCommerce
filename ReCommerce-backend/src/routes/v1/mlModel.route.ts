import express from 'express';
import mlModelController from '../../controllers/mlModel.controller';

const router = express.Router();

router.post('/', mlModelController.createMlModel);
router.get('/', mlModelController.getMlModels);
router.get('/:mlModelId', mlModelController.getMlModel);

export default router;