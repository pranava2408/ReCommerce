import httpStatus from 'http-status';
import prisma from '../client';
import { ItemStatus, ListingStatus } from '@prisma/client';
import ApiError from '../utils/ApiError';

interface QueryFilters {
  status?: ListingStatus;
}

interface QueryOptions {
  limit?: number;
}

const queryMarketplaceListings = async (filter: QueryFilters, options: QueryOptions) => {
  return prisma.marketplaceListing.findMany({
    where: {
      status: filter.status ?? 'ACTIVE',

      item: {
        images: {
          some: {}
        }
      }
    },

    orderBy: {
      createdAt: 'desc'
    },

    ...(options.limit && {
      take: options.limit
    }),

    include: {
      item: {
        include: {
          images: true
        }
      }
    }
  });
};

const createMarketplaceListing = async (
  userId: number,
  body: { itemId: string; title: string; description?: string; listingPrice: number }
) => {
  const { itemId, title, description, listingPrice } = body;

  // 1. Fetch user profile to get coordinates
  const userProfile = await prisma.userProfile.findUnique({
    where: { userId }
  });

  if (!userProfile) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'User profile coordinates not found. Please set them up first.'
    );
  }

  const { latitude, longitude } = userProfile;

  // 2. Find or create the Location block for Silchar using these exact coordinates
  let location = await prisma.location.findFirst({
    where: {
      city: 'Silchar',
      latitude,
      longitude
    }
  });

  if (!location) {
    location = await prisma.location.create({
      data: {
        country: 'India',
        state: 'Assam',
        city: 'Silchar',
        latitude,
        longitude
      }
    });
  }

  // 3. Run atomic transaction to build the listing and update item availability state
  return await prisma.$transaction(async (tx) => {
    // Verify item existence
    const item = await tx.item.findUnique({
      where: { id: itemId }
    });

    if (!item) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Target resale item not found.');
    }

    // Build the marketplace listing
    // Inside your prisma.$transaction block in marketplace.service.ts:
    const listing = await tx.marketplaceListing.create({
      data: {
        itemId,
        sellerId: userId,
        // 🛠️ FIX: Optional chaining ensures it safely falls back if the database lookup fails
        locationId: location?.id || item?.locationId,
        title,
        description,
        listingPrice,
        status: ListingStatus.ACTIVE
      }
    });

    // Toggle parent item status context to LISTED
    await tx.item.update({
      where: { id: itemId },
      data: { status: ItemStatus.LISTED }
    });

    return listing;
  });
};

export default {
  queryMarketplaceListings,
  createMarketplaceListing
};
