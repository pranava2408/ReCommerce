import express from 'express';
import validate from '../../middlewares/validate';
import marketplaceValidation from '../../validations/marketplace.validation';
import marketplaceController from '../../controllers/marketplace.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get(
  '/listings',
  validate(marketplaceValidation.getListings),
  marketplaceController.getActiveListings
);

router.post(
  '/listings',
  auth(), // Populates req.user with the session data
  validate(marketplaceValidation.createResaleListing), // Validates incoming form payload fields
  marketplaceController.createResaleListing
);

export default router;