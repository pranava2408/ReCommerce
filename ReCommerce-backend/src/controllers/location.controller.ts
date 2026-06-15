import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import locationService from '../services/location.service';

const bulkCreateLocations = catchAsync(async (req, res) => {
  const result = await locationService.bulkCreateLocations(req.body.locations);
  res.status(httpStatus.CREATED).send(result);
});

const autoSeedIndia = catchAsync(async (req, res) => {
  const result = await locationService.autoSeedIndianLocations();
  res.status(httpStatus.CREATED).send({
    message: 'Successfully populated database with automated Indian locations!',
    recordsInserted: result.count
  });
});

const getLocations = catchAsync(async (req, res) => {
  const locations = await locationService.getAllLocations();
  res.status(httpStatus.OK).send(locations);
});

export default {
  bulkCreateLocations,
  autoSeedIndia,
  getLocations
};