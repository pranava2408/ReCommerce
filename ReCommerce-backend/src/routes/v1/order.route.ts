import express from 'express';
import auth from '../../middlewares/auth';
import orderController from '../../controllers/order.controller';

const router = express.Router();

router.post('/', auth(), orderController.createOrder);
router.get('/my-orders', auth(), orderController.getMyOrders);
router.get('/:orderId', auth(), orderController.getOrder);

export default router;
