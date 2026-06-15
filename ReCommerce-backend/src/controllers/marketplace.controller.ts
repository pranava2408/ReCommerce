import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import marketplaceService from '../services/marketplace.service';
import { User } from '@prisma/client';

const getActiveListings = catchAsync(async (req, res) => {
  const filter = {
    status: req.query.status as any
  };
  
  const options = {
    limit: parseInt(req.query.limit as string, 10) || 20
  };

  const listings = await marketplaceService.queryMarketplaceListings(filter, options);
  
  // Wrap response in a standard data object to match your response interfaces
  res.status(httpStatus.OK).send({
    success: true,
    data: listings
  });
});

const createResaleListing = catchAsync(async (req, res) => {
  // Extract user ID attached by your auth middleware context layer
  const userId = (req.user as User).id; 

  const listing = await marketplaceService.createMarketplaceListing(userId, req.body);
  
  res.status(httpStatus.CREATED).send({
    success: true,
    message: 'Item listed successfully on the marketplace.',
    data: listing
  });
});

export default {
  getActiveListings,
  createResaleListing
};