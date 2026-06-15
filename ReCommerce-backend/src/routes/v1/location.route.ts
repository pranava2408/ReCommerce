import express from 'express';
import validate from '../../middlewares/validate';
import locationValidation from '../../validations/location.validation';
import locationController from '../../controllers/location.controller';

const router = express.Router();

router.post('/bulk', validate(locationValidation.bulkCreateLocations), locationController.bulkCreateLocations);
router.post('/auto-seed-india', locationController.autoSeedIndia);
router.get('/all', locationController.getLocations);

export default router;